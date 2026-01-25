Your data collection strategy is **solid and well-structured** for a beginner TinyML project, but I'll provide specific improvements based on Edge Impulse best practices and sensor fusion requirements.[1][2]

## Overall Assessment

Your approach of **30-60 samples per class (5-10 minutes total)** aligns with Edge Impulse's recommended starting point for classification tasks. The 3-class structure (`fire`, `no_fire`, `false_alarm`) is correct, and prioritizing the `false_alarm` class is **critical** for reducing nuisance alarms in real-world deployment.[3][4][1]

## Key Strengths

- **Situational diversity**: Testing multiple scenarios per class (e.g., small flame close vs. far, cooking fumes vs. steam) is essential for sensor fusion models that need to learn complex multi-sensor patterns.[5][4]
- **False alarm emphasis**: Your 2-4 situations for `false_alarm` is appropriate since this class typically causes the most classification errors in fire detection systems.[4][6]
- **10-second window size**: Good choice for balancing temporal patterns (e.g., flame flicker) with manageable file sizes.

## Critical Improvements

### 1. **Class Balance Is Essential**

Aim for **equal sample counts across all three classes** (e.g., 60 samples each = 180 total). Imbalanced datasets cause ML models to bias toward the majority class, dramatically increasing false negatives or false positives. Since `false_alarm` has 2-4 situations vs. `fire` having 2-3, you're at risk of imbalance.[6][7]

**Action**: Collect 50-60 samples per class minimum, distributed evenly across your situations.

### 2. **Add Temporal Variability**

For sensor fusion with slow-moving signals (temperature, humidity, VOC) and fast signals (flame sensor), capture data at **different stages** of each situation:

- **Fire class**: Start recording _before_ ignition, during flame growth, and steady burn (captures CO/VOC rise rates).
- **False_alarm class**: Capture the entire event cycle (e.g., kettle heating → steam burst → dissipation).

**Why**: Your NN model will learn _rate-of-change_ patterns, not just absolute thresholds.[8][4]

### 3. **Prioritize These False Alarm Scenarios**

Based on multi-sensor fire detection research:[4]

- **High-priority**: Cooking fumes (oil smoke), aerosol sprays, steam
- **Medium-priority**: Alcohol vapors (hand sanitizer), candles (small flame without dangerous fire signatures)
- **Low-priority**: Dusty air (unless your deployment environment has this)

### 4. **Test Set Strategy**

Edge Impulse auto-splits your data 80/20 train/test, but manually reserve **one full situation per class** for testing (e.g., "smoldering fire" for `fire`, "shower steam" for `false_alarm`). This validates generalization to _unseen conditions_, not just unseen samples.[9][2]

## Minimum Data to Start Training

| Class         | Samples                              | Total Duration |
| ------------- | ------------------------------------ | -------------- |
| `fire`        | 60 (20 per situation × 3 situations) | 10 minutes [1] |
| `no_fire`     | 60 (20 per situation × 3 situations) | 10 minutes [1] |
| `false_alarm` | 60 (15 per situation × 4 situations) | 10 minutes [1] |

**Total**: 180 samples, ~30 minutes of data across all classes.

If accuracy is poor after first training, Edge Impulse's typical fix is: **(1) Add 50% more data to the worst-performing class, (2) Check DSP block feature separation in the Feature Explorer**.[10][11]

## Hardware-Specific Considerations

Your Arduino UNO R4's **Cortex-M4 (48 MHz)** has limited RAM. With 5 sensors at 10Hz, you're generating ~50 bytes/sample. A 10-second window = 500 samples = 25KB raw data. Edge Impulse's DSP blocks will compress this, but avoid windows >10 seconds to stay within device inference limits.[8]

---

## 📚 Academic Notes for Thesis

### Keywords

- **Sensor Fusion**, **TinyML**, **Edge Impulse**, **Class Imbalance**, **False Alarm Mitigation**, **Data Augmentation**, **Temporal Feature Extraction**, **Neural Network Quantization (int8)**, **Embedded Machine Learning**, **Multi-Modal Fire Detection**

### Key Concepts to Expand in Paper

#### 1. **Class Imbalance in Safety-Critical Systems**

- Cite: Batista et al. (SMOTE-Tomek for imbalance)[6]
- **Argument**: Fire detection has inherent imbalance (rare fire events vs. common benign conditions). Discuss how _equal sampling during training_ differs from _real-world class distribution_ and why this improves minority class (fire) detection.

#### 2. **Sensor Fusion vs. Threshold-Based Detection**

- Cite: Desikan et al. (2025) - "Hybrid ML-Based Fault-Tolerant Sensor Data Fusion"[4]
- **Contrast**: Traditional systems use fixed thresholds (e.g., "smoke > 500ppm = alarm"). Sensor fusion learns _correlations_ (e.g., "rising CO + steady temp + no flame = smoldering fire").

#### 3. **Edge Impulse MLOps Pipeline**

- Cite: Edge Impulse white paper (arXiv:2212.03332)[2]
- **Technical depth**: Explain DSP block feature extraction (e.g., spectral analysis for time-series), NN architecture selection (FFNN vs. CNN for sensor data), and quantization trade-offs (float32 → int8 reduces memory 4x with <2% accuracy loss).[8]

#### 4. **Temporal Feature Engineering**

- Cite: "Fusing Multi-sensor Input with State Information on TinyML" (arXiv:2404.02567)[5]
- **Key finding**: Late fusion (combining sensor outputs after individual processing) improves R² by 0.06-0.10 with negligible memory overhead.[5]
- **Apply to your project**: Your AHT20 (temperature) changes slowly; flame sensor changes at 1-10Hz. Discuss differential DSP blocks per sensor type.

#### 5. **Dataset Size Requirements in TinyML**

- Cite: Edge Impulse tutorials[1][3]
- **Guidelines**: 3-10 minutes per class for continuous monitoring tasks (audio, sensor streams). Compare to computer vision (requires 100s-1000s of images).[12][9]
- **Justification**: Lower data requirements due to (1) simpler feature space (5 sensors vs. 150,000 pixels), (2) temporal redundancy (10 samples/second).

### Suggested Thesis Structure (2-3 pages on dataset)

1. **Dataset Design Rationale** (1 page)

   - Class taxonomy justification (`fire`/`no_fire`/`false_alarm`)
   - Situational coverage analysis (why cooking fumes matter more than dust)

2. **Data Collection Methodology** (1 page)

   - Hardware setup (sensor placement, sampling rate justification)
   - Collection protocol (10-second windows, recording procedure)
   - Quality control (outlier removal, sensor calibration checks)

3. **Dataset Statistics & Balancing** (0.5 page)

   - Sample distribution table (like the one above)
   - Class imbalance mitigation (equal sampling vs. SMOTE/augmentation)

4. **Edge Impulse Pipeline Integration** (0.5 page)
   - Data Forwarder format (CSV structure)
   - Train/test split strategy (80/20 auto-split + manual holdout set)

### Additional Sources to Cite

- **Fire detection datasets**: "Fire and Smoke Datasets in 20 Years" (arXiv:2503.14552) - Use this to compare your multi-sensor approach vs. vision-only methods.[12]
- **TinyML benchmarks**: "Embedded Sensor Data Fusion and TinyML for RUL Estimation" (PMC12196908) - Cite their int8 quantization results (2ms latency, 1.2KB RAM) to justify your deployment feasibility.[8]

---

**Next Steps**: Start collecting `no_fire` baseline data across different times of day (morning/evening temperature shifts matter for your AHT20 sensor). This is the safest class to gather first while you design your controlled fire test setup.

[1](https://thinkrobotics.com/blogs/learn/edge-impulse-audio-classification-tutorial-build-smart-audio-recognition-models-for-edge-devices)
[2](https://arxiv.org/pdf/2212.03332.pdf)
[3](https://hackmd.io/@unical2022/Hklw4XKDq)
[4](https://pmc.ncbi.nlm.nih.gov/articles/PMC11991413/)
[5](https://arxiv.org/html/2404.02567v1)
[6](http://www.ijnc.org/index.php/ijnc/article/download/293/304)
[7](https://semaphore.io/blog/imbalanced-data-machine-learning-python)
[8](https://pmc.ncbi.nlm.nih.gov/articles/PMC12196908/)
[9](https://docs.arduino.cc/tutorials/nicla-vision/image-classification/)
[10](https://docs.edgeimpulse.com/studio/projects/learning-blocks/blocks/classification)
[11](https://forum.edgeimpulse.com/t/maximum-size-in-edge-impulse/5752)
[12](https://arxiv.org/html/2503.14552v1)
[13](https://www.edgeimpulse.com/blog/make-the-most-of-limited-datasets-using-audio-data-augmentation/)
[14](https://www.youtube.com/watch?v=h9X2f848txg)
[15](https://docs.edgeimpulse.com/studio/projects/live-classification)
[16](https://dl.acm.org/doi/10.1145/3744103.3744121)
[17](https://docs.edgeimpulse.com/studio/projects/data-acquisition/auto-labeler)
[18](https://www.silabs.com/documents/public/training/wireless/ML%20Speech%20Recognition%20Lab%20Manual_Public.pdf)
[19](https://forum.edgeimpulse.com/t/best-dataset-size-for-object-detection-model-and-ai-labeling-in-edge-impulse/13931)
[20](https://www.sciencedirect.com/science/article/pii/S1569843225003127)
