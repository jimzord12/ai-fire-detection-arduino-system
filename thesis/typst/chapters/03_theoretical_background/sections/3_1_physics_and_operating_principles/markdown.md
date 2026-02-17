The following research outlines the physical and chemical operating principles of the sensors utilized in the autonomous fire detection node, focusing on transduction mechanisms and signal characteristics.

## MEMS MOx Gas Sensors

The detection of smoke, Carbon Monoxide (CO), and Volatile Organic Compounds (VOCs) relies on the **chemiresistive effect** in metal oxide semiconductors, typically Tin Dioxide (\(SnO_2\)). In clean air, oxygen molecules adsorb onto the \(SnO_2\) surface, capturing electrons from the conduction band to form ionic species (e.g., \(O^-\) or \(O_2^-\)), which creates a depletion layer and increases electrical resistance. When exposed to **reducing gases** like CO or VOCs, these gases react with the adsorbed oxygen ions, releasing electrons back into the semiconductor and significantly decreasing the sensor's resistance. [academia](https://www.academia.edu/127106397/MOX_Based_Resistive_Gas_Sensors_with_Different_Types_of_Sensitive_Materials_Powders_Pellets_Films_Used_in_Environmental_Chemistry)

MEMS-based gas sensors utilize a **micro-hotplate** (MHP) structure, consisting of a suspended thin-film membrane that integrates a heater and sensing electrodes. This architecture allows the sensing film to reach optimal operating temperatures (typically \(200^{\circ}C\) to \(400^{\circ}C\)) with minimal power consumption, often below 100 mW. Temperature plays a critical role in **selectivity**; for instance, \(SnO_2\) exhibits peak sensitivity to CO at lower temperatures, while higher temperatures are required to facilitate the oxidation of complex VOCs. [nature](https://www.nature.com/articles/s41378-025-01055-6)

## IR Flame Detection

Flame detection is achieved by monitoring specific spectral signatures and temporal patterns unique to combustion. Hydrocarbon fires exhibit a prominent **"CO2 Spike"** at approximately 4.3 µm due to the resonance of hot carbon dioxide molecules produced during the reaction. While industrial detectors use specialized Mid-IR sensors for this peak, low-cost **silicon-based sensors** operate in the Near-IR (760 nm–1100 nm) range, detecting the blackbody radiation emitted by the flame's soot particles. [eelectronicparts](https://www.eelectronicparts.com/products/flame-detection-sensor-ir-infrared-receiver-control-module-760nm-1100nm)

To distinguish a real fire from steady IR sources like sunlight or incandescent bulbs, these sensors analyze the **flicker frequency**, which typically ranges from 1 to 30 Hz due to air turbulence and fuel-oxidant mixing. Steady heat sources produce a constant (DC) signal, whereas artificial lighting often oscillates at 100/120 Hz, allowing the fire node to filter out false alarms by focusing on the characteristic low-frequency flicker of a flame. [sense-ware](https://www.sense-ware.com/wp-content/uploads/7.5-SW_Flame_School_The_Spectrum.pdf)

## AHT20 Capacitive Sensing

The AHT20 measures relative humidity (RH) through a **capacitive transduction** mechanism using a hygroscopic polymer as a dielectric material. The dielectric constant of water (\(\epsilon \approx 80\)) is significantly higher than that of the dry polymer; as water vapor is absorbed, the overall capacitance of the sensor increases proportionally to the ambient humidity. This change is then converted into a digital signal by an integrated ASIC. [asairsensors](https://asairsensors.com/product/aht20-integrated-temperature-and-humidity-sensor-filter-membrane/)

During the initial stages of combustion, the AHT20 captures rapid environmental fluctuations that serve as early fire indicators:

- **Temperature Spikes**: Rapid exothermic reactions cause a sharp rise in thermal energy.
- **Humidity Fluctuations**: While high-temperature fires often lower local RH, the combustion of certain fuels (like wood or alcohol) initially releases water vapor as a byproduct, leading to a transient humidity increase. [wiki.dfrobot](https://wiki.dfrobot.com/SKU_SEN0528_Gravity_AHT20_Temperature_and_Humidity_Sensor)

## Sensor Stability and Aging

MEMS gas sensors are subject to **long-term drift** caused by grain growth in the sensing film, chemical poisoning (e.g., from siloxanes), and baseline shifts due to ambient humidity changes. Standard compensation techniques include: [pubs.acs](https://pubs.acs.org/doi/10.1021/acs.chemrev.4c00592)

- **Baseline Tracking**: Algorithms that continuously adjust the "clean air" reference value to account for slow environmental shifts. [pmc.ncbi.nlm.nih](https://pmc.ncbi.nlm.nih.gov/articles/PMC12687727/)
- **Pulse-Driven Heating**: Periodically cycling the micro-hotplate temperature to "clean" the sensor surface and perform differential measurements, which improves stability. [pmc.ncbi.nlm.nih](https://pmc.ncbi.nlm.nih.gov/articles/PMC12687727/)
- **TinyML Integration**: Using machine learning models to recognize the _pattern_ of a gas rise rather than relying on absolute resistance thresholds, effectively mitigating the impact of gradual sensor aging. [geweedetector](https://www.geweedetector.com/how-do-ir-flame-detectors-work/)

### References

Aosong Electronics. (2024). _Data Sheet AHT20 - Humidity and Temperature Sensor_. https://www.aosong.com/userfiles/files/media/Data%20Sheet%20AHT20.pdf

DFRobot. (2023). _AHT20 Temperature and Humidity Sensor Arduino Wiki_. https://wiki.dfrobot.com/SKU_SEN0528_Gravity_AHT20_Temperature_and_Humidity_Sensor

HJP Sensor. (2025). _Application of Infrared Sensing Technology in Flame Detection_. https://www.hjpsensor.com/news/new-76-242.html

Li, Z., et al. (2025). Ultra-sensitive ethanol detection using a chemiresistive SnO2 thin-film gas sensor functionalized with RuO2 nanosheets. _Microsystems & Nanoengineering_, _11_(6). https://doi.org/10.1038/s41378-025-01055-6

Liu, X., et al. (2025). Selectivity in Chemiresistive Gas Sensors: Strategies and Challenges. _Chemical Reviews_. https://doi.org/10.1021/acs.chemrev.4c00592

Nazemi, H., et al. (2019). MOX-Based Resistive Gas Sensors with Different Types of Sensitive Materials. _Sensors_, _19_(6). https://doi.org/10.3390/s19061287

Sense-WARE. (2021). _The Spectrum: Flame School_. https://www.sense-ware.com/wp-content/uploads/7.5-SW_Flame_School_The_Spectrum.pdf

Vicentini, R., et al. (2025). Tailoring the ethanol selectivity of SnO2-based MEMS gas sensors by combining WO3 loading with a pulse-driven heating mode. _Scientific Reports_, _15_. https://doi.org/10.1038/s41598-025-05613-0

Wang, D., et al. (2018). Microhotplates for Metal Oxide Semiconductor Gas Sensor Applications—Towards the CMOS-MEMS Monolithic Approach. _Micromachines_, _9_(11), 562. https://doi.org/10.3390/mi9110562
