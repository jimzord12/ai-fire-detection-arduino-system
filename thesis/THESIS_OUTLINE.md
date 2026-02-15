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
- **Glossary of Terms** (Definitions for TinyML, Sensor Fusion, Edge Computing, Quantization)

### Chapter 1: Introduction (6–8 pages, ~2,400 words)

#### 1.1 Background (~650 words)

- Significance of Fire Detection and False Alarm Issues (~350 words)
- Limitations of Traditional Fire Detectors vs. Intelligent Edge Nodes (~300 words)

#### 1.2 Problem Statement (~600 words)

- Background and Problem Statement (~350 words)
- Scope and Limitations (Explicitly addressing stationary "Autonomous Node" vs. Mobile Robot) (~250 words)

#### 1.3 Research Questions (~550 words)

- Can a multi-sensor fusion approach distinguish between real fire, ambient conditions, and common false alarm triggers? (~200 words)
- Is TinyML deployment on a Cortex-M4 microcontroller feasible for real-time fire detection with <100ms latency? (~180 words)
- How does three-class classification (fire/no_fire/false_alarm) compare to binary classification in reducing false positives? (~170 words)

#### 1.4 Research Objectives and Contributions (~350 words)

- Research Objectives and Contributions (~350 words)

#### 1.5 Thesis Organization (~250 words)

- Thesis Organization (~250 words)

### Chapter 2: Literature Review (12–15 pages, ~5,600 words)

#### 2.0 Literature Search Method (PRISMA-inspired rapid SLR) (~400 words)

- Databases and search strings (2015–present)
- Inclusion/exclusion criteria and screening steps
- PRISMA flow reporting + extraction table

#### 2.1 Evolution of Fire Detection Technologies (~750 words)

#### 2.2 Traditional Single-Sensor and Multi-Sensor Systems (~800 words)

#### 2.3 Machine Learning Applications in Fire Detection (~750 words)

#### 2.4 Sensor Fusion Techniques (~1,100 words)

- Kalman Filters (~350 words)
- Bayesian Networks (~350 words)
- Neural Networks (~400 words)

#### 2.5 TinyML and Edge AI Deployments on Microcontrollers (~750 words)

#### 2.6 MEMS-Based Gas Sensors and IR Flame Detection in Recent Works (~550 words)

#### 2.7 Strategies for False Alarm Reduction (~500 words)

- Context-Awareness (~500 words)

#### 2.8 Research Gaps and Motivation for Three-Class Classification (~400 words)

#### 2.9 Summary of Related Works (~1,000 words)

- Comparison Table (~400 words)

### Chapter 3: Theoretical Background (11–13 pages, ~4,800 words)

#### 3.1 Physics and Operating Principles of Fire-Relevant Sensors (~650 words)

#### 3.2 Characteristics of MEMS Smoke, VOC, CO, IR Flame, and Temperature/Humidity Sensors (~850 words)

#### 3.3 Principles of Sensor Fusion for Discrimination (~600 words)

#### 3.4 Feature Engineering for Fire Detection (~1,200 words)

- Statistical Analysis (Mean, RMS, Kurtosis) for Gas/Thermal Trends (~350 words)
- Frequency-domain features (FFT/Spectral Power) for flame flicker at 10–15Hz (~450 words)
- Cross-sensor correlations and dimensionality reduction (~400 words)

#### 3.5 Neural Network Fundamentals for Classification (~600 words)

#### 3.6 Model Quantization and Optimization for Resource-Constrained Devices (~500 words)

#### 3.7 Overview of the Edge Impulse Platform Pipeline (~400 words)

### Chapter 4: Sensor Selection and Characterization (6–7 pages, ~2,500 words)

#### 4.1 Requirements for Multi-Modal Sensing (~300 words)

#### 4.2 Detailed Examination of Selected Sensors (~1,200 words)

- Fermion MEMS Smoke Detection Sensor (Ethanol Compatible) (~260 words)
- Gravity Analog Flame Sensor (IR Spectrum sensitivity) (~200 words)
- Fermion VOC Gas Sensor (MEMS) (~260 words)
- Fermion MEMS Carbon Monoxide (CO) Sensor (~260 words)
- Fermion AHT20 Temperature and Humidity Sensor (~220 words)

#### 4.3 Justification of Sensor Choice (~400 words)

- Sensitivity vs. Selectivity (~400 words)

#### 4.4 Sensor Calibration Protocols and Baseline Behavior (~600 words)

### Chapter 5: Hardware Platform and System Integration (6–7 pages, ~2,600 words)

_(Critical Chapter for "Robotic Platform" Grade)_

#### 5.1 The Autonomous Edge-Node Architecture (~850 words)

- Justification for Arduino UNO R4 WiFi (Renesas RA4M1 + ESP32-S3 Bridge) (~400 words)
- Asymmetric Multi-Processing (AMP): RA4M1 as the "Inference Brain" vs. ESP32-S3 as the "Connectivity Backbone" (~450 words)

#### 5.2 Power Management and Thermal Considerations (~350 words)

- Active Heating elements (~350 words)

#### 5.3 Physical Design and Enclosure (~500 words)

- Airflow considerations for Gas Sensors (~300 words)
- Isolation of Thermal Components (~200 words)

#### 5.4 Connectivity and Location Awareness (~550 words)

- Static Location Tagging (Zone_ID implementation) (~250 words)
- MQTT Telemetry Structure (~300 words)

#### 5.5 System Schematic and Wiring Diagrams (~350 words)

### Chapter 6: Data Collection Methodology (10–12 pages, ~3,600 words)

#### 6.1 Safety Protocols During Data Collection (~700 words)

- Risk Assessment (Fire containment, Ventilation, PPE) (~700 words)

#### 6.2 Rationale for Three-Class Classification (~450 words)

- fire, no_fire, false_alarm (~450 words)

#### 6.3 Sampling Parameters (~550 words)

- 10Hz frequency (~250 words)
- Window sizes (~300 words)

#### 6.4 Class-Specific Data Collection Scenarios (~1,050 words)

- Fire Class: Paper, Wood, Cloth burns (~350 words)
- No-Fire Class: Idle office, Kitchen ambient (~300 words)
- False-Alarm Class: Cooking fumes, Alcohol vapors, Intense IR light (~400 words)

#### 6.5 Environmental Variance (~350 words)

- City/Indoor vs. Simulated Forest/Outdoor (~350 words)

#### 6.6 Dataset Organization, Labeling, and Storage (~450 words)

### Chapter 7: Implementation (9–11 pages, ~3,600 words)

#### 7.1 Edge Impulse Project Setup (~450 words)

#### 7.2 Impulse Design and DSP Blocks (~600 words)

- Spectral Analysis Configuration (~350 words)
- Feature Selection Importance (~250 words)

#### 7.3 Model Architecture and Training (~700 words)

- Neural Network topology design (~300 words)
- Hyperparameter Tuning Results (Layers, Neurons, Learning Rate) (~400 words)

#### 7.4 Arduino Firmware Development (~600 words)

- Data Forwarder Sketch (Data Collection) (~250 words)
- Real-Time Inference Sketch (Deployment) (~350 words)

#### 7.5 Heuristic Post-Processing and Hybrid Triggering Logic (~600 words)

- Combining ML Probabilities with Hard Thresholds (Visual/Heuristic Confirmation) (~350 words)
- Temporal Debouncing (Consecutive Detection Requirements) (~250 words)

#### 7.6 Logic for Alarm Triggering (~350 words)

- Smoothing (~200 words)
- Confidence Thresholds (~150 words)

#### 7.7 Quantization Strategy (~300 words)

- Float32 vs. Int8 (~300 words)

### Chapter 8: Experimental Results and Evaluation (12–14 pages, ~4,700 words)

#### 8.1 Test Environment Description (~400 words)

#### 8.2 Dataset Summary (~600 words)

- Distribution and Balance (~600 words)

#### 8.3 Training and Validation Metrics (~600 words)

- Accuracy (~350 words)
- Loss (~250 words)

#### 8.4 Ablation Study (~1,400 words)

- Performance comparison: Single Sensor vs. Fusion Model (~350 words)
- The "Heat Paradox": Why Single-Sensor Thermal Detection Fails in False Alarm Scenarios (~400 words)
- Identifying the "CO Truth Sensor" for Combustion Verification (~350 words)
- Proof of "Fusion" benefit (~300 words)

#### 8.5 Environment-Specific Performance (~550 words)

- Confusion Matrices for Urban, Indoor, and Outdoor sets (~550 words)

#### 8.6 On-Device Performance Metrics (~900 words)

- Inference Latency (ms) (~300 words)
- RAM/Flash Usage (~300 words)
- Power Consumption Analysis (~300 words)

#### 8.7 Comparison with Baseline Approaches (~250 words)

### Chapter 9: Discussion (7–9 pages, ~2,900 words)

#### 9.1 Interpretation of Class Separability (~600 words)

- The "Truth Sensor" and "Thermal Anomaly" Analysis (~600 words)

#### 9.2 Strengths of the "Autonomous Node" Approach (~450 words)

#### 9.3 Analysis of Error Cases (~450 words)

- Why did False Alarms happen? (~450 words)

#### 9.4 Deployment Scenarios and Scalability (~850 words)

- Cost Analysis per Node (~280 words)
- Mesh Network Topology for Multi-Node Systems (~320 words)
- Certification Challenges (UL/CE) (~250 words)

#### 9.5 Ethical and Safety Aspects of AI in Life-Critical Systems (~550 words)

### Chapter 10: Conclusion and Future Work (4–5 pages, ~1,600 words)

#### 10.1 Limitations of This Study (~450 words)

- Dataset constraints (~160 words)
- Lab vs. Real World (~150 words)
- Sensor Drift (~140 words)

#### 10.2 Summary of Key Findings (~400 words)

#### 10.3 Contributions to the Field (~300 words)

#### 10.4 Future Work (~450 words)

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
  - **Appendix G: Risk Assessment & Safety Protocols**
  - **Appendix H: Raw Data Samples (CSV Snippets)**

