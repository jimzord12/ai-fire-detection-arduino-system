#include <Arduino.h>
#include <Wire.h>
#include "DFRobot_AHT20.h"

// --- Professional Types ---
enum class SensorType { ANALOG, I2C };

struct SensorConfig {
    const char* label;
    const char* name;
    SensorType type;
    int pinD;
    const char* pinA;
};

// Configuration for Arduino UNO R4 WiFi
static const SensorConfig SENSOR_MAP[] = {
    {"ANALOG", "Smoke", SensorType::ANALOG, 14, "A0"},
    {"ANALOG", "VOC",   SensorType::ANALOG, 15, "A1"},
    {"ANALOG", "CO",    SensorType::ANALOG, 16, "A2"},
    {"ANALOG", "Flame", SensorType::ANALOG, 17, "A3"},
    {"I2C",    "AHT20", SensorType::I2C,    18, "A4/A5"}
};

DFRobot_AHT20 aht;

void printCell(String text, int width, bool last = false) {
    Serial.print(text);
    for (int i = text.length(); i < width; i++) Serial.print(" ");
    if (!last) Serial.print(" | ");
}

void printDivider() {
    Serial.println("+------------+----------+------------+----------+");
}

void setup() {
    Serial.begin(115200);
    pinMode(LED_BUILTIN, OUTPUT);

    // Boot-up sync
    for(int i = 0; i < 3; i++) {
        digitalWrite(LED_BUILTIN, HIGH); delay(100);
        digitalWrite(LED_BUILTIN, LOW);  delay(900);
    }

    Serial.println("\n[SYSTEM] Initializing Hardware Self-Test...");
    Serial.println();

    printDivider();
    printCell(" TYPE", 10); printCell("NAME", 8); printCell("PIN", 10); printCell("STATUS", 8, true);
    Serial.println();
    printDivider();

    bool allSystemOk = true;
    String failedList = "";

    for (const auto& s : SENSOR_MAP) {
        bool currentPassed = false;
        String pinDesc = String(s.pinD) + " (" + s.pinA + ")";

        if (s.type == SensorType::ANALOG) {
            int val = analogRead(s.pinD);
            if (val > 1 && val < 1024) currentPassed = true;
        }
        else if (s.type == SensorType::I2C) {
            Wire.begin();
            Wire.beginTransmission(0x38);
            if (Wire.endTransmission() == 0 && aht.begin() == 0) {
                currentPassed = true;
            }
        }

        String statusStr = currentPassed ? "[ OK ]" : "[FAIL]";
        printCell(" " + String(s.label), 10);
        printCell(s.name, 8);
        printCell(pinDesc, 10);
        printCell(statusStr, 8, true);
        Serial.println();

        if (!currentPassed) {
            allSystemOk = false;
            if (failedList.length() > 0) failedList += ", ";
            failedList += s.name;
        }
    }
    printDivider();

    // --- SYSTEM LOG SUMMARY ---
    Serial.println();
    if (allSystemOk) {
        Serial.println(">>> LOG: SYSTEM STATUS [PASS]");
        Serial.println(">>> All sensors are operational and within expected parameters.");
    } else {
        Serial.println(">>> LOG: SYSTEM STATUS [FAULT]");
        Serial.print(">>> CRITICAL: The following sensors are NOT working: ");
        Serial.println(failedList);
        Serial.println(">>> ACTION: Check physical connections and power for the listed sensors.");
    }
    Serial.println();
}

void loop() {
    digitalWrite(LED_BUILTIN, !digitalRead(LED_BUILTIN));
    delay(500);
}
