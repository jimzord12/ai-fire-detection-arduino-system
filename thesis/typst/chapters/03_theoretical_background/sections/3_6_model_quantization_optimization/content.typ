== Model Quantization and Optimization for Resource-Constrained Devices

The deployment of deep learning models on resource-constrained microcontrollers, such as the ARM Cortex-M4, necessitates specialized optimization techniques to overcome severe limitations in memory (RAM), storage (Flash), and computational power. Model quantization and architectural optimization are the primary strategies used to bridge the gap between high-performance neural networks and the "edge" environment. This section examines the theoretical foundations of quantization and its impact on the performance of autonomous sensing nodes.

=== Principles of Neural Network Quantization

Quantization is the process of mapping continuous, high-precision floating-point values (typically 32-bit Float) to a discrete, lower-precision set of values (e.g., 8-bit Integer). In a neural network, this transformation is applied to both the weights and the activations.

==== Post-Training Quantization (PTQ)

Post-Training Quantization is a common TinyML optimization technique where a pre-trained floating-point model is converted to a fixed-point representation using a representative dataset to calibrate the dynamic range of activations. For an 8-bit integer (INT8) quantization, the mapping is defined as:

$q = round(r/S + Z)$

where $r$ is the real value, $S$ is a scaling factor, and $Z$ is the zero-point offset @perez2023tinyml. By converting weights from 4-byte floats to 1-byte integers, the model's storage footprint is reduced by approximately 75%, allowing complex models to fit within the 256 KB Flash of the Renesas RA4M1 microcontroller used in this project.

==== Quantization-Aware Training (QAT)

While PTQ is efficient, it can introduce quantization noise that degrades classification accuracy. Quantization-Aware Training (QAT) addresses this by simulating the effects of quantization during the training process itself. This allows the network to adapt its weights to the lower-precision representation, often resulting in higher accuracy than PTQ, particularly for highly compressed models @meleti2024obscured.

=== Performance Optimization and Latency Reduction

Beyond memory savings, quantization significantly enhances inference speed. Microcontrollers like the Renesas RA4M1 feature specialized instructions (e.g., SIMD - Single Instruction, Multiple Data) that can process multiple integer operations in a single clock cycle. By utilizing these instructions, an INT8-quantized model can achieve a 2x to 4x reduction in inference latency compared to its floating-point counterpart, which is critical for meeting the < 100ms real-time response target for fire detection @perez2023tinyml.

=== Pruning and Architectural Compression

Complementary to quantization, pruning involves removing redundant or near-zero weights from the network, effectively "thinning" the model architecture. This reduces the number of multiply-accumulate (MAC) operations required for inference, further decreasing power consumption and latency @meleti2024obscured. For autonomous nodes, these optimizations ensure that the system can maintain high-frequency sampling (10 Hz) while simultaneously performing local inference without exhausting the device's resources.
