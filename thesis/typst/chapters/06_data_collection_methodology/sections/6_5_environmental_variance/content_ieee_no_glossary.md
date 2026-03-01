The robustness of an autonomous fire detection system is fundamentally linked to its ability to generalize across diverse environmental conditions. Because the chemical and physical signatures of fire are highly dependent on ambient variables—such as background air quality, ventilation rates, and thermal gradients—the data collection methodology must incorporate a wide range of environmental variance. This section details the strategy used to capture this variance, ensuring that the machine learning model can distinguish between fire events and "no_fire" ambient noise across different deployment scenarios.

## Spatial and Contextual Variance

To build a representative dataset, sensor data was collected in three distinct environmental contexts, each presenting a unique set of challenges for sensor fusion:

1.  **Indoor Residential/Office**: Characterized by stable temperatures and low background gas concentrations, but subject to high-frequency nuisance events such as cooking steam or aerosol usage.
2.  **Outdoor Urban/City**: Exposed to variable background VOC levels from vehicular emissions and fluctuating humidity, which can influence the baseline resistance of MEMS gas sensors @hatip2024multisensory.
3.  **Simulated Outdoor/Transition**: Controlled experiments where the node was exposed to varying airflow rates to simulate wind interference, which is known to disperse smoke plumes and modulate flame flicker frequencies @fonollosa2018chemical.

By recording "no_fire" baselines in each of these environments, the system ensures that the TinyML model learns to ignore localized background drift and seasonal variations in temperature and humidity.

## Rejection of Location-Specific Bias

A critical risk in multi-sensor fire detection is the development of location-specific bias, where a model may inadvertently learn the unique background signature of a specific room rather than the universal signature of fire. To mitigate this, the "no_fire" class includes samples from diverse zones recorded at different times of day @wang2023fire. This approach ensures that the decision boundary for the "fire" class is defined by the correlated rise in combustion products rather than absolute thresholds that might only be valid in a single, controlled laboratory setting. Furthermore, the inclusion of variable airflow during fire scenarios validates the system's performance in semi-open environments, where traditional detectors often fail due to smoke dilution @meleti2024obscured.
