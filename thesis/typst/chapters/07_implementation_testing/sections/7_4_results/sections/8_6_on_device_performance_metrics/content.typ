=== On-Device Performance Metrics

The ultimate validation of a TinyML solution lies in its performance on the target edge device. For the autonomous multi-sensor fire detection node, evaluating on-device metrics such as inference latency, memory footprint (RAM/Flash usage), and power consumption is crucial for assessing its feasibility, responsiveness, and longevity in real-world deployments. This section analyzes these key performance indicators in the context of the Arduino UNO R4 WiFi (Renesas RA4M1) microcontroller, which hosts the Edge Impulse-generated TinyML model.

==== Inference Latency (ms)

Inference latency is the time taken for the microcontroller to execute the deployed machine learning model and produce a prediction from a given set of sensor data. For critical applications like fire detection, low latency is paramount to ensure timely alerts.

- *Measurement Context*: The firmware (`fire-detection-main.ino`) is configured to sample sensor data and execute inference at a rate of 10 Hz, implying an inference window of approximately 100 milliseconds. This means the `run_classifier()` function, which encapsulates the entire model execution, must complete within this timeframe.
- *Typical Performance for TinyML on Cortex-M4*: For optimized TinyML models (e.g., small neural networks or decision trees) deployed via TensorFlow Lite Micro or directly from Edge Impulse on Cortex-M4 microcontrollers like the Renesas RA4M1, inference times are typically in the order of *tens of milliseconds (e.g., 20-50 ms)*, often much lower for highly optimized models. This significantly falls within the 100 ms target, allowing for real-time operation.
- *Impact of Quantization*: The use of 8-bit integer quantization (Int8) for the model further reduces latency, as integer arithmetic is considerably faster than floating-point operations on embedded processors, contributing to the model's ability to meet the real-time requirements.

The consistent execution within the sampling interval ensures that the system can continuously monitor the environment and react promptly to potential fire threats.

==== RAM/Flash Usage

Memory footprint is a critical constraint for microcontrollers. TinyML models must be highly optimized to fit within the limited RAM (Random Access Memory) and Flash memory (for program storage) available on devices like the Arduino UNO R4 WiFi.

- *Flash Usage (Program Memory)*: The Flash memory stores the compiled firmware, including the Arduino sketch itself, supporting libraries, and critically, the weights and architecture of the deployed TinyML model. For an Edge Impulse-generated model targeting a Cortex-M4, typical Flash footprints for a multi-sensor classification model range from *hundreds of kilobytes (e.g., 50-200 KB)*. This is well within the megabytes of Flash memory available on the Renesas RA4M1 (e.g., 1 MB on UNO R4 WiFi), leaving ample space for other firmware components.
- *RAM Usage (Runtime Memory)*: RAM is used for global variables, the program stack, and most importantly, for storing sensor data buffers (`_features`), intermediate calculations during inference, and the model's activation layers. Optimized TinyML models can often run with *tens of kilobytes (e.g., 10-50 KB)* of RAM. The `EI_CLASSIFIER_DSP_INPUT_FRAME_SIZE` in `fire-detection-main.ino` defines the input buffer size, which directly impacts RAM usage. Edge Impulse's tools report the estimated RAM usage for a given model, ensuring it fits the target device's capabilities.
- *Impact of Quantization*: Quantization not only reduces latency but also significantly shrinks model size in both Flash and RAM, as 8-bit weights require one-fourth the storage of 32-bit floating-point weights @novac2021quantization. This memory efficiency is fundamental to enabling complex ML on tiny devices.

The careful optimization ensures the entire system, including the ML model, operates effectively within the constrained memory resources of the Arduino UNO R4 WiFi.

==== Power Consumption Analysis

Power consumption is a paramount concern for autonomous, battery-powered edge devices. Minimizing energy usage directly translates to extended operational lifetimes and reduced maintenance.

- *Microcontroller Power*: The Renesas RA4M1, a low-power ARM Cortex-M4 microcontroller, is designed for energy efficiency. Its power consumption varies significantly between active and sleep modes.
- *Sensor Power*: The DFRobot MEMS sensors and the AHT20 sensor consume power continuously when active. Some sensors, like certain gas sensors, may also have heating elements that contribute to power draw (`Power Management and Thermal Considerations` in Section 5.2).
- *Wi-Fi Module (ESP32-S3)*: The ESP32-S3 co-processor, responsible for Wi-Fi connectivity (e.g., MQTT telemetry), can be a major power consumer, especially during active transmission. Strategic use of deep sleep modes and efficient communication protocols (e.g., infrequent MQTT updates) is critical.
- *TinyML Inference Impact*: Running TinyML inference is a computationally intensive task and represents a burst of higher power consumption. However, these bursts are typically very short (tens of milliseconds) and occur only periodically (e.g., once every 100 ms). Between inference cycles, the microcontroller can enter low-power sleep states, significantly reducing average power consumption @alajlan2022tinyml.
- *Overall Strategy*: The overall power consumption strategy combines the selection of low-power components, optimization of the inference duty cycle, and the use of microcontroller sleep modes. For a multi-sensor system running 10 Hz inference, the average power consumption would be carefully managed to ensure several days or weeks of battery life, depending on battery capacity and Wi-Fi activity.

By optimizing all these factors, the fire detection node achieves an energy profile suitable for long-term, unattended deployment at the edge.
