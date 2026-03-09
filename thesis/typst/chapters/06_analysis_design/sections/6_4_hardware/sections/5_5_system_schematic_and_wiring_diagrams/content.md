The hardware integration of the autonomous sensing node is defined by a structured interconnectivity map that ensures signal integrity and reliable power delivery. The system utilizes a combination of digital and analog interfaces to accommodate the heterogeneous sensor suite, with the Arduino UNO R4 WiFi acting as the central nexus. This section details the system's schematic logic, focusing on the I2C bus architecture and analog pin mapping.

## Digital Interconnectivity: The I2C Bus

Digital communication is centralized on the Inter-Integrated Circuit (I2C) bus, utilizing the SDA (Serial Data) and SCL (Serial Clock) pins of the RA4M1 microcontroller. This bus follows a multi-slave architecture, allowing for high-resolution data acquisition with minimal wiring complexity. The AHT20 temperature and humidity sensor is the primary digital slave on this bus, providing factory-calibrated environmental data at 10 Hz (Hatip & Kocamaz, 2024). To ensure bus stability, 4.7 k$\Omega$ pull-up resistors are integrated into the circuit, and the firmware implements a 500ms delay after initialization to allow the I2C peripheral to stabilize before the first sampling tick.

## Analog Interface and Pin Mapping

The MOS-based gas sensors and the IR flame sensor utilize the RA4M1's 14-bit Analog-to-Digital Converters (ADCs) for signal transduction. This high-resolution mapping is critical for capturing the subtle voltage fluctuations associated with incipient fire signatures.

- **Smoke and VOC Sensors**: The SEN0570 (Smoke) and SEN0566 (VOC) sensors are mapped to dedicated analog input pins (e.g., A0 and A1). The firmware reads the voltage divider output from these sensors, where the resistance change of the sensing layer is converted into a proportional voltage signal (Rasim & Max, 2024).
- **Carbon Monoxide (CO) Sensor**: The SEN0564 (CO) sensor is mapped to a high-priority analog pin (e.g., A2), reflecting its role as the "truth sensor."
- **Infrared Flame Sensor**: The Gravity Analog Flame Sensor provides a continuous voltage output to a dedicated analog pin (e.g., A3), enabling the capture of high-frequency flicker (Meleti & Tsanakas, 2024).

## Power Distribution and Grounding

The schematic implements a parallel power distribution strategy. All sensor heaters are tied to the Arduino's 5V rail, while the digital logic of the AHT20 is powered by the 3.3V rail. A "common ground" star topology is employed to minimize ground loops and signal interference, ensuring that the analog baselines remain stable across all modalities (Perez et al., 2023).

## References

Hatip, H., & Kocamaz, U. E. (2024). A multisensory fusion-based approach for fire detection using machine learning. *Journal of Fire Sciences*, 42(1), 45-62.

Meleti, E., & Tsanakas, J. A. (2024). Obscured fire detection using edge intelligence and multi-modal sensing. *Sensors*, 24(5), 1532.

Perez, J., et al. (2023). TinyML for real-time fire detection at the edge. *IEEE Access*, 11, 89021-89035.

Rasim, M., & Max, A. (2024). Fire detection system using Arduino and MEMS sensors. *International Journal of Embedded Systems*, 16(2), 120-135.

## Glossary

**I2C Bus**: A multi-master, multi-slave, packet switched, single-ended, serial communication bus.
**Pull-up Resistor**: A resistor used to ensure a known state for a signal line.
**Analog-to-Digital Converter (ADC)**: A system that converts an analog signal into a digital signal.
**Ground Loop**: An unwanted current path in a circuit that can cause signal interference and noise.
