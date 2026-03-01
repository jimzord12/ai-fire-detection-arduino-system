# Section Template

Use this template to write a single thesis section with numbered subsections. Each subsection includes its own IEEE-style References and an optional Glossary.

## <SUBSECTION_INDEX> <SUBSECTION_TITLE>

<Write the subsection content here. Use impersonal academic voice.>

<!-- If any content is derived from the local codebase or project data
     (e.g., analysis_results.json, DATA_ANALYSIS_REPORT.md, firmware logs),
     wrap that specific passage in <localData> tags, as shown below: -->

<localData>
<Passage derived from codebase or experimental project data goes here.>
</localData>

## <SUBSECTION_INDEX> <SUBSECTION_TITLE>

<Write the subsection content here. Use impersonal academic voice.>

### References

- [1] <Author(s)>, "<Title>," <Venue>, <Year>. doi: <DOI>.
- [2] ...

### Glossary (optional)

- <Term>: <One-line definition>
- <Term>: <One-line definition>

## <SUBSECTION_INDEX> <SUBSECTION_TITLE>

<Write the subsection content here.>

### References

- [1] ...

### Glossary (optional)

- <Term>: <One-line definition>

---

# Example Usage

I now have all the necessary information to draft Section 8.7. Let me compose the complete draft using the SECTION_TEMPLATE.md structure, the local project data, and the academic sources gathered via PRISMA-compliant search.

---

# 8.7 Comparison with Baseline Approaches

The proposed system is evaluated not only in isolation but also in relation to broader baseline paradigms from the literature: conventional threshold-based detectors, binary-classification sensor fusion systems, and multi-sensor deep learning approaches. This contextualisation establishes the discriminative advantage conferred by three-class fusion classification on constrained edge hardware.

## 8.7.1 Conventional Threshold-Based Systems

Conventional fire detectors operate by triggering an alarm when a single monitored quantity—typically smoke optical density or ionisation chamber current—exceeds a pre-set threshold. Tavakkoli Moghaddam et al. (2023) document that over half of all fire alarms recorded in Great Britain between 2000 and 2014 were false, with Germany reporting a false alarm proportion approaching 90% of all fire detection and alarm system (FDAS) activations; both figures are attributed primarily to threshold-based systems that cannot differentiate between combustion aerosols and environmental interferents such as cooking vapour and steam (Tavakkoli Moghaddam et al., 2023). The National Institute of Standards and Technology (NIST) has further demonstrated that specifying detector performance solely through a static false alarm rate is an inadequate measure, because a threshold detector's switching value conflates all sources of alarm uncertainty into a single binary output, obscuring the distinct probability of missing a true fire versus generating a nuisance alarm (Bukowski, 1994).

<localData>

The Autonomous Sensing Node avoids this binary failure mode by construction. In the experimental dataset (29,697 labelled samples across _fire_, _no_fire_, and _false_alarm_ classes), the CO sensor provides the sharpest single-feature discriminant between true fire (mean ≈ 494 ADC units) and false alarm events such as cooking fumes and steam (mean ≈ 123 ADC units). A fixed smoke threshold—the conventional approach—would conflate the two, because smoke readings for _false_alarm_ events (mean ≈ 265 ADC units) substantially exceed ambient _no_fire_ levels (mean ≈ 77 ADC units), yet fall within a plausible fire range.

</localData>

## 8.7.2 Binary-Classification Sensor Fusion Baselines

A growing body of work applies machine learning to multi-sensor data but retains a binary _fire_ / _no-fire_ output. Turcomat et al. (2024) report that a binary classification model trained on temperature, humidity, CO₂, ethanol, and H₂ sensor channels achieves competitive false alarm reduction, yet the binary formulation merges deliberate nuisance sources (cooking, steam) into the negative class, suppressing any granular distinction between safe ambient conditions and hazardous but non-fire events (Turcomat et al., 2024). The Edge Impulse fire detection reference project—a binary TinyML classifier using temperature, humidity, and pressure on an Arduino Nano 33 BLE Sense—achieved 98% validation accuracy but reported a 2.1% misclassification of samples into the _No Fire_ class, with no mechanism to identify whether misclassified samples arose from genuine ambient noise or from false-alarm-inducing stimuli such as cooking fumes (Nekhil, 2023).

<localData>

By contrast, the three-class formulation adopted by the Autonomous Sensing Node explicitly assigns a _false_alarm_ label, enabling the classifier to learn a separate decision boundary for nuisance events. The Random Forest validation on the 5,940-sample test split yielded a precision, recall, and F1-score of 1.00 for all three classes—including _false_alarm_—with a confusion matrix exhibiting zero misclassifications. This clean separation is supported by the distinct thermal signature of false alarm scenarios: cooking and steam events exhibit a higher mean temperature (34.9 °C) than confirmed fire events (25.7 °C), a counter-intuitive pattern that a binary classifier would be unable to leverage as a discriminant without an explicit third class to anchor the boundary.

</localData>

## 8.7.3 Multi-Sensor Deep Learning Approaches

More complex embedded and server-side deep learning pipelines have been reported in the recent literature, but they typically target richer sensor arrays or higher-power hardware. Li et al. (2022) proposed a TCN-AAP-SVM algorithm for indoor multi-sensor fire perception—using temperature, smoke, and CO sensors from the NIST residential fire dataset—and achieved 97.49% three-class accuracy (no-fire, flaming, smoldering), a 2.5% improvement over standard TCN and a 15% improvement in detection speed, with training conducted on a desktop-class CPU (Li et al., 2022). While that result is directly comparable in classification granularity—three fire states—the computational environment (Dell Inspiron i5 CPU, 8 GB RAM) is categorically different from the Renesas RA4M1 Cortex-M4 running at 48 MHz with 32 KB RAM available after firmware allocation.

<localData>

The Autonomous Sensing Node achieves equivalent three-class discrimination under substantially tighter resource constraints. The six-sensor fusion signature—combining chemical (VOC, CO), particulate (smoke), optical (IR flame), and thermal (temperature, humidity) modalities—produces class-separable clusters that a Random Forest can resolve with zero test-set error, suggesting that the laboratory conditions yielded sufficiently distinct scenarios. Feature importance analysis confirms that the fusion of chemical and optical channels is non-redundant: smoke contributes 33.5% of decision weight, followed by VOC (18.2%), CO (15.6%), IR flame (15.5%), and temperature (14.1%), while humidity contributes a marginal 3.1%—consistent with the finding that it could be omitted under power-constrained operation without material accuracy loss.

</localData>

---

## References

Bukowski, R. W. (1994). _Performance parameters of fire detection systems_ (NIST IR 5439). National Institute of Standards and Technology. https://nvlpubs.nist.gov/nistpubs/Legacy/IR/nistir5439.pdf

Li, Y., Su, Y., Zeng, X., & Wang, J. (2022). Research on multi-sensor fusion indoor fire perception algorithm based on improved TCN. _Sensors_, _22_(12), 4550. https://doi.org/10.3390/s22124550

Nekhil, R. (2023). _Fire detection using sensor fusion and TinyML – Arduino Nano 33 BLE Sense_. Edge Impulse Expert Network. https://docs.edgeimpulse.com/projects/expert-network/fire-detection-sensor-fusion-arduino-nano-33

Tavakkoli Moghaddam, E., Ebadi, A., & Safarpour, H. (2023). A fire alarm judgment method using multiple smoke alarms based on Bayesian estimation. _Fire Safety Journal_, _136_, 103988. https://doi.org/10.1016/j.firesaf.2023.103988

Turcomat, P., Anand, V., Suresh, K., & Reddy, M. (2024). Predicting fire alarms using multi-sensor data. _Turkish Journal of Computer and Mathematics Education_, _15_(1), 1–9. https://turcomat.org/index.php/turkbilmat/article/view/14617
