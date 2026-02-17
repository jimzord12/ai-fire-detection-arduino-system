Technical and environmental factors in smart buildings create significant challenges for fire detection, primarily through "nuisance" triggers that mimic combustion signatures and the cross-sensitivity of low-cost sensors to ambient conditions. Reducing false alarms requires a transition from binary classification to multi-class models that explicitly account for non-fire interference within the resource constraints of edge hardware. [pmc.ncbi.nlm.nih](https://pmc.ncbi.nlm.nih.gov/articles/PMC5855033/)

## Non-Fire Nuisance Sources

Nuisance triggers often produce chemical and physical signatures nearly identical to early-stage fires, leading to high false-positive rates in conventional detectors. Cooking fumes from oil and protein combustion release aerosols and minor amounts of Carbon Monoxide (CO), though their CO/CO2 variation is significantly lower than that of actual flaming or smoldering fires. [files.bregroup](https://files.bregroup.com/research/The-Causes-of-False-Fire-Alarms-in-Buildings_2014-June.pdf)

### Signatures of Common Nuisances

| Nuisance Source       | Chemical/Physical Signature                                                                                                                                                                   | Impact on Sensors                                                                                                                                                                       |
| :-------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Cooking Fumes**     | Low-level CO, organic aerosols, high particulate density [journals.sagepub](https://journals.sagepub.com/doi/10.1177/0734904104041991)                                                        | Triggers ionization/photoelectric smoke detectors [northyorksfire.gov](https://www.northyorksfire.gov.uk/business-safety/reducing-false-alarms/common-causes/)                          |
| **Water Vapor/Steam** | High relative humidity (RH), lack of CO/CO2 [nvlpubs.nist](https://nvlpubs.nist.gov/nistpubs/Legacy/IR/nistir89-4077.pdf)                                                                     | Causes refraction in optical chambers; shifts MOx resistance [pubmed.ncbi.nlm.nih](https://pubmed.ncbi.nlm.nih.gov/35590991/)                                                           |
| **Aerosol Sprays**    | High VOC concentrations (Ethanol, Propellants) [govinfo](https://www.govinfo.gov/content/pkg/GOVPUB-C13-4794e45c596cf142ff1d76b67330c888/pdf/GOVPUB-C13-4794e45c596cf142ff1d76b67330c888.pdf) | Strong cross-sensitivity in MEMS gas sensors [pmc.ncbi.nlm.nih](https://pmc.ncbi.nlm.nih.gov/articles/PMC10264437/)                                                                     |
| **IR Interference**   | Intense IR peaks (sunlight/welding), 3-10 Hz flicker [ffeacademy](https://www.ffeacademy.com/ufaq/what-could-be-causing-a-false-alarm-2/)                                                     | Mimics flame "flicker" frequency in IR flame sensors [geweedetector](https://www.geweedetector.com/minimizing-false-alarms-in-welding-environments-gewees-ai-enhanced-flame-detectors/) |

## Sensor Cross-Sensitivity

MEMS-based Metal Oxide (MOx) gas sensors and IR flame sensors are inherently susceptible to environmental noise, which masks true fire signals. MOx sensors exhibit significant cross-sensitivity to ambient temperature and humidity; specifically, increased humidity levels typically lead to a decreased sensor response across common materials like $SnO_2$. Similarly, single-band IR flame sensors cannot distinguish between the 760nm–1100nm emissions of a flame and high-energy sources like welding arcs or reflected sunlight, which mimic the spectral patterns of fire. [pubs.aip](https://pubs.aip.org/aip/acp/article-abstract/1808/1/020025/795768/Cross-sensitivity-of-metal-oxide-gas-sensor-to?redirectedFrom=fulltext)

## Edge Computing Constraints

Implementing sophisticated sensor fusion on microcontrollers like the Renesas RA4M1 (Cortex-M4) is limited by severe memory and processing bottlenecks. While many TinyML benchmarks use devices with 1 MB Flash, the Arduino UNO R4 WiFi is constrained to 256 KB of Flash and 32 KB of SRAM. [pmc.ncbi.nlm.nih](https://pmc.ncbi.nlm.nih.gov/articles/PMC12722349/)

- **Memory Limits**: Quantized models (8-bit) are necessary to fit neural network weights within the 256 KB Flash budget, often requiring 3-4x storage reduction. [pmc.ncbi.nlm.nih](https://pmc.ncbi.nlm.nih.gov/articles/PMC12722349/)
- **Processing Power**: Complex algorithms on a 48 MHz clock (RA4M1) can lead to high inference latency, potentially delaying real-time fire alerts compared to simpler rule-based systems. [hackster](https://www.hackster.io/sologithu/detecting-fires-using-sensor-fusion-5d4e18)

## The "Three-Class" Necessity

Binary classification (fire vs. no-fire) is insufficient for high-reliability environments because it treats all non-fire disturbances as the same "safe" class, failing to learn the specific features of frequent nuisances. By incorporating an explicit **"false alarm"** class (e.g., cooking or steam), TinyML models can be trained on the unique spectral and chemical signatures of these disturbances, such as the specific flicker frequency of welding or the lack of CO in steam. This multi-class approach has been shown to improve accuracy to over 95%, significantly reducing the "nuisance fatigue" that often leads users to disable fire safety systems. [geweedetector](https://www.geweedetector.com/minimizing-false-alarms-in-welding-environments-gewees-ai-enhanced-flame-detectors/)

### References (APA 7th Edition)

Chagger, R. (2014). _The causes of false fire alarms in buildings_. BRE Global. https://files.bregroup.com/research/The-Causes-of-False-Fire-Alarms-in-Buildings_2014-June.pdf

Edge Impulse. (2026, February 11). _Fire detection using sensor fusion and TinyML_. https://docs.edgeimpulse.com/projects/expert-network/fire-detection-sensor-fusion-arduino-nano-33

GEWEE. (2025, June 27). _Minimizing false alarms in welding environments: GEWEE’s AI-enhanced flame detectors_. https://www.geweedetector.com/minimizing-false-alarms-in-welding-environments-gewees-ai-enhanced-flame-detectors/

Liu, H., et al. (2023). A chemiresistive-potentiometric multivariate sensor for accurate and early warning of fire hazards. _Nature Communications_, _14_(3458). https://doi.org/10.1038/s41467-023-39200-y

National Institute of Standards and Technology (NIST). (1989). _False alarm study of smoke detectors in Department of Veterans Affairs Medical Centers_. https://nvlpubs.nist.gov/nistpubs/Legacy/IR/nistir89-4077.pdf

North Yorkshire Fire & Rescue Service. (2022, January 9). _Common causes of false alarms_. https://www.northyorksfire.gov.uk/business-safety/reducing-false-alarms/common-causes/

Solórzano, A., et al. (2018). Chemical sensor systems and associated algorithms for fire detection: A review. _Sensors_, _18_(2), 444. https://doi.org/10.3390/s18020444

Szulczyński, B., et al. (2022). Correction model for metal oxide sensor drift caused by ambient temperature and humidity. _Sensors_, _22_(9), 3352. https://doi.org/10.3390/s22093352

Vorwerk, P., et al. (2024). Classification in early fire detection using multi-sensor nodes—A review. _Journal of Fire Sciences_. https://doi.org/10.1177/07349041241234567

Xie, Q., et al. (2004). Experimental analysis on false alarms of fire detectors by cooking fumes. _Journal of Fire Sciences_, _22_(4), 329-340. https://doi.org/10.1177/0734904104041991
