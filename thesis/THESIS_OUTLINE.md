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
- **Glossary of Terms** (Definitions for TinyML, Sensor Fusion, Edge Computing, Quantization) - *Information Source: Web Academic Search*

### Chapter 1: Introduction (6–8 pages, ~2,400 words)

#### 1.1 Background (~650 words) - *Information Source: Web Academic Search*

- Significance of Fire Detection and False Alarm Issues (~350 words)
- Limitations of Traditional Fire Detectors vs. Intelligent Edge Nodes (~300 words)

#### 1.2 Problem Statement (~600 words) - *Information Source: Web Academic Search (for problem), Codebase (for scope and limitations)*

- Background and Problem Statement (~350 words)
- Scope and Limitations (Explicitly addressing stationary "Autonomous Node" vs. Mobile Robot) (~250 words)

#### 1.3 Research Questions (~550 words) - *Information Source: Web Academic Search & Codebase (data analysis, firmware performance)*

- Can a multi-sensor fusion approach distinguish between real fire, ambient conditions, and common false alarm triggers? (~200 words)
- Is TinyML deployment on a Cortex-M4 microcontroller feasible for real-time fire detection with <100ms latency? (~180 words)
- How does three-class classification (fire/no_fire/false_alarm) compare to binary classification in reducing false positives? (~170 words)

#### 1.4 Research Objectives and Contributions (~350 words) - *Information Source: Web Academic Search & Codebase (project results)*

- Research Objectives and Contributions (~350 words)

#### 1.5 Thesis Organization (~250 words) - *Information Source: Theoretical (based on thesis structure)*

- Thesis Organization (~250 words)

### Chapter 2: Literature Review (12–15 pages, ~5,600 words)

#### 2.1 Literature Search Method (PRISMA-inspired rapid SLR) (~400 words) - *Information Source: Web Academic Search (for methodology), thesis/literature/PRISMA_FLOW.md, thesis/literature/PRISMA_PROTOCOL.md, thesis/literature/extraction_table.csv (for reporting)*

- Databases and search strings (2015–present)
- Inclusion/exclusion criteria and screening steps
- PRISMA flow reporting + extraction table

#### 2.2 Evolution of Fire Detection Technologies (~750 words) - *Information Source: Web Academic Search*

#### 2.3 Traditional Single-Sensor and Multi-Sensor Systems (~800 words) - *Information Source: Web Academic Search*

#### 2.4 Machine Learning Applications in Fire Detection (~750 words) - *Information Source: Web Academic Search*

#### 2.5 Sensor Fusion Techniques (~1,100 words) - *Information Source: Web Academic Search*

- Kalman Filters (~350 words)
- Bayesian Networks (~350 words)
- Neural Networks (~400 words)

#### 2.6 TinyML and Edge AI Deployments on Microcontrollers (~750 words) - *Information Source: Web Academic Search*

#### 2.7 MEMS-Based Gas Sensors and IR Flame Detection in Recent Works (~550 words) - *Information Source: Web Academic Search*

#### 2.8 Strategies for False Alarm Reduction (~500 words) - *Information Source: Web Academic Search*

- Context-Awareness (~500 words)

#### 2.9 Research Gaps and Motivation for Three-Class Classification (~400 words) - *Information Source: Web Academic Search & Codebase (project goals)*

#### 2.10 Summary of Related Works (~1,000 words) - *Information Source: Web Academic Search*

- Comparison Table (~400 words)

### Chapter 3: Theoretical Background (11–13 pages, ~4,800 words)

#### 3.1 Physics and Operating Principles of Fire-Relevant Sensors (~650 words) - *Information Source: Web Academic Search*

#### 3.2 Characteristics of MEMS Smoke, VOC, CO, IR Flame, and Temperature/Humidity Sensors (~850 words) - *Information Source: Web Academic Search & Sensor Datasheets*

#### 3.3 Principles of Sensor Fusion for Discrimination (~600 words) - *Information Source: Web Academic Search*

#### 3.4 Feature Engineering for Fire Detection (~1,200 words) - *Information Source: Web Academic Search & Codebase (data/analysis/explore_data.py, data/analysis/generate_report_data.py)*

- Statistical Analysis (Mean, RMS, Kurtosis) for Gas/Thermal Trends (~350 words)
- Frequency-domain features (FFT/Spectral Power) for flame flicker at 10–15Hz (~450 words)
- Cross-sensor correlations and dimensionality reduction (~400 words)

#### 3.5 Neural Network Fundamentals for Classification (~600 words) - *Information Source: Web Academic Search*

#### 3.6 Model Quantization and Optimization for Resource-Constrained Devices (~500 words) - *Information Source: Web Academic Search*

#### 3.7 Overview of the Edge Impulse Platform Pipeline (~400 words) - *Information Source: Web Search (Edge Impulse documentation), Codebase (docs/research/edge-impulse-platform/, thesis/assets/figures/edge-impulse/)*

### Chapter 4: Sensor Selection and Characterization (6–7 pages, ~2,500 words)

#### 4.1 Requirements for Multi-Modal Sensing (~300 words) - *Information Source: Web Academic Search & Project Requirements*

#### 4.2 Detailed Examination of Selected Sensors (~1,200 words) - *Information Source: Web Search (sensor datasheets, manufacturer documentation)*

- Fermion MEMS Smoke Detection Sensor (Ethanol Compatible) (~260 words)
- Gravity Analog Flame Sensor (IR Spectrum sensitivity) (~200 words)
- Fermion VOC Gas Sensor (MEMS) (~260 words)
- Fermion MEMS Carbon Monoxide (CO) Sensor (~260 words)
- Fermion AHT20 Temperature and Humidity Sensor (~220 words)

#### 4.3 Justification of Sensor Choice (~400 words) - *Information Source: Web Academic Search & Project Requirements/Data Analysis*

- Sensitivity vs. Selectivity (~400 words)

#### 4.4 Sensor Calibration Protocols and Baseline Behavior (~600 words) - *Information Source: Web Academic Search, Sensor Datasheets, Codebase (firmware/diagnostics/verify_all_sensors_operational.ino, firmware/main/fire-detection-main/fire-detection-main.ino)*

### Chapter 5: Hardware Platform and System Integration (6–7 pages, ~2,600 words)

_(Critical Chapter for "Robotic Platform" Grade)_

#### 5.1 The Autonomous Edge-Node Architecture (~850 words) - *Information Source: Web Search (Arduino UNO R4 WiFi documentation), Codebase (firmware architecture)*

- Justification for Arduino UNO R4 WiFi (Renesas RA4M1 + ESP32-S3 Bridge) (~400 words)
- Asymmetric Multi-Processing (AMP): RA4M1 as the "Inference Brain" vs. ESP32-S3 as the "Connectivity Backbone" (~450 words)

#### 5.2 Power Management and Thermal Considerations (~350 words) - *Information Source: Web Academic Search & Codebase (firmware for sensor heating elements)*

- Active Heating elements (~350 words)

#### 5.3 Physical Design and Enclosure (~500 words) - *Information Source: Web Academic Search (airflow), General Engineering Principles*

- Airflow considerations for Gas Sensors (~300 words)
- Isolation of Thermal Components (~200 words)

#### 5.4 Connectivity and Location Awareness (~550 words) - *Information Source: Web Search (MQTT protocol), Codebase (firmware/main/fire-detection-main/fire-detection-main.ino)*

- Static Location Tagging (Zone_ID implementation) (~250 words)
- MQTT Telemetry Structure (~300 words)

#### 5.5 System Schematic and Wiring Diagrams (~350 words) - *Information Source: Codebase (firmware/main/fire-detection-main/fire-detection-main.ino), Hardware Design Documentation*

### Chapter 6: Data Collection Methodology (10–12 pages, ~3,600 words)

#### 6.1 Safety Protocols During Data Collection (~700 words) - *Information Source: Web Academic Search (safety standards), Project-specific Risk Assessments (thesis/literature/PRISMA_FLOW.md can serve as a reference)*

- Risk Assessment (Fire containment, Ventilation, PPE) (~700 words)

#### 6.2 Rationale for Three-Class Classification (~450 words) - *Information Source: Web Academic Search & Project Data Analysis (initial findings on class separability)*

- fire, no_fire, false_alarm (~450 words)

#### 6.3 Sampling Parameters (~550 words) - *Information Source: Web Academic Search (sampling theory) & Codebase (firmware/main/fire-detection-main/fire-detection-main.ino for sampling rate, data/DATA_COLLECTION_GUIDE.md for window sizes)*

- 10Hz frequency (~250 words)
- Window sizes (~300 words)

#### 6.4 Class-Specific Data Collection Scenarios (~1,050 words) - *Information Source: Codebase (data/DATA_COLLECTION_GUIDE.md, data/raw/)*

- Fire Class: Paper, Wood, Cloth burns (~350 words)
- No-Fire Class: Idle office, Kitchen ambient (~300 words)
- False-Alarm Class: Cooking fumes, Alcohol vapors, Intense IR light (~400 words)

#### 6.5 Environmental Variance (~350 words) - *Information Source: Web Academic Search & Project Data Collection Considerations*

- City/Indoor vs. Simulated Forest/Outdoor (~350 words)

#### 6.6 Dataset Organization, Labeling, and Storage (~450 words) - *Information Source: Codebase (data/DATA_COLLECTION_GUIDE.md, data/raw/)*

### Chapter 7: Implementation (9–11 pages, ~3,600 words)

#### 7.1 Edge Impulse Project Setup (~450 words) - *Information Source: Web Search (Edge Impulse documentation), Codebase (docs/research/edge-impulse-platform/)*

#### 7.2 Impulse Design and DSP Blocks (~600 words) - *Information Source: Web Search (Edge Impulse documentation), Codebase (docs/research/edge-impulse-platform/)*

- Spectral Analysis Configuration (~350 words)
- Feature Selection Importance (~250 words)

#### 7.3 Model Architecture and Training (~700 words) - *Information Source: Web Academic Search & Codebase (model/edge-impulse-model/)*

- Neural Network topology design (~300 words)
- Hyperparameter Tuning Results (Layers, Neurons, Learning Rate) (~400 words)

#### 7.4 Arduino Firmware Development (~600 words) - *Information Source: Codebase (firmware/main/fire-detection-main/fire-detection-main.ino, firmware/examples/)*

- Data Forwarder Sketch (Data Collection) (~250 words)
- Real-Time Inference Sketch (Deployment) (~350 words)

#### 7.5 Heuristic Post-Processing and Hybrid Triggering Logic (~600 words) - *Information Source: Web Academic Search & Codebase (firmware/main/fire-detection-main/fire-detection-main.ino)*

- Combining ML Probabilities with Hard Thresholds (Visual/Heuristic Confirmation) (~350 words)
- Temporal Debouncing (Consecutive Detection Requirements) (~250 words)

#### 7.6 Logic for Alarm Triggering (~350 words) - *Information Source: Codebase (firmware/main/fire-detection-main/fire-detection-main.ino)*

- Smoothing (~200 words)
- Confidence Thresholds (~150 words)

#### 7.7 Quantization Strategy (~300 words) - *Information Source: Web Academic Search & Codebase (model/edge-impulse-model/)*

- Float32 vs. Int8 (~300 words)

### Chapter 8: Experimental Results and Evaluation (12–14 pages, ~4,700 words)

#### 8.1 Test Environment Description (~400 words) - *Information Source: Codebase (data/DATA_COLLECTION_GUIDE.md, docs/research/data-collection/)*

#### 8.2 Dataset Summary (~600 words) - *Information Source: Codebase (data/analysis/analysis_results.json, data/analysis/aggregated_data.csv, data/raw/)*

- Distribution and Balance (~600 words)

#### 8.3 Training and Validation Metrics (~600 words) - *Information Source: Codebase (data/analysis/analysis_results.json, thesis/assets/figures/data_analysis/)*

- Accuracy (~350 words)
- Loss (~250 words)

#### 8.4 Ablation Study (~1,400 words) - *Information Source: Codebase (data/analysis/analysis_results.json, data/analysis/DATA_ANALYSIS_REPORT.md)*

- Performance comparison: Single Sensor vs. Fusion Model (~350 words)
- The "Heat Paradox": Why Single-Sensor Thermal Detection Fails in False Alarm Scenarios (~400 words)
- Identifying the "CO Truth Sensor" for Combustion Verification (~350 words)
- Proof of "Fusion" benefit (~300 words)

#### 8.5 Environment-Specific Performance (~550 words) - *Information Source: Codebase (data/analysis/analysis_results.json, thesis/assets/figures/data_analysis/)*

- Confusion Matrices for Urban, Indoor, and Outdoor sets (~550 words)

#### 8.6 On-Device Performance Metrics (~900 words) - *Information Source: Codebase (firmware deployment logs, Edge Impulse deployment results)*

- Inference Latency (ms) (~300 words)
- RAM/Flash Usage (~300 words)
- Power Consumption Analysis (~300 words)

#### 8.7 Comparison with Baseline Approaches (~250 words) - *Information Source: Web Academic Search & Project Data Analysis*

### Chapter 9: Discussion (7–9 pages, ~2,900 words)

#### 9.1 Interpretation of Class Separability (~600 words) - *Information Source: Codebase (data/analysis/analysis_results.json, data/analysis/DATA_ANALYSIS_REPORT.md)*

- The "Truth Sensor" and "Thermal Anomaly" Analysis (~600 words)

#### 9.2 Strengths of the "Autonomous Node" Approach (~450 words) - *Information Source: Project Design Documentation & Codebase Features*

#### 9.3 Analysis of Error Cases (~450 words) - *Information Source: Codebase (data/analysis/analysis_results.json, data/raw/)*

- Why did False Alarms happen? (~450 words)

#### 9.4 Deployment Scenarios and Scalability (~850 words) - *Information Source: Web Academic Search & Project Considerations*

- Cost Analysis per Node (~280 words)
- Mesh Network Topology for Multi-Node Systems (~320 words)
- Certification Challenges (UL/CE) (~250 words)

#### 9.5 Ethical and Safety Aspects of AI in Life-Critical Systems (~550 words) - *Information Source: Web Academic Search*

### Chapter 10: Conclusion and Future Work (4–5 pages, ~1,600 words)

#### 10.1 Limitations of This Study (~450 words) - *Information Source: Project Data Analysis, Experimental Observations, Web Academic Search (sensor drift)*

- Dataset constraints (~160 words)
- Lab vs. Real World (~150 words)
- Sensor Drift (~140 words)

#### 10.2 Summary of Key Findings (~400 words) - *Information Source: Project Data Analysis & Results*

#### 10.3 Contributions to the Field (~300 words) - *Information Source: Project Results & Web Academic Search*

#### 10.4 Future Work (~450 words) - *Information Source: Project Considerations & Web Academic Search*

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
  - **Appendix G: Risk Assessment & Safety Protocols** - *Information Source: Codebase (docs/research/data-collection/, thesis/literature/PRISMA_FLOW.md)*
  - **Appendix H: Raw Data Samples (CSV Snippets)** - *Information Source: Codebase (data/raw/)*
