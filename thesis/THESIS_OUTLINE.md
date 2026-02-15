# Thesis Outline: Autonomous Multi-Sensor Fire Detection Node Using Sensor Fusion and TinyML

**Target Length**: 65–75 pages (excluding front matter, references, and appendices)
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

### Chapter 1: Introduction (6–8 pages)

1. Background and Problem Statement
2. Significance of Fire Detection and False Alarm Issues
3. Limitations of Traditional Fire Detectors vs. Intelligent Edge Nodes
4. **Research Questions:**
5. Can a multi-sensor fusion approach distinguish between real fire, ambient conditions, and common false alarm triggers?
6. Is TinyML deployment on a Cortex-M4 microcontroller feasible for real-time fire detection with <100ms latency?
7. How does three-class classification (fire/no_fire/false_alarm) compare to binary classification in reducing false positives?
8. Research Objectives and Contributions
9. Scope and Limitations (Explicitly addressing stationary "Autonomous Node" vs. Mobile Robot)
10. Thesis Organization

### Chapter 2: Literature Review (12–15 pages)

1. Evolution of Fire Detection Technologies
2. Traditional Single-Sensor and Multi-Sensor Systems
3. Machine Learning Applications in Fire Detection
4. Sensor Fusion Techniques (Kalman Filters, Bayesian Networks, Neural Networks)
5. TinyML and Edge AI Deployments on Microcontrollers
6. MEMS-Based Gas Sensors and IR Flame Detection in Recent Works
7. Strategies for False Alarm Reduction (Context-Awareness)
8. Research Gaps and Motivation for Three-Class Classification
9. Summary of Related Works (Comparison Table)

### Chapter 3: Theoretical Background (11–13 pages)

1. Physics and Operating Principles of Fire-Relevant Sensors
2. Characteristics of MEMS Smoke, VOC, CO, IR Flame, and Temperature/Humidity Sensors
3. Principles of Sensor Fusion for Discrimination
4. **Feature Engineering for Fire Detection:**
   1. Statistical Analysis (Mean, RMS, Kurtosis) for Gas/Thermal Trends
   2. Frequency-domain features (FFT/Spectral Power) for flame flicker at 10–15Hz
   3. Cross-sensor correlations and dimensionality reduction
5. Neural Network Fundamentals for Classification
6. Model Quantization and Optimization for Resource-Constrained Devices
7. Overview of the Edge Impulse Platform Pipeline

### Chapter 4: Sensor Selection and Characterization (6–7 pages)

1. Requirements for Multi-Modal Sensing
2. Detailed Examination of Selected Sensors:
   1. Fermion MEMS Smoke Detection Sensor (Ethanol Compatible)
   2. Gravity Analog Flame Sensor (IR Spectrum sensitivity)
   3. Fermion VOC Gas Sensor (MEMS)
   4. Fermion MEMS Carbon Monoxide (CO) Sensor
   5. Fermion AHT20 Temperature and Humidity Sensor
3. Justification of Sensor Choice (Sensitivity vs. Selectivity)
4. Sensor Calibration Protocols and Baseline Behavior

### Chapter 5: Hardware Platform and System Integration (6–7 pages)

_(Critical Chapter for "Robotic Platform" Grade)_

1. **The Autonomous Edge-Node Architecture:**
   1. Justification for Arduino UNO R4 WiFi (Renesas RA4M1 + ESP32-S3 Bridge)
   2. Asymmetric Multi-Processing (AMP): RA4M1 as the "Inference Brain" vs. ESP32-S3 as the "Connectivity Backbone"
2. Power Management and Thermal Considerations (Active Heating elements)
3. **Physical Design and Enclosure:**
   1. Airflow considerations for Gas Sensors
   2. Isolation of Thermal Components
4. **Connectivity and Location Awareness:**
   1. Static Location Tagging (Zone_ID implementation)
   2. MQTT Telemetry Structure
5. System Schematic and Wiring Diagrams

### Chapter 6: Data Collection Methodology (10–12 pages)

1. **Safety Protocols During Data Collection:**
   1. Risk Assessment (Fire containment, Ventilation, PPE)
2. Rationale for Three-Class Classification (fire, no_fire, false_alarm)
3. Sampling Parameters (10Hz frequency, Window sizes)
4. Class-Specific Data Collection Scenarios:
   1. **Fire Class:** Paper, Wood, Cloth burns
   2. **No-Fire Class:** Idle office, Kitchen ambient
   3. **False-Alarm Class:** Cooking fumes, Alcohol vapors, Intense IR light
5. Environmental Variance (City/Indoor vs. Simulated Forest/Outdoor)
6. Dataset Organization, Labeling, and Storage

### Chapter 7: Implementation (9–11 pages)

1. Edge Impulse Project Setup
2. **Impulse Design and DSP Blocks:**
   1. Spectral Analysis Configuration
   2. Feature Selection Importance
3. **Model Architecture and Training:**
   1. Neural Network topology design
   2. **Hyperparameter Tuning Results** (Layers, Neurons, Learning Rate)
4. Arduino Firmware Development:
   1. Data Forwarder Sketch (Data Collection)
   2. Real-Time Inference Sketch (Deployment)
5. **Heuristic Post-Processing and Hybrid Triggering Logic:**
   1. Combining ML Probabilities with Hard Thresholds (Visual/Heuristic Confirmation)
   2. Temporal Debouncing (Consecutive Detection Requirements)
6. Logic for Alarm Triggering (Smoothing, Confidence Thresholds)
7. Quantization Strategy (Float32 vs. Int8)

### Chapter 8: Experimental Results and Evaluation (12–14 pages)

1. Test Environment Description
2. Dataset Summary (Distribution and Balance)
3. Training and Validation Metrics (Accuracy, Loss)
4. **Ablation Study:**
   1. Performance comparison: Single Sensor vs. Fusion Model
   2. The "Heat Paradox": Why Single-Sensor Thermal Detection Fails in False Alarm Scenarios
   3. Identifying the "CO Truth Sensor" for Combustion Verification
   4. Proof of "Fusion" benefit
5. **Environment-Specific Performance:**
   1. Confusion Matrices for Urban, Indoor, and Outdoor sets
6. On-Device Performance Metrics:
   1. Inference Latency (ms)
   2. RAM/Flash Usage
   3. Power Consumption Analysis
7. Comparison with Baseline Approaches

### Chapter 9: Discussion (7–9 pages)

1. Interpretation of Class Separability (The "Truth Sensor" and "Thermal Anomaly" Analysis)
2. Strengths of the "Autonomous Node" Approach
3. Analysis of Error Cases (Why did False Alarms happen?)
4. **Deployment Scenarios and Scalability:**
   1. Cost Analysis per Node
   2. Mesh Network Topology for Multi-Node Systems
   3. Certification Challenges (UL/CE)
5. Ethical and Safety Aspects of AI in Life-Critical Systems

### Chapter 10: Conclusion and Future Work (4–5 pages)

1. **Limitations of This Study:**
1. Dataset constraints, Lab vs. Real World, Sensor Drift
1. Summary of Key Findings
1. Contributions to the Field
1. Future Work:
1. OTA Updates
1. LoRaWAN Integration for Forest Deployment
1. Cooperative Sensing (Multi-robot consensus)

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

