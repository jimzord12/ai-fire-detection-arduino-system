# 3.6 Model Quantization and Optimization for Resource-Constrained Devices

The deployment of neural network classifiers on embedded microcontrollers such as the Renesas RA4M1 (Cortex-M4) imposes strict memory and computational budgets that full-precision floating-point models cannot satisfy without optimization. Model quantization and related compression techniques reduce the arithmetic precision and parameter count of trained networks, enabling inference within the kilobyte-scale RAM and Flash constraints typical of ultra-low-power MCUs. This section examines the principal optimization strategies relevant to TinyML deployment: post-training quantization (PTQ), quantization-aware training (QAT), network pruning, and knowledge distillation.

## 3.6.1 Motivation: Resource Constraints of Cortex-M4 Microcontrollers

Microcontrollers targeted for TinyML deployment typically offer between 16 KB and 256 KB of SRAM and 256 KB to 1 MB of Flash memory, with no hardware support for 64-bit or even 32-bit floating-point arithmetic in the most constrained variants (Abadade et al., 2023). The Arduino UNO R4 WiFi's RA4M1 core provides 32 KB of SRAM and 256 KB of Flash, placing it squarely within the category of devices that require aggressive model compression before any neural network inference is feasible. A standard single-hidden-layer fully connected network with 32-bit float (FP32) weights occupying 50 KB of parameter storage would consume the entire Flash budget before accounting for the inference engine, firmware, or sensor-driver code (Capogrosso et al., 2023). Furthermore, floating-point multiply-accumulate (MAC) operations on a Cortex-M4 without FPU acceleration incur substantially higher clock cycles per operation than equivalent 8-bit integer arithmetic, directly translating into longer inference latency and greater energy consumption per classification cycle (David et al., 2021).

The consequence is that model optimization is not merely a performance enhancement but a prerequisite for deployment. Quantization reduces both the storage footprint and the computational cost of inference by replacing high-precision numerical representations with lower-precision alternatives, while compression techniques such as pruning and knowledge distillation reduce the number of parameters that must be stored and evaluated altogether (Suwannaphong et al., 2025).

## 3.6.2 Post-Training Quantization: Float32 to Int8

Post-training quantization (PTQ) is the most widely adopted compression strategy in TinyML workflows because it requires no modification to the training procedure and can be applied directly to a converged FP32 model (Abadade et al., 2023). The core operation maps each FP32 weight or activation value \( r \) to an integer representation \( q \) according to:

\[ q = \text{round}\!\left(\frac{r}{s}\right) + z \]

where \( s \) is a floating-point scale factor and \( z \) is an integer zero-point that aligns the real-valued zero with the quantized range (Suwannaphong et al., 2025). For 8-bit integer (INT8) quantization, \( q \) ranges over \([-128, 127]\) for signed or \([0, 255]\) for unsigned representations. This substitution reduces per-parameter storage from 4 bytes to 1 byte, yielding a theoretical 4× reduction in model size and a commensurate reduction in the memory bandwidth required during inference (Capogrosso et al., 2023).

In practice, the scale and zero-point parameters are determined during a calibration pass in which a representative subset of the training data is fed through the model to record the dynamic range of each layer's activations. Full-integer PTQ, as implemented in the TensorFlow Lite converter, quantizes both weights and activations to INT8, enabling the inference engine to execute entirely in integer arithmetic and removing the need for any floating-point hardware (David et al., 2021). On Cortex-M4 targets, this results in measurable latency reductions: benchmarks reported in the TensorFlow Lite Micro (TFLM) evaluation demonstrate that INT8 inference can be 2–4× faster than FP32 on ARM cores lacking a double-precision FPU, while the model size reduction is consistent at approximately 75% (David et al., 2021).

The principal risk associated with PTQ is accuracy degradation, particularly in layers whose weight or activation distributions exhibit high kurtosis or significant outliers. For fire detection classifiers whose feature space includes heterogeneous sensor readings (gas concentrations spanning several orders of magnitude alongside normalized temperature and humidity values), careful per-channel quantization—where independent scale and zero-point values are assigned to each output channel of a convolutional or dense layer—is preferred over per-tensor quantization to preserve inter-channel dynamic range (Abadade et al., 2023).

## 3.6.3 Quantization-Aware Training

When PTQ introduces unacceptable accuracy loss, quantization-aware training (QAT) offers a superior alternative by simulating quantization noise during the forward pass of training itself (Capogrosso et al., 2023). Fake quantization nodes are inserted after each weight and activation tensor; during the forward pass, values are rounded to the nearest representable integer and then cast back to floating point for gradient computation. The model thereby learns weight distributions that are inherently tolerant of low-precision representation, and the resulting INT8 model retains significantly more of the FP32 baseline accuracy than PTQ alone (Capogrosso et al., 2023). QAT is particularly beneficial for three-class classifiers where the decision boundaries between _fire_, _no_fire_, and _false_alarm_ are closely spaced in feature space and small representation errors could cause misclassification between safety-critical and benign outcomes.

## 3.6.4 Pruning and Knowledge Distillation as Complementary Strategies

Beyond quantization, two further compression approaches are relevant to the present deployment context. **Structured pruning** eliminates entire neurons, filters, or layers whose contribution to output accuracy falls below a threshold, reducing both parameter count and inference latency without requiring sparse-matrix hardware support (Abadade et al., 2023). Unstructured pruning removes individual weights, producing sparse matrices that require specialized runtime support to realize computational savings and is therefore less suited to constrained MCU deployments (Capogrosso et al., 2023).

**Knowledge distillation** follows a teacher–student paradigm in which a large, high-accuracy teacher network supervises the training of a compact student network by providing soft probability targets in addition to the hard ground-truth labels (Suwannaphong et al., 2025). The student network optimizes a combined loss:

\[ \mathcal{L} = (1 - \alpha)\,\mathcal{L}_{\text{CE}}(\hat{y},\, y) + \alpha\,\mathcal{L}_{\text{KD}}(\hat{y}\_s,\, \hat{y}\_t) \]

where \( \mathcal{L}_{\text{CE}} \) is the standard cross-entropy loss against ground-truth labels \( y \), \( \mathcal{L}_{\text{KD}} \) measures the divergence between the student output \( \hat{y}\_s \) and the teacher output \( \hat{y}\_t \), and \( \alpha \) is a weighting hyperparameter (Suwannaphong et al., 2025). Experimental results on MCU-targeted architectures demonstrate that knowledge distillation can match the accuracy of larger teacher models within a 64 KB RAM budget, making it a viable path for achieving high classification accuracy under the RA4M1's constraints without sacrificing the three-class discrimination capability central to this project (Suwannaphong et al., 2025).

## 3.6.5 The Edge Impulse Quantization Pipeline

Within the Edge Impulse platform employed in this project, model optimization is integrated directly into the deployment workflow. After training, the platform automatically applies full-integer PTQ using the TensorFlow Lite converter, generating an INT8-quantized `.tflite` model that is subsequently wrapped in a C++ library compatible with the Arduino build environment (David et al., 2021). The platform reports per-layer accuracy loss between the FP32 and INT8 variants, enabling selective retention of FP32 precision in sensitive layers. The final deliverable is a compiled library exposing a statically allocated inference object, ensuring that all model weights reside in Flash and all intermediate activation buffers are allocated from a pre-defined arena in SRAM, with no dynamic heap allocation at runtime (David et al., 2021). This design pattern is a direct consequence of the memory-safety requirements of bare-metal embedded systems, where heap fragmentation would otherwise compromise the stability of long-running autonomous detection nodes.

Collectively, INT8 PTQ remains the primary optimization strategy for this deployment due to its zero-retraining overhead and native support in the Edge Impulse pipeline, with QAT reserved as a fallback strategy should post-quantization accuracy on the three-class task fall below acceptable thresholds established during model evaluation (Abadade et al., 2023; Capogrosso et al., 2023).

---

## References

- Abadade, Y., Temouden, A., Bamoumen, H., Benamar, N., Chtouki, Y., & Hafid, A. S. (2023). A comprehensive survey on TinyML. _IEEE Access_, _11_, 96892–96922. https://doi.org/10.1109/ACCESS.2023.3294111

- Capogrosso, L., Fraccaroli, E., Fummi, F., & Quaglia, D. (2023). _A machine learning-oriented survey on tiny machine learning_ (arXiv:2309.11932). arXiv. https://doi.org/10.48550/arXiv.2309.11932

- David, R., Duke, J., Jain, A., Janapa Reddi, V., Jeffries, N., Li, J., Kreeger, N., Navia, I., Regev, S., Rhodes, R., Wang, T., Warden, P., & Rhodes, R. (2021). TensorFlow Lite Micro: Embedded machine learning for TinyML systems. _Proceedings of Machine Learning and Systems_, _3_, 800–811. https://arxiv.org/abs/2010.08678

- Suwannaphong, T., Jovan, F., Craddock, I., & McConville, R. (2025). Optimising TinyML with quantization and distillation of transformer and Mamba models for indoor localisation on edge devices. _Scientific Reports_, _15_, Article 10081. https://doi.org/10.1038/s41598-025-94205-9

---

## Glossary

- **Post-Training Quantization (PTQ):** A model compression technique that reduces the numerical precision of a trained model's weights and activations after training is complete, without requiring retraining.
- **Quantization-Aware Training (QAT):** A training procedure that simulates quantization effects during the forward pass, producing models whose weight distributions are intrinsically robust to low-precision representation.
- **INT8:** 8-bit signed integer representation; the standard target precision for TinyML inference on Cortex-M microcontrollers.
- **Knowledge Distillation (KD):** A compression paradigm in which a compact "student" network is trained to replicate the output distribution of a larger "teacher" network.
- **Structured Pruning:** A neural network compression method that removes entire neurons, filters, or layers, enabling inference speedup without specialized sparse-matrix hardware.
- **Scale factor (_s_):** A floating-point multiplier used in quantization to map the continuous dynamic range of a tensor to its discrete integer representation.
- **Zero-point (_z_):** An integer offset in quantization that ensures the real value zero is exactly representable in the quantized domain.
- **TensorFlow Lite Micro (TFLM):** An open-source inference framework from Google designed to execute quantized deep learning models on MCUs with kilobyte-scale memory.
