# Logic for Alarm Triggering

The alarm triggering mechanism within the Fire Detection System's firmware (`fire-detection-main.ino`) is designed to be robust and reliable, minimizing false positives while ensuring prompt response to genuine fire threats. This logic integrates the probabilistic output of the TinyML model with heuristic rules and temporal stability checks, forming a multi-layered decision-making process. The primary goal is to translate the system's "Fire" classification into a tangible alarm state (e.g., activating a siren or visual indicator).

## 7.6.1 Confidence Thresholds

At the core of the alarm decision is the confidence derived from the Edge Impulse model's inference. The `runEiInferenceAndSetLed()` function extracts the probability (`fireProb`) associated with the "fire" class from the `ei_impulse_result_t`. Two key confidence thresholds govern the model's contribution to the alarm:

*   **`_fireThreshold = 0.70f`**: This primary threshold dictates the minimum probability that the ML model must assign to the "fire" class for an alarm to be considered. If `fireProb` is below this value, the system remains in a non-alarm state, irrespective of other conditions. A value of 0.70f (70% confidence) ensures a high degree of certainty from the AI component before proceeding.
*   **`_uncertainThreshold = 0.50f`**: While not directly used in the final alarm triggering logic, this optional threshold serves as an indicator for potentially uncertain predictions. It can be utilized for logging or more nuanced decision-making in advanced scenarios, such as escalating monitoring without immediate alarm.

The `_fireThreshold` acts as the first gate in the alarm logic, ensuring that only high-confidence "fire" predictions from the TinyML model are considered for further processing.

## 7.6.2 Smoothing and Temporal Debouncing

To prevent spurious alarms caused by transient sensor noise or brief environmental fluctuations, the system incorporates a smoothing mechanism in the form of temporal debouncing. This ensures that a detected "fire" condition is persistent over a short period before escalating to a full alarm.

The debouncing is managed by a `static int consecutiveFireCount` variable. This counter is incremented only when two crucial conditions are simultaneously met:
1.  The `fireProb` from the ML model meets or exceeds the `_fireThreshold`.
2.  A `visualConfirmation` (as detailed in Section 7.5) is active, indicating physical evidence of smoke or flame.

If these combined conditions are met for a predefined number of consecutive inference cycles (`consecutiveFireCount >= 3`), then the alarm is fully triggered (`digitalWrite(LED_BUILTIN, HIGH)`). This `consecutiveFireCount` acts as a short-term memory, effectively smoothing the decision process over time. If the conditions for fire are not met in any given cycle, `consecutiveFireCount` is reset to zero, disarming any pending alarm.

This temporal debouncing, combined with the hybrid safety check, significantly enhances the system's resilience against nuisance alarms. It ensures that the alarm is only activated for persistent and credible fire events, improving the overall reliability and user trust in the autonomous sensing node.

### References


