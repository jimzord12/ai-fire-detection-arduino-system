The robustness of an autonomous fire detection system is fundamentally linked to its ability to generalize across diverse environmental conditions. Because the chemical and physical signatures of fire are highly dependent on ambient variables—such as background air quality, ventilation rates, and thermal gradients—the data collection methodology must incorporate a wide range of environmental variance. This section details the strategy used to capture this variance, ensuring that the machine learning model can distinguish between fire events and "no_fire" ambient noise across different deployment scenarios.

## Spatial and Contextual Variance

To build a representative dataset, sensor data was collected in three distinct environmental contexts, each presenting a unique set of challenges for sensor fusion:

1.  **Indoor Residential/Office**: Characterized by stable temperatures and low background gas concentrations, but subject to high-frequency nuisance events such as cooking steam or aerosol usage.
2.  **Outdoor Urban/City**: Exposed to variable background VOC levels from vehicular emissions and fluctuating humidity, which can influence the baseline resistance of MEMS gas sensors (Hatip & Kocamaz, 2024).
3.  **Simulated Outdoor/Transition**: Controlled experiments where the node was exposed to varying airflow rates (using fans) to simulate wind interference, which is known to disperse smoke plumes and modulate flame flicker frequencies (Fonollosa et al., 2018).

By recording "no_fire" baselines in each of these environments, the system ensures that the TinyML model learns to ignore localized background drift and seasonal variations in temperature and humidity.

## Rejection of Location-Specific Bias

A critical risk in multi-sensor fire detection is the development of location-specific bias, where a model may inadvertently learn the unique background signature of a specific room rather than the universal signature of fire. To mitigate this, the "no_fire" class includes samples from diverse zones (e.g., kitchens, laboratories, and outdoor balconies) recorded at different times of day (Wang et al., 2023). This approach ensures that the decision boundary for the "fire" class is defined by the correlated rise in combustion products (CO, smoke, VOC) rather than absolute thresholds that might only be valid in a single, controlled laboratory setting. Furthermore, the inclusion of variable airflow during fire scenarios validates the system's performance in semi-open environments, where traditional detectors often fail due to smoke dilution (Meleti & Tsanakas, 2024).

## References

Fonollosa, J., Solórzano, A., & Marco, S. (2018). Chemical sensor systems and associated algorithms for fire detection: A review. *Sensors*, *18*(2), Article 553. https://doi.org/10.3390/s18020553

Hatip, H., & Kocamaz, U. E. (2024). A multisensory fusion-based approach for fire detection using machine learning. *Journal of Fire Sciences*, 42(1), 45-62.

Meleti, E., & Tsanakas, J. A. (2024). Obscured fire detection using edge intelligence and multi-modal sensing. *Sensors*, 24(5), 1532.

Wang, L., et al. (2023). Fire detection and false alarm reduction using sensor fusion and deep learning. *Fire Safety Journal*, 138, 103812.

## Glossary

**Environmental Variance**: The range of different environmental conditions (temperature, humidity, air quality) encountered by a system.
**Generalizability**: The ability of a machine learning model to perform accurately on new, unseen data that was not part of its training set.
**Smoke Dilution**: The reduction in smoke concentration due to mixing with clean air, often caused by strong ventilation or wind.
