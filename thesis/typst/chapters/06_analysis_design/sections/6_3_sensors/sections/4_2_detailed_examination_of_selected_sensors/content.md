This section provides a detailed examination of the hardware components selected for the autonomous fire detection node. The sensor suite comprises five distinct modalities, each chosen for its specific sensitivity to combustion products or environmental variables. All gas sensors belong to the DFRobot Fermion MEMS series, optimized for low power consumption and high integration in edge-sensing applications.

### Fermion MEMS Smoke Detection Sensor (SEN0570)

The SEN0570 is a Micro-Electro-Mechanical Systems (MEMS) based smoke sensor designed for high-sensitivity detection of particulates associated with combustion. Unlike traditional ionization or photoelectric detectors, this MEMS implementation utilizes a metal-oxide semiconductor (MOS) layer that reacts to a wide range of smoke types, including those from wood, paper, and synthetic materials. A significant operational advantage of the SEN0570 is its ethanol compatibility, which allows it to maintain stability in environments where alcohol-based cleaning products might trigger false positives in less sophisticated sensors (DFRobot, 2024b). The sensor operates on a 3.3V–5V supply and provides an analog output proportional to smoke concentration, making it ideal for integration with the high-resolution ADCs of the Renesas RA4M1 microcontroller.

### Gravity Analog Flame Sensor (DFR0076)

The Gravity Analog Flame Sensor is an infrared (IR) based device optimized for detecting radiation in the 760 nm to 1100 nm wavelength band. This spectrum is characteristic of the thermal emissions of an open flame. The sensor utilizes a phototransistor with a wide detection angle of approximately 60 degrees and a response time of less than 1 ms, enabling the capture of high-frequency flame flicker (Rasim & Max, 2024). The onboard potentiometer allows for hardware-level sensitivity adjustment, providing a first line of defense against static IR interference before digital signal processing.

### Fermion VOC Gas Sensor (SEN0566)

Volatile Organic Compounds (VOCs) are primary indicators of early-stage fire, especially when synthetic materials or chemical accelerants are involved. The SEN0566 MEMS VOC sensor is designed to detect a broad spectrum of organic vapors, including formaldehyde, benzene, and toluene, with a detection range of 0 to 1000 ppm (DFRobot, 2024c). Its small form factor and low power consumption (<50 mW) are critical for continuous 24/7 monitoring in stationary nodes. The sensor's rapid response to ambient air quality changes provides the machine learning model with the high-frequency temporal data necessary to distinguish between slow-building fire signatures and transient environmental changes.

### Fermion MEMS Carbon Monoxide (CO) Sensor (SEN0564)

The detection of Carbon Monoxide (CO) is the most reliable method for combustion verification, as CO is a byproduct of nearly all fire events but is rarely produced by common household nuisance sources like steam or aerosol sprays. The SEN0564 MEMS CO sensor provides high selectivity for CO molecules with a typical sensing range of 1 to 1000 ppm (DFRobot, 2024a). By acting as a "truth sensor" within the fusion model, the CO sensor significantly reduces the false alarm rate by providing a physical confirmation of incomplete combustion that must coincide with elevated smoke or VOC readings (Wang et al., 2023).

### Fermion AHT20 Temperature and Humidity Sensor

Environmental context is provided by the AHT20, a high-precision digital sensor that communicates via the I2C protocol. It offers a temperature accuracy of ±0.3°C and a relative humidity accuracy of ±2%. In this research, the AHT20 serves two critical roles: first, it provides data for the "heat paradox" analysis, where thermal anomalies are used to distinguish cooking events from incipient fires (Meleti & Tsanakas, 2024); second, it enables humidity-based compensation for the MOS gas sensors, whose resistance can be influenced by ambient moisture levels (Hatip & Kocamaz, 2024).

## References

DFRobot. (2024a). *Fermion: MEMS CO Gas Sensor (1-1000ppm) - SEN0564 Datasheet*. https://wiki.dfrobot.com/SKU_SEN0564_Fermion_MEMS_CO_Gas_Sensor

DFRobot. (2024b). *Fermion: MEMS Smoke Sensor - SEN0570 Datasheet*. https://wiki.dfrobot.com/SKU_SEN0570_Fermion_MEMS_Smoke_Sensor

DFRobot. (2024c). *Fermion: MEMS VOC Gas Sensor - SEN0566 Datasheet*. https://wiki.dfrobot.com/SKU_SEN0566_Fermion_MEMS_VOC_Gas_Sensor

Hatip, H., & Kocamaz, U. E. (2024). A multisensory fusion-based approach for fire detection using machine learning. *Journal of Fire Sciences*, 42(1), 45-62.

Meleti, E., & Tsanakas, J. A. (2024). Obscured fire detection using edge intelligence and multi-modal sensing. *Sensors*, 24(5), 1532.

Rasim, M., & Max, A. (2024). Fire detection system using Arduino and MEMS sensors. *International Journal of Embedded Systems*, 16(2), 120-135.

Wang, L., et al. (2023). Fire detection and false alarm reduction using sensor fusion and deep learning. *Fire Safety Journal*, 138, 103812.

## Glossary

**MEMS (Micro-Electro-Mechanical Systems)**: Technology that in its most general form can be defined as miniaturized mechanical and electro-mechanical elements that are made using the techniques of microfabrication.
**ADC (Analog-to-Digital Converter)**: A system that converts an analog signal into a digital signal.
**I2C (Inter-Integrated Circuit)**: A synchronous, multi-master, multi-slave, packet switched, single-ended, serial communication bus.
**Sub-ppm**: Concentrations less than one part per million.
