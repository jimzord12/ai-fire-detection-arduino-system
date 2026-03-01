The hardware integration of the autonomous sensing node is defined by a structured interconnectivity map that ensures signal integrity and reliable power delivery. The system utilizes a combination of digital and analog interfaces to accommodate the heterogeneous sensor suite, with the Arduino UNO R4 WiFi acting as the central nexus. This section details the system's schematic logic, focusing on the I2C bus architecture and analog pin mapping.

## Digital Interconnectivity: The I2C Bus

Digital communication is centralized on the Inter-Integrated Circuit (I2C) bus, utilizing the SDA (Serial Data) and SCL (Serial Clock) pins of the RA4M1 microcontroller. This bus follows a multi-slave architecture, allowing for high-resolution data acquisition with minimal wiring complexity. The AHT20 temperature and humidity sensor is the primary digital slave on this bus, providing factory-calibrated environmental data at 10 Hz @hatip2024multisensory. To ensure bus stability, pull-up resistors are integrated into the circuit, and the firmware implements a stabilization delay after initialization.

## Analog Interface and Pin Mapping

The MOS-based gas sensors and the IR flame sensor utilize the RA4M1's high-resolution Analog-to-Digital Converters (ADCs) for signal transduction. This mapping is critical for capturing the subtle voltage fluctuations associated with incipient fire signatures.

- **Smoke and VOC Sensors**: The MEMS smoke and VOC sensors are mapped to dedicated analog input pins. The firmware reads the voltage divider output from these sensors, where the resistance change of the sensing layer is converted into a proportional voltage signal @rasim2024fire.
- **Carbon Monoxide (CO) Sensor**: The MEMS CO sensor is mapped to a high-priority analog pin, reflecting its role as the "truth sensor."
- **Infrared Flame Sensor**: The Gravity Analog Flame Sensor provides a continuous voltage output to a dedicated analog pin, enabling the capture of high-frequency flicker @meleti2024obscured.

## Power Distribution and Grounding

The schematic implements a parallel power distribution strategy. All sensor heaters are tied to the Arduino's 5V rail, while the digital logic of the environmental sensor is powered by the 3.3V rail. A "common ground" star topology is employed to minimize ground loops and signal interference, ensuring that the analog baselines remain stable across all modalities @perez2023tinyml.
