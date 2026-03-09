=== Appendix C: Model Architecture Details <appendix:model-details>
Additional details regarding the Edge Impulse model architecture, including layer-by-layer parameter counts and quantization metrics, are documented here.

The TinyML model deployed on the Autonomous Sensing Node was designed and trained using the Edge Impulse platform. This appendix details the neural network architecture, training hyperparameters, and performance metrics.

==== Neural Network Architecture

The model is a fully connected (Dense) Neural Network optimized for the Renesas RA4M1 microcontroller. It utilizes a three-layer "bottleneck" structure to encourage feature compression and robust classification.

#figure(
  table(
    columns: (1fr, 1.5fr, 1fr, 1.5fr),
    inset: 10pt,
    align: horizon,
    [*Layer Type*], [*Neurons*], [*Activation*], [*Note*],
    [Input], [6 Channels], [-], [Raw sensor features],
    [Dense], [30], [ReLU], [Initial expansion],
    [Dense], [20], [ReLU], [Feature compression],
    [Dense], [50], [ReLU], [Expansion],
    [Output], [3 Classes], [Softmax], [Classification probabilities],
  ),
  caption: [Neural Network Architecture for the Fire Detection Model],
) <table-nn-architecture>

==== Training Hyperparameters

The model was trained using the following parameters to ensure stable convergence and avoid overfitting:

- *Optimizer*: Adam Optimizer.
- *Learning Rate*: 0.0005.
- *Training Cycles (Epochs)*: 100.
- *Batch Size*: 32.
- *Data Augmentation*: None (raw time-series windowing only).

==== Performance Metrics (Validation Set)

The validation results achieved during the training phase demonstrate perfect mathematical separability between the three classes in the controlled laboratory environment.

- *Total Accuracy*: 100.0%
- *Loss*: < 0.01

#figure(
  table(
    columns: (1.5fr, 1.2fr, 1.2fr, 1.2fr),
    inset: 10pt,
    align: horizon,
    [*Class*], [*Precision*], [*Recall*], [*F1-Score*],
    [Fire], [100.0%], [100.0%], [1.00],
    [No Fire], [100.0%], [100.0%], [1.00],
    [False Alarm], [100.0%], [100.0%], [1.00],
  ),
  caption: [Model Confusion Matrix Results. The 100% accuracy reflects the high separability of the captured feature space under ideal conditions.],
) <table-performance-metrics>

==== Generalization and Overfitting Note

As discussed in Section 8.3, the 100% validation accuracy is a baseline feasibility result. It suggests a high degree of *overfitting* to the specific sensor signatures and environmental constraints of the laboratory setup. While this proves the concept of multi-sensor fusion, real-world deployment requires the hybrid logic described in Section 7.6 to account for stochastic transients and sensor drift that may not be captured in the static validation set.

==== Optimization and Deployment

The model was compiled using the *Edge Impulse EON Compiler*, which reduces RAM and Flash usage by up to 50% compared to standard TensorFlow Lite for Microcontrollers. The final model uses approximately 4.2 kB of RAM and 18.5 kB of Flash on the Arduino UNO R4 WiFi.
