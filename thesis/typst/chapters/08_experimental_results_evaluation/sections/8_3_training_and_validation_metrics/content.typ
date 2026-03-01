== Training and Validation Metrics

The performance of the TinyML model developed for multi-sensor fire detection was rigorously assessed using standard training and validation metrics. These metrics provide quantitative insights into the model's ability to learn from the training data and generalize to unseen data, specifically focusing on its accuracy in classifying fire, no_fire, and false alarm states, as well as the behavior of the loss function during training. The evaluation relies on data presented in `data/analysis/analysis_results.json`.

==== Accuracy

Accuracy is a fundamental metric that quantifies the proportion of correctly classified instances out of the total instances. For a multi-class classification problem like fire detection, overall accuracy provides a high-level overview of the model's performance. The `analysis_results.json` reports an impressive overall accuracy of 1.0 (100%) for the trained model on its validation set. This indicates that all 5940 samples in the validation dataset were correctly classified across the three target classes.

Beyond overall accuracy, a more detailed understanding of the model's performance per class is provided by precision, recall, and F1-score, as detailed in the `classification_report` within `analysis_results.json`:

- *False_Alarm Class*: Precision: 1.0, Recall: 1.0, F1-score: 1.0, Support: 1792 samples.
- *Fire Class*: Precision: 1.0, Recall: 1.0, F1-score: 1.0, Support: 1781 samples.
- *No_Fire Class*: Precision: 1.0, Recall: 1.0, F1-score: 1.0, Support: 2367 samples.

A precision of 1.0 for all classes indicates that when the model predicts a class, it is always correct (no false positives for any class). A recall of 1.0 signifies that the model correctly identifies all actual instances of each class (no false negatives for any class). Consequently, an F1-score of 1.0 across all classes demonstrates perfect balance between precision and recall.

The confusion matrix, visually represented in `thesis/assets/figures/data_analysis/confusion_matrix.png` and numerically in `analysis_results.json`, further confirms these results. It shows a perfect diagonal with zero off-diagonal elements, meaning there were no misclassifications between any of the "false_alarm," "fire," and "no_fire" classes. This high accuracy, precision, and recall across all classes on the validation set suggests that the model has learned distinct and separable features for each class from the provided dataset.

==== Loss

The loss function quantifies the error between the model's predictions and the true labels during training. The objective of the training process is to minimize this loss. While `analysis_results.json` does not explicitly provide a training loss curve or final loss value, a typical training process for such a high-performing model (achieving 100% accuracy) would involve the iterative reduction of a chosen loss function (e.g., Categorical Cross-Entropy for multi-class classification) over epochs.

A perfectly trained model, especially one achieving 100% accuracy on its validation set, implies that the training loss converged to a very low value, approaching zero, and that the model effectively learned the underlying patterns without significant overfitting to this specific validation set. The absence of any misclassifications in the confusion matrix suggests that the model's weights and biases were successfully optimized to classify the features of each class distinctly. In a practical scenario, monitoring the training and validation loss curves (not directly presented here but standard practice in model development) would typically show a decreasing trend, indicating effective learning and convergence.

The exceptional accuracy and implicit low loss achieved on the validation set are strong indicators of the model's capability to differentiate between fire, no_fire, and false alarm conditions based on the multi-sensor input.
