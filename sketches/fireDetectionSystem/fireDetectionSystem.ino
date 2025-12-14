#include <Arduino.h>
#include "DFRobot_AHT20.h"

// ================================
// Types first (so functions compile)
// ================================
enum SensorType {
  SENSOR_ANALOG,
  SENSOR_I2C_TEMP
};

struct Sensor {
  const char* name;
  SensorType type;   // How to read the sensor
  int pin1;          // Analog pin OR SCL
  int pin2;          // -1 OR SDA
  float threshold1;
  float threshold2;
};

// ================================
// Globals
// ================================
DFRobot_AHT20 tempHumidSensor;

// Name,   Type,           Pin1, Pin2, Threshold
const Sensor sensors[] = {
  {"VOC",   SENSOR_ANALOG,   A5,  -1,   300, -1},
  {"Smoke", SENSOR_ANALOG,   A4,  -1,   900, -1},
  {"Flame", SENSOR_ANALOG,   A3,  -1,   512, -1},
  {"CO",    SENSOR_ANALOG,   A2,  -1,   250, -1},
  {"AHT20", SENSOR_I2C_TEMP, SCL, SDA,  50.0, 20.0}, // Threshold is Deg C (example)
};

template <size_t N>
constexpr uint8_t getLength(const Sensor (&)[N]) {
  return (uint8_t)N;
}

// ================================
// Helper functions
// ================================
void powerLed(bool state) {
  digitalWrite(LED_BUILTIN, state ? HIGH : LOW);
}

using TimeoutCallback = void (*)();

struct TimeoutTimer {
  uint32_t startMs = 0;
  uint32_t timeoutMs = 0;
  TimeoutCallback cb = nullptr;
  bool armed = false;
  bool fired = false;

  void start(uint32_t durationMs, TimeoutCallback callback) {
    startMs = millis();
    timeoutMs = durationMs;
    cb = callback;
    armed = true;
    fired = false;
  }

  void cancel() {
    armed = false;
  }

  void update() {
    if (!armed || fired || cb == nullptr) return;

    // rollover-safe elapsed check (millis() subtraction pattern)
    if ((uint32_t)(millis() - startMs) >= timeoutMs) {  // [web:8]
      fired = true;
      armed = false;     // one-shot
      cb();              // call the user function
    }
  }
};



int isAht20Ready = -1;

void setupAHT20() {

  const uint8_t SENSOR_COUNT = getLength(sensors);
  for (uint8_t i = 0; i < SENSOR_COUNT; i++) {
    const Sensor s = sensors[i];
    if (s.name != "AHT20") return;
  }

  isAht20Ready = tempHumidSensor.begin();

  if (isAht20Ready != 0) {
    Serial.print("AHT20 sensor initialization failed. error status: ");
    Serial.println(isAht20Ready);
  }
}

void csvLogger(const Sensor& s, int sensorValue1, int sensorValue2) {
  unsigned long t = millis();
  Serial.print(t);
  Serial.print(',');
  Serial.print(s.name);
  Serial.print(',');

  if (sensorValue2 != -1) {
    // I2C Sensor (Temp & Humidity)
    Serial.print("temp");
    Serial.print(',');
    Serial.print("humidity");
    Serial.print(',');
  }

  Serial.print(sensorValue1);

  if (sensorValue2 != -1) {
    Serial.print(',');
    Serial.print(sensorValue2);
  }

  Serial.println(); // end the CSV line
}

TimeoutTimer t;

void onTimeout() {
  powerLed(false);
}

// ================================
// Arduino entry points
// ================================
void setup() {
  Serial.begin(9600);
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
  t.update(); // <-- otherwise timer does not work

  bool areWeOnFire = false;
  if (isAht20Ready != 0) {
    setupAHT20(); // IMPORTANT: initialize AHT20
  }

  const uint8_t SENSOR_COUNT = getLength(sensors);

  for (uint8_t i = 0; i < SENSOR_COUNT; i++) {
    const Sensor& s = sensors[i];

    if (s.type == SENSOR_ANALOG && s.pin2 == -1) {
      int sensorValue = analogRead(s.pin1);
      csvLogger(s, sensorValue, -1);

      if (sensorValue > s.threshold1) {
        areWeOnFire = true;
      }
    }

    if (s.type == SENSOR_I2C_TEMP && isAht20Ready == 0 && s.pin2 != -1) {
      int temp = (int)tempHumidSensor.getTemperature_C();
      int humidity = (int)tempHumidSensor.getHumidity_RH();
      csvLogger(s, temp, humidity);

      if (temp > s.threshold1 || humidity > s.threshold2) {
        areWeOnFire = true;
      }
    }

  }

  if (areWeOnFire == true) {
    if (t.armed == true) {
      t.cancel();
    }

    powerLed(true);
    t.start(2000, onTimeout);  // fire once after 2 seconds
  }

  delay(1000);
}
