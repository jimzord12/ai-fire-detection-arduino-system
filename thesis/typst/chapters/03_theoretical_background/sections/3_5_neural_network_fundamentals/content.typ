== Neural Network Fundamentals for Classification

Artificial Neural Networks (ANNs), specifically Multi-Layer Perceptrons (MLPs), provide the mathematical framework for performing non-linear classification on multi-modal sensor data. In the context of an autonomous fire detection node, the MLP serves as the "inference engine" that maps a vector of engineered features—derived from smoke, gas, IR, and environmental sensors—to one of three discrete classes: fire, no_fire, or false_alarm. This section outlines the fundamental components and operational principles of neural networks as applied to this classification task.

=== The Artificial Neuron and Layered Architecture

The fundamental building block of an ANN is the artificial neuron, a computational unit that models the weighted summation of inputs followed by a non-linear activation. For a given input vector $x$, the neuron computes an output $y$ as:

$y = sigma(sum_(i=1)^n w_i x_i + b)$

where $w_i$ represents the synaptic weights, $b$ is the bias term, and $sigma$ is the activation function @sailesh2022novel. In an MLP, these neurons are organized into a structured hierarchy consisting of an input layer, one or more hidden layers, and an output layer. The hidden layers enable the network to learn complex, high-dimensional decision boundaries that are inaccessible to linear classifiers @pathan2024multisensory.

=== Activation Functions: ReLU and Softmax

Activation functions introduce the non-linearity necessary for the network to approximate complex functions.

- *Rectified Linear Unit (ReLU)*: In the hidden layers, the ReLU function, defined as $f(x) = max(0, x)$, is commonly employed. ReLU is computationally efficient for TinyML applications as it involves only a simple thresholding operation, and it mitigates the vanishing gradient problem during training @sailesh2022novel.
- *Softmax*: For multi-class classification, the output layer typically utilizes the Softmax activation function. Softmax squashes a vector of $K$ real values into a probability distribution consisting of $K$ probabilities proportional to the exponentials of the input numbers. This allows the autonomous node to interpret the model's output as the confidence or probability of each class (fire, no_fire, or false_alarm) @wang2023fire.

=== Training via Backpropagation and Gradient Descent

The process of "learning" in a neural network involves adjusting the weights and biases to minimize a predefined loss function. For a three-class classification problem, the Categorical Cross-Entropy loss is typically used, which measures the dissimilarity between the predicted probability distribution and the ground-truth one-hot encoded labels @pathan2024multisensory.

Optimization is achieved through Backpropagation, an algorithm that calculates the gradient of the loss function with respect to each weight by applying the chain rule of calculus. These gradients are then used by an optimizer, such as Adam or Stochastic Gradient Descent (SGD), to iteratively update the weights in the direction that reduces the loss @meleti2024obscured. In TinyML workflows, this training is performed on a resource-rich machine (e.g., via the Edge Impulse platform) before the optimized, frozen model is deployed for inference on the microcontroller.

=== Non-Linear Multi-Class Discrimination

The strength of the MLP in fire detection lies in its ability to identify cross-modal correlations. While a simple heuristic might fail to distinguish cooking fumes from smoke, a trained MLP can learn that a rise in VOCs accompanied by stable CO levels and the absence of IR flicker most likely represents a false alarm @wang2023fire. This capacity for non-linear discrimination is what enables the autonomous node to achieve high precision and a low false-alarm rate across diverse environmental scenarios.
