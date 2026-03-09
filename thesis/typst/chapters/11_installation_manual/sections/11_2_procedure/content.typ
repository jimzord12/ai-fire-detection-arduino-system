== Installation Procedure

=== Hardware Assembly
The sensing node is assembled by connecting the multi-sensor suite to the Arduino UNO R4 WiFi as specified in the following wiring schedule:

1. *Smoke Sensor (MEMS)*: VCC to 5V, GND to GND, AOUT to Analog Pin A0.
2. *VOC Sensor (MEMS)*: VCC to 5V, GND to GND, AOUT to Analog Pin A1.
3. *CO Sensor (MEMS)*: VCC to 5V, GND to GND, AOUT to Analog Pin A2.
4. *Flame Sensor (Analog)*: VCC to 5V, GND to GND, AOUT to Analog Pin A3.
5. *AHT20 (I2C)*: VCC to 5V, GND to GND, SDA to SDA, SCL to SCL.

Care must be taken to ensure that the total current draw of the sensors does not exceed the limits of the Arduino's 5V regulator. For extended experimental sessions, an external 5V power supply is recommended.

=== Firmware Upload
The production firmware is located in the `firmware/main/fire-detection-main/` directory. To deploy the system:

1. Open the `.ino` file in the Arduino IDE.
2. Ensure the "Arduino UNO R4 WiFi" board definition is installed via the Boards Manager.
3. Install the `DFRobot_AHT20` and the project-specific Edge Impulse library.
4. Connect the Arduino via USB and select the appropriate serial port.
5. Click "Upload" to compile and flash the firmware.
