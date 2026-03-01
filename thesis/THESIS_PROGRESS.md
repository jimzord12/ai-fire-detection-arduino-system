# Thesis Writing Progress

| Chapter                                         | Section                                                                  | Status               | Stage                       | Notes                             | Source      |
| :---------------------------------------------- | :----------------------------------------------------------------------- | :------------------- | :-------------------------- | :-------------------------------- | :---------- |
| **1: Introduction**                             | 1.1 Background                                                           | ✅ Done              | included in chapter         | Framed as Autonomous Sensing Node | web + local |
|                                                 | 1.2 Problem Statement                                                    | ✅ Done              | included in chapter         |                                   | web + local |
|                                                 | 1.3 Research Questions                                                   | ✅ Done              | included in chapter         |                                   | web + local |
|                                                 | 1.4 Research Objectives                                                  | ✅ Done              | included in chapter         |                                   | web + local |
|                                                 | 1.5 Thesis Organization                                                  | ✅ Done              | included in chapter         |                                   | local       |
| **2: Literature Review**                        | 2.1 Literature Selection Strategy                                        | ✅ Done              | included in chapter         |                                   | web         |
|                                                 | 2.2 Evolution of Fire Detection and MEMS Technology                      | ✅ Done              | included in chapter         |                                   | web         |
|                                                 | 2.3 Sensor Fusion and TinyML at the Edge                                 | ✅ Done              | included in chapter         |                                   | web         |
|                                                 | 2.4 False Alarm Mitigation and Research Synthesis                        | ✅ Done              | included in chapter         |                                   | web         |
| **3: Theoretical Background**                   | 3.1 Physics and Operating Principles of Fire-Relevant Sensors            | ✅ Done              | included in chapter         |                                   | local       |
|                                                 | 3.2 Characteristics of MEMS Smoke, VOC, CO, IR Flame, and Temp/Humidity  | ✅ Done              | included in chapter         |                                   | local       |
|                                                 | 3.3 Principles of Sensor Fusion for Discrimination                       | ✅ Done              | included in chapter         |                                   | local       |
|                                                 | 3.4 Feature Engineering for Fire Detection                               | ✅ Done              | included in chapter         |                                   | local       |
|                                                 | 3.5 Neural Network Fundamentals for Classification                       | ✅ Done              | included in chapter         |                                   | local       |
|                                                 | 3.6 Model Quantization and Optimization for Resource-Constrained Devices | ✅ Done              | included in chapter         |                                   | local       |
|                                                 | 3.7 Overview of the Edge Impulse Platform Pipeline                       | ✅ Done              | included in chapter         |                                   | local       |
| **4: Sensor Selection and Characterization**    | 4.1 Requirements for Multi-Modal Sensing                                 | ✅ Done              | included in chapter         |                                   | local       |
|                                                 | 4.2 Detailed Examination of Selected Sensors                             | ✅ Done              | included in chapter         |                                   | local       |
|                                                 | 4.3 Justification of Sensor Choice                                       | ✅ Done              | included in chapter         |                                   | local       |
|                                                 | 4.4 Sensor Calibration Protocols and Baseline Behavior                   | ✅ Done              | included in chapter         |                                   | local       |
| **5: Hardware Platform and System Integration** | 5.1 The Autonomous Edge-Node Architecture                                | ✅ Done              | included in chapter         |                                   | local       |
|                                                 | 5.2 Power Management and Thermal Considerations                          | ✅ Done              | included in chapter         |                                   | local       |
|                                                 | 5.3 Physical Design and Enclosure                                        | ✅ Done              | included in chapter         |                                   | local       |
|                                                 | 5.4 Connectivity and Location Awareness                                  | ✅ Done              | included in chapter         |                                   | local       |
|                                                 | 5.5 System Schematic and Wiring Diagrams                                 | ✅ Done              | included in chapter         |                                   | local       |
| **6: Data Collection Methodology**              | 6.1 Safety Protocols During Data Collection                              | ✅ Done              | included in chapter         |                                   | local       |
|                                                 | 6.2 Rationale for Three-Class Classification                             | ✅ Done              | included in chapter         |                                   | local       |
|                                                 | 6.3 Sampling Parameters                                                  | ✅ Done              | included in chapter         |                                   | local       |
|                                                 | 6.4 Class-Specific Data Collection Scenarios                             | ✅ Done              | included in chapter         |                                   | local       |
|                                                 | 6.5 Environmental Variance                                               | ✅ Done              | included in chapter         |                                   | local       |
|                                                 | 6.6 Dataset Organization, Labeling, and Storage                          | ✅ Done              | included in chapter         |                                   | local       |
| **7: Implementation**                           | 7.1 Edge Impulse Project Setup                                           | ✅ Done              | included in chapter         |                                   | local       |
|                                                 | 7.2 Impulse Design and DSP Blocks                                        | ✅ Done              | included in chapter         |                                   | local       |
|                                                 | 7.3 Model Architecture and Training                                      | ✅ Done              | included in chapter         |                                   | local       |
|                                                 | 7.4 Arduino Firmware Development                                         | ✅ Done              | included in chapter         |                                   | local       |
|                                                 | 7.5 Heuristic Post-Processing and Hybrid Triggering Logic                | ✅ Done              | included in chapter         |                                   | local       |
|                                                 | 7.6 Logic for Alarm Triggering                                           | ✅ Done              | included in chapter         |                                   | local       |
|                                                 | 7.7 Quantization Strategy                                                | ✅ Done              | included in chapter         |                                   | local       |
| **8: Experimental Results and Evaluation**      | 8.1 Test Environment Description                                         | ✅ Done              | included in chapter         |                                   | local       |
|                                                 | 8.2 Dataset Summary                                                      | ✅ Done              | included in chapter         |                                   | local       |
|                                                 | 8.3 Training and Validation Metrics                                      | ✅ Done              | included in chapter         |                                   | local       |
|                                                 | 8.4 Ablation Study                                                       | ✅ Done              | included in chapter         | Critical: Fusion > Single Sensor  | local       |
|                                                 | 8.5 Environment-Specific Performance                                     | ✅ Done              | included in chapter         |                                   | local       |
|                                                 | 8.6 On-Device Performance Metrics                                        | ✅ Done              | included in chapter         |                                   | local       |
|                                                 | 8.7 Comparison with Baseline Approaches                                  | ✅ Done              | included in chapter         |                                   | local       |
| **9: Discussion**                               | 9.1 Interpretation of Class Separability                                 | ✅ Done              | included in chapter         |                                   | local       |
|                                                 | 9.2 Strengths of the "Autonomous Node" Approach                          | ✅ Done              | included in chapter         |                                   | local       |
|                                                 | 9.3 Analysis of Error Cases                                              | ✅ Done              | included in chapter         |                                   | local       |
|                                                 | 9.4 Deployment Scenarios and Scalability                                 | ✅ Done              | included in chapter         |                                   | local       |
|                                                 | 9.5 Ethical and Safety Aspects of AI in Life-Critical Systems            | ✅ Done              | included in chapter         |                                   | web         |
| **10: Conclusion and Future Work**              | 10.1 Limitations of This Study                                           | ✅ Done              | included in chapter         |                                   | local       |
|                                                 | 10.2 Summary of Key Findings                                             | ✅ Done              | included in chapter         |                                   | local       |
|                                                 | 10.3 Contributions to the Field                                          | ✅ Done              | included in chapter         |                                   | local       |
|                                                 | 10.4 Future Work                                                         | ✅ Done              | included in chapter         |                                   | local       |

**Legend:**

- 🔲 Todo
- 📝 Drafting - Web Only - Web Only
- 📝 Drafting - Web Only - Web + Local
- 👀 Review
- ✅ Done
