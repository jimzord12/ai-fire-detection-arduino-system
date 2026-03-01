== False Alarm Mitigation and Research Synthesis

The mitigation of false alarms remains the primary driver for innovation in fire detection systems. Current literature identifies a significant gap in the ability of traditional detectors to distinguish between genuine combustion and common indoor nuisance events, such as cooking aerosols, water steam, and alcohol-based cleaning vapors. These events often produce physical signatures—elevated particulate counts and VOC spikes—that mimic the early stages of a fire, leading to high rates of spurious triggers @fonollosa2018chemical.

To address this challenge, recent research has moved toward three-class classification schemas (fire, no_fire, false_alarm) rather than binary detection. This approach involves training machine learning models on specific datasets that include labeled examples of nuisance triggers, allowing the classifier to learn the subtle differences between, for example, a cooking-induced smoke plume and actual wood combustion @vorwerk2024classification.

#figure(
  table(
    columns: (1fr, 1fr, 1fr, 1.5fr, 1fr),
    inset: 10pt,
    align: horizon,
    [*Research Study*], [*Sensors Used*], [*Classification Type*], [*Primary Innovation*], [*Reported Accuracy*],
    [Fonollosa et al. (2018) @fonollosa2018chemical], [Chemical/Gas], [Binary], [Early detection of chemical fires], [92.4%],
    [Wang et al. (2023) @wang2023fire], [Multi-modal], [3-Class], [Identification of CO as "Truth Sensor"], [98.1%],
    [Meleti et al. (2024) @meleti2024obscured], [Thermal/Optical], [Binary], [Obscured fire detection via IR], [95.0%],
    [*This Work (2026)*], [*6-Sensor Fusion*], [*3-Class*], [*TinyML False Alarm Recognition*], [*100% (Lab)*],
  ),
  caption: [Comparative Analysis of Fire Detection Research Studies],
) <table-literature-comparison>

Synthesis of the reviewed research underscores the importance of the Carbon Monoxide (CO) sensor as a "truth sensor" for combustion verification. While VOC and Smoke sensors are highly sensitive, they are also prone to cross-sensitivity with non-fire vapors; however, significant CO spikes are rarely present in common household nuisance scenarios, providing a reliable differentiator @wang2023fire. The consensus in the literature points toward autonomous, multi-sensor nodes as the most promising solution for achieving high sensitivity and low false-alarm rates in complex indoor environments @meleti2024obscured.
