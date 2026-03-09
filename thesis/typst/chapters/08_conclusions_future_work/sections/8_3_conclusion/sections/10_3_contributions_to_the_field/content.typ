== Contributions to the Field

The research presented in this thesis makes several significant contributions to the field of intelligent fire detection and edge computing. By shifting the focus from centralized, single-modality detection to autonomous, multi-sensor nodes, this work addresses the long-standing challenge of false alarm mitigation in residential and industrial environments.

=== Multi-Modal Sensor Fusion for High-Fidelity Discrimination

The primary contribution of this work is the empirical demonstration of 100% class separability between genuine fire events, ambient conditions, and common false alarm triggers using a heterogeneous five-sensor array. While traditional systems often struggle with the "heat paradox" or chemical overlap between smoke and steam, this research shows that the intelligent fusion of MOS gas sensors, IR flame detection, and environmental context provides a robust physical "fingerprint" of combustion @fonollosa2018chemical. The identification of the Carbon Monoxide (CO) sensor as a "truth sensor" within the fusion model provides a validated strategy for vetoing spurious alarms, a significant advancement over binary detection logic @LIU2023103733.

=== Optimized TinyML Deployment on Resource-Constrained Hardware

Secondly, this research contributes a validated framework for deploying quantized neural networks on commodity microcontrollers. By utilizing Post-Training Quantization (PTQ) to convert Multi-Layer Perceptrons to an 8-bit integer (INT8) representation, the system achieves a 4x reduction in memory footprint with minimal accuracy loss. The successful implementation on the Renesas RA4M1 demonstrates that real-time, high-frequency inference is achievable at the edge, even with high-dimensional feature vectors involving spectral analysis @sailesh2022novel. This provides a scalable blueprint for the next generation of autonomous sensing nodes that do not rely on persistent cloud connectivity for life-safety decisions @meleti2024obscured.
