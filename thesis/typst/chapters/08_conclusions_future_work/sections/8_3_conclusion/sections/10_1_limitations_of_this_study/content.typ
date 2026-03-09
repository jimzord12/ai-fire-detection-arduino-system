=== Limitations of This Study

No scientific study is without its limitations, and the development of the autonomous multi-sensor fire detection node is no exception. Acknowledging and discussing these limitations is crucial for contextualizing the presented results, guiding future research, and ensuring a realistic understanding of the system's current capabilities and potential challenges in real-world deployment. This section outlines the primary limitations identified within this study.

==== Dataset Constraints

The robust performance of the TinyML model, evidenced by its 100% classification accuracy on the validation set, is intrinsically linked to the characteristics of the collected dataset. However, this dataset, while comprehensive within its defined scenarios, presents certain constraints:

-   *Limited Diversity of Fire Sources*: The "Fire" class data primarily encompassed controlled burns of paper, wood, and cloth. While representative of common household fires, it does not cover the vast spectrum of fire types, including electrical fires, liquid fuel fires, or specialized signatures of high-density forest vegetation.
-   *Controlled False Alarm Scenarios*: Similarly, the "False Alarm" class included common nuisance sources like cooking fumes, steam, and aerosol sprays. While these are prevalent false alarm triggers, the real world presents an even broader array of non-fire phenomena, such as complex atmospheric haze or biological VOCs found in dense forests.
-   *Single Sensor Instance*: The entire dataset was collected using a single set of DFRobot MEMS sensors. Variations in sensor manufacturing or potential unit-to-unit discrepancies are not captured in the current dataset.

==== Lab vs. Real World

The data collection and model validation were primarily conducted in a controlled laboratory environment. While this approach facilitated precise control over experimental conditions, it inherently introduces a "lab-to-real-world gap."

-   *Environmental Variability*: Real-world environments are far more dynamic than laboratory settings. Factors such as fluctuating ambient temperatures, varying humidity levels, diverse airflow patterns, and complex chemical mixtures can significantly influence sensor readings.
-   *Lack of Long-Term Deployment*: The study did not include extensive long-term real-world deployment. The performance observed in controlled conditions might not directly translate to sustained performance over months or years.

==== Sensor Drift

Sensor drift refers to the gradual change in a sensor's readings over time, independent of changes in the measured physical phenomenon. This is a common characteristic of MEMS gas sensors.

-   *Impact on Baselines*: Sensor drift can alter the baseline readings, leading to a shift in the perceived "no_fire" state. A model trained on initial sensor baselines might misinterpret drifted readings as signs of fire or false alarms.
-   *Mitigation Challenge*: The current firmware does not incorporate explicit adaptive baseline algorithms or periodic re-calibration mechanisms. Future research would need to address these challenges to maintain accuracy over the system's operational lifespan.
