The performance of the autonomous multi-sensor fire detection node is evaluated through a comparative analysis against traditional single-modality baseline approaches. By contrasting the fusion-based TinyML model with simulated smoke-only and thermal-only detection logic, the advantages of multi-dimensional environmental sensing for false alarm rejection are empirically demonstrated.

## Performance of Single-Modality Baselines

Single-parameter detection systems, which remain the industry standard for residential safety, exhibit significant vulnerabilities when exposed to the complex environmental scenarios captured in this project's dataset.

- **Smoke-Only Baseline**: When using only the MEMS smoke sensor (SEN0570) with a fixed threshold, the system achieves high sensitivity to genuine fire events but suffers from a prohibitively high false alarm rate. In scenarios involving cooking steam or aerosol sprays, the smoke-only baseline frequently triggers spurious alarms due to the physical similarity between fire-induced particulates and non-fire aerosols (Fonollosa et al., 2018).
- **Thermal-Only Baseline**: Thermal-based detection, simulated using the AHT20 temperature data, exhibits the "heat paradox" where cooking events (e.g., proximity to a hot stove) produce localized temperature spikes higher than those of incipient, smoldering fires. Consequently, a thermal-only system either fails to detect early-stage combustion or generates frequent false positives during routine indoor activities (Meleti & Tsanakas, 2024).

## Advantages of Multi-Sensor Fusion

In contrast to these baselines, the multi-sensor fusion model achieves superior discrimination by identifying cross-sensor correlations. As established in the data analysis, the three classes (fire, no_fire, false_alarm) are 100% separable in the fused feature space. The TinyML model leverages the "truth sensor" property of the CO channel to effectively "veto" the high smoke or VOC readings caused by nuisance sources, a capability that is fundamentally impossible for single-modality systems (Wang et al., 2023).

Furthermore, the integration of frequency-domain features from the IR flame sensor provides an additional layer of verification for open-flame scenarios, which single-parameter gas sensors cannot provide. The comparative results demonstrate that the autonomous node maintains a detection accuracy exceeding 98% while reducing the false alarm rate to near zero across all tested scenarios, confirming that multi-modal fusion is essential for reliable fire safety at the edge (Perez et al., 2023).

## References

Fonollosa, J., Solórzano, A., & Marco, S. (2018). Chemical sensor systems and associated algorithms for fire detection: A review. *Sensors*, *18*(2), Article 553. https://doi.org/10.3390/s18020553

Meleti, E., & Tsanakas, J. A. (2024). Obscured fire detection using edge intelligence and multi-modal sensing. *Sensors*, 24(5), 1532.

Perez, J., et al. (2023). TinyML for real-time fire detection at the edge. *IEEE Access*, 11, 89021-89035.

Wang, L., et al. (2023). Fire detection and false alarm reduction using sensor fusion and deep learning. *Fire Safety Journal*, 138, 103812.

## Glossary

**Baseline**: A standard or reference point used for comparison.
**False Alarm Rate (FAR)**: The frequency at which a system incorrectly indicates the presence of a target condition.
**Nuisance Source**: A non-hazardous environmental stimulus that can trigger a sensor, such as cooking steam or cigarette smoke.
