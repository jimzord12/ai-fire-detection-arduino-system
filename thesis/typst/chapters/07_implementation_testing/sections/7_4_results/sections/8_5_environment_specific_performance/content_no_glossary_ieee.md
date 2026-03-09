# Environment-Specific Performance


## 8.5.1 Overall Confusion Matrix and Environmental Context

The `analysis_results.json` provides an aggregated confusion matrix for the entire dataset, which incorporates samples from various simulated environments. The core classes evaluated are "false_alarm," "fire," and "no_fire." For the full dataset, the confusion matrix (as presented in Section 8.3) indicates perfect classification:

```json
"confusion_matrix": [
    [1792, 0, 0],   // True False_Alarm vs Predicted False_Alarm, Fire, No_Fire
    [0, 1781, 0],   // True Fire vs Predicted False_Alarm, Fire, No_Fire
    [0, 0, 2367]    // True No_Fire vs Predicted False_Alarm, Fire, No_Fire
]
```
This perfect diagonal implies that, across the aggregated dataset, the model achieved 100% accuracy, with no misclassifications between any of the classes. The scenarios used for data collection (e.g., "Idle office," "Kitchen ambient," "Paper, Wood, Cloth burns," "Cooking fumes," "Sprays") inherently represent different indoor environments and conditions.

Although granular confusion matrices specific to "urban," "indoor," or "outdoor" sets are not explicitly provided in the current `analysis_results.json`, the overall performance reflects the model's ability to generalize across the *range of environments simulated during data collection*. The data collection methodology outlined in Section 6.4 covered:

*   **Indoor/Ambient Scenarios**: Represented by "No-Fire Class: Idle Office, Kitchen Ambient" (e.g., `no_fire__closed_room`, `no_fire__open_space`) and "False Alarm Class: Cooking Fumes, Steam, Sprays" (e.g., `false_alarm__cooking`, `false_alarm__steam`). These directly inform the model's performance in typical indoor settings.
*   **Controlled Fire Scenarios**: "Fire Class: Paper, Wood, Cloth burns" (e.g., `fire__close_low_vent`, `fire__medium_norm_vent`) were conducted under varying ventilation conditions, simulating different aspects of an indoor fire event.

The perfect accuracy on the aggregated dataset suggests that the features extracted by the TinyML model are sufficiently discriminative across these varied conditions. However, a deeper environment-specific performance analysis would typically involve:

*   **Stratified Evaluation**: Creating separate validation sets for each distinct environmental type (e.g., strictly kitchen-specific data, office-specific data, outdoor-simulated data).
*   **Detailed Confusion Matrices**: Generating confusion matrices for each of these stratified sets to identify if the model's performance degrades or if specific misclassifications occur more frequently in certain environments. For instance, a model might perform exceptionally well in a quiet office but struggle with distinguishing cooking fumes from fire in a busy kitchen.

Given the current aggregated performance, the model demonstrates high efficacy across the simulated test environments. Future work could involve more granular environmental stratification to further validate performance in highly specific deployment contexts, including those that might involve outdoor or semi-outdoor scenarios where factors like wind, sunlight, and larger volumes of air might influence sensor readings. The `Environmental Variance` section (Section 6.5) touches upon the considerations for these varied settings.

### References
