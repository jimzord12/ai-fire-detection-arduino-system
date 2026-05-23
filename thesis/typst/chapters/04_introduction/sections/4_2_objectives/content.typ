== Research Objectives <sec:research_objectives>

The central objective of this research is to design, implement, and evaluate an autonomous sensing node that leverages multi-sensor fusion and TinyML for intelligent fire detection with minimal false alarm rates. This objective is motivated by the well-documented failure of legacy single-parameter detectors to distinguish genuine combustion from common nuisance sources, and by the emergence of TinyML as a viable paradigm for deploying intelligent classification on resource-constrained microcontrollers. The specific research objectives are structured to address the full development lifecycle, from hardware design through to experimental validation.

=== Objective 1: Multi-Modal Hardware Platform Development

+ *To develop a multi-modal hardware platform* based on the Arduino UNO R4 WiFi that integrates MEMS sensors for smoke, VOC, CO, and AHT20 for environmental monitoring, along with an analog IR flame sensor.

The selection of a multi-modal sensor suite is grounded in the understanding that no single sensing modality can reliably distinguish fire from all non-fire sources. As established in the literature review, smoke-only systems are vulnerable to cooking fumes and steam, while temperature-only systems cannot differentiate between ambient heating and combustion. By integrating five complementary sensing channels—each monitoring a different physical or chemical marker of combustion—the platform captures the multi-dimensional "physical fingerprint" necessary for robust discrimination @fonollosa2018chemical.

=== Objective 2: Asymmetric Multi-Processing Firmware Architecture

+ *To implement an Asymmetric Multi-Processing (AMP) firmware architecture* that decouples high-frequency sensor acquisition and local TinyML inference (RA4M1) from low-priority MQTT telemetry (ESP32-S3).

The AMP architecture addresses a fundamental tension in edge-based safety systems: the need for deterministic, low-latency inference alongside network communication. By isolating the safety-critical inference loop on the Cortex-M4 core and delegating telemetry to the ESP32-S3 co-processor, the system ensures that network operations never interfere with the real-time classification cycle. This separation of concerns is consistent with established best practices for safety-critical embedded systems, where primary detection logic must remain independent of non-essential subsystems @khan2025advancements.

=== Objective 3: Multi-Class Dataset Collection

+ *To collect and label a comprehensive multi-class dataset* encompassing genuine fire scenarios, ambient environmental conditions, and diverse false alarm triggers across representative environments, including indoor building settings, urban city contexts, and simulated forest/wildfire scenarios.

The quality and diversity of the training dataset directly determines the generalization capability of the resulting model. A particular emphasis is placed on the inclusion of false alarm scenarios—cooking fumes, aerosol sprays, steam, and cleaning products—as these represent the primary failure mode of existing systems. The three-class labeling scheme (fire / no_fire / false_alarm) is a deliberate architectural choice that provides the model with explicit negative examples, rather than relying on the implicit assumption that all non-fire data is homogeneous @li2022research.

=== Objective 4: TinyML Model Training and Optimization

+ *To train and optimize a quantized neural network* (TinyML) using the Edge Impulse platform, capable of three-class classification with minimal latency on the target hardware @warden2019tinyml @hymel2023edge.

Model optimization for embedded deployment requires balancing classification accuracy against the strict memory and computational constraints of the target MCU. The objective encompasses the full TinyML pipeline: feature engineering, neural network architecture selection, training, post-training quantization to INT8 precision, and validation of the quantized model's accuracy retention @das2025tiny.

=== Objective 5: Performance Evaluation

+ *To evaluate the system's performance* in terms of classification accuracy, false alarm rejection, and on-device resource utilization (latency, RAM, Flash) @samanta2024optimizing.

Evaluation extends beyond aggregate accuracy metrics to include per-class performance analysis, ablation studies, and comparison with baseline approaches. This comprehensive evaluation framework ensures that the system's strengths and limitations are transparently documented, providing a realistic assessment of its readiness for deployment.

=== Objective 6: Hybrid Decision Architecture

+ *To develop and evaluate a hybrid hardware-AI decision fusion model* that combines probabilistic TinyML inference with deterministic hardware safety overrides and heuristic suppression to ensure life-safety reliability and mitigate the generalization limits of laboratory-trained machine learning models.

This objective addresses the gap between laboratory performance and real-world reliability. Pure machine learning models, regardless of their training accuracy, may encounter edge cases not represented in the training data. The hybrid architecture provides a safety net: deterministic hardware thresholds ensure that critical fire signatures (e.g., high-intensity IR) always trigger an alarm, while heuristic suppression rules prevent the system from alarming on signatures that are consistent with known nuisance patterns despite elevated AI confidence.

Through the fulfillment of these objectives, this research contributes a validated framework for the next generation of autonomous, high-fidelity fire detection nodes suitable for edge deployment in smart building ecosystems.
