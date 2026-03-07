== Arduino Firmware Development

The embedded software, or firmware, forms the intelligence layer of the autonomous sensing node, orchestrating sensor readings, data preprocessing, TinyML inference, and alarm triggering logic. Developed within the Arduino IDE ecosystem and compiled for the Arduino UNO R4 WiFi's Renesas RA4M1 microcontroller, the firmware is structured to manage both data collection (for model training) and real-time inference (for deployment). This section details the development of two primary firmware components: the Data Forwarder Sketch and the Real-Time Inference Sketch.

=== Data Forwarder Sketch (Data Collection)

The Data Forwarder Sketch, exemplified by aspects of the `fire-detection-main.ino` firmware, serves as a crucial tool for acquiring raw sensor data in a structured format suitable for TinyML model training. While `fire-detection-main.ino` is primarily an inference sketch, it retains a `logData()` function which mimics the functionality required for data forwarding during collection phases. This `logData()` function is responsible for:

- *Sensor Interrogation*: Reading values from all connected sensors (Smoke, VOC, CO, Flame via Analog pins, and Temperature/Humidity via I2C AHT20 sensor).
- *Timestamping*: Recording the `millis()` timestamp for each sample, crucial for time-series analysis and windowing in Edge Impulse.
- *CSV Output*: Formatting the collected sensor readings into a comma-separated value (CSV) string and printing it to the Serial monitor (`Serial.print(...)` and `Serial.println()`). The format ensures easy parsing by external tools (e.g., Python scripts for data logging) and direct compatibility with Edge Impulse data ingestion pipelines.
- *AHT20 Management*: Includes logic for I2C AHT20 sensor initialization (`_aht.begin()`) and periodic re-initialization attempts (`_ahtReinitInterval`) to ensure reliable data streams, addressing potential sensor communication issues.

For dedicated data collection, a simplified version of this logic, often found in `the sensor integration examples` like `analog_smoke_sensor.ino` or `temp_humidity_sensor.ino`, can be used in conjunction with host-side scripts (e.g., `the automated data collection utility`). These examples demonstrate basic sensor readout for individual sensors, forming the building blocks of a comprehensive data forwarder. The `the data collection script` script leverages this serial output to capture and store labeled raw data, essential for building the three-class classification dataset.

=== Real-Time Inference Sketch (Deployment)

The `fire-detection-main.ino` firmware's core functionality is its role as the Real-Time Inference Sketch, enabling on-device TinyML model execution for autonomous fire detection. This sketch integrates the trained Edge Impulse model and orchestrates the inference process.

#figure(
  image("../../../../assets/figures/edge-impulse/009-platform-deployment.png", width: 80%),
  caption: [Deployment Target Selection. The deployment page showing the various export options, specifically the selection of the Arduino library for integration into the custom firmware.],
) <fig-ei-deployment>

- *Sensor Data Acquisition*: The `pushSampleToEiBuffer()` function continuously reads the current state of all physical sensors and populates a feature buffer (`_features`). The order and count of these features (`EI_CLASSIFIER_DSP_INPUT_FRAME_SIZE`) are strictly defined by the Edge Impulse project configuration, ensuring compatibility with the deployed model.
- *TinyML Model Integration*: The firmware includes an Edge Impulse-generated C++ library (`#include <fire-detector-fusion_inferencing.h>`), which provides the `run_classifier()` function. This function takes the populated feature buffer (`_features`) as input and executes the optimized neural network model on the Renesas RA4M1 microcontroller.
- *Inference Execution*: The `runEiInferenceAndSetLed()` function is invoked when a full window of sensor data has been collected (`_feature_ix >= EI_CLASSIFIER_DSP_INPUT_FRAME_SIZE`). It converts the raw feature buffer into a signal (`numpy::signal_from_buffer`), performs classification (`run_classifier`), and retrieves the inference results (`ei_impulse_result_t`).
- *Alarm Triggering Logic*: Based on the inference results, specifically the probability of the "fire" class (`fireProb`), the firmware implements a hybrid alarm triggering logic. This combines the AI model's prediction with heuristic-based physical confirmation. For example, if `(fireProb >= _fireThreshold && visualConfirmation)` ensures that a high AI prediction for fire is corroborated by raw sensor data indicating actual smoke or flame, minimizing false positives (e.g., from high CO due to non-fire events). A debouncing mechanism (`consecutiveFireCount`) is also implemented to prevent transient alarms.
- *System Diagnostics*: The `performSelfTest()` function runs at startup, verifying the operational status of all connected sensors. In case of a sensor fault, a visual alarm pattern is activated (`alarmPattern()`), ensuring system reliability and alerting to potential hardware issues.

This integrated approach enables the Arduino UNO R4 WiFi to act as a truly autonomous edge intelligence unit, performing real-time fire detection with minimal latency and high reliability, directly leveraging the optimized TinyML model.
