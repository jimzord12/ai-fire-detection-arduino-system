== Model Architecture and Training

This section describes the neural network topology designed for three-class fire event classification and documents the hyperparameter tuning process conducted within the Edge Impulse platform. The goal is to arrive at a compact, Cortex-M4-compatible model that reliably discriminates between fire, no_fire, and false_alarm while satisfying the on-device inference budget of less than 100 ms.

=== Neural Network Topology Design

The classification model follows a fully connected, feed-forward architecture — commonly referred to as a multi-layer perceptron (MLP) — operating on the spectral feature vector produced by the DSP block. This architectural choice is well-motivated by the structured, tabular nature of the fused sensor feature space: because the input consists of pre-computed spectral statistics rather than raw spatial data, convolutional or recurrent layers would introduce unnecessary parameter overhead without proportional accuracy gains on resource-constrained hardware @alajlan2022tinyml. The primary constraint imposed by the target necessitates that the model's weight footprint remain well under the available Flash budget.

The selected topology consists of three dense layers. The input layer receives the flattened spectral feature vector; two hidden layers apply non-linear transformations; and the output layer applies a Softmax activation to produce calibrated class probabilities across the three target classes. The Rectified Linear Unit (ReLU) activation function is used for all hidden layers. ReLU is preferred over sigmoid or tanh activations in shallow embedded networks because it mitigates the vanishing gradient problem during backpropagation and reduces inference computational cost @li2022research. A Dropout layer is inserted after each hidden layer to act as a regulariser during training; dropout has been shown empirically to stabilise training curves and prevent co-adaptation of neurons @li2022research.

The output layer uses Softmax normalisation, which converts raw logit scores into probability distributions that sum to unity. This is particularly valuable in a safety-critical detection context because the softmax output directly supports confidence-threshold gating: an alarm is only escalated when the fire class probability exceeds a defined threshold, rather than relying solely on an argmax decision @xiao2023hybrid. The three-class formulation is a deliberate departure from binary fire/no-fire paradigms; prior work has demonstrated that distinguishing smouldering and false-alarm-inducing scenarios as separate classes systematically improves overall classification accuracy @li2022research.

=== Hyperparameter Tuning Results

Hyperparameter optimisation was conducted iteratively using the Edge Impulse platform. The parameters explored include the number of hidden layers and neurons per layer, learning rate, dropout rate, and the number of training epochs. The Adam optimiser was selected throughout all trials. Adam computes per-parameter adaptive learning rates, which has consistently demonstrated faster convergence and superior generalisation compared to vanilla stochastic gradient descent in classification tasks on small tabular datasets @xiao2023hybrid.

The neuron count per hidden layer represents the primary trade-off between representational capacity and model size. Drawing on empirical findings in multi-sensor fire classification, configurations tested spanned 16, 32, and 64 neurons in each hidden layer. The final configuration retaining the best validation accuracy without exceeding the RAM budget was selected.

The learning rate was initialised at 0.0005. An excessively large learning rate risks divergence, while an excessively small rate prolongs convergence; the value 0.0005 lies within the range reported as effective for Adam-optimised shallow MLPs on sensor-fusion problems @xiao2023hybrid. Training was conducted for 100 cycles (epochs) with a batch size of 32. Dropout was set to 0.25 in all hidden layers, a conservative value that prevents overfitting. The combination of dropout regularisation and the Adam optimiser was reported as effective in similar multi-class sensor data studies @li2022research.

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

The model was trained and validated using the train/test split managed by Edge Impulse. Upon completion of training, validation accuracy and loss were recorded, together with the per-class F1 score and the confusion matrix, which were used to verify that no single class dominated the training signal @alajlan2022tinyml. The three-class design also serves the broader goal of reducing nuisance alarms: research showed that incorporating distinct smoulder and false-positive classes in the classification target improves early warning reliability, achieving over 96% accuracy across multiple fire material types @xiao2023hybrid.
