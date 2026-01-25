// Flame sensor on Arduino UNO R4 WiFi
// VCC -> 5V, GND -> GND, AO -> A0

bool isLEDSetup = false;
PinStatus LEDState = LOW;

// Use "String" (Arduino class) or const char* instead of "string"
void prt(const char *text) {
  Serial.println(text);
}

void setupLED(pin_size_t pinNumber, PinMode mode) {
  pinMode(pinNumber, mode);
  isLEDSetup = true;
}

void setup() {
  Serial.begin(9600);          // Start serial at 9600 baud
  setupLED(LED_BUILTIN, OUTPUT); // Use the built-in LED (on pin 13 on Uno R4 WiFi)
}

void lightLED() {
  if (!isLEDSetup) {
    prt("ERROR: LED is not setup!");
    return;
  }
  digitalWrite(LED_BUILTIN, HIGH);  // Turn LED on
  LEDState = HIGH;
}

void closeLED() {
  if (!isLEDSetup) {
    prt("ERROR: LED is not setup!");
    return;
  }
  digitalWrite(LED_BUILTIN, LOW);   // Turn LED off
  LEDState = LOW;
}

void loop() {
  int flameSensorValue = analogRead(A0);  // Read analog 0–1023
  Serial.print("Flame value: ");
  Serial.println(flameSensorValue);

  if (flameSensorValue > 512) {
    lightLED();
  } else {
    closeLED();
  }

  delay(500);  // 500 ms
}
