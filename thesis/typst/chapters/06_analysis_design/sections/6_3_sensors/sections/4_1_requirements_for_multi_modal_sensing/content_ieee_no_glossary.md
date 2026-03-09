The design of an autonomous fire detection node requires a multi-modal sensing strategy to overcome the physical and environmental limitations of traditional single-parameter systems. Because fire is a complex phenomenon characterized by the simultaneous evolution of particulates, gases, infrared radiation, and heat, a single sensor modality is insufficient for robust discrimination between genuine fires and non-fire nuisance events. This section defines the technical and operational requirements that guided the selection of the multi-modal sensor suite for this research.

## Functional and Physical Requirements

The primary functional requirement for the sensor suite is the ability to provide a comprehensive and redundant "fingerprint" of the environment. This necessitates the integration of heterogeneous sensors that target diverse physical properties:

1.  **Chemical Markers**: Continuous monitoring of combustion products, specifically smoke particulates, Volatile Organic Compounds (VOCs), and Carbon Monoxide (CO), is essential for incipient fire detection @fonollosa2018chemical.
2.  **Optical Signature**: The detection of active flames via infrared (IR) radiation provides a high-confidence indicator of open combustion, distinguishing it from smoldering events.
3.  **Environmental Context**: High-resolution temperature and humidity data are required to contextualize gas sensor readings and identify thermal anomalies @LIU2023103733.

Physically, the sensors must be suitable for edge deployment in an "Autonomous Node" architecture. This requires low power consumption—allowing for long-term operation on battery or energy-harvesting systems—and a miniature footprint (MEMS-based) to ensure a compact and unobtrusive device design @meleti2024obscured.

## Operational and Integration Requirements

From an operational perspective, the sensors must support high-frequency sampling (at least 10 Hz) to capture the rapid transients and temporal modulation (e.g., flame flicker) characteristic of fire events. Integration requirements include compatibility with the Arduino UNO R4 WiFi platform, necessitating sensors with standard I2C or analog interfaces. Furthermore, the gas sensors must exhibit sufficient sensitivity to detect sub-ppm concentrations of combustion products while maintaining long-term stability in diverse indoor environments @rasim2024fire.
