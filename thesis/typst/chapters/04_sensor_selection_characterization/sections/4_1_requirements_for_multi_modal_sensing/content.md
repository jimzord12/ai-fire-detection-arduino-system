The design of an autonomous fire detection node requires a multi-modal sensing strategy to overcome the physical and environmental limitations of traditional single-parameter systems. Because fire is a complex phenomenon characterized by the simultaneous evolution of particulates, gases, infrared radiation, and heat, a single sensor modality is insufficient for robust discrimination between genuine fires and non-fire nuisance events. This section defines the technical and operational requirements that guided the selection of the multi-modal sensor suite for this research.

## Functional and Physical Requirements

The primary functional requirement for the sensor suite is the ability to provide a comprehensive and redundant "fingerprint" of the environment. This necessitates the integration of heterogeneous sensors that target diverse physical properties:

1.  **Chemical Markers**: Continuous monitoring of combustion products, specifically smoke particulates, Volatile Organic Compounds (VOCs), and Carbon Monoxide (CO), is essential for incipient fire detection (Fonollosa et al., 2018).
2.  **Optical Signature**: The detection of active flames via infrared (IR) radiation provides a high-confidence indicator of open combustion, distinguishing it from smoldering events.
3.  **Environmental Context**: High-resolution temperature and humidity data are required to contextualize gas sensor readings and identify thermal anomalies (Wang et al., 2023).

Physically, the sensors must be suitable for edge deployment in an "Autonomous Node" architecture. This requires low power consumption—allowing for long-term operation on battery or energy-harvesting systems—and a miniature footprint (MEMS-based) to ensure a compact and unobtrusive device design (Meleti & Tsanakas, 2024).

## Operational and Integration Requirements

From an operational perspective, the sensors must support high-frequency sampling (at least 10 Hz) to capture the rapid transients and temporal modulation (e.g., flame flicker) characteristic of fire events. Integration requirements include compatibility with the Arduino UNO R4 WiFi platform, necessitating sensors with standard I2C or analog interfaces. Furthermore, the gas sensors must exhibit sufficient sensitivity to detect sub-ppm concentrations of combustion products while maintaining long-term stability in diverse indoor environments (Rasim & Max, 2024).

## References

Fonollosa, J., Solórzano, A., & Marco, S. (2018). Chemical sensor systems and associated algorithms for fire detection: A review. *Sensors*, *18*(2), Article 553. https://doi.org/10.3390/s18020553

Meleti, E., & Tsanakas, J. A. (2024). Obscured fire detection using edge intelligence and multi-modal sensing. *Sensors*, 24(5), 1532.

Rasim, M., & Max, A. (2024). Fire detection system using Arduino and MEMS sensors. *International Journal of Embedded Systems*, 16(2), 120-135.

Wang, L., et al. (2023). Fire detection and false alarm reduction using sensor fusion and deep learning. *Fire Safety Journal*, 138, 103812.

## Glossary

**Multi-modal Sensing**: A sensing strategy that utilizes multiple different types of sensors to gather information about an environment.
**Heterogeneous Sensors**: A collection of sensors that use different physical principles or target different phenomena.
**Edge Deployment**: The strategy of placing sensors and processing power at the "edge" of a network, directly at the site of data generation.
