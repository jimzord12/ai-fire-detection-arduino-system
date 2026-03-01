== Research Questions <sec:research_questions>

This research aims to evaluate the effectiveness and feasibility of an autonomous sensing node for fire detection. To guide the investigation, the following research questions have been formulated:

+ *Can a multi-sensor fusion approach distinguish between real fire, ambient conditions, and common false alarm triggers?*
  This question explores the effectiveness of combining five heterogeneous sensor modalities (smoke, VOC, CO, IR flame, and environmental context) to create a physically-grounded "fingerprint" of combustion. It investigates whether the cross-correlation between different physical and chemical phenomena provides sufficient information to achieve high separability between classes that are often confused by single-modality systems.

+ *Is TinyML deployment on a Cortex-M4 microcontroller feasible for real-time fire detection with < 100ms latency?*
  This question addresses the technical feasibility of performing complex machine learning inference at the edge. It examines whether an optimized and quantized neural network model can operate within the severe memory and processing constraints of the Renesas RA4M1 core while maintaining the high sampling frequency (10 Hz) necessary for rapid fire response.

+ *How does three-class classification (fire/no_fire/false_alarm) compare to binary classification in reducing false positives?*
  This question investigates the architectural decision to explicitly include a "false_alarm" class in the model training. It seeks to determine if providing the model with labeled examples of common nuisance triggers (e.g., cooking fumes, alcohol vapors) results in a more robust decision boundary and a lower rate of spurious alerts compared to traditional binary models.
