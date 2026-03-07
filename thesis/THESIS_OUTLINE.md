# Thesis Outline: Autonomous Multi-Sensor Fire Detection Node Using Sensor Fusion and TinyML

**Target Length**: 70–90 pages (excluding front matter, references, and appendices)
**Target References**: 50–70 sources (peer-reviewed journals, conference papers, datasheets, standards like EN 54/NFPA 72)

### Front Matter

- Title Page
- Declaration of Originality
- Abstract (1 page)
- Acknowledgments
- Table of Contents
- List of Figures
- List of Tables
- List of Abbreviations and Symbols
- **Glossary of Terms** (Definitions for TinyML, Sensor Fusion, Edge Computing, Quantization) - _Information Source: Web Academic Search_

### Chapter 1: Introduction (6–8 pages, ~2,400 words)

#### 1.1 Background (~650 words) - _Information Source: Web Academic Search_

- Significance of Fire Detection and False Alarm Issues (~350 words)
- Limitations of Traditional Fire Detectors vs. Intelligent Edge Nodes (~300 words)

#### 1.2 Problem Statement (~600 words) - _Information Source: Web Academic Search (for problem), Codebase (for scope and limitations)_

- Background and Problem Statement (~350 words)
- Scope and Limitations (Explicitly addressing stationary "Autonomous Node" vs. Mobile Robot) (~250 words)

#### 1.3 Research Questions (~550 words) - _Information Source: Web Academic Search & Codebase (data analysis, firmware performance)_

- Can a multi-sensor fusion approach distinguish between real fire, ambient conditions, and common false alarm triggers? (~200 words)
- Is TinyML deployment on a Cortex-M4 microcontroller feasible for real-time fire detection with <100ms latency? (~180 words)
- How does three-class classification (fire/no_fire/false_alarm) compare to binary classification in reducing false positives? (~170 words)

#### 1.4 Research Objectives and Contributions (~350 words) - _Information Source: Web Academic Search & Codebase (project results)_

- Research Objectives and Contributions (~350 words)

#### 1.5 Thesis Organization (~250 words) - _Information Source: Theoretical (based on thesis structure)_

- Thesis Organization (~250 words)

### Chapter 2: Literature Review (8–10 pages, ~3,500 words)

#### 2.1 Literature Selection Strategy (~500 words) - _Information Source: Web Academic Search & thesis/literature/PRISMA_PROTOCOL.md_

- Brief overview of search method (2015–present).
- Key focus: Multi-modal sensing, TinyML, and false alarm reduction.

#### 2.2 Evolution of Fire Detection and MEMS Technology (~1,000 words) - _Information Source: Web Academic Search_

- From single-sensor units to intelligent multi-modal nodes.
- Characteristics of MEMS sensors (Smoke, VOC, CO) and IR flame detection.

#### 2.3 Sensor Fusion and TinyML at the Edge (~1,000 words) - _Information Source: Web Academic Search_

- Review of fusion techniques (Kalman, Bayesian, Neural Networks).
- Current state of TinyML on microcontrollers (latency, quantization).

#### 2.4 False Alarm Mitigation and Research Synthesis (~1,000 words) - _Information Source: Web Academic Search & Codebase (project goals)_

- Strategies for handling cooking/nuisance scenarios.
- Gap analysis: Why 3-class classification is needed.
- Comparison Table of related works.

### Chapter 3: Theoretical Background (11–13 pages, ~4,800 words)

#### 3.1 Physics and Operating Principles of Fire-Relevant Sensors (~650 words) - _Information Source: Web Academic Search_

#### 3.2 Characteristics of MEMS Smoke, VOC, CO, IR Flame, and Temperature/Humidity Sensors (~850 words) - _Information Source: Web Academic Search & Sensor Datasheets_

#### 3.3 Principles of Sensor Fusion for Discrimination (~600 words) - _Information Source: Web Academic Search_

#### 3.4 Feature Engineering for Fire Detection (~1,200 words) - _Information Source: Web Academic Search & Codebase (data/analysis/explore_data.py, data/analysis/generate_report_data.py)_

- Statistical Analysis (Mean, RMS, Kurtosis) for Gas/Thermal Trends (~350 words)
- Frequency-domain features (FFT/Spectral Power) for flame flicker at 10–15Hz (~450 words)
- Cross-sensor correlations and dimensionality reduction (~400 words)

#### 3.5 Neural Network Fundamentals for Classification (~600 words) - _Information Source: Web Academic Search_

#### 3.6 Model Quantization and Optimization for Resource-Constrained Devices (~500 words) - _Information Source: Web Academic Search_

#### 3.7 Overview of the Edge Impulse Platform Pipeline (~400 words) - _Information Source: Web Search (Edge Impulse documentation), Codebase (docs/research/edge-impulse-platform/, thesis/assets/figures/edge-impulse/)_

### Chapter 4: Sensor Selection and Characterization (6–7 pages, ~2,500 words)

#### 4.1 Requirements for Multi-Modal Sensing (~300 words) - _Information Source: Web Academic Search & Project Requirements_

#### 4.2 Detailed Examination of Selected Sensors (~1,200 words) - _Information Source: Web Search (sensor datasheets, manufacturer documentation)_

- Fermion MEMS Smoke Detection Sensor (Ethanol Compatible) (~260 words)
- Gravity Analog Flame Sensor (IR Spectrum sensitivity) (~200 words)
- Fermion VOC Gas Sensor (MEMS) (~260 words)
- Fermion MEMS Carbon Monoxide (CO) Sensor (~260 words)
- Fermion AHT20 Temperature and Humidity Sensor (~220 words)

#### 4.3 Justification of Sensor Choice (~400 words) - _Information Source: Web Academic Search & Project Requirements/Data Analysis_

- Sensitivity vs. Selectivity (~400 words)

#### 4.4 Sensor Calibration Protocols and Baseline Behavior (~600 words) - _Information Source: Web Academic Search, Sensor Datasheets, Codebase (firmware/diagnostics/verify_all_sensors_operational.ino, firmware/main/fire-detection-main/fire-detection-main.ino)_

### Chapter 5: Hardware Platform and System Integration (6–7 pages, ~2,600 words)

_(Critical Chapter for "Robotic Platform" Grade)_

#### 5.1 The Autonomous Edge-Node Architecture (~850 words) - _Information Source: Web Search (Arduino UNO R4 WiFi documentation), Codebase (firmware architecture)_

- Justification for Arduino UNO R4 WiFi (Renesas RA4M1 + ESP32-S3 Bridge) (~400 words)
- Asymmetric Multi-Processing (AMP): RA4M1 as the "Inference Brain" vs. ESP32-S3 as the "Connectivity Backbone" (~450 words)

#### 5.2 Power Management and Thermal Considerations (~350 words) - _Information Source: Web Academic Search & Codebase (firmware for sensor heating elements)_

- Active Heating elements (~350 words)

#### 5.3 Physical Design and Enclosure (~500 words) - _Information Source: Web Academic Search (airflow), General Engineering Principles_

- Airflow considerations for Gas Sensors (~300 words)
- Isolation of Thermal Components (~200 words)

#### 5.4 Connectivity and Location Awareness (~550 words) - _Information Source: Web Search (MQTT protocol), Codebase (firmware/main/fire-detection-main/fire-detection-main.ino)_

- Static Location Tagging (Zone_ID implementation) (~250 words)
- MQTT Telemetry Structure (~300 words)

#### 5.5 System Schematic and Wiring Diagrams (~350 words) - _Information Source: Codebase (firmware/main/fire-detection-main/fire-detection-main.ino), Hardware Design Documentation_

### Chapter 6: Data Collection Methodology (10–12 pages, ~3,600 words)

#### 6.1 Safety Protocols During Data Collection (~700 words) - _Information Source: Web Academic Search (safety standards), Project-specific Risk Assessments (thesis/literature/PRISMA_FLOW.md can serve as a reference)_

- Risk Assessment (Fire containment, Ventilation, PPE) (~700 words)

#### 6.2 Rationale for Three-Class Classification (~450 words) - _Information Source: Web Academic Search & Project Data Analysis (initial findings on class separability)_

- fire, no_fire, false_alarm (~450 words)

#### 6.3 Sampling Parameters (~550 words) - _Information Source: Web Academic Search (sampling theory) & Codebase (firmware/main/fire-detection-main/fire-detection-main.ino for sampling rate, data/DATA_COLLECTION_GUIDE.md for window sizes)_

- 10Hz frequency (~250 words)
- Window sizes (~300 words)

#### 6.4 Class-Specific Data Collection Scenarios (~1,050 words) - _Information Source: Codebase (data/DATA_COLLECTION_GUIDE.md, data/raw/)_

- Fire Class: Paper, Wood, Cloth burns (~350 words)
- No-Fire Class: Idle office, Kitchen ambient (~300 words)
- False-Alarm Class: Cooking fumes, Alcohol vapors, Intense IR light (~400 words)

#### 6.5 Environmental Variance (~350 words) - _Information Source: Web Academic Search & Project Data Collection Considerations_

- City/Indoor vs. Simulated Forest/Outdoor (~350 words)

#### 6.6 Dataset Organization, Labeling, and Storage (~450 words) - _Information Source: Codebase (data/DATA_COLLECTION_GUIDE.md, data/raw/)_

### Chapter 7: Implementation (9–11 pages, ~3,600 words)

#### 7.1 Edge Impulse Project Setup (~450 words) - _Information Source: Web Search (Edge Impulse documentation), Codebase (docs/research/edge-impulse-platform/)_

#### 7.2 Impulse Design and DSP Blocks (~600 words) - _Information Source: Web Search (Edge Impulse documentation), Codebase (docs/research/edge-impulse-platform/)_

- Spectral Analysis Configuration (~350 words)
- Feature Selection Importance (~250 words)

#### 7.3 Model Architecture and Training (~700 words) - _Information Source: Web Academic Search & Codebase (model/edge-impulse-model/)_

- Neural Network topology design (~300 words)
- Hyperparameter Tuning Results (Layers, Neurons, Learning Rate) (~400 words)

#### 7.4 Arduino Firmware Development (~600 words) - _Information Source: Codebase (firmware/main/fire-detection-main/fire-detection-main.ino, firmware/examples/)_

- Data Forwarder Sketch (Data Collection) (~250 words)
- Real-Time Inference Sketch (Deployment) (~350 words)

#### 7.5 Hybrid Hardware-AI Decision Fusion (~600 words) - _Information Source: Web Academic Search & Codebase (firmware/main/fire-detection-main/fire-detection-main.ino)_

- Integrating TinyML Inference with Deterministic Safety Overrides (~350 words)
- The "Clean Fire" Paradox: Why Hardware Overrides are Necessary for Generalization (~250 words)

#### 7.6 Temporal Debouncing and Alarm Persistence (~350 words) - _Information Source: Codebase (firmware/main/fire-detection-main/fire-detection-main.ino)_

- Consecutive Detection Requirements (3-count debounce) (~200 words)
- Temporal Decay Logic for "Cooling Down" States (~150 words)

#### 7.7 Quantization Strategy (~300 words) - _Information Source: Web Academic Search & Codebase (model/edge-impulse-model/)_

- Float32 vs. Int8 (~300 words)

### Chapter 8: Experimental Results and Evaluation (12–14 pages, ~4,700 words)

#### 8.1 Test Environment Description (~400 words) - _Information Source: Codebase (data/DATA_COLLECTION_GUIDE.md, docs/research/data-collection/)_

#### 8.2 Dataset Summary (~600 words) - _Information Source: Codebase (data/analysis/analysis_results.json, data/analysis/aggregated_data.csv, data/raw/)_

- Distribution and Balance (~600 words)

#### 8.3 Training and Validation Metrics (~600 words) - _Information Source: Codebase (data/analysis/analysis_results.json, thesis/assets/figures/data_analysis/)_

- Accuracy (~350 words)
- Loss (~250 words)

#### 8.4 Ablation Study (~1,400 words) - _Information Source: Codebase (data/analysis/analysis_results.json, data/analysis/DATA_ANALYSIS_REPORT.md)_

- Performance comparison: Single Sensor vs. Fusion Model (~350 words)
- The "Heat Paradox": Why Single-Sensor Thermal Detection Fails in False Alarm Scenarios (~400 words)
- Identifying the "CO Truth Sensor" for Combustion Verification (~350 words)
- Proof of "Fusion" benefit (~300 words)

#### 8.5 Environment-Specific Performance (~550 words) - _Information Source: Codebase (data/analysis/analysis_results.json, thesis/assets/figures/data_analysis/)_

- Confusion Matrices for Urban, Indoor, and Outdoor sets (~550 words)

#### 8.6 On-Device Performance Metrics (~900 words) - _Information Source: Codebase (firmware deployment logs, Edge Impulse deployment results)_

- Inference Latency (ms) (~300 words)
- RAM/Flash Usage (~300 words)
- Power Consumption Analysis (~300 words)

#### 8.7 Comparison with Baseline Approaches (~250 words) - _Information Source: Web Academic Search & Project Data Analysis_

### Chapter 9: Discussion (7–9 pages, ~2,900 words)

#### 9.1 Interpretation of Class Separability (~600 words) - _Information Source: Codebase (data/analysis/analysis_results.json, data/analysis/DATA_ANALYSIS_REPORT.md)_

- The "Truth Sensor" and "Thermal Anomaly" Analysis (~600 words)

#### 9.2 Strengths of the "Autonomous Node" Approach (~450 words) - _Information Source: Project Design Documentation & Codebase Features_

#### 9.3 Analysis of Error Cases (~450 words) - _Information Source: Codebase (data/analysis/analysis_results.json, data/raw/)_

- Why did False Alarms happen? (~450 words)

#### 9.4 Deployment Scenarios and Scalability (~850 words) - _Information Source: Web Academic Search & Project Considerations_

- Cost Analysis per Node (~280 words)
- Mesh Network Topology for Multi-Node Systems (~320 words)
- Certification Challenges (UL/CE) (~250 words)

#### 9.5 Ethical and Safety Aspects of AI in Life-Critical Systems (~550 words) - _Information Source: Web Academic Search_

### Chapter 10: Conclusion and Future Work (4–5 pages, ~1,600 words)

#### 10.1 Limitations of This Study (~450 words) - _Information Source: Project Data Analysis, Experimental Observations, Web Academic Search (sensor drift)_

- Dataset constraints (~160 words)
- Lab vs. Real World (~150 words)
- Sensor Drift (~140 words)

#### 10.2 Summary of Key Findings (~400 words) - _Information Source: Project Data Analysis & Results_

#### 10.3 Contributions to the Field (~300 words) - _Information Source: Project Results & Web Academic Search_

#### 10.4 Future Work (~450 words) - _Information Source: Project Considerations & Web Academic Search_

- OTA Updates (~150 words)
- LoRaWAN Integration for Forest Deployment (~150 words)
- Cooperative Sensing (Multi-robot consensus) (~150 words)

### Back Matter

- References (APA 7th Edition)
- Appendices
  - Appendix A: Full Arduino Source Code
  - Appendix B: Wiring Diagrams & PCB Layouts
  - Appendix C: Data Collection Logs
  - Appendix D: Training Curves & Confusion Matrices
  - Appendix E: Sensor Datasheet Excerpts
  - Appendix F: Edge Impulse Configuration
  - **Appendix G: Risk Assessment & Safety Protocols** - _Information Source: Codebase (docs/research/data-collection/, thesis/literature/PRISMA_FLOW.md)_
  - **Appendix H: Raw Data Samples (CSV Snippets)** - _Information Source: Codebase (data/raw/)_
