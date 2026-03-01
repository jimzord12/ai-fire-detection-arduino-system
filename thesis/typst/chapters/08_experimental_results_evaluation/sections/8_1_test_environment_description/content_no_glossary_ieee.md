# Test Environment Description

The experimental setup for data collection and model evaluation was designed to ensure rigorous and reproducible conditions for characterizing fire, no-fire, and false alarm scenarios. This section details the hardware and software components, physical environment, and operational workflow that constituted the test environment. The controlled nature of the setup was crucial for generating a high-quality dataset suitable for training and validating the TinyML-based fire detection system.

## 8.1.1 Hardware and Software Configuration

The central hardware component of the test environment was the **Arduino UNO R4 WiFi** microcontroller board, serving as the autonomous sensing node. This board was connected via USB to a host PC, which facilitated data logging and interaction with the Edge Impulse platform. The sensor array comprised five DFRobot MEMS sensors: smoke (analog A0), VOC (analog A1), CO (analog A2), flame (analog A3), and an AHT20 for temperature and humidity (I2C via A4/A5). All sensors were calibrated and their operational status was verified prior to data collection.

On the software side, the Arduino UNO R4 WiFi was programmed with a custom data collection firmware (a variant of `firmware/main/fire-detection-main/fire-detection-main.ino`, optimized for 10 Hz serial output). The host PC ran the **Edge Impulse Data Forwarder**, a utility responsible for streaming live sensor data from the Arduino's serial port to the Edge Impulse Studio. The **Edge Impulse Studio** served as the primary platform for data management, labeling (`fire`, `no_fire`, `false_alarm`), feature engineering, model training, and deployment. All necessary drivers and serial communication software were ensured to be operational.

## 8.1.2 Physical Setup and Scenario Execution

The physical environment for data collection was carefully controlled to simulate various real-world scenarios while maintaining safety. Key aspects of the physical setup and scenario execution included:

*   **Sensor Array Placement**: The DFRobot sensor array was mounted on a stable surface, ensuring consistent positioning relative to fire sources or nuisance triggers.
*   **Environmental Control**: Scenarios involved manipulating environmental factors such as ventilation (e.g., closing windows/doors for low ventilation, opening them for normal/open space airflow) and the introduction of specific stimuli (e.g., controlled flames, cooking fumes, steam, aerosol sprays).
*   **Safety Protocols**: Strict safety measures, as outlined in the project's data collection guidelines (Data Collection Guide, n.d.), were observed during all fire and false alarm scenarios, including appropriate ventilation, fire containment, and personal protective equipment.
*   **Warm-up Period**: Prior to any data collection, the sensor array was subjected to a warm-up period of at least 30 minutes to ensure sensor stability and accurate readings.

The workflow for each scenario (as detailed in `docs/research/data-collection/procedure.md`) involved initializing the sensor array, starting the Edge Impulse Data Forwarder stream, triggering the specific scenario condition, allowing a brief stabilization period (2–3 seconds), and then capturing 10-second samples. Each scenario was typically repeated 30 times to build a statistically significant dataset.

## 8.1.3 Quality Assurance and Data Verification

To ensure the high quality and integrity of the collected data, several Quality Assurance (QA) checks were integrated into the data collection process:

*   **Serial Output Verification**: Real-time monitoring of the Arduino's serial output was performed to confirm continuous data streaming at 10 Hz without dropped frames.
*   **Data Forwarder Status**: The connection status of the Edge Impulse Data Forwarder on the host PC was continuously verified.
*   **CSV Format Confirmation**: Post-collection, CSV files were checked to confirm adherence to the expected header and column order: `timestamp, smoke, voc, co, flame, temperature, humidity`.
*   **Visual Inspection**: Raw CSV data in the Edge Impulse Studio was visually inspected for obvious sensor malfunctions or anomalies.
*   **Re-collection Policy**: Any scenario yielding fewer than 25 complete samples or exhibiting clear sensor malfunctions necessitated re-collection.

These procedures collectively ensured that the data generated in the test environment was reliable, accurately labeled, and representative of the intended fire, no-fire, and false alarm conditions, thereby forming a solid foundation for robust model development.

### References