== Edge Intelligence and TinyML <sec:edge_intelligence>

The traditional architecture for Internet of Things (IoT) systems has historically relied on a cloud-centric model, where raw sensor data is transmitted to centralized servers for processing and decision-making. However, for life-safety applications such as fire detection, this paradigm introduces critical vulnerabilities related to network latency, bandwidth constraints, and single-point-of-failure risks. The emergence of Edge Intelligence—specifically Tiny Machine Learning (TinyML)—offers a decentralized alternative by enabling complex inference tasks to be performed directly on the microcontroller unit (MCU) at the sensing site. This section explores the theoretical advancements that facilitate this shift and their implications for autonomous fire sensing nodes.

=== The Transition from Cloud to Edge-Centric Sensing

The primary driver for Edge Intelligence in fire detection is the requirement for deterministic real-time response. Fire events are characterized by rapid non-linear growth; a delay of several seconds due to network congestion or cloud unavailability can be the difference between containment and catastrophic failure. By performing data fusion and classification locally, _Autonomous Sensing Nodes_ achieve sub-100 ms inference latencies, ensuring immediate triggering of alarm states regardless of connectivity status @alajlan2022tinyml. Furthermore, local processing mitigates the "data deluge" problem in large-scale deployments, as only high-level alerts or compressed telemetry are transmitted, significantly reducing the power consumption associated with wireless radio operation @Tummala2025TinyML.

=== Theoretical Foundations of TinyML

TinyML represents the intersection of machine learning and embedded systems, focusing on the optimization of deep learning models for devices with memory budgets typically under 256 KB of RAM and 1 MB of Flash @warden2019tinyml. The theoretical breakthrough enabling this is the realization that many neural network architectures exhibit significant redundancy. Techniques such as weight pruning, neural architecture search (NAS), and most critically, 8-bit integer (INT8) quantization, allow for the reduction of model size by 75% or more with negligible loss in classification accuracy @das2025tiny @novac2021quantization. For fire detection, these optimizations allow a multi-modal neural network to extract high-level features from sensor streams (e.g., spectral analysis of gas signatures) while maintaining a small enough footprint to reside alongside the primary firmware logic on a single MCU core.

=== Advantages for Autonomous Fire Systems

The application of TinyML to fire sensing provides three fundamental advantages: autonomy, privacy, and reliability. Autonomy is achieved through the system's ability to maintain protective monitoring during network outages—a common occurrence during fire-induced power failures. Privacy is inherently preserved as raw environmental data (which could potentially leak sensitive occupant activity) never leaves the device @alajlan2022tinyml. Finally, reliability is enhanced through the reduction of system complexity; by eliminating the dependency on external APIs or cloud services, the "attack surface" for system failure is minimized. As highlighted by @hymel2023edge, platforms like Edge Impulse have standardized the deployment of these models, allowing for a rigorous, data-driven approach to fire detection that was previously only possible on high-power gateway devices.

=== Section Glossary

- **Edge Intelligence**: The paradigm of performing data processing and machine learning inference at the "edge" of the network, close to the data source, rather than in a centralized cloud.
- **TinyML (Tiny Machine Learning)**: A field of machine learning focused on developing models and algorithms capable of running on low-power, resource-constrained microcontrollers.
- **Quantization**: The process of mapping high-precision floating-point numbers to lower-precision integer representations to reduce the memory footprint and increase the inference speed of a model.
- **Inference Latency**: The time required for a machine learning model to process an input and generate a prediction.
