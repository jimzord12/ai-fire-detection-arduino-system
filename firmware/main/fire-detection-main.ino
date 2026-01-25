#include <Arduino.h>
#include <Wire.h>
#include "DFRobot_AHT20.h"

/**
 * @brief Fire Detection System with Integrated Diagnostics
 * Optimized for Renesas RA4M1 (Arduino UNO R4)
 */

enum class SensorType {
    ANALOG,
    I2C
};

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
const int I2C_Stability_Wait = 500;

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

    void printCell(String text, int width, bool last = false) {
        Serial.print(text);
        for (int i = text.length(); i < width; i++) Serial.print(" ");
        if (!last) Serial.print(" | ");
    }

    void printDivider() {
        Serial.println("+------------+----------+------------+----------+");
    }

    /**
     * @brief Performs a hardware self-test on all configured sensors.
     * @return true if all sensors passed, false otherwise.
     */
    bool performSelfTest() {
        Serial.println("\n[SYSTEM] Initializing Hardware Self-Test...");
        Serial.println();

        printDivider();
        printCell(" TYPE", 10); printCell("NAME", 8); printCell("PIN", 10); printCell("STATUS", 8, true);
        Serial.println();
        printDivider();

        bool allOk = true;
        _failedSensors = "";

        for (const auto& s : SENSOR_MAP) {
            bool currentPassed = false;
            String typeStr = (s.type == SensorType::ANALOG) ? " ANALOG" : " I2C";
            String pinStr;

            if (s.type == SensorType::ANALOG) {
                // Map analog pin constants to readable strings
                if (s.pinSDA == A0) pinStr = "A0";
                else if (s.pinSDA == A1) pinStr = "A1";
                else if (s.pinSDA == A2) pinStr = "A2";
                else if (s.pinSDA == A3) pinStr = "A3";
                else pinStr = String(s.pinSDA);

                int val = analogRead(s.pinSDA);
                // Basic heuristic: check if sensor is within expected electronic bounds
                if (val > 5 && val < 1018) currentPassed = true;
            } 
            else if (s.type == SensorType::I2C) {
                pinStr = "A4/A5";
                Wire.beginTransmission(0x38); // AHT20 Default Address
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

            if (!currentPassed) {
                allOk = false;
                if (_failedSensors.length() > 0) _failedSensors += ", ";
                _failedSensors += s.name;
            }
        }
        printDivider();

        if (allOk) {
            Serial.println("\n>>> LOG: SYSTEM STATUS [PASS]");
            Serial.println(">>> All sensors are operational and within expected parameters.");
        } else {
            Serial.println("\n>>> LOG: SYSTEM STATUS [FAULT]");
            Serial.print(">>> CRITICAL: The following sensors are NOT working: ");
            Serial.println(_failedSensors);
            Serial.println(">>> ACTION: Check physical connections and power.");
        }
        Serial.println();
        return allOk;
    }

    void alarmPattern(uint32_t currentMillis) {
        // Fast alarming blink: 100ms ON, 100ms OFF
        digitalWrite(LED_BUILTIN, (currentMillis / 100) % 2);
    }

    void logData() {
        Serial.print(millis());
        Serial.print(",");
        Serial.print(analogRead(A0));  // Smoke
        Serial.print(",");
        Serial.print(analogRead(A3));  // Flame
        Serial.print(",");
        Serial.print(analogRead(A2));  // CO
        Serial.print(",");
        Serial.print(analogRead(A1));  // VOC
        Serial.print(",");
        if (_ahtInitialized && _aht.startMeasurementReady(/*crcEn=*/true)) {
            Serial.print(_aht.getTemperature_C(), 2);
            Serial.print(",");
            Serial.print(_aht.getHumidity_RH(), 2);
        } else {
            Serial.print("ERR,ERR");
        }
        Serial.println();
    }

public:
    void begin() {
        Serial.begin(BAUD_RATE);
        Wire.begin();
        Wire.setClock(100000); // Standard 100kHz I2C
        pinMode(LED_BUILTIN, OUTPUT);

        // Allow some time for Serial to connect and sensors to stabilize
        delay(1000);

        if (!performSelfTest()) {
            _systemFault = true;
        }
    }

    void update() {
        uint32_t currentMillis = millis();

        // If system is in fault state, block operation and alarm
        if (_systemFault) {
            alarmPattern(currentMillis);
            return;
        }

        // Normal sensor logging at sample interval
        if (currentMillis - _lastTick >= _sampleInterval) {
            _lastTick = currentMillis;
            logData();

            // Periodic re-initialization attempt for AHT20 if it was lost
            if (!_ahtInitialized &&
                (currentMillis - _lastAhtReinitAttempt >= _ahtReinitInterval)) {
                _lastAhtReinitAttempt = currentMillis;
                if (_aht.begin() == 0) {
                    _ahtInitialized = true;
                }
            }
        }

        // Operational heartbeat (slow blink)
        digitalWrite(LED_BUILTIN, (currentMillis / 1000) % 2);
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