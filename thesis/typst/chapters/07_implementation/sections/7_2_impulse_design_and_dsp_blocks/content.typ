== Impulse Design and DSP Blocks

The design of the "Impulse" within the Edge Impulse platform defines the signal processing pipeline that transforms raw multi-sensor data into a format suitable for neural network classification. For this project, the Impulse is configured to handle heterogeneous time-series data from five sensor channels, utilizing a specialized Digital Signal Processing (DSP) block to extract discriminative features. This section details the Impulse configuration and the parameters of the Spectral Analysis block.

=== Time-Series Windowing and Preprocessing

The input block of the Impulse specifies the temporal resolution and windowing strategy for the incoming 10 Hz sensor data. A window size of 2000 ms (2 seconds) was selected, with a window increase (stride) of 1000 ms. This 50% overlap ensures that the system performs an inference every second, providing near real-time response while maintaining sufficient temporal context for feature extraction @perez2023tinyml.

Before feature extraction, the raw data undergoes zero-mean normalization to ensure that the varying scales of the different sensor modalities do not bias the learning process. This normalization is critical for maintaining the numeric stability of the neural network on resource-constrained microcontrollers @meleti2024obscured.

=== Spectral Analysis DSP Block

The primary DSP block employed in this research is the Spectral Analysis block, which is specifically designed for analyzing repetitive patterns and trends in sensor data. This block extracts two categories of features: time-domain and frequency-domain.

==== Time-Domain Features (Gas and Environmental Sensors)

For the slowly-varying gas sensor channels (smoke, VOC, CO) and the environmental sensors, the block extracts first-order statistical moments:
- *Mean*: Captures the average concentration or temperature level within the 2-second window, identifying the monotonic rise characteristic of incipient fires @fonollosa2018chemical.
- *Root Mean Square (RMS)*: Provides a measure of the signal's energy, which is essential for distinguishing transient cooking events from sustained combustion.

==== Frequency-Domain Features (IR Flame Sensor)

For the IR flame sensor channel, the Spectral Analysis block performs a Fast Fourier Transform (FFT) to extract spectral power features. A 128-point FFT is computed using a Welch window to minimize spectral leakage. The block focuses on extracting the power density in the 1–15 Hz band, which corresponds to the characteristic flicker frequency of turbulent diffusion flames @rasim2024fire. By converting the IR time-series into its spectral components, the machine learning model can distinguish the modulated infrared emission of a flame from static IR noise sources such as sunlight or incandescent lighting @meleti2024obscured.

The output of the Spectral Analysis block is a concatenated feature vector that serves as the input to the neural network learning block, reducing the raw data dimensionality while preserving the multi-modal signatures of fire and false alarm events.
