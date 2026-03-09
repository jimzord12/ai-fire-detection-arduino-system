The reliability of an autonomous fire detection node is contingent upon the accurate calibration of its sensors and a clear understanding of their baseline behavior in diverse environments. Because metal-oxide (MOS) gas sensors and infrared flame sensors are prone to drift and environmental interference, specific protocols must be implemented during both hardware initialization and software execution to ensure data integrity. This section outlines the calibration procedures and baseline stabilization techniques employed in the project's firmware.

## Hardware Pre-heating and Stabilization

MOS-based MEMS gas sensors, such as the Fermion smoke, VOC, and CO sensors, require a thermal stabilization period to achieve a consistent baseline resistance. Upon initial deployment, new sensors must undergo a "burn-in" period of approximately 48 hours to remove contaminants from the sensing layer and stabilize the internal micro-heater @dfrobot2024voc. In daily operation, the node implements a software-controlled warm-up phase of 120 seconds upon power-up, during which sensor readings are monitored but not used for inference. This ensures that the sensing layer has reached its optimal operating temperature (typically 200°C to 400°C), minimizing the risk of false positives caused by cold-start transients @hatip2024multisensory.

## Software-Level Baseline Detection

To account for long-term sensor drift and varying ambient air quality, the system utilizes a dynamic baseline detection algorithm within the Arduino firmware. The baseline represents the "no_fire" state of the environment.

### Differential Sensing Logic

Rather than relying on absolute voltage thresholds, the node's inference logic is based on the differential change from the established baseline (delta R/R_0). During the first 10 seconds of stable operation (after the warm-up period), the firmware calculates the mean and standard deviation of each gas sensor channel to define the ambient baseline @rasim2024fire. This allows the system to adapt to different rooms or seasonal variations in background gas concentrations. As implemented in the main firmware, the system performs continuous "sanity checks" to ensure that the baseline remains within expected physiological limits before permitting the machine learning model to trigger an alarm.

## Flame Sensor Sensitivity Adjustment

The Gravity Analog Flame Sensor requires a manual calibration of its onboard potentiometer to define the detection range. Calibration is performed by exposing the sensor to a controlled IR source (simulating a small flame) at the maximum required detection distance and adjusting the potentiometer until the digital trigger threshold is reached. This hardware-level adjustment provides a coarse filter for static IR noise, such as sunlight or high-intensity artificial lighting, which is then further refined by the temporal flicker analysis in the machine learning model @meleti2024obscured.

## Environmental Compensation (AHT20)

The AHT20 sensor comes factory-calibrated and does not require user adjustment. However, its high-resolution temperature and humidity data are used to compensate for the cross-sensitivity of the MOS gas sensors. As humidity increases, water vapor molecules compete for active sites on the gas sensing layer, potentially lowering the perceived resistance @hatip2024multisensory. The fusion model uses the AHT20's digital output to normalize these readings, ensuring that the detected gas trends are independent of ambient weather conditions.
