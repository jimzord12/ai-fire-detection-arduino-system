# Edge Impulse Platform - Create an Impulse

## Guide

1. Go to "Impulse design" (Sidebar) → "Create impulse".

2. Time series data settings:
   - Choose "Raw data" as the input type.
   - Set the window size to 2000 ms (2 seconds).
     Why? Your sensors (Flame/VOC) react relatively fast. 2 seconds captures enough history to see a trend or flicker without waiting too long.
   - Set the window increase to 1000 ms (1 second).
     Why? This creates overlapping windows (sliding window), effectively doubling your training data and making the model more robust to when exactly an event starts.
   - Frequency: Leave at 10 Hz (matched to your data).
   - Zero-pad data: Check this (Enable).

3. Add a learning block:
   - Click "Add a processing block".
   - Select Spectral Analysis.
     Why? Even though you have gas sensors, "Spectral Analysis" is the standard block for multi-sensor fusion in Edge Impulse. It calculates Statistical features (Mean, RMS—great for Gas/Temp) and Frequency features (Power spectrum—great for Flame flicker).

4. Add a learning block:
   - Click "Add a learning block".
   - Select "Classification".

5. Save the impulse design.
