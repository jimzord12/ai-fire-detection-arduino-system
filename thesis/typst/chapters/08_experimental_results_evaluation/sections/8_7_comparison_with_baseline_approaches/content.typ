== Comparison with Baseline Approaches

The performance of the autonomous multi-sensor fire detection node is evaluated through a comparative analysis against traditional single-modality baseline approaches. By contrasting the fusion-based TinyML model with simulated smoke-only and thermal-only detection logic, the advantages of multi-dimensional environmental sensing for false alarm rejection are empirically demonstrated.

=== Performance of Single-Modality Baselines

Single-parameter detection systems, which remain the industry standard for residential safety, exhibit significant vulnerabilities when exposed to the complex environmental scenarios captured in this project's dataset.

- *Smoke-Only Baseline*: When using only the MEMS smoke sensor with a fixed threshold, the system achieves high sensitivity to genuine fire events but suffers from a prohibitively high false alarm rate. In scenarios involving cooking steam or aerosol sprays, the smoke-only baseline frequently triggers spurious alarms due to the physical similarity between fire-induced particulates and non-fire aerosols @fonollosa2018chemical.
- *Thermal-Only Baseline*: Thermal-based detection, simulated using the temperature data, exhibits the "heat paradox" where cooking events produce localized temperature spikes higher than those of incipient, smoldering fires. Consequently, a thermal-only system either fails to detect early-stage combustion or generates frequent false positives during routine indoor activities @meleti2024obscured.

=== Advantages of Multi-Sensor Fusion

In contrast to these baselines, the multi-sensor fusion model achieves superior discrimination by identifying cross-sensor correlations. As established in the data analysis, the three classes (fire, no_fire, false_alarm) are 100% separable in the fused feature space. The TinyML model leverages the "truth sensor" property of the CO channel to effectively "veto" the high smoke or VOC readings caused by nuisance sources, a capability that is fundamentally impossible for single-modality systems @wang2023fire.

Furthermore, the integration of frequency-domain features from the IR flame sensor provides an additional layer of verification for open-flame scenarios, which single-parameter gas sensors cannot provide. The comparative results demonstrate that the autonomous node maintains a detection accuracy exceeding 98% while reducing the false alarm rate to near zero across all tested scenarios, confirming that multi-modal fusion is essential for reliable fire safety at the edge @sailesh2022novel.
