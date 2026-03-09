=== Justification of Sensor Choice

The selection of the multi-modal sensor suite for the autonomous fire detection node is justified by the need to balance high sensitivity for early-stage fire detection with high selectivity to minimize false alarms. Traditional fire detectors often suffer from a trade-off where increasing sensitivity leads to a proportional increase in nuisance alarms from non-fire aerosols or environmental fluctuations. This section provides the rationale for the chosen sensors, focusing on how their complementary properties address this fundamental challenge.

==== Sensitivity for Early Detection

The primary justification for selecting the DFRobot Fermion MEMS gas sensor series (Smoke and VOC) is their exceptional sensitivity to the gaseous and particulate byproducts of incipient fires. MEMS-based metal-oxide (MOS) sensors exhibit rapid response times and can detect combustion markers at sub-ppm concentrations, often before visible smoke or significant heat is present @fonollosa2018chemical. By integrating both a broad-spectrum VOC sensor and a particulate-focused smoke sensor, the system captures a high-resolution "chemical snapshot" of the environment, ensuring that slow-building or smoldering fires are identified in their earliest stages.

==== Selectivity and the "Truth Sensor" Strategy

While sensitivity ensures detection, selectivity is critical for discrimination. The inclusion of the SEN0564 MEMS Carbon Monoxide (CO) sensor is a strategic choice justified by its high selectivity for CO, a universal product of incomplete combustion. As demonstrated in the project's data analysis, CO levels remain near baseline in common false alarm scenarios such as cooking steam, aerosol sprays, or cleaning alcohol, whereas they spike significantly during genuine fire events @LIU2023103733. By designating the CO sensor as a "truth sensor" within the fusion model, the node can effectively "veto" high readings from the more cross-sensitive smoke and VOC sensors if a corresponding CO rise is not detected, significantly reducing the false positive rate.

==== Redundancy and Contextual Validation

The Gravity Analog Flame Sensor and the AHT20 environmental sensor provide the necessary redundant and contextual data to validate chemical sensor readings. The IR flame sensor offers a non-chemical detection modality that is nearly instantaneous, providing a high-confidence indicator of open flames that is physically distinct from gas-based detection @toreyin2012wavelet. Simultaneously, the AHT20's temperature and humidity data are used to contextualize gas sensor resistance changes, allowing the machine learning model to account for ambient environmental variance and identify "heat paradox" scenarios where false alarms may exhibit higher localized temperatures than early-stage fires @meleti2024obscured. This multi-layered approach ensures that the node's final classification is based on a fused consensus of physically diverse phenomena.
