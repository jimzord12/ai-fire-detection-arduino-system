# Report: Academic Reference Alternatives for Thesis Improvement

Based on the [Academic Review Report](academic_review_report.md), this document identifies "bad" (non-peer-reviewed/hobbyist) references currently used in the thesis and provides the context needed to find appropriate academic replacements from high-impact journals (e.g., _IEEE Sensors_, _Information Fusion_, _ACM Transactions on Embedded Systems_).

---

## 1. Reference: @rasimmax2024fire (YouTube Video)

**Current Entry:**

```bibtex
@misc{rasimmax2024fire,
  author = {Rasimmax},
  title = {Fire detection system using Arduino Nano 33 BLE and TinyML | Edge Impulse | PHP integration},
  howpublished = {YouTube video},
  month = {June},
  year = {2024},
  url = {https://www.youtube.com/watch?v=FdQLSpr0g-E}
}
```

**Academic Critique:**

> "The inclusion of YouTube videos as primary citations is unacceptable... suggests a research process limited to 'how-to' tutorials."

**Usage Context in Thesis:**
This reference is heavily used (14+ citations) to support several critical technical claims:

- **Flame Flicker Frequency:** Cited for the 1–15 Hz band as the characteristic flicker frequency of turbulent diffusion flames (Section 7.2).
- **IR Sensor Physics:** Used to describe the 760 nm to 1100 nm band of phototransistor-based sensors and their response time (<1 ms) (Section 4.2, 3.2).
- **Baseline Calibration:** Cited for the strategy of using the first 10 seconds of operation to define an ambient baseline (delta R/R0) (Section 4.4).
- **System Architecture:** Used to support the use of MQTT for telemetry and ventilated enclosure design for passive airflow (Section 5.3, 5.4).
- **Sensor Fusion:** Supporting the claim that CO acts as a "truth sensor" to veto false positives from smoke/VOC (Section 3.3).

**Search Keywords for Alternatives:**

- `"flame flicker frequency" spectral analysis infrared`
- `"CO sensor" fire detection "false alarm rejection"`
- `"gas sensor" baseline "differential resistance" fire`
- `"passive ventilation" sensor enclosure "convection" fire`

---

## 2. Reference: @nekhil2023fire (Hobbyist Blog/Expert Network)

**Current Entry:**

```bibtex
@article{nekhil2023fire,
  author = {Perez, J. and Smith, A.},
  title = {TinyML for Edge Intelligence},
  journal = {Journal of Sensors},
  year = {2023},
  volume = {10},
  number = {2},
  pages = {123-130},
  url = {https://docs.edgeimpulse.com/projects/expert-network/fire-detection-sensor-fusion-arduino-nano-33}
}
```

**Academic Critique:**

> "Hobbyist blog posts as primary citations... suggests a lack of deep engagement with established Multi-Sensor Data Fusion (MSDF) theory."

**Usage Context in Thesis:**
This reference is used 13+ times to support fundamental Machine Learning and optimization concepts:

- **Model Quantization:** Cited for the Post-Training Quantization (PTQ) process, 8-bit integer (INT8) conversion, and the mathematical representation `r = S(q - Z)` (Section 3.6, 3.7).
- **Microcontroller Performance:** Supports claims about CMSIS-DSP, SIMD instructions, and memory footprint reduction on ARM Cortex-M4 (Renesas RA4M1) (Section 5.1, 3.6).
- **Neural Network Architecture:** Cited for MLP fundamentals, ReLU activation function benefits in TinyML, and input windowing strategies (Section 3.5, 7.2).
- **Edge AI Rationale:** Used to justify the shift from cloud-based to on-device inference for life-safety (Section 2.3, 10.3).

**Search Keywords for Alternatives:**

- `"post-training quantization" neural network "Cortex-M" fire`
- `"TinyML" fire detection "multi-sensor fusion" peer-reviewed`
- `"INT8 quantization" inference latency "embedded systems"`
- `"ReLU" activation "resource-constrained" machine learning`

---

## 3. Reference: @singh2024realtime (Hobbyist Blog)

**Current Entry:**

```bibtex
@misc{singh2024realtime,
  author = {Singh, S.},
  title = {Real-time Smoke Detection With AI-based Sensor Fusion},
  howpublished = {Electromaker},
  month = {January},
  year = {2024},
  url = {https://www.electromaker.io/project/view/real-time-smoke-detection-with-ai-based-sensor-fusion}
}
```

**Academic Critique:**

> Flagged as a "sub-standard source" and "hobbyist blog post."

**Usage Context in Thesis:**

- **Note:** This reference is present in the bibliography but is **not currently cited in the text**. It should be removed or replaced with an academic survey on multi-sensor smoke detection if it was intended to support the Literature Review.

**Search Keywords for Alternatives:**

- `"multi-sensor smoke detection" review "machine learning"`
- `"artificial intelligence" fire detection "sensor fusion" survey`

---

## Summary of Targeted Journals for Replacements

To satisfy the reviewer's requirements, replacements should ideally be sourced from:

1.  **IEEE Sensors Journal**
2.  **Information Fusion** (Elsevier)
3.  **ACM Transactions on Embedded Computing Systems (TECS)**
4.  **Sensors and Actuators B: Chemical** (specifically for CO/VOC sensing)
5.  **Fire Safety Journal**
