# Evolution of Fire Detection and MEMS Technology

## 2.2.1 From Single-Sensor Units to Intelligent Multi-Modal Nodes

The history of fire detection systems reveals a consistent drive towards enhanced reliability, speed, and false alarm reduction. Early fire detection was largely reactive, relying on human observation or simple thermal alarms. The advent of single-sensor fire detectors, primarily ionization and photoelectric smoke alarms, marked a significant advancement. Ionization smoke detectors, introduced in the mid-20th century, are highly sensitive to fast-flaming fires producing small, invisible combustion particles, while photoelectric detectors excel at detecting slow, smoldering fires that generate larger, visible smoke particles [1]. Despite their widespread adoption and effectiveness in saving lives, these single-sensor units are inherently limited. Their reliance on a single physical phenomenon makes them susceptible to false alarms triggered by non-fire aerosols such as cooking fumes, steam, or dust [2].

The limitations of single-sensor approaches spurred the development of multi-sensor fire detectors. These systems integrate two or more sensing technologies (e.g., photoelectric and ionization smoke, heat, or carbon monoxide) within a single unit. The goal is to improve discrimination by analyzing multiple fire signatures simultaneously. For instance, a rise in both smoke and heat provides stronger evidence of a fire than either alone. Modern multi-sensor detectors often employ basic logic or algorithms to interpret combined sensor readings, leading to a reduction in nuisance alarms compared to their single-sensor predecessors [3]. This evolution marked a transition from purely reactive, threshold-based detection to rudimentary intelligent decision-making at the device level.

The current frontier in fire detection is the emergence of intelligent multi-modal nodes. These systems move beyond simple sensor fusion to incorporate advanced computational capabilities, often leveraging machine learning and artificial intelligence at the edge. The term "multi-modal" implies the integration of diverse sensor types that capture different physical properties associated with fire, not just different types of smoke or heat. This includes gas sensors (CO, VOC), flame sensors (IR, UV), and environmental sensors (temperature, humidity), alongside traditional smoke detectors. The shift to "nodes" emphasizes their networked, autonomous nature, capable of local processing and intelligent decision-making before transmitting alerts. This paradigm enables sophisticated pattern recognition, allowing systems to distinguish between actual fire events, normal environmental conditions, and various false alarm sources through contextual analysis and sensor fusion algorithms [4].

## 2.2.2 Characteristics of MEMS Sensors (Smoke, VOC, CO) and IR Flame Detection

Micro-Electro-Mechanical Systems (MEMS) technology has revolutionized sensor design, offering compact, low-power, and cost-effective solutions critical for the development of intelligent edge nodes. MEMS sensors are miniaturized devices fabricated using microfabrication techniques, enabling high sensitivity and integration into small form factors. In fire detection, key MEMS-based gas sensors include smoke, Volatile Organic Compounds (VOC), and Carbon Monoxide [5]. However, like all smoke sensors, they can be triggered by non-fire aerosols, necessitating fusion with other modalities.

**MEMS VOC Sensors**: VOC sensors are designed to detect a wide range of organic compounds present in the air, many of which are combustion byproducts. Similar to MEMS smoke sensors, they often employ MOS technology, where the resistance changes upon adsorption of VOC molecules. The presence of VOCs can indicate various phenomena, including chemical spills, off-gassing from materials, or the initial stages of a smoldering fire. By monitoring VOC levels, these sensors provide early indicators that can be correlated with other fire signatures. Their broad sensitivity means they are crucial for detecting complex scenarios but also require careful interpretation to avoid false alarms from cleaning products or cooking [6].

**MEMS CO Sensors**: Carbon Monoxide [7]. Therefore, CO is often considered a "truth sensor" in multi-modal fire detection.

**Infrared [8]. Modern IR flame detectors often consist of one or more IR photodetectors (e.g., narrow-band IR sensors tuned to specific flame emission wavelengths) and a signal processing unit. By analyzing the intensity and flicker frequency of the incoming IR radiation, these sensors can quickly and reliably identify flames, even in the presence of smoke or non-combustion heat sources. They are less prone to false alarms from non-fire aerosols but can be triggered by other IR sources like strong sunlight or heating elements, underscoring the need for multi-modal fusion.


DFRobot. (2022). *Gravity: I2C MEMS VOC Sensor - SGP40*. DFRobot Wiki.

Intelligent Fire Detection Systems Using Deep Learning and Multi-Sensor Data Fusion. (2025). *Journal Name*, *Volume*(Issue), pages. (Note: Full reference details were not provided in the search result for this paper. Placeholder used.)

Multi-sensor data fusion algorithm for indoor fire detection based on ensemble learning. (2024). *Journal Name*, *Volume*(Issue), pages. (Note: Full reference details were not provided in the search result for this paper. Placeholder used.)

National Fire Protection Association. (2021). *NFPA 72: National Fire Alarm and Signaling Code*.

Nekhil, R. (2023). *Fire detection using sensor fusion and TinyML – Arduino Nano 33 BLE Sense*. Edge Impulse Expert Network.

Real-time Smoke Detection with AI-Based Sensor Fusion. (2025). *Journal Name*, *Volume*(Issue), pages. (Note: Full reference details were not provided in the search result for this paper. Placeholder used.)

Tavakkoli Moghaddam, E., Ebadi, A., & Safarpour, H. (2023). A fire alarm judgment method using multiple smoke alarms based on Bayesian estimation. _Fire Safety Journal_, _136_, 103988.

Wang, Y., & Wang, Y. (2017). Research on fire detection technology based on image processing. _International Journal of Signal Processing, Image Processing and Pattern Recognition_, _10_(5), 183-194.

### References

- [1] UNKNOWN (APA - No Full Match): (National Fire Protection Association, 2021)
- [2] UNKNOWN (APA - No Full Match): (Tavakkoli Moghaddam et al., 2023)
- [3] UNKNOWN (APA - No Full Match): (Intelligent Fire Detection Systems, 2025)
- [4] UNKNOWN (APA - No Full Match): (Real-time Smoke Detection, 2025; Multi-sensor data fusion algorithm, 2024)
- [5] UNKNOWN (APA - No Full Match): (CO) detectors.

**MEMS Smoke Sensors**: These sensors typically utilize a micro-hotplate with a metal oxide semiconductor (MOS) sensing layer. When smoke particles (combustion aerosols) come into contact with the heated surface, they cause a change in the electrical resistance of the MOS layer. This resistance change is then converted into an electrical signal, indicating the presence of smoke. MEMS technology allows for rapid response times, lower power consumption compared to traditional smoke detectors, and reduced susceptibility to environmental drift (Nekhil, 2023)
- [6] UNKNOWN (APA - No Full Match): (DFRobot, 2022)
- [7] UNKNOWN (APA - No Full Match): (CO) is a highly toxic gas produced during incomplete combustion, making it a critical indicator of active fire. MEMS CO sensors leverage electrochemical or MOS principles to detect CO concentrations. Electrochemical CO sensors produce an electrical current proportional to the CO concentration, offering high selectivity. MOS-type CO sensors, meanwhile, exhibit resistance changes. Due to its unique characteristic as a byproduct of combustion, CO sensing plays a vital role in distinguishing real fires from false alarm sources like steam or cooking, which often produce smoke or VOCs but negligible CO (Nekhil, 2023)
- [8] UNKNOWN (APA - No Full Match): (IR) Flame Detection**: IR flame sensors detect the infrared radiation emitted by flames. Flames produce characteristic flicker frequencies (typically 1-30 Hz) due to their turbulent combustion (Wang & Wang, 2017)