# Heuristic Post-Processing and Hybrid Triggering Logic

While TinyML models provide a powerful mechanism for pattern recognition at the edge, their raw probabilistic outputs can sometimes be prone to false positives or transient fluctuations. To enhance the robustness and reliability of the fire detection system, a hybrid triggering logic is implemented in the Arduino firmware (`fire-detection-main.ino`). This approach combines the machine learning model's inference with heuristic post-processing rules, incorporating both contextual sensor data and temporal stability mechanisms.

## 7.5.1 Combining ML Probabilities with Hard Thresholds (Visual/Heuristic Confirmation)

The core of the hybrid triggering logic involves a "hybrid safety check" that corroborates the AI model's probabilistic predictions with direct, physical sensor readings. A high probability of "fire" from the TinyML model is necessary but not sufficient to trigger an alarm; it must be supported by a "visual" or "heuristic" confirmation from the raw sensor data. This design philosophy directly addresses the limitations of relying solely on ML outputs, which might occasionally misinterpret complex sensor patterns.

The `runEiInferenceAndSetLed()` function within the `FireDetectionSystem` class is responsible for this logic. After the `run_classifier()` function provides the `ei_impulse_result_t`, the firmware extracts the `fireProb` (probability of fire class). Simultaneously, it retrieves raw sensor values from the feature buffer, specifically `rawSmoke` (from Analog pin A0, index 0 in `_features`) and `rawFlame` (from Analog pin A3, index 3 in `_features`).

A `visualConfirmation` boolean is determined by a logical OR operation:
```cpp
bool visualConfirmation = (rawSmoke > 60) || (rawFlame > 500); // For Testing
```
This heuristic rule stipulates that a physical manifestation of fire—either a significant smoke level (above 60, where baseline is typically around 90 but can vary) or a strong flame signal (above 500, indicating infrared radiation from a flame)—must be present. The `_fireThreshold` (e.g., 0.70f) sets the AI model's confidence level required. An alarm is triggered only if `fireProb >= _fireThreshold && visualConfirmation`. This two-factor authentication process significantly reduces false positives by filtering out scenarios where the AI might detect a fire-like pattern (e.g., high CO levels from non-fire sources) but no corroborating visual evidence exists (as noted in Section 7.4.2 regarding "[Suppressing] Model says Fire (High CO), but no Smoke/Flame detected."). Debug prints (`Serial.print("Prob:"); Serial.print(fireProb); Serial.print(" Smoke:"); Serial.print(rawSmoke); Serial.println(rawFlame);`) are integrated to aid in tuning these heuristic thresholds.

## 7.5.2 Temporal Debouncing (Consecutive Detection Requirements)

To further enhance alarm stability and prevent transient false alarms caused by momentary sensor spikes or fleeting environmental disturbances, a temporal debouncing mechanism is employed. This mechanism requires the system to detect "fire" conditions (AI model confirmation + heuristic confirmation) for a consecutive number of inference cycles before a full alarm is triggered.

Implemented using a `static int consecutiveFireCount` variable within the `runEiInferenceAndSetLed()` function, this counter increments each time the `fireProb >= _fireThreshold && visualConfirmation` condition is met. An actual alarm state (e.g., `digitalWrite(LED_BUILTIN, HIGH)`) is only activated when `consecutiveFireCount` reaches a predefined debounce threshold (e.g., `if (consecutiveFireCount >= 3)`). If the conditions for fire are not met in any cycle, `consecutiveFireCount` is reset to zero, effectively clearing any accumulating "fire" state.

This temporal integration ensures that the detected event is persistent and not merely a transient anomaly. It acts as a digital filter, providing a short memory to the alarm system, thereby increasing its reliability against fleeting disturbances and enhancing the user experience by reducing nuisance activations. The combination of ML probabilities, raw sensor heuristics, and temporal debouncing creates a robust, multi-layered approach to intelligent fire detection.

### References


