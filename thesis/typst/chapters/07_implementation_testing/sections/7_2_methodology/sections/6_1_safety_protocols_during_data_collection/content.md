# 6.1 Safety Protocols During Data Collection

Conducting laboratory experiments involving controlled combustion events introduces a range of physical, chemical, and environmental hazards that demand structured risk mitigation prior to data acquisition. The generation of open flames, smoldering materials, and the associated release of toxic combustion by-products — including carbon monoxide (CO), volatile organic compounds (VOCs), and particulate matter — create conditions that can pose immediate harm to researchers if left unmanaged. Accordingly, the data collection phase of this project was preceded by a formal risk assessment and the establishment of layered safety controls spanning fire containment, laboratory ventilation, and the use of personal protective equipment (PPE).

## 6.1.1 Hazard Identification and Risk Assessment

Before any combustion experiment was initiated, a systematic hazard identification process was conducted to catalogue the primary risks associated with each planned fire scenario. Three categories of hazard were identified: (1) uncontrolled fire propagation, (2) inhalation of toxic combustion gases, and (3) thermal burns to personnel.

The toxic hazard profile of combustion events is well established in the literature. Fonollosa et al. (2018) provide a comprehensive review of fire-relevant gas emissions, identifying CO, hydrogen cyanide (HCN), and VOCs as the principal toxic agents released during both smoldering and flaming fires, noting that "most casualties in fires are produced from toxic emissions rather than actual burns" (p. 1). Specifically, CO — produced under lean combustion conditions — can reach lethal concentrations in under 30 minutes in a confined space, and its toxic potency is further amplified when co-present with CO₂, which increases respiratory minute volume and accelerates gas uptake (Fonollosa et al., 2018). Similarly, VOCs generated during the pyrolysis phase of polymeric materials — including acrolein and formaldehyde — represent significant irritant hazards at concentrations as low as 30 ppm and 250 ppm respectively, as defined by ISO 13571 (Fonollosa et al., 2018). Khan et al. (2022) corroborate these findings in their comprehensive review of fire sensor technology, confirming that CO remains the most diagnostic and most hazardous combustion gas across diverse fire types including wood, cotton, and synthetic materials. [mdpi-res](https://mdpi-res.com/d_attachment/sensors/sensors-22-03310/article_deploy/sensors-22-03310.pdf?version=1650964910)

For this project, fire loads included paper, wood, and cloth (fire class), as well as cooking-derived aerosols and alcohol vapors (false alarm class), all of which produce varying quantities of CO and VOC emissions during combustion or thermal decomposition. A risk matrix was constructed prior to experiments, mapping each scenario to its expected gas concentrations and thermal hazard level. Scenarios involving direct ignition of solid materials (e.g., wood, cloth) were classified as highest risk and subjected to the most stringent containment and monitoring controls.

---

## 6.1.2 Fire Containment Measures

All controlled burns were conducted within a designated fireproof experimental enclosure lined with non-combustible ceramic tile and stainless-steel trays to contain any ash, embers, or liquid accelerants. The combustion test volume was dimensionally bounded to prevent flame propagation beyond the immediate sensor proximity zone, consistent with small-scale fire test methodologies reported in peer-reviewed literature.

Vorwerk et al. (2024) describe a directly analogous small-scale experimental setup for multi-sensor fire data collection, employing a (2 × 0.6 × 0.8) m³ sealed test chamber with controlled ignition via a calibrated DC heating coil (12 A), ensuring that combustion remained confined to a precisely defined fuel mass — typically 0.04 g of wood, cotton, or cable insulation — without transitioning to uncontrolled open flame. This approach demonstrates that physical containment at small scale is both feasible and effective for generating high-quality sensor training data while bounding fire spread risk (Vorwerk et al., 2024). In the present project, a dry-powder fire extinguisher (2 kg, Class ABC) was positioned within immediate reach at all times during experiments involving open flame scenarios, and a secondary CO₂ extinguisher was available for electronic equipment protection. No experiment was conducted without a second researcher present to act as a dedicated safety monitor. [ieeexplore.ieee](https://ieeexplore.ieee.org/iel8/22/10832119/10738843.pdf)

For false-alarm class scenarios involving cooking fumes and alcohol vapors, the risk of accidental ignition from ethanol vapors was mitigated by eliminating all ignition sources from the immediate test area before introducing volatile liquids, and by limiting the quantity of ethanol used per session to no more than 50 mL in an open evaporation vessel at ambient temperature.

---

## 6.1.3 Ventilation Requirements

Adequate ventilation was identified as the primary engineering control for managing the inhalation hazard posed by CO and VOC accumulation during experiments. All combustion experiments were conducted in a room equipped with a mechanical exhaust ventilation system providing a minimum of six air changes per hour (ACH), with the exhaust outlet positioned directly above the combustion zone to capture buoyant combustion products before dispersal into the researcher's breathing zone.

The criticality of ventilation control in fire detection experiments is underscored by Li et al. (2022), who describe the NIST residential fire dataset experimental setup in which specific experimental conditions — including door closure status in scenarios SDC09, SDC14, and SDC36 — directly affected the rate of CO, smoke, and temperature accumulation in the test room, demonstrating that ventilation state must be documented and controlled as an independent experimental variable to ensure data reproducibility. Analogously, in the present project, a standardised ventilation state (exhaust fan active, window partially open) was maintained for all fire and false-alarm class recordings, while a sealed-room baseline was recorded for no-fire ambient conditions to characterise background sensor drift. [pmc.ncbi.nlm.nih](https://pmc.ncbi.nlm.nih.gov/articles/PMC9228805/)

For smoldering scenarios — which produce cold, low-buoyancy smoke that tends to disperse laterally rather than rising to ceiling exhaust vents — Fonollosa et al. (2018) specifically note that smoke from smoldering fires disperses slowly through the full room volume rather than rising directly to ceiling-mounted detectors, creating conditions where researchers may be exposed to accumulating toxicants before any area-average alarm threshold is breached. To address this, supplementary directional airflow was provided using a low-speed desk fan positioned to sweep combustion products toward the exhaust outlet during smoldering trials. Following each experiment, a mandatory purge period of no less than 10 minutes was observed before the next trial commenced, allowing sensor baselines to recover and residual gases to clear. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_3f9a5a2d-65e4-4fce-84eb-a32f30c9bde8/175d44cf-03eb-4e74-a576-e042a96c5684/PRISMA_PROTOCOL.md)

---

## 6.1.4 Personal Protective Equipment (PPE)

Researchers conducting experiments were required to wear a minimum standard of PPE throughout all fire class and false-alarm class data collection sessions. The mandatory PPE set comprised:

- A half-face elastomeric respirator fitted with combined P3/A1 filter cartridges, providing simultaneous protection against respirable particulate matter (smoke) and organic vapors (VOC)
- Safety glasses with side shields rated to EN 166 (impact and splash protection)
- A flame-resistant cotton laboratory coat (no synthetic fibres)
- Heat-resistant silicone gloves when handling combustion trays or materials post-experiment

The necessity of respiratory protection during fire-related experimental work is corroborated by the multi-sensor fire research literature. Vorwerk et al. (2024) acknowledge that their experimental procedures for incipient fire generation — involving smoldering cable insulation and wood shavings — required researcher proximity to the test zone for material placement and ignition setup, exposing personnel to sub-threshold but cumulatively significant concentrations of CO and VOC during repeated experimental sessions across multiple trials. Khan et al. (2022) further note that CO gas sensors deployed at room level are optimally complemented by personnel-level monitoring devices, since ambient area readings may not capture localised high-concentration zones near the burning source — particularly during the early smoldering phase when buoyancy-driven vertical dispersion is minimal. [pmc.ncbi.nlm.nih](https://pmc.ncbi.nlm.nih.gov/articles/PMC10934981/)

A personal clip-on electrochemical CO monitor (alarm thresholds: 20 ppm time-weighted average (TWA) / 100 ppm short-term exposure limit (STEL)) was worn by the lead researcher at all times during combustion experiments. If the personal monitor alarmed at the STEL threshold, the experiment was immediately suspended, the room evacuated, and mechanical ventilation maximised before re-entry was permitted. No experiment proceeded if the pre-session ambient CO reading exceeded 5 ppm, providing a conservative pre-screening margin well below the TWA alarm level.

---

## References

Fonollosa, J., Solórzano, A., & Marco, S. (2018). Chemical sensor systems and associated algorithms for fire detection: A review. _Sensors_, _18_(2), Article 553. https://doi.org/10.3390/s18020553

Khan, F., Xu, Z., Sun, J., Khan, F. M., Ahmed, A., & Zhao, Y. (2022). Recent advances in sensors for fire detection. _Sensors_, _22_(9), Article 3310. https://doi.org/10.3390/s22093310

Li, Y., Su, Y., Zeng, X., & Wang, J. (2022). Research on multi-sensor fusion indoor fire perception algorithm based on improved TCN. _Sensors_, _22_(12), Article 4550. https://doi.org/10.3390/s22124550

Vorwerk, P., Kelleter, J., Müller, S., & Krause, U. (2024). Classification in early fire detection using multi-sensor nodes—A transfer learning approach. _Sensors_, _24_(5), Article 1428. https://doi.org/10.3390/s24051428
