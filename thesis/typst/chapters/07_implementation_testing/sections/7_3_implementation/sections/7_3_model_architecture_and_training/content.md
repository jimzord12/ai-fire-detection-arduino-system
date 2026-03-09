# 7.3 Model Architecture and Training

This section describes the neural network topology designed for three-class fire event classification and documents the hyperparameter tuning process conducted within the Edge Impulse platform. The goal is to arrive at a compact, Cortex-M4-compatible model that reliably discriminates between _fire_, _no_fire_, and _false_alarm_ while satisfying the on-device inference budget of less than 100 ms.

---

## 7.3.1 Neural Network Topology Design

The classification model follows a fully connected, feed-forward architecture — commonly referred to as a multi-layer perceptron (MLP) — operating on the spectral feature vector produced by the DSP block described in Section 7.2. This architectural choice is well-motivated by the structured, tabular nature of the fused sensor feature space: because the input consists of pre-computed spectral statistics rather than raw spatial data, convolutional or recurrent layers would introduce unnecessary parameter overhead without proportional accuracy gains on resource-constrained hardware (Alajlan & Ibrahim, 2022). The primary constraint imposed by the Renesas RA4M1 target (256 KB SRAM, 1 MB Flash) necessitates that the model's weight footprint remain well under the available Flash budget after the Edge Impulse runtime overhead is accounted for (Alajlan & Ibrahim, 2022).

The selected topology consists of three dense layers. The input layer receives the flattened spectral feature vector; two hidden layers apply non-linear transformations; and the output layer applies a Softmax activation to produce calibrated class probabilities across the three target classes (_fire_, _no_fire_, _false_alarm_). The Rectified Linear Unit (ReLU) activation function is used for all hidden layers. ReLU is preferred over sigmoid or tanh activations in shallow embedded networks because it mitigates the vanishing gradient problem during backpropagation and reduces inference computational cost, as ReLU requires only a threshold comparison rather than an exponential evaluation (Li et al., 2022). A Dropout layer is inserted after each hidden layer to act as a regulariser during training; dropout has been shown empirically to stabilise training curves and prevent co-adaptation of neurons, particularly in small-sample regimes typical of laboratory-collected sensor datasets (Li et al., 2022).

The output layer uses Softmax normalisation, which converts raw logit scores into probability distributions that sum to unity. This is particularly valuable in a safety-critical detection context because the softmax output directly supports confidence-threshold gating in the post-processing logic described in Section 7.5: an alarm is only escalated when the _fire_ class probability exceeds a defined threshold, rather than relying solely on an argmax decision (Xiao et al., 2023). The three-class formulation is an architectural deliberate departure from binary fire/no-fire paradigms; prior work on multi-sensor indoor fire perception has demonstrated that distinguishing smouldering and false-alarm-inducing scenarios as separate classes systematically improves overall classification accuracy compared with two-class approaches (Li et al., 2022).

---

## 7.3.2 Hyperparameter Tuning Results

Hyperparameter optimisation was conducted iteratively using the Edge Impulse Neural Network (Keras) learning block. The parameters explored include the number of hidden layers and neurons per layer, learning rate, dropout rate, and the number of training epochs. The Adam optimiser was selected throughout all trials. Adam (Adaptive Moment Estimation) computes per-parameter adaptive learning rates from the first and second moments of the gradient, which has consistently demonstrated faster convergence and superior generalisation compared to vanilla stochastic gradient descent in classification tasks on small tabular datasets (Xiao et al., 2023).

The neuron count per hidden layer represents the primary trade-off between representational capacity and model size. Drawing on empirical findings in multi-sensor fire classification, which show that networks that are simultaneously too wide and too deep yield diminishing accuracy gains and inflate inference latency, whereas overly shallow networks suffer from insufficient feature separation (Li et al., 2022), a sweep over hidden layer sizes was conducted. Configurations tested spanned 16, 32, and 64 neurons in each hidden layer. The final configuration retaining the best validation accuracy without exceeding the RAM budget was selected.

The learning rate was initialised at 0.0005. An excessively large learning rate risks divergence in the final training epochs, while an excessively small rate prolongs convergence without necessarily improving the generalisation bound; the value 0.0005 lies within the range reported as effective for Adam-optimised shallow MLPs on sensor-fusion classification problems (Xiao et al., 2023). Training was conducted for 100 cycles (epochs) with a batch size of 32. Dropout was set to 0.25 in all hidden layers, a conservative value that prevents overfitting without excessively increasing effective training time. The combination of dropout regularisation and the Adam optimiser was used in the three-class TCN-based fire perception study by Li et al. (2022), who reported an overall accuracy of 97.49% on NIST residential fire data, providing a reference point for the effectiveness of this optimisation strategy on comparable multi-class sensor data.

The table below summarises the final hyperparameter configuration:

| Hyperparameter           | Value                     |
| ------------------------ | ------------------------- |
| Hidden layers            | 2                         |
| Neurons per hidden layer | 32                        |
| Activation (hidden)      | ReLU                      |
| Output activation        | Softmax                   |
| Dropout rate             | 0.25                      |
| Optimiser                | Adam                      |
| Learning rate            | 0.0005                    |
| Training cycles (epochs) | 100                       |
| Batch size               | 32                        |
| Loss function            | Categorical cross-entropy |

The model was trained and validated using the train/test split managed by Edge Impulse. Upon completion of training, validation accuracy and loss were recorded, together with the per-class F1 score and the confusion matrix, which were used to verify that no single class dominated the training signal — a concern in imbalanced sensor datasets where the _false_alarm_ class may be underrepresented relative to the _no_fire_ class (Alajlan & Ibrahim, 2022). The three-class design also serves the broader goal identified in the literature of reducing nuisance alarms: Xiao et al. (2023) showed that incorporating distinct smoulder and false-positive classes in the classification target improves early warning reliability, achieving over 96% accuracy across multiple fire material types in an in-building evaluation.

---

## References

Alajlan, N. N., & Ibrahim, D. M. (2022). TinyML: Enabling of inference deep learning models on ultra-low-power IoT edge devices for AI applications. _Micromachines_, _13_(6), 851. https://doi.org/10.3390/mi13060851

Li, Y., Su, Y., Zeng, X., & Wang, J. (2022). Research on multi-sensor fusion indoor fire perception algorithm based on improved TCN. _Sensors_, _22_(12), 4550. https://doi.org/10.3390/s22124550

Xiao, S., Wang, S., Ge, L., Weng, H., Fang, X., Peng, Z., & Zeng, W. (2023). Hybrid feature fusion-based high-sensitivity fire detection and early warning for intelligent building systems. _Sensors_, _23_(2), 859. https://doi.org/10.3390/s23020859
