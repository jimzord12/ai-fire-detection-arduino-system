# Thesis Outline: Autonomous Multi-Sensor Fire Detection Node Using Sensor Fusion and TinyML

**Target Length**: 65–75 pages (excluding front matter, references, and appendices)
**Target References**: 70–90 sources (peer-reviewed journals, conference papers, datasheets, standards like EN 54/NFPA 72)

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
- Background and Problem Statement
- Significance of Fire Detection and False Alarm Issues
- Limitations of Traditional Fire Detectors vs. Intelligent Edge Nodes
- **Research Questions:**
  1. Can a multi-sensor fusion approach distinguish between real fire, ambient conditions, and common false alarm triggers?
  2. Is TinyML deployment on a Cortex-M4 microcontroller feasible for real-time fire detection with <100ms latency?
  3. How does three-class classification (fire/no_fire/false_alarm) compare to binary classification in reducing false positives?
- Research Objectives and Contributions
- Scope and Limitations (Explicitly addressing stationary "Autonomous Node" vs. Mobile Robot)
- Thesis Organization

### Chapter 2: Literature Review (12–15 pages)
- Evolution of Fire Detection Technologies
- Traditional Single-Sensor and Multi-Sensor Systems
- Machine Learning Applications in Fire Detection
- Sensor Fusion Techniques (Kalman Filters, Bayesian Networks, Neural Networks)
- TinyML and Edge AI Deployments on Microcontrollers
- MEMS-Based Gas Sensors and IR Flame Detection in Recent Works
- Strategies for False Alarm Reduction (Context-Awareness)
- Research Gaps and Motivation for Three-Class Classification
- Summary of Related Works (Comparison Table)

### Chapter 3: Theoretical Background (11–13 pages)
- Physics and Operating Principles of Fire-Relevant Sensors
- Characteristics of MEMS Smoke, VOC, CO, IR Flame, and Temperature/Humidity Sensors
- Principles of Sensor Fusion for Discrimination
- **Feature Engineering for Fire Detection:**
  - Time-domain features (Rate-of-Rise)
  - Frequency-domain features (FFT for flame flicker at 10–15Hz)
  - Cross-sensor correlations
- Neural Network Fundamentals for Classification
- Model Quantization and Optimization for Resource-Constrained Devices
- Overview of the Edge Impulse Platform Pipeline

### Chapter 4: Sensor Selection and Characterization (6–7 pages)
- Requirements for Multi-Modal Sensing
- Detailed Examination of Selected Sensors:
  - Fermion MEMS Smoke Detection Sensor (Ethanol Compatible)
  - Gravity Analog Flame Sensor (IR Spectrum sensitivity)
  - Fermion VOC Gas Sensor (MEMS)
  - Fermion MEMS Carbon Monoxide (CO) Sensor
  - Fermion AHT20 Temperature and Humidity Sensor
- Justification of Sensor Choice (Sensitivity vs. Selectivity)
- Sensor Calibration Protocols and Baseline Behavior

### Chapter 5: Hardware Platform and System Integration (6–7 pages)
*(Critical Chapter for "Robotic Platform" Grade)*
- **The Autonomous Edge-Node Architecture:**
  - Justification for Arduino UNO R4 WiFi (Renesas RA4M1 + ESP32-S3 Bridge)
  - Dual-Core Asymmetric Multiprocessing benefits (Sensing vs. Comms)
- Power Management and Thermal Considerations (Active Heating elements)
- **Physical Design and Enclosure:**
  - Airflow considerations for Gas Sensors
  - Isolation of Thermal Components
- **Connectivity and Location Awareness:**
  - Static Location Tagging (Zone_ID implementation)
  - MQTT Telemetry Structure
- System Schematic and Wiring Diagrams

### Chapter 6: Data Collection Methodology (10–12 pages)
- **Safety Protocols During Data Collection:**
  - Risk Assessment (Fire containment, Ventilation, PPE)
- Rationale for Three-Class Classification (fire, no_fire, false_alarm)
- Sampling Parameters (10Hz frequency, Window sizes)
- Class-Specific Data Collection Scenarios:
  - **Fire Class:** Paper, Wood, Cloth burns
  - **No-Fire Class:** Idle office, Kitchen ambient
  - **False-Alarm Class:** Cooking fumes, Alcohol vapors, Intense IR light
- Environmental Variance (City/Indoor vs. Simulated Forest/Outdoor)
- Dataset Organization, Labeling, and Storage

### Chapter 7: Implementation (9–11 pages)
- Edge Impulse Project Setup
- **Impulse Design and DSP Blocks:**
  - Spectral Analysis Configuration
  - Feature Selection Importance
- **Model Architecture and Training:**
  - Neural Network topology design
  - **Hyperparameter Tuning Results** (Layers, Neurons, Learning Rate)
- Arduino Firmware Development:
  - Data Forwarder Sketch (Data Collection)
  - Real-Time Inference Sketch (Deployment)
- Logic for Alarm Triggering (Smoothing, Confidence Thresholds)
- Quantization Strategy (Float32 vs. Int8)

### Chapter 8: Experimental Results and Evaluation (12–14 pages)
- Test Environment Description
- Dataset Summary (Distribution and Balance)
- Training and Validation Metrics (Accuracy, Loss)
- **Ablation Study:**
  - Performance comparison: Single Sensor vs. Fusion Model
  - Proof of "Fusion" benefit
- **Environment-Specific Performance:**
  - Confusion Matrices for Urban, Indoor, and Outdoor sets
- On-Device Performance Metrics:
  - Inference Latency (ms)
  - RAM/Flash Usage
  - Power Consumption Analysis
- Comparison with Baseline Approaches

### Chapter 9: Discussion (7–9 pages)
- Interpretation of Class Separability
- Strengths of the "Autonomous Node" Approach
- Analysis of Error Cases (Why did False Alarms happen?)
- **Deployment Scenarios and Scalability:**
  - Cost Analysis per Node
  - Mesh Network Topology for Multi-Node Systems
  - Certification Challenges (UL/CE)
- Ethical and Safety Aspects of AI in Life-Critical Systems

### Chapter 10: Conclusion and Future Work (4–5 pages)
- **Limitations of This Study:**
  - Dataset constraints, Lab vs. Real World, Sensor Drift
- Summary of Key Findings
- Contributions to the Field
- Future Work:
  - OTA Updates
  - LoRaWAN Integration for Forest Deployment
  - Cooperative Sensing (Multi-robot consensus)

### Back Matter
- References (IEEE Format)
- Appendices
  - Appendix A: Full Arduino Source Code
  - Appendix B: Wiring Diagrams & PCB Layouts
  - Appendix C: Data Collection Logs
  - Appendix D: Training Curves & Confusion Matrices
  - Appendix E: Sensor Datasheet Excerpts
  - Appendix F: Edge Impulse Configuration
  - **Appendix G: Risk Assessment & Safety Protocols**
  - **Appendix H: Raw Data Samples (CSV Snippets)**
