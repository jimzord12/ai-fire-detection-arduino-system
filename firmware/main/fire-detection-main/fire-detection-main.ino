#include <Arduino.h>
#include <Wire.h>
#include "DFRobot_AHT20.h"

// 1) Edge Impulse include (CHANGE THIS to match your downloaded library name)
// Example names look like: <fire-detector-fusion_inferencing.h>
#include <fire-detector-fusion_inferencing.h>

/**
 * @brief Fire Detection System with Integrated Diagnostics
 * Optimized for Renesas RA4M1 (Arduino UNO R4)
 */

enum class SensorType { ANALOG, I2C };

struct SensorConfig {
    const char* name;
    SensorType type;
    int pinSDA;      // Analog Pin or I2C SDA
    int pinSCL;      // -1 or I2C SCL
    float threshold1;
    float threshold2;
};

// --- Configuration ---
static const SensorConfig SENSOR_MAP[] = {
    {"Smoke", SensorType::ANALOG, A0, -1, 900.0f, -1.0f},
    {"VOC",   SensorType::ANALOG, A1, -1, 300.0f, -1.0f},
    {"CO",    SensorType::ANALOG, A2, -1, 250.0f, -1.0f},
    {"Flame", SensorType::ANALOG, A3, -1, 512.0f, -1.0f},
    {"AHT20", SensorType::I2C,    A4, A5, 50.0f,  20.0f} // A4=SDA, A5=SCL
};

const int BAUD_RATE = 115200;
const bool DISABLE_LOGS = false;

class FireDetectionSystem {
private:
    DFRobot_AHT20 _aht;
    const uint32_t _sampleInterval = 100; // 10Hz
    uint32_t _lastTick = 0;

    // AHT20 state & re-init helpers
    bool _ahtInitialized = false;
    uint32_t _lastAhtReinitAttempt = 0;
    const uint32_t _ahtReinitInterval = 5000; // ms

    // Diagnostics state
    bool _systemFault = false;
    String _failedSensors = "";

    // 2) TinyML inference buffer + state (minimal additions)
    float _features[EI_CLASSIFIER_DSP_INPUT_FRAME_SIZE];
    size_t _feature_ix = 0;

    // Thresholds you can tune later
    const float _fireThreshold = 0.70f;     // LED ON if fire prob >= this
    const float _uncertainThreshold = 0.50f; // optional: treat as uncertain

    void printCell(String text, int width, bool last = false) {
        Serial.print(text);
        for (int i = text.length(); i < width; i++) Serial.print(" ");
        if (!last) Serial.print(" | ");
    }

    void printDivider() {
        Serial.println("+------------+----------+------------+----------+");
    }

    bool performSelfTest() {
        bool allOk = true;
        _failedSensors = "";

        for (const auto& s : SENSOR_MAP) {
            bool currentPassed = false;

            if (s.type == SensorType::ANALOG) {
                int val = analogRead(s.pinSDA);
                if (val > 0 && val < 1025) currentPassed = true;
            }
            else if (s.type == SensorType::I2C) {
                Wire.beginTransmission(0x38);
                if (Wire.endTransmission() == 0 && _aht.begin() == 0) {
                    currentPassed = true;
                    _ahtInitialized = true;
                }
            }

            if (!currentPassed) {
                allOk = false;
                if (_failedSensors.length() > 0) _failedSensors += ", ";
                _failedSensors += s.name;
            }
        }

        if (!allOk) {
            Serial.println("\n[SYSTEM] Initializing Hardware Self-Test...\n");

            printDivider();
            printCell(" TYPE", 10); printCell("NAME", 8); printCell("PIN", 10); printCell("STATUS", 8, true);
            Serial.println();
            printDivider();

            for (const auto& s : SENSOR_MAP) {
                bool currentPassed = false;
                String typeStr = (s.type == SensorType::ANALOG) ? " ANALOG" : " I2C";
                String pinStr;

                if (s.type == SensorType::ANALOG) {
                    if (s.pinSDA == A0) pinStr = "A0";
                    else if (s.pinSDA == A1) pinStr = "A1";
                    else if (s.pinSDA == A2) pinStr = "A2";
                    else if (s.pinSDA == A3) pinStr = "A3";
                    else pinStr = String(s.pinSDA);

                    int val = analogRead(s.pinSDA);
                    if (val >= 0 && val < 1025) currentPassed = true;
                }
                else if (s.type == SensorType::I2C) {
                    pinStr = "A4/A5";
                    Wire.beginTransmission(0x38);
                    if (Wire.endTransmission() == 0 && _aht.begin() == 0) {
                        currentPassed = true;
                        _ahtInitialized = true;
                    }
                }

                String statusStr = currentPassed ? "[ OK ]" : "[FAIL]";
                printCell(typeStr, 10);
                printCell(s.name, 8);
                printCell(pinStr, 10);
                printCell(statusStr, 8, true);
                Serial.println();
            }
            printDivider();

            Serial.println("\n>>> LOG: SYSTEM STATUS [FAULT]");
            Serial.print(">>> CRITICAL: The following sensors are NOT working: ");
            Serial.println(_failedSensors);
            Serial.println(">>> ACTION: Check physical connections and power.\n");
        }

        return allOk;
    }

    void alarmPattern(uint32_t currentMillis) {
        digitalWrite(LED_BUILTIN, (currentMillis / 100) % 2);
    }

    void blinkThreeTimes() {
        for (int i = 0; i < 3; i++) {
            digitalWrite(LED_BUILTIN, HIGH);
            delay(100);
            digitalWrite(LED_BUILTIN, LOW);
            delay(100);
        }
    }

    // Your original CSV logger kept as-is (useful for debugging)
    void logData() {
        bool ahtReady = _ahtInitialized && _aht.startMeasurementReady(true);

        Serial.print(millis());
        Serial.print(",");
        Serial.print(analogRead(A0));  // smoke
        Serial.print(",");
        Serial.print(analogRead(A1));  // voc
        Serial.print(",");
        Serial.print(analogRead(A2));  // co
        Serial.print(",");
        Serial.print(analogRead(A3));  // flame
        Serial.print(",");

        if (ahtReady) {
            Serial.print(_aht.getTemperature_C(), 2); // temp
            Serial.print(",");
            Serial.print(_aht.getHumidity_RH(), 2);   // hum
        } else {
            Serial.print("ERR,ERR");
        }
        Serial.println();
    }

    // 3) Minimal helper: read sensors (once) and push into EI buffer
    void pushSampleToEiBuffer() {
        // If AHT fails, we still must push numeric values (no "ERR" strings allowed)
        float temp = 0.0f;
        float hum  = 0.0f;

        bool ahtReady = _ahtInitialized && _aht.startMeasurementReady(true);
        if (ahtReady) {
            temp = _aht.getTemperature_C();
            hum  = _aht.getHumidity_RH();
        }

        // Axis order MUST match what you used in Edge Impulse:
        // smoke, voc, co, flame, temp, hum
        _features[_feature_ix + 0] = (float)analogRead(A0);
        _features[_feature_ix + 1] = (float)analogRead(A1);
        _features[_feature_ix + 2] = (float)analogRead(A2);
        _features[_feature_ix + 3] = (float)analogRead(A3);
        _features[_feature_ix + 4] = temp;
        _features[_feature_ix + 5] = hum;

        _feature_ix += EI_CLASSIFIER_RAW_SAMPLES_PER_FRAME;
    }

    // 4) Helper: run inference and debounce the output
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
        // bool visualConfirmation = (rawSmoke > 200) || (rawFlame > 500);
        bool visualConfirmation = (rawSmoke > 60) || (rawFlame > 500); // For Testing

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


public:
    void begin() {
        Serial.begin(BAUD_RATE);
        Wire.begin();
        Wire.setClock(100000);
        pinMode(LED_BUILTIN, OUTPUT);

        delay(1000);

        if (!performSelfTest()) {
            _systemFault = true;
        } else {
            blinkThreeTimes();
        }

        // Start in safe state
        digitalWrite(LED_BUILTIN, LOW);
        _feature_ix = 0;
    }

    void update() {
        uint32_t currentMillis = millis();

        if (_systemFault) {
            alarmPattern(currentMillis);
            return;
        }

        if (currentMillis - _lastTick >= _sampleInterval) {
            _lastTick = currentMillis;

            // Keep your CSV logger (optional, but helpful while validating)
            if (!DISABLE_LOGS) logData();

            // Fill the EI window
            pushSampleToEiBuffer();

            // When we have enough samples for one window, run inference
            if (_feature_ix >= EI_CLASSIFIER_DSP_INPUT_FRAME_SIZE) {
                runEiInferenceAndSetLed();
                _feature_ix = 0; // “snapshot” inference; minimal change approach
            }

            // AHT20 re-init attempt (your original logic)
            if (!_ahtInitialized &&
                (currentMillis - _lastAhtReinitAttempt >= _ahtReinitInterval)) {
                _lastAhtReinitAttempt = currentMillis;
                if (_aht.begin() == 0) {
                    _ahtInitialized = true;
                }
            }
        }
    }
};

// --- Execution ---
FireDetectionSystem systemManager;

void setup() {
    systemManager.begin();
}

void loop() {
    systemManager.update();
}
