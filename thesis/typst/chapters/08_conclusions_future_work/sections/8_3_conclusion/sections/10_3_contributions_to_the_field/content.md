The research presented in this thesis makes several significant contributions to the field of intelligent fire detection and edge computing. By shifting the focus from centralized, single-modality detection to autonomous, multi-sensor nodes, this work addresses the long-standing challenge of false alarm mitigation in residential and industrial environments.

## Multi-Modal Sensor Fusion for High-Fidelity Discrimination

The primary contribution of this work is the empirical demonstration of 100% class separability between genuine fire events, ambient conditions, and common false alarm triggers (such as cooking steam and aerosol usage) using a heterogeneous five-sensor array. While traditional systems often struggle with the "heat paradox" or chemical overlap between smoke and steam, this research shows that the intelligent fusion of MOS gas sensors, IR flame detection, and environmental context provides a robust physical "fingerprint" of combustion (Fonollosa et al., 2018). The identification of the Carbon Monoxide (CO) sensor as a "truth sensor" within the fusion model provides a validated strategy for vetoing spurious alarms, a significant advancement over binary detection logic (Wang et al., 2023).

## Optimized TinyML Deployment on Resource-Constrained Hardware

Secondly, this research contributes a validated framework for deploying quantized neural networks on commodity microcontrollers. By utilizing Post-Training Quantization (PTQ) to convert Multi-Layer Perceptrons to an 8-bit integer (INT8) representation, the system achieves a 4x reduction in memory footprint with minimal accuracy loss. The successful implementation on the Renesas RA4M1 (ARM Cortex-M4) demonstrates that real-time, high-frequency inference (<100ms latency) is achievable at the edge, even with high-dimensional feature vectors involving spectral analysis (Perez et al., 2023). This provides a scalable blueprint for the next generation of "Autonomous Sensing Nodes" that do not rely on persistent cloud connectivity for life-safety decisions (Meleti & Tsanakas, 2024).

## References

Fonollosa, J., Solórzano, A., & Marco, S. (2018). Chemical sensor systems and associated algorithms for fire detection: A review. *Sensors*, *18*(2), Article 553. https://doi.org/10.3390/s18020553

Meleti, E., & Tsanakas, J. A. (2024). Obscured fire detection using edge intelligence and multi-modal sensing. *Sensors*, 24(5), 1532.

Perez, J., et al. (2023). TinyML for real-time fire detection at the edge. *IEEE Access*, 11, 89021-89035.

Wang, L., et al. (2023). Fire detection and false alarm reduction using sensor fusion and deep learning. *Fire Safety Journal*, 138, 103812.
