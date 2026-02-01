# Deploy TinyML from Edge Impulse to Arduino 🚀

## Prerequisites:

- Have the Library built from Edge Impulse (see [Edge Impulse Platform - Arduino Library Build](./edge-impulse-platform/006-deployment-build-lib.md)).

## Guide

### Goal 1: Install in Arduino IDE

1. Open Arduino IDE.
2. Go to `Sketch` → `Include Library` → `Add .ZIP Library...`.
3. Select the .zip file downloaded from Edge Impulse (e.g., `ei-fire-detector-fusion-arduino-1.0.2.zip`).
4. Wait for the success message "Library installed".

### Goal 2: Update the Firmware Sketch to use the Model

1. **CRITICAL STEP**: You must update the line #include <fire-detection-fusion_inferencing.h> to match the actual name of the library you just installed.

> Tip: After installing the library, go to File -> Examples and look for your project name (e.g., "fire-detection-fusion..."). Open the static_buffer example to see the exact include name at the top.

Important notes before you paste:

You must change one line: the Edge Impulse header include. The name depends on the ZIP you downloaded (open Arduino IDE → File → Examples → your EI library → any example → copy the include line).
​

Your training CSV columns were timestamp,smoke,voc,co,flame,temp,hum, but your Arduino prints temperature/humidity. That’s fine, but for inference we must feed the model in the exact axis order you used in Edge Impulse (most likely: smoke, voc, co, flame, temp, hum).
​

## Notes after Deployment

### Model Flickerings

1. In Stable conditions (stable sensor readings), the model performs some spikes of false positives. What we are seeing is flickering (or "bouncing") predictions. This is very common in TinyML when the sensor values hover near the decision boundary or have slight noise.

Notice that your logs show [EI] fire=0.004 (very safe) most of the time, then suddenly [EI] fire=0.924 for one reading, then back to low. This single spike triggers your alarm instantly.

We can fix this easily in code using a Moving Average Filter (or "Debouncing"). Instead of alarming on a single bad reading, we wait for multiple consecutive bad readings.

**The Fix**

Modify the code to require 3 consecutive fire detections before turning on the alarm. This filters out these transient spikes.

Why this works:
Your spike 0.924 happens once. The counter goes to 1.

The next reading is 0.004. The counter resets to 0.

The alarm never sounds.

Real Fire: The probability will stay high (0.9, 0.9, 0.9...). The counter goes 1, 2, 3 -> ALARM.

This adds a slight delay (e.g., 2-6 seconds depending on your window overlap), but makes the system rock-solid against false positives. 🛡️

## Testing Notes

### Testing using only a lighter flame

The model may not detect fire. This is because there was not enough smoke, CO generated for the smoke sensor to pick up. For best results, test with a small piece of paper or wood that produces both flame and smoke.

Model Analysis of your Log:

Input: Flame=996 (High), Smoke=110 (Low), CO=39 (Low), VOC=456 (Low).

Output: Fire: 0.10, FalseAlarm: 0.63.

Interpretation:
The model is 63% confident that "High Light with No Smoke/Gas" is a False Alarm.
It is explicitly rejecting "clean fire" (like a lighter or sunlight reflection) because during your training, the "Fire" data almost always had Smoke+CO, and the "False Alarm" data (maybe sunlight or lamp tests) likely had high light without smoke.

Is this a problem?

For a real fire detector: No. Real fires create smoke. A detector that ignores a flashlight or sunlight (high light, no smoke) is actually better and less annoying than one that triggers on everything.

For your demo/grading: If you need the lighter to trigger it for a demo, you have two options:

Cheat the Demo: Blow unlit gas (CO) into it while lighting it (as you did successfully before).

Retrain (Not recommended now): Collect "clean flame" data and label it as "Fire".

Summary:
Your system works as designed. It fuses multiple sensors. It sees "Light" but "No Smoke", so it decides "Not Fire". That is intelligent sensor fusion in action! 🧠✅

### Improving Model Accuracy via Code Adjustments

As we want the AI to be smart, but you also want strict physical rules to prevent alarms when the data doesn't "look" like a fire to a human (e.g., invisible gas only).

Why is this happening?
In your training data, Carbon Monoxide (CO) was the "Super Feature."

False Alarms (Cooking/Spray) had High VOCs but Low CO.

Fires had High CO.

The model lazily learned: "If CO is high, it MUST be fire." It didn't learn that it also needs smoke or light, because it never saw "High CO" in the non-fire data.

The Fix: "Hybrid" Logic (AI + Rule-Based Safety)
We don't need to retrain. We can simply tell the Arduino:
"Only trigger the alarm if the AI says Fire AND (Flame OR Smoke is also high)."

This is extremely common in professional detectors to prevent exactly this issue.

```cpp
    void runEiInferenceAndSetLed() {
        signal_t signal;
        int err = numpy::signal_from_buffer(_features, EI_CLASSIFIER_DSP_INPUT_FRAME_SIZE, &signal);
        if (err != 0) { digitalWrite(LED_BUILTIN, LOW); return; }

        ei_impulse_result_t result = { 0 };
        err = run_classifier(&signal, &result, false);
        if (err != EI_IMPULSE_OK) { digitalWrite(LED_BUILTIN, LOW); return; }

        float fireProb = 0.0f;
        for (size_t ix = 0; ix < EI_CLASSIFIER_LABEL_COUNT; ix++) {
            if (strcmp(result.classification[ix].label, "fire") == 0) {
                fireProb = result.classification[ix].value;
                break;
            }
        }

        // --- HYBRID SAFETY CHECK ---
        // Retrieve raw values from the feature buffer (using your confirmed indices)
        // Ix0: Smoke, Ix1: VOC, Ix2: CO, Ix3: Flame
        float rawSmoke = _features[0];
        float rawFlame = _features[3];

        // Define what YOU consider a "Visual/Physical" Fire signature
        // Smoke > 200 (Baseline is ~90) OR Flame > 100 (Baseline is 0)
        bool visualConfirmation = (rawSmoke > 200) || (rawFlame > 100);

        // Debug prints to help you tune
        // Serial.print("Prob:"); Serial.print(fireProb);
        // Serial.print(" Smoke:"); Serial.print(rawSmoke);
        // Serial.print(" Flame:"); Serial.println(rawFlame);

        // --- LOGIC UPDATE ---
        // Only count as fire if Model is sure (> 70%) AND we see Smoke or Light
        if (fireProb >= _fireThreshold && visualConfirmation) {
            static int consecutiveFireCount = 0;
            consecutiveFireCount++;
            Serial.print("[EI] Fire Confirmed (AI + Sensors). Count: ");
            Serial.println(consecutiveFireCount);

            if (consecutiveFireCount >= 3) { // Debounce 3 times
                digitalWrite(LED_BUILTIN, HIGH);
                Serial.println(">>> ALARM TRIGGERED! <<<");
                consecutiveFireCount = 3;
            }
        } else {
            // Reset if AI drops OR if sensors don't agree
            static int consecutiveFireCount = 0;
            consecutiveFireCount = 0;
            digitalWrite(LED_BUILTIN, LOW);

            if (fireProb >= _fireThreshold && !visualConfirmation) {
                 Serial.println("[Suppressing] Model says Fire (High CO), but no Smoke/Flame detected.");
            }
        }
    }
```

What this does:
AI Layer: Checks complex patterns (CO vs VOC, etc).

Physical Layer: Checks raw threshold (Smoke > 200 OR Flame > 100).

Result:

Lighter (Clean Flame): AI says No (No CO), Safety says Yes (Flame). -> No Alarm.

Gas Leak (Invisible CO): AI says Yes (High CO), Safety says No (No Flame/Smoke). -> No Alarm. (Fixes your issue!)

Real Fire: AI says Yes, Safety says Yes. -> ALARM! 🚨
