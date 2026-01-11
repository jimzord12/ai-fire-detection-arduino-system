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
    {"VOC",   SensorType::ANALOG, A1, -1, 300.0f, -1.0f},
    {"Smoke", SensorType::ANALOG, A0, -1, 900.0f, -1.0f},
    {"Flame", SensorType::ANALOG, A3, -1, 512.0f, -1.0f},
    {"CO",    SensorType::ANALOG, A2, -1, 250.0f, -1.0f},
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

    void processAnalog(const SensorConfig& cfg) {
        Serial.print(analogRead(cfg.pinSDA));
        Serial.print(",");
    }

    void processI2C() {
        if (_aht.startMeasurementReady()) {
            Serial.print(_aht.getTemperature_C());
            Serial.print(",");
            Serial.print(_aht.getHumidity_RH());
        } else {
            Serial.print("0.00,0.00"); // Safety fallback
        }
    }

public:
    void begin() {
        Serial.begin(BAUD_RATE);
        Wire.begin();

        while (_aht.begin() != 0) {
            delay(I2C_Stability_Wait);
        }
    }

    void update() {
        uint32_t currentMillis = millis();
        if (currentMillis - _lastTick >= _sampleInterval) {
            _lastTick = currentMillis;
            runDiagnostics();
        }
    }

    void runDiagnostics() {
        // Iterate through sensors using range-based for (C++11)
        for (const auto& sensor : SENSOR_MAP) {
            if (sensor.type == SensorType::ANALOG) {
                processAnalog(sensor);
            } else if (sensor.type == SensorType::I2C) {
                processI2C();
            }
        }
        Serial.println(); // End CSV row for Data Forwarder
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
