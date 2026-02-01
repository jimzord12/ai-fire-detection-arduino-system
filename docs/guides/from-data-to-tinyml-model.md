# From Data to TinyML Model (Edge Impulse): Fire Detection with Sensor Fusion

## Phase 1: Create the Impulse (Model Architecture)

_Goal: Tell Edge Impulse how to process your raw data._

1.  **Go to "Impulse design" → "Create impulse"**.
2.  **Time series data settings**:
    - **Window size**: Set to **2000 ms** (2 seconds).
      - _Why?_ Your sensors (Flame/VOC) react relatively fast. 2 seconds captures enough history to see a trend or flicker without waiting too long.
    - **Window increase**: Set to **1000 ms**.
      - _Why?_ This creates overlapping windows (sliding window), effectively doubling your training data and making the model more robust to when exactly an event starts.
    - **Frequency**: Leave at **10 Hz** (matched to your data).
    - **Zero-pad data**: Check this (Enable).
3.  **Add a processing block**:
    - Click "Add a processing block".
    - Select **Spectral Analysis**.
    - _Why?_ Even though you have gas sensors, "Spectral Analysis" is the standard block for multi-sensor fusion in Edge Impulse. It calculates **Statistical** features (Mean, RMS—great for Gas/Temp) _and_ **Frequency** features (Power spectrum—great for Flame flicker).
4.  **Add a learning block**:
    - Click "Add a learning block".
    - Select **Classification (Keras)**.
5.  **Save Impulse**.

---

## Phase 2: Configure Features (Sensor Fusion)

_Goal: Extract meaningful numbers (features) from the raw signals._

1.  **Go to "Impulse design" → "Spectral features"**.
2.  **Parameters Tab**:
    - **Scale axes**: Check this box (Important! Your Flame values are ~900, but CO might be ~50. Scaling puts them on the same 0-1 playing field).
    - **Filter Type**: "None" is usually fine, or "Low-pass" if your readings are very noisy. Start with "None".
    - **FFT Length**: Keep default (e.g., 128 or 256).
    - _Advanced (Optional)_: If you want to be precise, you can disable "Take log of spectrum" for the gas sensors, but keeping defaults is fine for a beginner.
3.  **Generate features**:
    - Click **Save parameters**.
    - Click **Generate features**.
    - Wait for the process to complete.
4.  **Feature Explorer**:
    - Look at the 3D graph. You should see clusters of different colors (Blue = no_fire, Orange = fire, Green = false_alarm).
    - _Good sign:_ The "Fire" cluster is separated from "No Fire".
    - _Common overlap:_ "False Alarm" (cooking) might be close to "Fire". This is normal; the neural network will learn the fine boundary.

---

## Phase 3: Train the Neural Network

_Goal: Teach the model to distinguish the patterns._

1.  **Go to "Impulse design" → "Classifier"**.
2.  **Neural Network Settings**:
    - **Number of training cycles (epochs)**: Increase to **100** (default is often 30). This gives the model more time to learn.
    - **Learning rate**: `0.0005` or `0.001` (default is usually fine).
    - **Data augmentation**: Enable if available (helps preventing overfitting), but for sensor data, often disabled by default.
    - **Architecture**: The default 2 Dense layers (e.g., 20 neurons, 10 neurons) is usually sufficient for this amount of data.
3.  **Train**:
    - Click **Start training**.
    - Watch the "Loss" go down and "Accuracy" go up.
4.  **Evaluate Results**:
    - Look at the **Confusion Matrix** at the bottom.
    - **Target Accuracy**: > 90%.
    - Check specifically: Does it confuse "False Alarm" with "Fire"? If yes, you might need more training epochs or a slightly larger model.

---

## Phase 4: Test the Model

_Goal: Verify performance on data the model has NEVER seen._

1.  **Go to "Model testing"**.
2.  Click **"Classify all"**.
3.  Edge Impulse will run your trained model against the 20% test set you created.
4.  **Result**: You want an accuracy close to your training accuracy.
    - If Training = 99% and Testing = 60%, you are "Overfitting". (Solution: Reduce epochs, simplify model, or get more data).
    - If Training = 90% and Testing = 88-92%, you are **Ready to Deploy!**

---

## Phase 5: Deploy to Arduino

_Goal: Get the C++ library code._

1.  **Go to "Deployment"**.
2.  Search for **Arduino library**.
3.  Select it and click **Build** (scroll down).
4.  **Download**: This will give you a `.zip` file (e.g., `ei-fire-detection-arduino-1.0.1.zip`).
5.  **Install in Arduino IDE**:
    - Open Arduino IDE.
    - `Sketch` → `Include Library` → `Add .ZIP Library...`
    - Select the file you just downloaded.

---

## Phase 6: Create the Inference Sketch

_Goal: Bridge the library with your sensors._

You cannot just run your old sketch. You need a **new** sketch that combines your sensor reading logic with the Edge Impulse inference logic.

1.  **Open the Example**:
    - `File` → `Examples` → `[Your Project Name] Edge Impulse` → `static_buffer` (or `nano_ble33_sense_accelerometer` for a continuous template, but `static_buffer` is easier to understand first).
    - Actually, I recommend starting with a **clean new sketch** and copying the parts you need.

2.  **The "Magic" Logic**:
    - The model expects a list of numbers (raw features) exactly matching your Impulse input axes order (e.g., `Smoke, VOC, CO, Flame, Temp, Humidity` x Window Size).
    - Since we used a **2000 ms** window at **10 Hz**, the model expects: 2 seconds \* 10 samples/sec = **20 samples**.
    - Each "sample" contains all 6 sensor values.
    - So you need to pass an array of `20 * 6 = 120` floats to the classifier.

**Wait!** There is an easier way for continuous real-time monitoring: **"Continuous Inferencing"**.
However, implementation from scratch is tricky for beginners.

**Recommended Beginner Strategy (Snapshot Mode):**

1.  Read sensors for 2 seconds, storing data in a buffer.
2.  Run the classifier on that buffer.
3.  Print result (Fire/No Fire).
4.  Repeat.

**Here is a Complete "Inference Sketch" Template** for your exact setup. Copy this into a new Arduino Sketch.

```cpp
/*
 * Fire Detection Inference Sketch
 * Board: Arduino UNO R4 WiFi
 * Sensors: DFRobot Smoke, VOC, CO, Flame, AHT20
 */

#include <Arduino.h>
#include <Wire.h>
#include <DFRobot_AHT20.h>

// IMPORTANT: Include the library you just installed!
// The name depends on your project name in Edge Impulse.
// Go to Sketch > Include Library and check the exact name, or look at the example.
// It will look like: <ProjectName_inferencing.h>
#include <fire-detection-fusion_inferencing.h>

// --- Sensor Pin Definitions (Match your main sketch) ---
#define PIN_SMOKE A0
#define PIN_VOC   A1
#define PIN_CO    A2
#define PIN_FLAME A3

DFRobot_AHT20 aht20;

// --- Model Settings ---
// These must match your Edge Impulse settings exactly
#define FREQUENCY_HZ        10
#define INTERVAL_MS         (1000 / FREQUENCY_HZ) // 100ms
#define N_SENSORS           6  // Smoke, VOC, CO, Flame, Temp, Humid

// The "Window Size" from Impulse Design (e.g., 2000ms)
// EI_CLASSIFIER_DSP_INPUT_FRAME_SIZE is defined in the library automatically
// Check if it matches: (WindowSize / Interval) * N_Sensors

// Buffer to hold raw data for one window
float features[EI_CLASSIFIER_DSP_INPUT_FRAME_SIZE];

void setup() {
    Serial.begin(115200);
    while(!Serial);
    Serial.println("Starting Fire Detection Inference...");

    // Initialize AHT20
    Wire.begin();
    if (aht20.begin() != 0) {
        Serial.println("AHT20 Error!");
        while(1);
    }

    // Validate model settings
    if (EI_CLASSIFIER_RAW_SAMPLE_COUNT * N_SENSORS != EI_CLASSIFIER_DSP_INPUT_FRAME_SIZE) {
        Serial.print("Error: Model expects ");
        Serial.print(EI_CLASSIFIER_DSP_INPUT_FRAME_SIZE);
        Serial.print(" values, but code provides ");
        Serial.println(EI_CLASSIFIER_RAW_SAMPLE_COUNT * N_SENSORS);
        Serial.println("Check N_SENSORS and Window Size!");
        while(1);
    }
}

void loop() {
    Serial.println("Sampling...");

    // 1. Collect Data (Fill the Window)
    // We need to fill 'features[]' with 2 seconds of data
    for (int i = 0; i < EI_CLASSIFIER_RAW_SAMPLE_COUNT; i++) {
        uint32_t start = millis();

        // Read all sensors
        float smoke = analogRead(PIN_SMOKE);
        float voc = analogRead(PIN_VOC);
        float co = analogRead(PIN_CO);
        float flame = analogRead(PIN_FLAME);

        // AHT20 reading (start measurement if needed)
        float temp = 0;
        float humid = 0;
        if (aht20.startMeasurementReady(true)) {
             temp = aht20.getTemperature_C();
             humid = aht20.getHumidity_RH();
        }

        // Store in flat array. ORDER MATTERS!
        // Must match the order in Edge Impulse "Acquisition" tab exactly.
        // Usually alphabetical or insertion order. CHECK "Impulse Design" > "Spectral Features" to confirm order!
        // Assuming: Smoke, VOC, CO, Flame, Temp, Humidity (verify this!)
        int base_ix = i * N_SENSORS;
        features[base_ix + 0] = smoke;
        features[base_ix + 1] = voc;
        features[base_ix + 2] = co;
        features[base_ix + 3] = flame;
        features[base_ix + 4] = temp;
        features[base_ix + 5] = humid;

        // Wait for next sample to maintain 10Hz
        while (millis() - start < INTERVAL_MS);
    }

    // 2. Run Inference
    Serial.println("Running Inference...");

    // Create a signal object from the features buffer
    signal_t signal;
    int err = numpy::signal_from_buffer(features, EI_CLASSIFIER_DSP_INPUT_FRAME_SIZE, &signal);
    if (err != 0) {
        Serial.printf("Error creating signal: %d\n", err);
        return;
    }

    // Run classifier
    ei_impulse_result_t result = { 0 };
    err = run_classifier(&signal, &result, false /* debug */);
    if (err != EI_IMPULSE_OK) {
        Serial.printf("Error running classifier: %d\n", err);
        return;
    }

    // 3. Print Results
    Serial.println("Predictions:");
    for (size_t ix = 0; ix < EI_CLASSIFIER_LABEL_COUNT; ix++) {
        Serial.print("    ");
        Serial.print(result.classification[ix].label);
        Serial.print(": ");
        Serial.println(result.classification[ix].value, 2);
    }

    // Simple Logic
    // Adjust index  [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_3f9a5a2d-65e4-4fce-84eb-a32f30c9bde8/98808590-69c4-4ad6-ba9c-d6a6c455f3bb/fire-detection-main.md) based on your label order! (Check serial output)
    if (result.classification [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_3f9a5a2d-65e4-4fce-84eb-a32f30c9bde8/98808590-69c4-4ad6-ba9c-d6a6c455f3bb/fire-detection-main.md).value > 0.8) {
        Serial.println("🔥 FIRE DETECTED! 🔥");
    }

    Serial.println("--------------------------------");
}
```

**Crucial Check:** The order of `features[...]` in the loop **MUST** match the order of axes in your Edge Impulse project.

- Go to **Impulse design** -> **Spectral features**.
- Look at the "Selected axes" list on the right.
- Update the code (`features[base_ix + 0]`, etc.) to match that order perfectly. If you swap Smoke and Temp, the model will be garbage!
