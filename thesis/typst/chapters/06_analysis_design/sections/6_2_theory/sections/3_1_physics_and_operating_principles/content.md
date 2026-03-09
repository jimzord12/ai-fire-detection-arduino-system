The detection of incipient fire events requires the precise transduction of physical and chemical phenomena into measurable electrical signals. This process is governed by the operating principles of diverse sensor modalities, each targeting specific signatures of combustion, such as aerosol concentration, gas evolution, infrared radiation, and thermal fluctuations. Understanding these underlying physics is essential for developing robust sensor fusion algorithms that can distinguish between genuine fire threats and environmental noise.

## Metal-Oxide Semiconductor (MOS) Gas Sensing

The primary mechanism for detecting smoke, volatile organic compounds (VOCs), and carbon monoxide (CO) in modern Micro-Electro-Mechanical Systems (MEMS) sensors is based on the chemo-resistive effect of metal-oxide semiconductors, most commonly tin dioxide (SnO2). In an oxygen-rich environment, oxygen molecules from the atmosphere are adsorbed onto the surface of the heated metal-oxide grain, capturing electrons from the conduction band and forming a depletion layer (Wang, 2023). This results in a high baseline electrical resistance.

When reducing gases—such as CO or hydrocarbons found in smoke—interact with the adsorbed oxygen, a redox reaction occurs, releasing electrons back into the semiconductor's conduction band. This process reduces the thickness of the depletion layer and significantly decreases the sensor's electrical resistance (Hatip, 2024). The magnitude of this resistance change is proportional to the concentration of the target gas, allowing for quantitative measurement. MEMS implementations optimize this process by integrating a micro-heater that maintains the sensing layer at an ideal operating temperature (typically 200°C to 400°C), ensuring rapid reaction kinetics and high sensitivity within a miniature footprint (Meleti, 2024).

## Infrared (IR) Flame Detection

Flame detection relies on the principles of blackbody radiation and the specific spectral emissions of hot gases. During the combustion of organic materials, carbon dioxide (CO2) molecules are excited and emit characteristic radiation in the infrared spectrum, particularly a strong peak at approximately 4.3 μm, known as the "CO2 spike" (Perez, 2023). Additionally, the flickering nature of a flame—typically occurring at frequencies between 1 Hz and 20 Hz—provides a temporal signature that distinguishes it from static heat sources.

Infrared sensors, such as the Gravity Analog Flame Sensor, utilize a photodiode or phototransistor sensitive to a specific range of the IR spectrum (typically 760 nm to 1100 nm). When IR photons within this band strike the active area of the sensor, they generate a photocurrent proportional to the radiation intensity (Rasim, 2024). By analyzing both the absolute intensity and the frequency components of this signal, the system can identify the presence of an active flame while rejecting interference from sunlight or artificial lighting.

## Capacitive and Resistive Environmental Sensing

Environmental variables, specifically temperature and humidity, serve as critical context for gas sensor readings and as secondary indicators of fire. Humidity sensing in modern digital sensors, such as the AHT20, often employs a capacitive operating principle. A thin-film polymer dielectric is placed between two electrodes; as water molecules are adsorbed by the polymer, its dielectric constant changes, leading to a measurable change in capacitance (Wang, 2023).

Temperature sensing typically leverages the predictable resistance-temperature relationship of a thermistor or the voltage-temperature relationship of a p-n junction. In integrated MEMS devices, these thermal changes are converted into digital values via an on-chip Analog-to-Digital Converter (ADC), providing high-resolution data for environmental compensation and thermal anomaly detection (Meleti, 2024).

## References

Hatip, H., & Kocamaz, U. E. (2024). A multisensory fusion-based approach for fire detection using machine learning. Journal of Fire Sciences, 42(1), 45-62.

Meleti, E., & Tsanakas, J. A. (2024). Obscured fire detection using edge intelligence and multi-modal sensing. Sensors, 24(5), 1532.

Perez, J., et al. (2023). TinyML for real-time fire detection at the edge. IEEE Access, 11, 89021-89035.

Rasim, M., & Max, A. (2024). Fire detection system using Arduino and MEMS sensors. International Journal of Embedded Systems, 16(2), 120-135.

Wang, L., et al. (2023). Fire detection and false alarm reduction using sensor fusion and deep learning. Fire Safety Journal, 138, 103812.

## Glossary

**Chemo-resistive Effect**: The phenomenon where the electrical resistance of a material changes in response to the chemical adsorption of gas molecules.
**Redox Reaction**: A chemical reaction involving the transfer of electrons between two species, consisting of simultaneous reduction and oxidation.
**Blackbody Radiation**: The electromagnetic radiation emitted by by an idealized physical body that absorbs all incident electromagnetic radiation.
**Depletion Layer**: An insulating region within a conductive semiconductor material where the mobile charge carriers have been diffused away.
