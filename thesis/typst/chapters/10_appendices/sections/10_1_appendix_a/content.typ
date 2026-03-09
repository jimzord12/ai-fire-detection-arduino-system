== Appendix A: Technical Schematics <appendix:schematics>
Technical schematics for the sensing node, including sensor wiring diagrams and PCB layouts (if applicable), are provided here.

The Autonomous Sensing Node is constructed using an Arduino UNO R4 WiFi integrated with a suite of five MEMS and analog sensors. This appendix provides the detailed wiring schedule and hardware configuration used for the experimental prototype.

=== Wiring Schedule

The sensors are interfaced with the Arduino UNO R4 WiFi according to the following pin assignment, ensuring both analog and digital communication requirements are met.

#figure(
  table(
    columns: (1.5fr, 1.5fr, 1fr, 1.2fr),
    inset: 10pt,
    align: horizon,
    [*Sensor*], [*Model*], [*Arduino Pin*], [*Signal Type*],
    [Smoke Sensor], [DFRobot SEN0570], [A0], [Analog (MEMS)],
    [VOC Sensor], [DFRobot SEN0566], [A1], [Analog (MEMS)],
    [CO Sensor], [DFRobot SEN0564], [A2], [Analog (MEMS)],
    [Flame Sensor], [DFRobot DFR0076], [A3], [Analog (IR)],
    [Temp/Hum Sensor], [DFRobot SEN0527], [SDA/SCL], [Digital (I2C)],
  ),
  caption: [Wiring Schedule for the Autonomous Sensing Node],
) <table-wiring-schedule>

=== Hardware Considerations

- *Power Supply*: All sensors are powered from the Arduino's 5V rail. Total current consumption remains within the 1.2A limit of the Arduino UNO R4's switching regulator, though an external 9V DC supply is recommended for stability during continuous inference.
- *I2C Bus*: The AHT20 sensor communicates over the I2C bus (address 0x38). Internal pull-up resistors on the Arduino UNO R4 are utilized.
- *Analog Reference*: The system uses the default 5V analog reference ($V_"ref"$). Sensor calibration constants in the firmware account for this voltage levels to ensure consistent feature extraction.
