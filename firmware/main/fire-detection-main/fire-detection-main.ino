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

/**
 * @brief Single sensor snapshot read once per tick.
 * Eliminates redundant analogRead() and I2C calls across functions.
 */
struct SensorSnapshot {
    int   smoke;    // A0 raw ADC
    int   voc;      // A1 raw ADC
    int   co;       // A2 raw ADC
    int   flame;    // A3 raw ADC
    float temp;     // AHT20 temperature (°C), 0.0f if not ready
    float humidity; // AHT20 relative humidity (%RH), 0.0f if not ready
    bool  ahtReady; // whether temp/humidity values are valid
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
const bool DISABLE_LOGS = true;

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

    // Thresholds and Debounce
    const float _fireThreshold = 0.70f;
    int _consecutiveFireCount = 0;
    const int _maxFireCount = 5;

    // Physical confirmation thresholds (for hybrid safety check)
    static constexpr int SMOKE_CONFIRM_THRESHOLD = 180;
    static constexpr int FLAME_CONFIRM_THRESHOLD = 150;
    static constexpr int CO_CONFIRM_THRESHOLD    = 180;

    // Critical override thresholds (bypass AI entirely)
    static constexpr int FLAME_CRITICAL_THRESHOLD = 800;
    static constexpr int CO_CRITICAL_THRESHOLD    = 400;

    // Sensor count derived from SENSOR_MAP
    static constexpr size_t SENSOR_COUNT = sizeof(SENSOR_MAP) / sizeof(SENSOR_MAP[0]);

    /**
     * @brief Read all sensors exactly once per tick.
     * @return SensorSnapshot with current raw values.
     */
    SensorSnapshot readAllSensors() {
        SensorSnapshot snap;
        snap.smoke = analogRead(A0);
        snap.voc   = analogRead(A1);
        snap.co    = analogRead(A2);
        snap.flame = analogRead(A3);

        snap.ahtReady = _ahtInitialized && _aht.startMeasurementReady(true);
        if (snap.ahtReady) {
            snap.temp     = _aht.getTemperature_C();
            snap.humidity = _aht.getHumidity_RH();
        } else {
            snap.temp     = 0.0f;
            snap.humidity = 0.0f;
        }
        return snap;
    }

    void printCell(String text, int width, bool last = false) {
        Serial.print(text);
        for (int i = text.length(); i < width; i++) Serial.print(" ");
        if (!last) Serial.print(" | ");
    }

    void printDivider() {
        Serial.println("+------------+----------+------------+----------+");
    }

    /**
     * @brief Result of testing a single sensor during self-test.
     * Stored during the single pass, then used for display - no re-reading.
     */
    struct SelfTestResult {
        bool  passed;
        const char* name;
        const char* typeStr;
        const char* pinStr;
    };

    bool performSelfTest() {
        SelfTestResult results[SENSOR_COUNT];
        bool allOk = true;
        _failedSensors = "";
        bool ahtProbed = false;  // Guard: _aht.begin() called at most once

        // --- Single pass: test each sensor and store results ---
        for (size_t i = 0; i < SENSOR_COUNT; i++) {
            const auto& s = SENSOR_MAP[i];
            results[i].name    = s.name;
            results[i].passed  = false;
            results[i].typeStr = "";
            results[i].pinStr  = "";

            if (s.type == SensorType::ANALOG) {
                results[i].typeStr = " ANALOG";

                if      (s.pinSDA == A0) results[i].pinStr = "A0";
                else if (s.pinSDA == A1) results[i].pinStr = "A1";
                else if (s.pinSDA == A2) results[i].pinStr = "A2";
                else if (s.pinSDA == A3) results[i].pinStr = "A3";
                else                     results[i].pinStr = "??";

                int val = analogRead(s.pinSDA);
                results[i].passed = (val >= 0 && val < 1025);
            }
            else if (s.type == SensorType::I2C) {
                results[i].typeStr = " I2C";
                results[i].pinStr  = "A4/A5";

                // Probe I2C address first (non-destructive)
                Wire.beginTransmission(0x38);
                bool devicePresent = (Wire.endTransmission() == 0);

                if (devicePresent && !ahtProbed) {
                    // _aht.begin() called at most ONCE during self-test
                    if (_aht.begin() == 0) {
                        results[i].passed = true;
                        _ahtInitialized = true;
                    }
                    ahtProbed = true;
                } else if (devicePresent && ahtProbed) {
                    // Device is present but we already called begin(); trust prior result
                    results[i].passed = _ahtInitialized;
                }
            }

            if (!results[i].passed) {
                allOk = false;
                if (_failedSensors.length() > 0) _failedSensors += ", ";
                _failedSensors += s.name;
            }
        }

        // --- Display results from stored data (no re-reading) ---
        if (!allOk) {
            Serial.println("\n[SYSTEM] Initializing Hardware Self-Test...\n");

            printDivider();
            printCell(" TYPE", 10); printCell("NAME", 8); printCell("PIN", 10); printCell("STATUS", 8, true);
            Serial.println();
            printDivider();

            for (size_t i = 0; i < SENSOR_COUNT; i++) {
                const char* statusStr = results[i].passed ? "[ OK ]" : "[FAIL]";
                printCell(results[i].typeStr, 10);
                printCell(results[i].name,    8);
                printCell(results[i].pinStr,  10);
                printCell(statusStr,          8, true);
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

    /**
     * @brief Log sensor data in CSV format for Python logger.
     * Format: millis,smoke,voc,co,flame,temp,hum  (unchanged from v1.0)
     */
    void logData(const SensorSnapshot& snap) {
        Serial.print(millis());
        Serial.print(",");
        Serial.print(snap.smoke);
        Serial.print(",");
        Serial.print(snap.voc);
        Serial.print(",");
        Serial.print(snap.co);
        Serial.print(",");
        Serial.print(snap.flame);
        Serial.print(",");

        if (snap.ahtReady) {
            Serial.print(snap.temp, 2);
            Serial.print(",");
            Serial.print(snap.humidity, 2);
        } else {
            Serial.print("ERR,ERR");
        }
        Serial.println();
    }

    /**
     * @brief Push a single sample into the EI feature buffer.
     * Axis order: smoke, voc, co, flame, temp, hum (must match Edge Impulse model)
     */
    void pushSampleToEiBuffer(const SensorSnapshot& snap) {
        _features[_feature_ix + 0] = (float)snap.smoke;
        _features[_feature_ix + 1] = (float)snap.voc;
        _features[_feature_ix + 2] = (float)snap.co;
        _features[_feature_ix + 3] = (float)snap.flame;
        _features[_feature_ix + 4] = snap.temp;
        _features[_feature_ix + 5] = snap.humidity;

        _feature_ix += EI_CLASSIFIER_RAW_SAMPLES_PER_FRAME;
    }

    /**
     * @brief Run Edge Impulse inference and apply hybrid safety check.
     * Uses SensorSnapshot (no re-reading) and validates with Smoke + Flame + CO.
     */
    void runEiInferenceAndSetLed(const SensorSnapshot& snap) {
        signal_t signal;
        int err = numpy::signal_from_buffer(_features, EI_CLASSIFIER_DSP_INPUT_FRAME_SIZE, &signal);
        if (err != 0) { return; }

        ei_impulse_result_t result = { 0 };
        err = run_classifier(&signal, &result, false);
        if (err != EI_IMPULSE_OK) { return; }

        float fireProb = 0.0f;
        float noFireProb = 0.0f;
        float falseAlarmProb = 0.0f;

        for (size_t ix = 0; ix < EI_CLASSIFIER_LABEL_COUNT; ix++) {
            if (strcmp(result.classification[ix].label, "fire") == 0) fireProb = result.classification[ix].value;
            if (strcmp(result.classification[ix].label, "no_fire") == 0) noFireProb = result.classification[ix].value;
            if (strcmp(result.classification[ix].label, "false_alarm") == 0) falseAlarmProb = result.classification[ix].value;
        }

        // --- HYBRID SAFETY CHECK ---
        // CO is the "Truth Sensor" — most reliable differentiator between
        // real combustion and false alarms (spray/steam show high VOC/Smoke
        // but negligible CO).  (Ref: DATA_ANALYSIS_REPORT.md §5)
        bool smokeActive = (snap.smoke > SMOKE_CONFIRM_THRESHOLD);
        bool flameActive = (snap.flame > FLAME_CONFIRM_THRESHOLD);
        bool coActive    = (snap.co    > CO_CONFIRM_THRESHOLD);

        bool physicalConfirmation = smokeActive || flameActive || coActive;

        // CRITICAL OVERRIDE: If flame or CO is dangerously high, trigger regardless of AI
        bool criticalOverride = (snap.flame > FLAME_CRITICAL_THRESHOLD)
                             || (snap.co    > CO_CRITICAL_THRESHOLD);

        // Debug AI Thought Process
        Serial.print("[AI Probe] Fire: "); Serial.print(fireProb, 2);
        Serial.print(" | No-Fire: "); Serial.print(noFireProb, 2);
        Serial.print(" | False-Alarm: "); Serial.println(falseAlarmProb, 2);
        Serial.print("[Sensors] Smoke: "); Serial.print(snap.smoke);
        Serial.print(" | VOC: "); Serial.print(snap.voc);
        Serial.print(" | CO: "); Serial.print(snap.co);
        Serial.print(" | Flame: "); Serial.println(snap.flame);

        // --- LOGIC UPDATE ---
        if ((fireProb >= _fireThreshold && physicalConfirmation) || criticalOverride) {
            _consecutiveFireCount++;
            if (_consecutiveFireCount > _maxFireCount) _consecutiveFireCount = _maxFireCount;

            if (criticalOverride) {
                Serial.print(">>> CRITICAL OVERRIDE: ");
                if (snap.flame > FLAME_CRITICAL_THRESHOLD) Serial.print("INTENSE FLAME");
                if (snap.co    > CO_CRITICAL_THRESHOLD)    Serial.print("DANGEROUS CO");
                Serial.println(" DETECTED! <<<");
            }
            Serial.print("[SYSTEM] Fire Confirmed. Confidence Level: ");
            Serial.println(_consecutiveFireCount);

            if (_consecutiveFireCount >= 3) {
                digitalWrite(LED_BUILTIN, HIGH);
                Serial.println(">>> ALARM TRIGGERED! <<<");
            }
        } else {
            // Gradual decay if fire not detected
            if (_consecutiveFireCount > 0) {
                _consecutiveFireCount--;
                Serial.print("[INFO] Clearing... Level: ");
                Serial.println(_consecutiveFireCount);
            }

            if (_consecutiveFireCount == 0) {
                digitalWrite(LED_BUILTIN, LOW);
            }

            if (fireProb >= _fireThreshold && !physicalConfirmation) {
                Serial.print("[Suppressing] AI thinks Fire, but physical sensors see no ");
                Serial.print("Smoke/Flame/CO (likely Sunlight). ");
                Serial.print("[Smoke:"); Serial.print(snap.smoke);
                Serial.print(" Flame:"); Serial.print(snap.flame);
                Serial.print(" CO:"); Serial.println(snap.co);
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

            // READ SENSORS ONCE per tick - all consumers share this snapshot
            SensorSnapshot snap = readAllSensors();

            // Pass snapshot to all consumers
            if (!DISABLE_LOGS) logData(snap);
            pushSampleToEiBuffer(snap);

            // When we have enough samples for one window, run inference
            if (_feature_ix >= EI_CLASSIFIER_DSP_INPUT_FRAME_SIZE) {
                runEiInferenceAndSetLed(snap);
                _feature_ix = 0;
            }

            // AHT20 re-init attempt
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
