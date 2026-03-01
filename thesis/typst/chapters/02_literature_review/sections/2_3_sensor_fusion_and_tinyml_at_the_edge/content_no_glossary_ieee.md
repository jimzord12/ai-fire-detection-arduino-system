# Sensor Fusion and TinyML at the Edge

## 2.3.1 Review of Fusion Techniques (Kalman, Bayesian, Neural Networks)

Sensor fusion is a crucial methodology in modern sensing systems, enabling robust and accurate environmental perception by combining data from multiple disparate sensors. Its primary goal is to overcome the limitations of individual sensors, such as noise, inaccuracies, or limited coverage, by leveraging complementary information [1]. Various techniques have emerged to address the challenges of integrating diverse sensor outputs, ranging from statistical approaches to advanced machine learning models.

One of the most widely adopted sensor fusion techniques is the **Kalman filter**. Developed in the 1960s, it is an optimal estimation algorithm that processes a series of measurements observed over time, containing noise and other inaccuracies, to produce estimates of unknown variables that tend to be more precise than those based on a single measurement alone [2]. The Kalman filter operates in two steps: prediction and update. It predicts the current state based on the previous state and a system model, then updates this prediction using current measurements, minimizing the mean square error. Its linear nature and computational efficiency make it suitable for real-time applications where sensor readings exhibit Gaussian noise, particularly in tracking and navigation systems [3]. Extended Kalman Filters [4]. This framework is particularly adept at handling uncertainty and making decisions in complex environments where dependencies between variables can be explicitly modeled. Bayesian fusion is robust to missing data and can integrate qualitative and quantitative information, making it suitable for high-level decision-making processes in autonomous systems, including fault diagnosis and target recognition [5].

More recently, **Neural Networks [6]. Multi-layer perceptrons (MLPs), Convolutional Neural Networks (CNNs) for spatial features, and Recurrent Neural Networks [7].

## 2.3.2 Current State of TinyML on Microcontrollers (Latency, Quantization)

TinyML represents a rapidly evolving field focused on deploying machine learning models on extremely resource-constrained devices, such as microcontrollers [8]. The current state of TinyML on microcontrollers is characterized by significant advancements in model optimization, specialized hardware, and development frameworks.

**Latency** is a critical metric for TinyML applications, especially in time-sensitive domains like fire detection. On microcontrollers, inference latency is primarily influenced by the model's complexity (number of layers, parameters, operations), the MCU's processing power (CPU clock speed, presence of DSP/FPU units), and memory bandwidth. Modern MCUs, such as the Renesas RA4M1 found in the Arduino UNO R4 WiFi, incorporate hardware accelerators that significantly reduce inference times for common ML operations [9]. Frameworks like TensorFlow Lite Micro (TFLu) are optimized for these constraints, ensuring that models can execute within milliseconds or microseconds, meeting real-time requirements for rapid anomaly detection (TensorFlow, n.d.).

**Quantization** is arguably the most impactful optimization technique in TinyML, directly addressing the memory and computational constraints of microcontrollers. Most machine learning models are trained using 32-bit floating-point numbers. Quantization reduces the precision of these numbers (e.g., to 8-bit integers, int8) without significant loss of accuracy [10]. This conversion dramatically decreases model size, memory footprint, and computational intensity, as integer arithmetic is much faster and more energy-efficient on MCUs than floating-point operations. Post-training quantization [11]. The judicious application of quantization enables complex neural network architectures to fit within kilobytes of RAM and execute efficiently on even low-power MCUs, making TinyML a viable solution for pervasive intelligence.


Castanedo, F. (2013). A review of data fusion techniques. *The Scientific World Journal, 2013*.

Durrant-Whyte, H., & Henderson, T. (2004). *Multisensor Data Fusion*. Springer.

Intelligent Fire Detection Systems Using Deep Learning and Multi-Sensor Data Fusion. (2025). *Journal Name*, *Volume*(Issue), pages. (Note: Full reference details were not provided in the search result for this paper. Placeholder used.)

Kalman, R. E. (1960). A new approach to linear filtering and prediction problems. *Transactions of the ASME—Journal of Basic Engineering, 82*(Series D), 35–45.

LeCun, Y., Bengio, Y., & Hinton, G. (2015). Deep learning. *Nature, 521*(7553), 436–444.

Nekhil, R. (2023). *Fire detection using sensor fusion and TinyML – Arduino Nano 33 BLE Sense*. Edge Impulse Expert Network.

Pearl, J. (1988). *Probabilistic Reasoning in Intelligent Systems: Networks of Plausible Inference*. Morgan Kaufmann.

Quantization Strategy. (2023). *Journal Name*, *Volume*(Issue), pages. (Note: Full reference details were not provided in the search result for this paper. Placeholder used.)

TensorFlow. (n.d.). *TensorFlow Lite Micro*. Retrieved from [https://www.tensorflow.org/lite/micro](https://www.tensorflow.org/lite/micro)

Warden, P., & Situnayake, D. (2019). *TinyML: Machine Learning with TensorFlow Lite on Arduino and Ultra-Low-Power Microcontrollers*. O'Reilly Media.

Welch, G., & Bishop, G. (2006). *An Introduction to the Kalman Filter*. University of North Carolina at Chapel Hill, Department of Computer Science.

### References

- [1] UNKNOWN (APA - No Full Match): (Castanedo, 2013)
- [2] UNKNOWN (APA - No Full Match): (Kalman, 1960)
- [3] UNKNOWN (APA - No Full Match): (Welch & Bishop, 2006)
- [4] UNKNOWN (APA - No Full Match): (EKF) and Unscented Kalman Filters (UKF) extend this concept to non-linear systems, although with increased computational complexity.

**Bayesian networks** offer a probabilistic graphical model for representing and reasoning about uncertain knowledge. In sensor fusion, Bayesian approaches combine evidence from multiple sensors by updating prior probabilities with likelihoods derived from sensor readings, yielding a posterior probability distribution over possible states (Pearl, 1988)
- [5] UNKNOWN (APA - No Full Match): (Durrant-Whyte & Henderson, 2004)
- [6] UNKNOWN (APA - No Full Match): (NNs)** have gained significant traction as a powerful sensor fusion technique, particularly with the rise of deep learning. NNs can learn complex, non-linear relationships between raw sensor data and desired outputs, circumventing the need for explicit system models or assumptions about noise distributions (LeCun et al., 2015)
- [7] UNKNOWN (APA - No Full Match): (RNNs) for temporal dependencies are employed to create an end-to-end fusion architecture. NNs excel in scenarios with high-dimensional data, heterogeneous sensors, and the need for adaptive learning, offering superior performance in classification and regression tasks compared to traditional methods when sufficient training data is available (Intelligent Fire Detection Systems, 2025)
- [8] UNKNOWN (APA - No Full Match): (MCUs). This paradigm shift brings intelligence directly to the edge, minimizing latency, enhancing privacy, and reducing power consumption by obviating the need for continuous cloud connectivity (Warden & Situnayake, 2019)
- [9] UNKNOWN (APA - No Full Match): (Nekhil, 2023)
- [10] UNKNOWN (APA - No Full Match): (Jacob et al., 2018)
- [11] UNKNOWN (APA - No Full Match): (PTQ) and quantization-aware training (QAT) are common approaches, with QAT often yielding better accuracy by simulating quantization effects during the training process (Quantization Strategy, 2023)