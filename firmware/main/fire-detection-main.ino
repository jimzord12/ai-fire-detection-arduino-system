#include <Arduino.h>
#include <Wire.h>
#include "DFRobot_AHT20.h"

/**
 * @brief Sensor Configuration & Logic
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

// --- Main Class ---

class FireDetectionSystem {
private:
    DFRobot_AHT20 _aht;
    const uint32_t _sampleInterval = 100; // 10Hz
    uint32_t _lastTick = 0;

    // AHT20 state & re-init helpers
    bool _ahtInitialized = false;
    uint32_t _lastAhtReinitAttempt = 0;
    const uint32_t _ahtReinitInterval = 5000; // ms


    void processAnalog(const SensorConfig& cfg) {
        Serial.print(analogRead(cfg.pinSDA));
        Serial.print(",");
    }

    void processI2C() {
        // Trigger measurement and wait for completion (enable CRC check)
        if (_ahtInitialized && _aht.startMeasurementReady(/* crcEn = */ true)) {
            Serial.print(_aht.getTemperature_C(), 2);
            Serial.print(",");
            Serial.print(_aht.getHumidity_RH(), 2);
        } else {
            // Measurement failed or sensor not initialized; print diagnostic markers
            Serial.print("ERR,ERR");
        }
    }

public:
    void begin() {
        Serial.begin(BAUD_RATE);
        Wire.begin();
        Wire.setClock(100000); // standard 100kHz I2C

        Serial.println("[AHT20] Initializing...");
        uint8_t status = 255;
        uint8_t attempts = 0;
        const uint8_t maxAttempts = 5;
        while ((status = _aht.begin()) != 0 && attempts < maxAttempts) {
            Serial.print("[AHT20] init failed status=");
            Serial.println(status);
            attempts++;
            delay(I2C_Stability_Wait);
        }
        if (status == 0) {
            _ahtInitialized = true;
            Serial.println("[AHT20] init succeeded");
        } else {
            _ahtInitialized = false;
            Serial.println("[AHT20] init failed - will retry in loop");
        }
    }

    void update() {
        uint32_t currentMillis = millis();
        if (currentMillis - _lastTick >= _sampleInterval) {
            _lastTick = currentMillis;
            runDiagnostics();

            // Attempt to reinitialize AHT20 periodically if not initialized
            if (!_ahtInitialized &&
                (currentMillis - _lastAhtReinitAttempt >= _ahtReinitInterval)) {
                _lastAhtReinitAttempt = currentMillis;
                Serial.println("[AHT20] Attempting re-init...");
                if (_aht.begin() == 0) {
                    _ahtInitialized = true;
                    Serial.println("[AHT20] re-init succeeded");
                } else {
                    Serial.println("[AHT20] re-init failed");
                }
            }
        }
    }

    void runDiagnostics() {
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
};

// --- Execution ---
FireDetectionSystem systemManager;

void setup() {
    systemManager.begin();
}

void loop() {
    systemManager.update();
}
