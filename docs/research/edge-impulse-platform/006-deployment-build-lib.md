# Edge Impulse Platform - Arduino Library Build

## Guide

You are now ready to export this brain to your hardware.

Step 1: Build the Library

Click Deployment on the left menu.

In the search bar, type Arduino.

Click the Arduino library block.

Scroll down to the bottom.

Optimizations: Select Enable EON Compiler (this makes it run faster and use less RAM).

Quantization: For maximum accuracy do not select Quantized (int8) unless resources are very tight. The Arduino R4 series can handle the float model just fine.

Click Build.

Wait for the build to finish (it might take a minute). It will automatically download a .zip file (e.g., ei-fire-detection-fusion-arduino-1.0.1.zip).
