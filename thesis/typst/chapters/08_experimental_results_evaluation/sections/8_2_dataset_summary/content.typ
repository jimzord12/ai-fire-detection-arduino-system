== Dataset Summary

The foundation of any robust machine learning system lies in its dataset. For the autonomous multi-sensor fire detection node, a comprehensive dataset was meticulously curated to support the three-class classification objective: "fire," "no_fire," and "false_alarm." This section provides a summary of the dataset's characteristics, including its distribution, balance across classes, and key statistical properties, drawing insights from `the experimental analysis results` and `the aggregated sensor dataset`.

==== Distribution and Balance

The dataset comprises a total of 5940 samples, systematically distributed across the three target classes. This balance is critical for preventing model bias towards any single class and ensuring equitable learning of patterns associated with each state. The distribution is as follows:

- *No_Fire Class*: 2367 samples
- *Fire Class*: 1781 samples
- *False_Alarm Class*: 1792 samples

#figure(
  image("../../../../assets/figures/data_analysis/class_distribution.png", width: 80%),
  caption: [Dataset Class Distribution. A bar chart representing the number of samples for each of the three target classes: fire, no_fire, and false_alarm. The distribution confirms a well-balanced dataset, preventing model bias.],
) <fig-class-distribution>

This near-balanced distribution (approximately 40% no_fire, 30% fire, 30% false_alarm) ensures that the model is adequately exposed to each class during training. The `label` and `scenario` columns within the `aggregated_data.csv` (timestamp, smoke, voc, co, flame, temp, hum, label, scenario, filename, humid) explicitly link each data point to its corresponding class and collection context, enabling detailed analysis of scenario-specific variations. The raw data structure in `the raw dataset repository{class}/{scenario}/` further reinforces this organization, providing direct traceability to the original collection events.

==== Sensor Statistics by Class

The `analysis_results.json` provides granular statistical summaries (mean, standard deviation, min, max) for each sensor across the three classes, offering crucial insights into their distinct signatures:

===== No_Fire Class:
- *smoke*: Mean 77.39, Std 21.69 (Low and stable)
- *voc*: Mean 427.52, Std 92.11 (Moderate baseline)
- *co*: Mean 385.00, Std 110.71 (Moderate baseline)
- *flame*: Mean 1.03, Std 1.23 (Near zero, no flame activity)
- *temp*: Mean 20.89, Std 3.56 (Room temperature)
- *hum*: Mean 56.73, Std 9.76 (Ambient humidity)
These statistics confirm a quiescent environment with typical ambient sensor readings.

===== Fire Class:
- *smoke*: Mean 412.65, Std 174.11 (Significantly elevated)
- *voc*: Mean 811.14, Std 119.28 (Elevated, indicating combustion byproducts)
- *co*: Mean 494.05, Std 351.90 (Elevated, with high variance reflecting active combustion)
- *flame*: Mean 385.64, Std 429.31 (Significantly elevated, high variance due to flame flicker/distance)
- *temp*: Mean 25.73, Std 8.94 (Elevated, but possibly lower than false alarms in early stages)
- *hum*: Mean 51.64, Std 19.39 (Moderate, less distinct)
These values clearly demonstrate the characteristic sensor responses during a fire event, with notable increases in smoke, VOC, CO, and flame signals.

===== False_Alarm Class:
- *smoke*: Mean 264.70, Std 98.95 (Elevated, but generally lower than true fire)
- *voc*: Mean 775.73, Std 113.41 (Significantly elevated, often comparable to fire, due to cooking/sprays)
- *co*: Mean 123.25, Std 137.04 (Significantly lower than fire, crucial differentiator)
- *flame*: Mean 97.78, Std 78.10 (Low, indicating no direct flame)
- *temp*: Mean 34.93, Std 7.24 (Often highest mean temperature, as seen in steam/cooking)
- *hum*: Mean 53.01, Std 27.77 (High variance, especially during steam events)
The false alarm class statistics highlight the overlap in smoke and VOC with true fire, but critically differentiate with significantly lower CO and flame readings, while often exhibiting higher temperatures (e.g., from steam). This statistical separation underpins the feasibility of three-class classification.

==== Dataset Balance

The near-balanced distribution of samples across the "fire," "no_fire," and "false_alarm" classes (1781, 2367, and 1792 samples respectively) prevents the machine learning model from developing a bias towards the majority class. This balanced approach is crucial for achieving high and equitable predictive performance across all critical states of the fire detection system, ensuring that both fire and false alarm conditions are accurately recognized without disproportionately favoring the "no_fire" state.
