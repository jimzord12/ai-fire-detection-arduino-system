- Even though the Diagram in the Official Provider Documentation shows to connect the SCL & SCA pins to some Pins on Arduino, I was getting a `AHT20 sensor initialization failed. error status : 2` which means that the Arduino couldn't find the sensor on the I2C bus. After some research, I found out that while there are dedicated pins labeled SDA and SCL, they are internally multiplexed with pins A4 (SDA) and A5 (SCL). Using the analog pins often provides a more secure physical connection on breadboards, which resolves the "Device not found" error caused by intermittent contact. `https://forum.arduino.cc/t/uno-r4-wifi-i2c-pins/1383641`

- Communication Protocol: The AHT20 uses a standard I2C interface at address $0x38$. It requires a "Trigger Measurement" command ($0xAC$) followed by a $80ms$ wait time (handled by the library) for the MEMS sensor to stabilize.
  ​

- Data Reliability: In a fire detector, humidity is a critical "negative correlate." During a fire, relative humidity typically drops sharply as temperature rises. Including this in your Sensor Fusion model helps the Neural Network distinguish between a fire and a "steam" event (like a shower), which would show rising humidity.

- UNO R4 WiFi Pinout: The Renesas RA4M1 microcontroller manages I2C via the Wire library, which defaults to pins $18$ (SDA) and $19$ (SCL), which are physically mapped to the A4/A5 header on the board.
  ​

- TinyML Pre-processing: When training in Edge Impulse, ensure your Scale factor is set correctly. Since analog readings are $0-1023$ and temperature is $0-100$, normalization (Standardization) within the DSP block is vital for the Neural Network to weight these inputs equally.
