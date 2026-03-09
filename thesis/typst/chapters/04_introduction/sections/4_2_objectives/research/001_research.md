# 1.4 Research Objectives and Contributions

## 1.4.1 Primary Research Objectives

The primary goal of this research is to develop and validate an autonomous sensing node capable of intelligent fire detection through multi-modal sensor fusion and edge-deployed machine learning. Traditional fire detection systems often suffer from high false alarm rates because they rely on single-modality thresholds, which fail to distinguish between combustion byproducts and common household aerosols.[1] To address these limitations, this study pursues three core objectives. First, the research aims to design a robust sensor fusion framework that integrates particulate smoke, volatile organic compounds (VOC), carbon monoxide (CO), and infrared flame signatures. By leveraging the mathematical correlations between these distinct environmental variables, the system seeks to improve the reliability of fire detection in complex indoor environments where "nuisance" triggers are prevalent.[2]

The second objective focuses on the technical feasibility of deploying sophisticated neural networks on resource-constrained hardware. Specifically, this study evaluates the implementation of TinyML models on a 48MHz Cortex-M4 microcontroller, such as the Renesas RA4M1 found in the Arduino UNO R4 WiFi. For an edge intelligence unit to be viable for life-safety applications, it must maintain an inference latency of less than 100ms to ensure a near-instantaneous response to evolving fire threats.[3] This objective involves investigating model optimization techniques, including quantization and pruning, to balance classification accuracy with the memory and processing limits of the embedded platform.

Third, the research investigates the efficacy of a three-class classification paradigm (fire, no-fire, and false alarm) compared to traditional binary models. While most existing literature categorizes events simply as fire or no-fire, this binary approach frequently results in high false-positive rates when the model encounters intense non-fire triggers like cooking fumes or cleaning sprays.[1] By explicitly training the model to recognize the statistical signatures of these "false alarm" scenarios, this study seeks to enhance the precision of the actual fire classification and provide more actionable intelligence for building automation systems.

## 1.4.2 Scientific and Technical Contributions

This thesis provides several contributions to the field of intelligent fire safety and edge computing. A significant technical contribution is the development of a validated edge intelligence unit architecture that utilizes asymmetric multi-processing. In this configuration, the primary microcontroller manages real-time sensor acquisition and ML inference, while a dedicated co-processor handles the connectivity backbone for MQTT-based telemetry.[3] This modular design mimics established robotic controller architectures, ensuring that the critical "reflex" of fire detection remains autonomous and unaffected by network latency or connectivity failures.

Furthermore, this research contributes a unique multi-modal dataset specifically designed for three-class fire detection. Unlike many publicly available datasets that focus on visual fire detection or limited sensor arrays, the data generated in this study includes high-frequency (10 Hz) time-series measurements from five distinct sensing modalities across a wide range of real-world fire and false alarm scenarios. This dataset facilitates the analysis of class separability and the identification of "truth sensors"—such as carbon monoxide for combustion verification—that are essential for reducing false alarms in stationary autonomous nodes.[2]

Finally, the study provides a comprehensive performance benchmark of TinyML models on low-power Cortex-M4 hardware. By documenting the trade-offs between model complexity, RAM usage, and inference latency, this work offers a roadmap for the deployment of intelligent safety systems in environments where cost and power consumption are critical constraints. The results demonstrate that through careful optimization, it is possible to achieve high-accuracy, multi-class fire detection on hardware that traditionally lacked the computational capacity for advanced machine learning.[3]

### References

- [1] M. Müller, J. Briesenick, and K. Behnke, "Classification in early fire detection using multi-sensor nodes—A study of the generalisability to unseen environments," _Sensors_, vol. 24, no. 4, p. 1319, 2024, doi: 10.3390/s24041319. [Online]. Available: https://doi.org/10.3390/s24041319
- [2] Z. Zheng, Y. Li, and X. Chen, "Research on multi-sensor fusion indoor fire perception algorithm," _Sensors_, vol. 22, no. 12, p. 4524, 2022, doi: 10.3390/s22124524. [Online]. Available: https://doi.org/10.3390/s22124524
- [3] S. Das, S. Somvanshi, S. A. Javed, M. M. Islam, R. Chakraborty, and M. Sultana, "From Tiny Machine Learning to Tiny Deep Learning: A Survey," _ACM Computing Surveys_, vol. 58, no. 7, Art. no. 168, 2025, doi: 10.1145/3776588. [Online]. Available: https://doi.org/10.1145/3776588

### Glossary

- **Asymmetric Multi-Processing**: A hardware architecture where different processor cores handle distinct tasks, such as separating high-speed inference from low-priority communication tasks.
- **Autonomous Sensing Node**: A standalone edge device that performs data acquisition, processing, and decision-making locally without requiring a continuous cloud connection.
- **Inference Latency**: The total time elapsed between the presentation of input data to a machine learning model and the generation of a classification result.
- **TinyML**: A branch of machine learning dedicated to the design and deployment of optimized models on ultra-low-power microcontrollers.
