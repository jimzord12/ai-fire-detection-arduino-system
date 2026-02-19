# 4.2 Detailed Examination of Selected Sensors

This section presents a systematic characterisation of each sensor selected for the autonomous multi-sensor fire detection node. The five sensing elements—a MEMS smoke sensor, an analogue infrared (IR) flame sensor, a MEMS volatile organic compound (VOC) sensor, a MEMS carbon monoxide (CO) sensor, and a combined temperature/humidity sensor—were chosen because fire events produce a multivariate chemical and radiative signature that no single transducer can reliably capture in isolation. Fonollosa et al. (2018) demonstrated that single-sensor fire detectors produce unacceptably high false-alarm rates, and that multi-sensor approaches exploiting the correlation among smoke particles, combustion gases, and thermal anomalies are essential for reliable discrimination between genuine fire and common nuisance sources. For each sensor, the operating principle, key performance parameters, fire-relevant response characteristics, and integration constraints are described.

---

## 4.2.1 Fermion MEMS Smoke Detection Sensor (Ethanol Compatible)

The Fermion MEMS Smoke Detection Sensor is a metal-oxide semiconductor (MOS) gas sensor whose sensing mechanism relies on the chemiresistive interaction between target gas molecules and adsorbed oxygen ions on the surface of a heated metal-oxide film. When combustion aerosols and associated reducing gases reach the sensing element, the surface reactions alter the film's electrical resistance, yielding an analogue voltage output proportional to particulate and gas concentration. Khan et al. (2022) describe this class of MOS sensor as having high sensitivity and a low unit cost, noting that the resistance change is caused by chemical interactions between target molecules and adsorbed oxygen ions; however, they also highlight that cross-sensitivity to non-fire volatiles introduces stability concerns that can produce false alarms.

In the context of fire detection, the sensor responds to both smoke particles from flaming combustion and to reducing gases such as ethanol vapour, a property that makes it an effective early indicator of smouldering fires—where visible smoke precedes a fully developed flame—but also renders it susceptible to nuisance triggers such as alcohol-based cleaning products (Fonollosa et al., 2018). The MEMS fabrication process miniaturises the heating element and gas-sensitive film onto a silicon substrate, reducing power consumption and package size compared with traditional pellistor-style sensors, while maintaining adequate sensitivity for indoor environments. The analogue output is sampled by the microcontroller's ADC at 10 Hz, consistent with the system sampling rate, and the resulting time-series signal is used both as an individual feature and as a cross-correlation input with the CO channel during the sensor fusion stage.

A critical operational consideration is the sensor's warm-up requirement: the resistive heating element must reach thermal equilibrium before reliable readings are obtained. Deng et al. (2023) confirmed, in a multi-sensor indoor fire detection system using smoke, CO, and temperature sensors, that raw sensor signals contain transient artefacts during the warm-up phase that must be removed by signal conditioning—in their implementation via a Savitzky–Golay filter—to prevent corruption of downstream classification. The present system accommodates this by enforcing a mandatory pre-sampling stabilisation period in firmware before data forwarding or inference is initiated.

---

## 4.2.2 Gravity Analogue Flame Sensor (IR Spectrum Sensitivity)

The Gravity Analogue Flame Sensor is a near-infrared (NIR) photodetector sensitive to wavelengths in the 760 nm–1100 nm range, which encompasses the primary emission bands of hydrocarbon flames arising from excited carbon-dioxide and water-vapour radicals, as well as incandescent soot particles. The sensor provides both an analogue voltage output proportional to the incident radiant intensity and a configurable digital threshold output via an on-board LM393 comparator, enabling dual-mode use within the firmware. The detection cone spans approximately 60 degrees, which is appropriate for the fixed-installation geometry of the autonomous node.

Khan et al. (2022) categorise NIR photodetectors of this type under non-visual flame detection technologies and note that the spectral response of silicon-based photodiodes in the 760–1100 nm range makes them particularly suitable for detecting hydrocarbon flames at close range, though the authors caution that broadband IR sensitivity also introduces susceptibility to high-intensity ambient light sources, incandescent lamps, and direct sunlight. This cross-sensitivity is a well-known limitation: the sensor cannot intrinsically distinguish between a candle flame at 0.5 m and a halogen desk lamp at the same radiant intensity. In the present architecture, this limitation is addressed through the three-class classification logic, where the `false_alarm` class explicitly includes intense IR light scenarios, and the flame sensor output is validated against concurrent CO and smoke readings before an alert is issued.

Fonollosa et al. (2018) note that combining gas and flame sensing channels provides complementary detection modalities: gas-phase indicators (CO, VOCs) appear earlier in smouldering fires, while the IR flame channel provides high confidence for open flaming combustion. The analogue output of the flame sensor is sampled at the system's 10 Hz rate and concatenated into the multi-sensor feature vector fed to the TinyML classifier, where spectral power features extracted from the 10–15 Hz flame-flicker band further enhance discrimination between genuine flames and static IR sources.

---

## 4.2.3 Fermion VOC Gas Sensor (MEMS)

Volatile organic compounds (VOCs) are released during the pyrolysis phase of smouldering fires—before visible smoke or a fully developed flame appears—making VOC sensing one of the earliest indicators of incipient combustion. The Fermion MEMS VOC Gas Sensor operates on the metal-oxide semiconductor chemiresistive principle, where the surface resistance of a heated SnO₂ or similar metal-oxide film changes upon exposure to reducing organic vapours including acetone, ethanol, toluene, and formaldehyde. The MEMS architecture integrates the micro-heater and sensing film on a silicon substrate, achieving a compact footprint and relatively low power consumption compared with macroscale pellistor sensors.

Fonollosa et al. (2018) identify VOC emissions as primary early-fire indicators, particularly in smouldering scenarios involving polymeric building materials, carpets, and furniture foam, where acrolein, formaldehyde, and other organic irritants are released at temperatures well below those detectable by conventional smoke or heat sensors. Solórzano et al. (2021) demonstrated, using a gas sensor array that included MOX elements targeting VOC signatures, that systems incorporating VOC channels achieve faster fire alarm response than standalone smoke-based detectors in standard fire-room experiments, with PLS-DA models providing 100% specificity and 85% sensitivity four months after calibration. This finding directly motivates the inclusion of the VOC channel in the present node, as it expands the detectable fire phase timeline into early pyrolysis.

The key challenge with MEMS VOC sensors in fire detection applications is selectivity: many common household activities—cooking, use of spray cleaners, and application of personal care products—generate VOC loads that can trigger false positives (Fonollosa et al., 2018). This cross-sensitivity is precisely the scenario modelled by the `false_alarm` class in the present dataset, which includes cooking fumes and alcohol vapours as representative nuisance conditions. Because the VOC sensor alone cannot distinguish fire-origin acetone from cleaning-product acetone, its output is treated as a necessary but insufficient condition for a fire alert, and its classification weight is contextualised through fusion with the CO and smoke channels.

---

## 4.2.4 Fermion MEMS Carbon Monoxide (CO) Sensor

Carbon monoxide is produced in all stages of indoor combustion and is considered the most toxicologically significant combustion product in fire scenarios (Fonollosa et al., 2018). The Fermion MEMS CO Sensor employs a chemiresistive metal-oxide detection element on a silicon MEMS substrate, in which CO molecules reduce adsorbed oxygen on the sensing surface, decreasing film resistance in proportion to CO concentration. Unlike electrochemical CO sensors—which offer higher sensitivity at very low concentrations but require regular recalibration and are sensitive to temperature and humidity—MEMS CO sensors are more durable, compact, and suited to long-term unattended operation (Khan et al., 2022).

Fonollosa et al. (2018) present compelling experimental evidence that photoelectric smoke detectors in some smouldering fire scenarios failed to trigger at all, while CO-augmented detectors triggered the alarm when ambient CO was in the range of 30–60 ppm—well below the incapacitation threshold. This underscores the CO channel's role as what the present research terms the "Truth Sensor" for combustion verification: a CO elevation that co-occurs with elevated smoke and VOC readings constitutes strong evidence of genuine combustion rather than a nuisance event, because most common false-alarm triggers (steam, dust, cooking aerosols without combustion) do not produce significant CO. Deng et al. (2023) corroborate this in their multi-sensor indoor system, where the simultaneous rise in smoke, CO, and temperature was the discriminating pattern used to confirm fire with 99.1% accuracy on an embedded platform.

The MEMS architecture provides the additional benefit of compatibility with the 3.3 V–5 V logic levels of the Arduino UNO R4 WiFi platform without requiring additional signal conditioning circuitry. The sensor's analogue output is read via the microcontroller's 14-bit ADC at 10 Hz. Because CO concentrations rise relatively slowly in large-volume rooms, the CO channel is particularly informative in the time-window statistical features (mean, root mean square) rather than in high-frequency spectral features, a property reflected in the feature engineering pipeline described in Section 3.4.

---

## 4.2.5 Fermion AHT20 Temperature and Humidity Sensor

The AHT20 is a second-generation MEMS capacitive humidity and band-gap temperature sensor produced by ASAIR, offering calibrated digital output over a standard I²C interface. Temperature is measured over a range of −40 °C to +85 °C with an accuracy of ±0.3 °C and a resolution of 0.01 °C, while relative humidity is measured from 0% to 100% RH with an accuracy of ±2% RH and a resolution of 0.024% RH. The sensor operates at 2 V–5 V and draws approximately 0.27 mA at 3.3 V, making it negligible in terms of the node's power budget. Long-term drift is specified at less than 0.04 °C/year for temperature and less than 0.5% RH/year for humidity, ensuring baseline stability over extended deployment periods.

In fire detection, temperature elevation is a well-established indicator of thermal events, but it is also the channel most susceptible to the "Heat Paradox" identified in this project's ablation study: cooking activities, space heaters, and direct sunlight can produce ambient temperature rises that, when treated as a sole criterion, generate false positives. Khan et al. (2022) note that fixed-threshold heat sensors are limited by their inability to discriminate between thermal anomalies from fire and those from controlled heating sources, and that intelligent multi-sensor fusion is required to contextualise thermal readings. In the present system, the AHT20's temperature channel contributes to fire detection through rate-of-rise features and cross-correlation with the gas channels: a temperature increase that co-occurs with rising CO and smoke is classified as fire, whereas an isolated temperature increase with stable gas levels is classified as `false_alarm` or `no_fire`.

Relative humidity is included as a secondary feature because it modulates the sensitivity of all three gas sensors: high humidity suppresses metal-oxide sensor resistance baselines, while very low humidity can shift sensitivity thresholds (Fonollosa et al., 2018). By logging simultaneous humidity readings, the feature extraction stage can partially compensate for humidity-induced drift in the gas sensor channels. Deng et al. (2023) set their fire simulation environment at 40% relative humidity and 20 °C, demonstrating that controlled environmental parameterisation is important for model generalisation—a principle adopted in the data collection protocol of the present project, where environmental metadata including temperature and humidity are recorded alongside sensor readings in every experimental session.

---

## References

Deng, X., Shi, X., Wang, H., Wang, Q., Bao, J., & Chen, Z. (2023). An indoor fire detection method based on multi-sensor fusion and a lightweight convolutional neural network. _Sensors_, _23_(24), 9689. https://doi.org/10.3390/s23249689

Fonollosa, J., Solórzano, A., & Marco, S. (2018). Chemical sensor systems and associated algorithms for fire detection: A review. _Sensors_, _18_(2), 553. https://doi.org/10.3390/s18020553

Khan, F., Xu, Z., Sun, J., Khan, F. M., Ahmed, A., & Zhao, Y. (2022). Recent advances in sensors for fire detection. _Sensors_, _22_(9), 3310. https://doi.org/10.3390/s22093310

Solórzano, A., Eichmann, J., Fernández, L., Ziems, B., Jiménez-Soto, J. M., Marco, S., & Fonollosa, J. (2021). Early fire detection based on gas sensor arrays: Multivariate calibration and validation. _Sensors and Actuators B: Chemical_, _352_, 130961. https://doi.org/10.1016/j.snb.2021.130961

---

## Glossary

- **AHT20**: A second-generation MEMS capacitive temperature and humidity sensor with I²C output, manufactured by ASAIR.
- **Chemiresistive sensor**: A sensor whose electrical resistance changes in response to the chemical interaction between a target gas and its sensing material surface.
- **Cross-sensitivity**: The unwanted response of a sensor to chemical species other than its primary target analyte, a principal source of false alarms in gas-based fire detection.
- **Metal-oxide semiconductor (MOS) sensor**: A gas-sensing element based on the resistance change of a metal-oxide film (e.g., SnO₂) when exposed to reducing or oxidising gases at elevated temperature.
- **VOC (Volatile Organic Compound)**: Organic chemicals with high vapour pressure at room temperature, released during pyrolysis and smouldering combustion; key early-fire chemical markers.
