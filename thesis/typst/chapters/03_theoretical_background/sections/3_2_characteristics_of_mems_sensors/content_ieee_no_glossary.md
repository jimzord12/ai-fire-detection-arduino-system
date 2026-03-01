The effectiveness of an autonomous fire detection node is fundamentally limited by the performance characteristics of its constituent sensors. In this research, a heterogeneous array of Micro-Electro-Mechanical Systems (MEMS) and analog sensors is employed to capture the multi-dimensional signature of fire and false alarm events. This section details the specific characteristics, performance metrics, and inherent limitations of the sensors used in the autonomous node, including smoke, volatile organic compounds (VOC), carbon monoxide (CO), infrared (IR) flame, and environmental (temperature and humidity) sensors.

## MEMS Gas Sensors (Smoke, VOC, and CO)

The gas sensing suite utilizes the DFRobot Fermion MEMS series, which represents a significant advancement over traditional electrochemical and bulky metal-oxide sensors. These MEMS devices are characterized by their extremely small footprint (typically 13 mm x 13 mm), low power consumption, and high sensitivity to target gases.

### Smoke and VOC Detection (SEN0570 & SEN0566)

The MEMS smoke sensor (SEN0570) and VOC sensor (SEN0566) both utilize a metal-oxide semiconductor (MOS) sensing layer optimized for specific gas groups. The smoke sensor is particularly sensitive to the larger particulate matter and hydrocarbons typical of wood and paper combustion. A key characteristic of these sensors is their rapid response time, often achieving a T90 (90% of final value) within 30 seconds of exposure @dfrobot2024smoke. However, these sensors exhibit significant cross-sensitivity; for instance, the smoke sensor is highly reactive to ethanol vapors, a property that is both a strength for detecting certain false alarms and a challenge for specificity @hatip2024multisensory.

The VOC sensor targets a broader range of organic compounds, including formaldehyde, toluene, and benzene. Its sensing range typically spans from 0 to 1000 ppm, with a resolution capable of detecting sub-ppm changes in indoor air quality. Both sensors incorporate an internal micro-heater, requiring a stabilized pre-heating period (typically 48 hours for new sensors and 1-2 minutes after short power-off cycles) to achieve a stable baseline resistance @dfrobot2024voc.

### Carbon Monoxide Detection (SEN0564)

The MEMS CO sensor (SEN0564) is optimized for the detection of CO, a critical marker of incomplete combustion. Unlike the broad-spectrum VOC sensor, the CO sensor's sensing layer is tailored to be highly selective for CO molecules, with a typical detection range of 1 to 1000 ppm @dfrobot2024co. In the context of fire detection, this sensor serves as a "truth sensor," as elevated CO levels are rarely present in common non-fire scenarios such as cooking steam or aerosol usage, providing a vital differentiator for the sensor fusion model @wang2023fire.

## Infrared (IR) Flame Sensor (DFR0076)

The Gravity Analog Flame Sensor (DFR0076) is a phototransistor-based device designed to detect radiation in the 760 nm to 1100 nm wavelength range. This band corresponds to the infrared emissions of a typical flame. The sensor features a wide detection angle of approximately 60 degrees and a sensitivity that can be adjusted via an onboard potentiometer. Its response time is nearly instantaneous (<1 ms), allowing for the capture of the high-frequency flicker characteristic of open flames @rasim2024fire. A significant limitation of this sensor modality is its line-of-sight requirement and susceptibility to intense IR interference from sunlight or incandescent lighting, necessitating its fusion with non-optical gas sensors to reduce false positives @meleti2024obscured.

## Environmental Monitoring (AHT20)

The AHT20 sensor provides digital temperature and humidity data via the I2C protocol. It is characterized by its high accuracy (±0.3°C for temperature and ±2% for relative humidity) and long-term stability.

- **Temperature**: The sensor operates across a -40°C to +85°C range. In fire detection, it monitors the "thermal anomaly" or "heat paradox," where certain false alarms (like cooking) may actually show higher localized heat than incipient fires @meleti2024obscured.
- **Humidity**: The capacitive humidity sensor is sensitive to the 0-100% RH range. Humidity data is essential for compensating the cross-sensitivity of MOS gas sensors, as water vapor can occupy active sites on the sensing layer and influence resistance readings @hatip2024multisensory.
