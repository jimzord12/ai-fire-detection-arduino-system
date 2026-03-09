== Requirements

=== Hardware Requirements
The fire detection system is built on the Arduino UNO R4 WiFi platform, utilizing a heterogeneous suite of MEMS sensors. The following components are required for the construction of the autonomous sensing node:

- *Arduino UNO R4 WiFi*: The primary microcontroller platform featuring a Renesas RA4M1 (Cortex-M4) for local inference and an ESP32-S3 for telemetry.
- *DFRobot Fermion: MEMS Smoke Detection Sensor*: For particulate smoke detection in the range of 10-1000ppm.
- *DFRobot Gravity: Analog Flame Sensor*: For IR-based flame signature detection (760nm–1100nm).
- *DFRobot Fermion: AHT20 Temperature and Humidity Sensor*: For environmental monitoring via I2C communication.
- *DFRobot Fermion: VOC Gas Sensor*: For Volatile Organic Compound detection (1-500ppm).
- *DFRobot Fermion: MEMS Carbon Monoxide (CO) Sensor*: A critical combustion marker (5-5000ppm).
- *Ancillary Components*: USB-C cable, breadboard, and high-quality jumper wires.

=== Software Requirements
A functional development environment must be established to compile the firmware and interact with the Edge Impulse TinyML pipeline:

- *Arduino IDE 2.3.0 or later*: For firmware development and deployment.
- *Node.js (v20+)*: Required for the Edge Impulse CLI tools.
- *Edge Impulse CLI*: Specifically the `edge-impulse-data-forwarder` for dataset collection.
- *Python (v3.12+)*: For automated data analysis and logging scripts.
