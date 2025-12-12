void powerLed(bool state) {
  int mode = 0;
  if (state == true) {
    mode = 1;
  }
  digitalWrite(LED_BUILTIN, mode);
}

void setup() {
  Serial.begin(9600);
}

int sensorPin = A0;

void loop() {
  unsigned long t = millis();          // time since reset, in ms

  int voc = analogRead(sensorPin);

  if (voc >= 512) {
    powerLed(voc >= 512);
  }

  // CSV line: timestamp,flame
  Serial.print(t);
  Serial.print(",");
  Serial.println(voc);

  delay(1000);
}