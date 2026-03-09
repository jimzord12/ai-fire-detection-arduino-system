#import "../../../../../../assets/figures/hybrid_logic_flow.typ": hybrid_logic_flow

=== Hybrid Hardware-AI Decision Fusion

While TinyML models provide a powerful mechanism for pattern recognition at the edge, their raw probabilistic outputs are susceptible to generalization gaps when encountering environmental noise or edge-case fire signatures. To ensure the reliability of the autonomous sensing node in life-safety applications, a multi-layered hybrid decision fusion logic is implemented in the firmware (`fire-detection-main.ino`). This architecture combines probabilistic machine learning inference with deterministic hardware safety overrides and temporal stability mechanisms.

==== The "Clean Fire" Paradox and Implementation Rationale

The primary motivation for a hybrid approach is the "Clean Fire" Paradox. Laboratory-trained models often over-fit to the multi-modal signature of smoky fires (High Smoke + High CO + High VOC). However, clean-burning sources, such as butane lighters or alcohol fires, produce intense infrared (IR) radiation but negligible particulate or carbon monoxide spikes. In such cases, a pure AI model may correctly identify the lack of smoke as a "No-Fire" condition, effectively ignoring a life-threatening open flame. Conversely, direct sunlight can mimic the IR flicker of a flame, fooling the AI into a false positive. The hybrid logic resolves this by using the AI for complex nuisance rejection (e.g., cooking vs. fire) while maintaining deterministic "reflexes" for intense IR sources.

==== The 4-Stage Decision Matrix

The detection algorithm operates as an asymmetric decision matrix, illustrated in @fig:hybrid-logic-flow. This process ensures that every alarm is verified across four distinct stages of increasing confidence.

#figure(
  hybrid_logic_flow(), 
  caption: [Four-stage Hybrid Hardware-AI Decision Fusion Logic.],
) <fig:hybrid-logic-flow>

===== Stage 1: TinyML Inference
The system continuously samples all six sensors at 10 Hz, filling a 2-second sliding window. The Edge Impulse model performs inference to calculate the probability of the "Fire" class (`fireProb`). A primary confidence threshold (`_fireThreshold = 0.70f`) acts as the first gate.

===== Stage 2: Heuristic Verification (Hybrid Check)
If the AI predicts a fire with high confidence, the system performs a heuristic "sanity check" against real-time sensor data.
```cpp
bool smokeActive = (currentSmoke > 180); 
bool flameActive = (currentFlame > 150);
bool visualConfirmation = smokeActive || flameActive;
```
If `fireProb >= 0.70` but no physical evidence of smoke or flame is detected (`visualConfirmation == false`), the alarm is suppressed. This state is logged as "Likely Sunlight," preventing the IR signature of solar glare from triggering a false alarm.

===== Stage 3: Deterministic Hardware Override
To mitigate the "Clean Fire" Paradox, a deterministic override bypasses the AI model entirely if extreme conditions are met:
```cpp
bool criticalOverride = (currentFlame > 800);
```
If the IR intensity exceeds 800 (out of 1023), the system assumes a direct, intense flame is present and proceeds directly to Stage 4, regardless of the AI's probabilistic output.

===== Stage 4: Temporal Verification and Decay
To prevent transient spikes from causing nuisance alarms, the system requires a persistent fire state across three consecutive inference cycles (`_consecutiveFireCount >= 3`). 

Unlike traditional "snap-reset" systems, this implementation uses a *Temporal Decay* mechanism. If a fire state is no longer detected, the `_consecutiveFireCount` is decremented by one each cycle rather than being reset to zero. This "cooling down" period ensures alarm stability during fluctuating fire conditions (e.g., flickering flames or moving smoke plumes).
