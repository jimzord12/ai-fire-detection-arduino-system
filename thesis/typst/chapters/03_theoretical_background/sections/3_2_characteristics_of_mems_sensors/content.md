The effectiveness of an autonomous fire detection node is fundamentally limited by the performance characteristics of its constituent sensors. In this research, a heterogeneous array of Micro-Electro-Mechanical Systems (MEMS) and analog sensors is employed to capture the multi-dimensional signature of fire and false alarm events. This section details the specific characteristics, performance metrics, and inherent limitations of the sensors used in the autonomous node, including smoke, volatile organic compounds (VOC), carbon monoxide (CO), infrared (IR) flame, and environmental (temperature and humidity) sensors.

## MEMS Gas Sensors (Smoke, VOC, and CO)

The gas sensing suite utilizes the DFRobot Fermion MEMS series, which represents a significant advancement over traditional electrochemical and bulky metal-oxide sensors. These MEMS devices are characterized by their extremely small footprint (typically 13 mm x 13 mm), low power consumption, and high sensitivity to target gases.

### Smoke and VOC Detection (SEN0570 & SEN0566)

The MEMS smoke sensor (SEN0570) and VOC sensor (SEN0566) both utilize a metal-oxide semiconductor (MOS) sensing layer optimized for specific gas groups. The smoke sensor is particularly sensitive to the larger particulate matter and hydrocarbons typical of wood and paper combustion. A key characteristic of these sensors is their rapid response time, often achieving a T90 (90% of final value) within 30 seconds of exposure (DFRobot, 2024b). However, these sensors exhibit significant cross-sensitivity; for instance, the smoke sensor is highly reactive to ethanol vapors, a property that is both a strength for detecting certain false alarms and a challenge for specificity (Hatip & Kocamaz, 2024).

The VOC sensor targets a broader range of organic compounds, including formaldehyde, toluene, and benzene. Its sensing range typically spans from 0 to 1000 ppm, with a resolution capable of detecting sub-ppm changes in indoor air quality. Both sensors incorporate an internal micro-heater, requiring a stabilized pre-heating period (typically 48 hours for new sensors and 1-2 minutes after short power-off cycles) to achieve a stable baseline resistance (DFRobot, 2024c).

### Carbon Monoxide Detection (SEN0564)

The MEMS CO sensor (SEN0564) is optimized for the detection of CO, a critical marker of incomplete combustion. Unlike the broad-spectrum VOC sensor, the CO sensor's sensing layer is tailored to be highly selective for CO molecules, with a typical detection range of 1 to 1000 ppm (DFRobot, 2024a). In the context of fire detection, this sensor serves as a "truth sensor," as elevated CO levels are rarely present in common non-fire scenarios such as cooking steam or aerosol usage, providing a vital differentiator for the sensor fusion model (Wang et al., 2023).

## Infrared (IR) Flame Sensor (DFR0076)

The Gravity Analog Flame Sensor (DFR0076) is a phototransistor-based device designed to detect radiation in the 760 nm to 1100 nm wavelength range. This band corresponds to the infrared emissions of a typical flame. The sensor features a wide detection angle of approximately 60 degrees and a sensitivity that can be adjusted via an onboard potentiometer. Its response time is nearly instantaneous (<1 ms), allowing for the capture of the high-frequency flicker characteristic of open flames (Rasim & Max, 2024). A significant limitation of this sensor modality is its line-of-sight requirement and susceptibility to intense IR interference from sunlight or incandescent lighting, necessitating its fusion with non-optical gas sensors to reduce false positives (Meleti & Tsanakas, 2024).

## Environmental Monitoring (AHT20)

The AHT20 sensor provides digital temperature and humidity data via the I2C protocol. It is characterized by its high accuracy (±0.3°C for temperature and ±2% for relative humidity) and long-term stability.

- **Temperature**: The sensor operates across a -40°C to +85°C range. In fire detection, it monitors the "thermal anomaly" or "heat paradox," where certain false alarms (like cooking) may actually show higher localized heat than incipient fires (Meleti & Tsanakas, 2024).
- **Humidity**: The capacitive humidity sensor is sensitive to the 0-100% RH range. Humidity data is essential for compensating the cross-sensitivity of MOS gas sensors, as water vapor can occupy active sites on the sensing layer and influence resistance readings (Hatip & Kocamaz, 2024).

## References

DFRobot. (2024a). *Fermion: MEMS CO Gas Sensor (1-1000ppm) - SEN0564 Datasheet*. https://wiki.dfrobot.com/SKU_SEN0564_Fermion_MEMS_CO_Gas_Sensor

DFRobot. (2024b). *Fermion: MEMS Smoke Sensor - SEN0570 Datasheet*. https://wiki.dfrobot.com/SKU_SEN0570_Fermion_MEMS_Smoke_Sensor

DFRobot. (2024c). *Fermion: MEMS VOC Gas Sensor - SEN0566 Datasheet*. https://wiki.dfrobot.com/SKU_SEN0566_Fermion_MEMS_VOC_Gas_Sensor

Hatip, H., & Kocamaz, U. E. (2024). A multisensory fusion-based approach for fire detection using machine learning. *Journal of Fire Sciences*, 42(1), 45-62.

Meleti, E., & Tsanakas, J. A. (2024). Obscured fire detection using edge intelligence and multi-modal sensing. *Sensors*, 24(5), 1532.

Rasim, M., & Max, A. (2024). Fire detection system using Arduino and MEMS sensors. *International Journal of Embedded Systems*, 16(2), 120-135.

Wang, L., et al. (2023). Fire detection and false alarm reduction using sensor fusion and deep learning. *Fire Safety Journal*, 138, 103812.

## Glossary

**Cross-sensitivity**: The sensitivity of a sensor to substances other than the target analyte.
**T90**: The time required for a sensor to reach 90% of its final stable reading after a step change in concentration.
**MOS (Metal-Oxide Semiconductor)**: A type of gas sensor that measures the change in resistance of a sensing layer when exposed to target gases.
**Line-of-sight**: A type of propagation that can transmit and receive data only where transmit and receive stations are in view of each other without any sort of an obstacle between them.
