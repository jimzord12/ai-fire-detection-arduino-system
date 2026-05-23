# EUC Thesis Outline: Autonomous Multi-Sensor Fire Detection Node

**Target Structure**: European University Cyprus (EUC) Master's Thesis Template (12 Sections)
**Status**: Refactored from 10-chapter structure.

---

## 1. Acknowledgements
- Formal gratitude to supervisors, university, and supporting organizations.

## 2. Abstract
- High-level summary of the multi-sensor fusion approach, TinyML implementation, and classification results (Fire/No-Fire/False Alarm).

## 3. Theoretical Background
- **3.1 Evolution of Multi-Sensor Fire Detection**: Historical shift from thresholding to fusion.
- **3.2 Edge Intelligence and TinyML**: Theoretical advancements in decentralized fire sensing.
- **3.3 Multi-Modal Sensing Principles**: Physics and chemistry of CO, VOC, and IR flame detection.

## 4. Introduction
- **4.1 Overview**: Background on fire detection challenges and the shift towards edge intelligence.
- **4.2 Aims and objectives**: Developing an autonomous node that reduces false positives using sensor fusion.
- **4.3 Structure of thesis**: Roadmap of the 12 sections.
- **4.4 Summary**: Transition to project scope.

## 5. Project Scope
- **5.1 Introduction**: Context of the research.
- **5.2 Problem Statement**: Limitations of current smoke-only detectors and the cost of false alarms.
- **5.3 Research Questions**: Can multi-sensor fusion reliably distinguish between cooking fumes and actual combustion?
- **5.4 Summary**: Justification for the proposed system boundaries.

## 6. Analysis and Design
- **6.1 Introduction**: Overview of the sensing architecture.
- **6.2 Theoretical Background**: Principles of MEMS gas sensing and IR flame detection.
- **6.3 Sensor Selection & Characterization**: Rationale for Smoke, VOC, CO, and AHT20 sensors.
- **6.4 Hardware Integration**: Circuit design and the "Asymmetric Multi-Processing" of the Arduino UNO R4.
- **6.5 Summary**: Finalized design specification.

## 7. Implementation and Testing
- **7.1 Introduction**: Realization of the physical node.
- **7.2 Data Collection Methodology**: Controlled scenario sampling (Fire, Cooking, Steam, Aerosols).
- **7.3 TinyML Pipeline**: Feature extraction (Spectral Analysis) and Neural Network training in Edge Impulse.
- **7.4 Experimental Results**: Classification accuracy, latency benchmarks, and confusion matrix analysis.
- **7.5 Summary**: Validation of the implementation against research questions.

## 8. Conclusions and Future Work
- **8.1 Introduction**: Synthesis of findings.
- **8.2 Discussion**: Implications of the "CO Truth Sensor" and the "Heat Paradox."
- **8.3 Conclusion**: Final verdict on the feasibility of edge-deployed fire detection.
- **8.4 Future Work**: Scaling to mesh networks, longitudinal drift analysis, and enclosure optimization.
- **8.5 Summary**: Closing remarks.

## 9. Bibliography
- Academic sources (IEEE, ACM) managed via `bibliography.bib`.

## 10. Appendices
- **10.1 Appendix A**: Technical Schematics.
- **10.2 Appendix B**: Raw Data CSV Samples.
- **10.3 Appendix C**: Model Architecture Details.

## 11. Installation Manual
- **11.1 Requirements**: Hardware components and software environment (Node.js, Arduino CLI).
- **11.2 Installation Procedure**: Wiring instructions and firmware upload steps.
- **11.3 Configuration**: Connecting to Edge Impulse and local serial logging.

## 12. User Manual
- **12.1 System Operation**: How to interpret LED/Serial alerts.
- **12.2 Data Collection Guide**: Using the automated collection scripts.
- **12.3 Maintenance & Troubleshooting**: Sensor health checks and calibration.

---
**Codebase Placeholder**: [GITHUB_REPO_LINK]
