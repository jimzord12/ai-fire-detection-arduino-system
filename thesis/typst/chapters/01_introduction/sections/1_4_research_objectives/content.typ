== Research Objectives <sec:research_objectives>

The central objective of this research is to design, implement, and evaluate an autonomous sensing node that leverages multi-sensor fusion and TinyML for intelligent fire detection. The specific objectives are:

+ *To develop a multi-modal hardware platform* based on the Arduino UNO R4 WiFi that integrates MEMS sensors for smoke, VOC, CO, and AHT20 for environmental monitoring, along with an analog IR flame sensor.
+ *To implement an Asymmetric Multi-Processing (AMP) firmware architecture* that decouples high-frequency sensor acquisition and local TinyML inference (RA4M1) from low-priority MQTT telemetry (ESP32-S3).
+ *To collect and label a comprehensive multi-class dataset* encompassing genuine fire scenarios, ambient environmental conditions, and diverse false alarm triggers.
+ *To train and optimize a quantized neural network* (TinyML) using the Edge Impulse platform, capable of three-class classification with minimal latency on the target hardware.
+ *To evaluate the system's performance* in terms of classification accuracy, false alarm rejection, and on-device resource utilization (latency, RAM, Flash).
+ *To develop and evaluate a hybrid hardware-AI decision fusion model* that combines probabilistic TinyML inference with deterministic hardware safety overrides and heuristic suppression to ensure life-safety reliability and mitigate the generalization limits of laboratory-trained machine learning models.

Through the fulfillment of these objectives, this research contributes a validated framework for the next generation of autonomous, high-fidelity fire detection nodes suitable for edge deployment in smart building ecosystems.
