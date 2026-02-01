# Edge Impulse Platform - Classifier & Training

## Guide

Training cycles (epochs): Set to 100 (give it time to learn).

Learning rate: Set to 0.0005 (go slower and more precise than the default 0.001).

Neural Network Architecture:

Use 2 Dense Layers (default is fine).

Layer 1: 30 Neurons. (Default was 20)

Layer 2: 20 Neurons. (Default was 10)

Layer 3: 5 Neurons.

> Tip: If accuracy is low (<85%), come back here and add a 4th layer or increase neurons to 60. But start simple.

> About "use learned optimizer" (VeLO): Do NOT enable this option. It is Overkill & Resource Heavy: VeLO is a huge, complex optimizer model (an LSTM) that is often larger than the tiny model you are trying to train. It requires significant GPU resources to run effectively, which is unnecessary for your simple sensor data (300 samples).

Actions:

1. Set the settings above.

2. Click Start training.

3. Wait for the results (Accuracy & Confusion Matrix).

What to look for in results:

- Total Accuracy: > 85% is a good start.

- Confusion Matrix:
  - Ideally: Fire should rarely be misclassified as No Fire (Safety risk).
  - False Alarm misclassified as Fire is annoying but safer than the reverse.

## Results

93.6% Accuracy! This is excellent. You didn't just meet the target; you exceeded the 90% goal with room to spare.

Your "experiment" with 3 layers (30, 20, 50 neurons) worked surprisingly well.

False Alarm Accuracy: 97.3% (Very high - excellent for reducing nuisance alarms).

No Fire Accuracy: 94.8% (Very robust).

Fire Accuracy: 89.1% (Solid, though it confuses ~6.7% of fires as "False Alarms" and ~4.2% as "No Fire").

Analysis of your Architecture:
You used a "bottleneck" structure (30 -> 20 -> 50).

Usually, we go "wide to narrow" (e.g., 50 -> 30 -> 10).

Your middle layer (20) forced the model to compress the data, extracting only the most critical features.

The final layer (50) then expanded it again before classification.

This is actually a known technique (Autoencoder-like behavior) that can sometimes help with noise!
