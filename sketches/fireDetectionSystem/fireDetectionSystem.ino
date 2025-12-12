void powerLed(bool state) {
  int mode = 0;
  if (state == true) {
    mode = 1;
  }
  digitalWrite(LED_BUILTIN, mode);
}

// 1. Define types to distinguish how to read data
enum SensorType {
  SENSOR_ANALOG,
  SENSOR_I2C_TEMP
};

// 2. Update Struct
struct Sensor {
  const char* name;
  SensorType type;    // <--- Added this
  int pin1;           // Analog pin OR SCL
  int pin2;           // -1 OR SDA
  float threshold;
};

// 3. Update Array
const Sensor sensors[] = {
  // Name,      Type,           Pin1, Pin2, Threshold
  {"VOC",       SENSOR_ANALOG,   A0,   -1,   300},
  {"Smoke",     SENSOR_ANALOG,   A1,   -1,   400},
  {"CO",        SENSOR_ANALOG,   A2,   -1,   250},
  {"AHT20",     SENSOR_I2C_TEMP, SCL,  SDA,  50.0}, // Threshold is now Deg C, not 0-1023
};

template <size_t N>
int getLength(const Sensor (&arr)[N]) {
  return N;
}

void setup() {
  Serial.begin(9600);
}

void loop() {

  const uint8_t SENSOR_COUNT = getLength(sensors);

  // Example of how to loop now:
  for(int i = 0; i < SENSOR_COUNT; i++) {
     // Add Sensor code here
  }

  delay(1000);
}