== Training and Validation Metrics

The performance of the TinyML model developed for multi-sensor fire detection was rigorously assessed using standard training and validation metrics. These metrics provide quantitative insights into the model's ability to learn from the training data and generalize to unseen data, specifically focusing on its accuracy in classifying fire, no_fire, and false alarm states, as well as the behavior of the loss function during training. The evaluation relies on data presented in `the experimental analysis results`.

==== Accuracy

Accuracy is a fundamental metric that quantifies the proportion of correctly classified instances out of the total instances. For a multi-class classification problem like fire detection, overall accuracy provides a high-level overview of the model's performance. The `analysis_results.json` reports an overall accuracy of 1.0 (100%) for the trained model on its validation set. While this suggests perfect classification of all 5940 samples in the validation dataset, it must be interpreted as a *baseline feasibility result achieved within a strictly controlled laboratory environment*. Such "perfect" separability is often characteristic of initial TinyML studies where the variance of environmental noise (e.g., dust, fluctuating air currents, or aging sensors) is minimized compared to real-world field conditions @muller2024classification.

Beyond overall accuracy, a more detailed understanding of the model's performance per class is provided by precision, recall, and F1-score, as detailed in the `classification_report` within `analysis_results.json`:

- *False_Alarm Class*: Precision: 1.0, Recall: 1.0, F1-score: 1.0.
- *Fire Class*: Precision: 1.0, Recall: 1.0, F1-score: 1.0.
- *No_Fire Class*: Precision: 1.0, Recall: 1.0, F1-score: 1.0.

A precision and recall of 1.0 for all classes signifies that, within the scope of the current dataset, the features extracted by the sensor fusion suite are highly discriminative. However, this level of performance should be viewed as an indicator of the model's strong potential rather than a guarantee of error-free operation in noisy, non-stationary environments.

#figure(
  image("../../../../assets/figures/data_analysis/confusion_matrix.png", width: 80%),
  caption: [Model Confusion Matrix. A matrix visualizing the predicted vs. actual class labels. The 100% accuracy in this controlled environment demonstrates the high mathematical separability of the fire and false alarm classes under ideal conditions.],
) <fig-confusion-matrix>

The confusion matrix, visually represented in @fig-confusion-matrix, further confirms these results, showing a perfect diagonal with zero off-diagonal elements. This indicates that misclassifications between "false_alarm," "fire," and "no_fire" classes were not observed during validation. This suggests that the model has successfully identified the distinct multi-modal signatures of each class in the training environment, providing a robust starting point for subsequent field testing and longitudinal reliability analysis.

==== Loss

The loss function quantifies the error between the model's predictions and the true labels during training. The objective of the training process is to minimize this loss. A perfectly trained model, especially one achieving high accuracy on its validation set, implies that the training loss converged to a very low value, approaching zero, and that the model effectively learned the underlying patterns of the provided dataset. The absence of any misclassifications in the confusion matrix suggests that the model's weights and biases were successfully optimized for the specific feature space generated during laboratory data collection. In a practical deployment, monitoring for a "Lab-to-Real-World" performance gap is critical, as the implicit low loss on validation data does not necessarily account for the stochastic nature of real-world fire transients @solorzano2021early.

