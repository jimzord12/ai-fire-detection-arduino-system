The deployment of deep learning models on resource-constrained microcontrollers, such as the ARM Cortex-M4, necessitates specialized optimization techniques to overcome severe limitations in memory (RAM), storage (Flash), and computational power. Model quantization and architectural optimization are the primary strategies used to bridge the gap between high-performance neural networks and the "edge" environment. This section examines the theoretical foundations of quantization and its impact on the performance of autonomous sensing nodes.

## Principles of Neural Network Quantization

Quantization is the process of mapping continuous, high-precision floating-point values (typically 32-bit Float) to a discrete, lower-precision set of values (e.g., 8-bit Integer). In a neural network, this transformation is applied to both the weights and the activations.

### Post-Training Quantization (PTQ)

Post-Training Quantization is a common TinyML optimization technique where a pre-trained floating-point model is converted to a fixed-point representation using a representative dataset to calibrate the dynamic range of activations. For an 8-bit integer (INT8) quantization, the mapping is defined as:

$q = 	ext{round}\left(\frac{r}{S} + Zight)$

where $r$ is the real value, $S$ is a scaling factor, and $Z$ is the zero-point offset (Perez et al., 2023). By converting weights from 4-byte floats to 1-byte integers, the model's storage footprint is reduced by approximately 75%, allowing complex models to fit within the 256 KB Flash of the Renesas RA4M1 microcontroller used in this project.

### Quantization-Aware Training (QAT)

While PTQ is efficient, it can introduce quantization noise that degrades classification accuracy. Quantization-Aware Training (QAT) addresses this by simulating the effects of quantization during the training process itself. This allows the network to adapt its weights to the lower-precision representation, often resulting in higher accuracy than PTQ, particularly for highly compressed models (Meleti & Tsanakas, 2024).

## Performance Optimization and Latency Reduction

Beyond memory savings, quantization significantly enhances inference speed. Microcontrollers like the Renesas RA4M1 feature specialized instructions (e.g., SIMD - Single Instruction, Multiple Data) that can process multiple integer operations in a single clock cycle. By utilizing these instructions, an INT8-quantized model can achieve a 2x to 4x reduction in inference latency compared to its floating-point counterpart, which is critical for meeting the <100ms real-time response target for fire detection (Perez et al., 2023).

## Pruning and Architectural Compression

Complementary to quantization, pruning involves removing redundant or near-zero weights from the network, effectively "thinning" the model architecture. This reduces the number of multiply-accumulate (MAC) operations required for inference, further decreasing power consumption and latency (Meleti & Tsanakas, 2024). For autonomous nodes, these optimizations ensure that the system can maintain high-frequency sampling (10 Hz) while simultaneously performing local inference without exhausting the device's resources.

## References

Meleti, E., & Tsanakas, J. A. (2024). Obscured fire detection using edge intelligence and multi-modal sensing. *Sensors*, 24(5), 1532.

Perez, J., et al. (2023). TinyML for real-time fire detection at the edge. *IEEE Access*, 11, 89021-89035.

## Glossary

**Quantization**: The process of approximating a continuous signal by a set of discrete symbols or integer values.
**Post-Training Quantization (PTQ)**: A technique to convert a pre-trained floating-point model to a quantized model with minimal accuracy loss.
**Quantization-Aware Training (QAT)**: A method where the model is trained with quantization effects in the loop to improve accuracy in low-precision deployments.
**SIMD (Single Instruction, Multiple Data)**: A type of parallel processing that allows one instruction to be applied to multiple data points simultaneously.
