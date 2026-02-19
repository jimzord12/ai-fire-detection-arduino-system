# 3.5 Neural Network Fundamentals for Classification

The classification of complex, multi-dimensional sensor data into discrete categories—such as _fire_, _no_fire_, and _false_alarm_—requires a computational model capable of learning nonlinear decision boundaries from high-dimensional feature vectors. Artificial neural networks (ANNs), and in particular the multilayer perceptron (MLP), provide the theoretical and algorithmic foundation for this task. This section presents the core architectural and mathematical principles of feedforward neural networks as they apply to the three-class fire detection problem addressed in this thesis.

## 3.5.1 Feedforward Network Architecture

A feedforward neural network, or multilayer perceptron (MLP), organises its computational units into an ordered sequence of layers: an input layer that receives the feature vector, one or more hidden layers that perform nonlinear transformations, and an output layer that produces class probability estimates (Goodfellow et al., 2016). Each neuron in layer \(l\) computes a weighted sum of its inputs and applies a nonlinear activation function \(\sigma\), yielding an output:

\[a^{(l)} = \sigma\!\left(W^{(l)}\, a^{(l-1)} + b^{(l)}\right)\]

where \(W^{(l)}\) is the weight matrix and \(b^{(l)}\) is the bias vector for layer \(l\) (Goodfellow et al., 2016). Without a nonlinear activation function, the composition of multiple linear layers collapses to a single linear transformation, eliminating the network's capacity to approximate complex functions (Goodfellow et al., 2016). In the context of fire detection, the input layer encodes the multi-sensor feature vector—comprising statistical moments and spectral descriptors derived from smoke, VOC, CO, IR flame, and temperature/humidity readings—while the hidden layers learn abstract intermediate representations that discriminate between combustion events and false-alarm stimuli.

The Rectified Linear Unit (ReLU), defined as \(\sigma(z) = \max(0, z)\), is the predominant activation function for hidden layers because it avoids vanishing-gradient effects that impede the training of deep networks (Goodfellow et al., 2016). For the output layer of a three-class classifier, the **softmax** function maps the raw logit vector \(\mathbf{z} \in \mathbb{R}^K\) to a proper probability distribution over \(K = 3\) classes:

\[\hat{p}_k = \frac{e^{z_k}}{\sum_{j=1}^{K} e^{z_j}}, \quad k \in \{\text{fire},\, \text{no_fire},\, \text{false_alarm}\}\]

This formulation ensures that the network outputs are non-negative, sum to unity, and can be interpreted as posterior class probabilities given the observed feature vector (Goodfellow et al., 2016).

## 3.5.2 Training by Backpropagation

Network parameters are learned by minimising a loss function \(\mathcal{L}\) over a labelled training dataset \(\{(\mathbf{x}_i, y_i)\}_{i=1}^{N}\). For multi-class classification, the standard choice is categorical cross-entropy loss:

\[\mathcal{L} = -\frac{1}{N}\sum*{i=1}^{N}\sum*{k=1}^{K} y*{ik}\log\hat{p}*{ik}\]

where \(y*{ik} \in \{0, 1\}\) is the one-hot encoded ground-truth label and \(\hat{p}*{ik}\) is the predicted probability for class \(k\) and sample \(i\) (Goodfellow et al., 2016). Minimisation proceeds via gradient descent; the gradient \(\partial \mathcal{L}/\partial W^{(l)}\) is computed efficiently by the **backpropagation** algorithm, which applies the chain rule layer-by-layer from the output toward the input (Goodfellow et al., 2016). In practice, mini-batch stochastic gradient descent (SGD) or adaptive optimisers such as Adam are employed to accelerate convergence and escape shallow local minima.

Regularisation strategies are essential to prevent overfitting, particularly when labelled fire datasets are limited in size. Dropout—randomly zeroing a fraction of neuron activations during training—forces the network to learn redundant representations and acts as an implicit ensemble of smaller networks (Goodfellow et al., 2016). Weight decay (L2 regularisation) penalises large parameter magnitudes, biasing the model toward smoother decision boundaries. For the fire/no_fire/false_alarm problem, overfitting is a practical concern because the false-alarm class encompasses a diverse range of stimuli (cooking fumes, alcohol vapours, intense IR illumination), and generalisation to unseen nuisance sources depends critically on adequate regularisation.

## 3.5.3 Multi-Class Classification in Fire Detection Applications

The suitability of MLP-based classifiers for sensor-based fire detection has been empirically validated in recent literature. Vorwerk et al. (2024) demonstrated that a neural network trained on multi-sensor node data—including CO, H₂, VOC, and particulate matter measurements—could classify four distinct incipient fire scenarios in a standard EN 54 test room, achieving a mean classification rate of 87% with a Cohen's κ of 0.83 using transfer learning augmentation. Their results confirmed that multi-class neural classifiers substantially outperform hard-threshold rule systems, particularly for the early-stage smoldering scenarios that most frequently produce false activations in conventional detectors (Vorwerk et al., 2024).

Xu et al. (2024) further demonstrated that a compact embedded convolutional neural network (EST-CNN) with only 67 kB of parameters could classify seven aerosol categories—four real fire smoke types and three interferential aerosols (oil fumes, water mist, and dust)—with an average accuracy of 98.96% on resource-constrained photoelectric smoke detector hardware. Critically, none of the interferential aerosols were misclassified as real fire smoke in their evaluation, indicating near-zero false-alarm generation when a properly trained neural architecture is deployed (Xu et al., 2024). This result directly motivates the three-class design adopted in the present work: by explicitly labelling false-alarm stimuli as a distinct target class during training, the classifier learns decision boundaries that separate nuisance events from genuine combustion, rather than conflating them within a generic "no_fire" category.

The practical constraint for deployment on a Cortex-M4 microcontroller (such as the Renesas RA4M1 on the Arduino UNO R4 WiFi) is that the network must remain compact—typically fewer than a few tens of thousands of parameters—while retaining sufficient representational capacity for three-class discrimination. As established in the preceding subsection, quantisation of the trained model to 8-bit integer precision further reduces memory and arithmetic requirements without material degradation in classification accuracy, a topic treated in detail in Section 3.6.

---

## References

Goodfellow, I., Bengio, Y., & Courville, A. (2016). _Deep learning_. MIT Press. https://www.deeplearningbook.org

Vorwerk, P., Kelleter, J., Müller, S., & Krause, U. (2024). Classification in early fire detection using multi-sensor nodes—A transfer learning approach. _Sensors_, _24_(5), 1428. https://doi.org/10.3390/s24051428

Xu, F., Zhu, M., Lin, M., Wang, M., & Chen, L. (2024). Embedded spatial–temporal convolutional neural network based on scattered light signals for fire and interferential aerosol classification. _Sensors_, _24_(3), 778. https://doi.org/10.3390/s24030778

---

## Glossary

- **Activation function**: A nonlinear function applied element-wise to neuron pre-activations, enabling the network to represent functions beyond linear mappings.
- **Backpropagation**: An algorithm for computing gradients of a scalar loss with respect to all network parameters by iterative application of the chain rule.
- **Cross-entropy loss**: A loss function for classification tasks that measures the divergence between predicted class probability distributions and one-hot ground-truth labels.
- **Dropout**: A regularisation technique in which a randomly selected subset of neuron activations is set to zero during each training step to reduce overfitting.
- **ReLU (Rectified Linear Unit)**: An activation function defined as \(\max(0, z)\), widely used in hidden layers for its computational efficiency and resistance to vanishing gradients.
- **Softmax**: An output-layer activation function that normalises a vector of real-valued logits into a valid probability distribution over mutually exclusive classes.
