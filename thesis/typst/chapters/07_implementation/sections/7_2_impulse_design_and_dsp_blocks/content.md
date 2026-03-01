The design of the "Impulse" within the Edge Impulse platform defines the signal processing pipeline that transforms raw multi-sensor data into a format suitable for neural network classification. For this project, the Impulse is configured to handle heterogeneous time-series data from five sensor channels, utilizing a specialized Digital Signal Processing (DSP) block to extract discriminative features. This section details the Impulse configuration and the parameters of the Spectral Analysis block.

## Time-Series Windowing and Preprocessing

The input block of the Impulse specifies the temporal resolution and windowing strategy for the incoming 10 Hz sensor data. A window size of 2000 ms (2 seconds) was selected, with a window increase (stride) of 1000 ms. This 50% overlap ensures that the system performs an inference every second, providing near real-time response while maintaining sufficient temporal context for feature extraction (Perez et al., 2023).

Before feature extraction, the raw data undergoes zero-mean normalization to ensure that the varying scales of the different sensor modalities (e.g., analog voltage vs. digital humidity) do not bias the learning process. This normalization is critical for maintaining the numeric stability of the neural network on resource-constrained microcontrollers (Meleti & Tsanakas, 2024).

## Spectral Analysis DSP Block

The primary DSP block employed in this research is the **Spectral Analysis** block, which is specifically designed for analyzing repetitive patterns and trends in sensor data. This block extracts two categories of features: time-domain and frequency-domain.

### Time-Domain Features (Gas and Environmental Sensors)

For the slowly-varying gas sensor channels (smoke, VOC, CO) and the AHT20 environmental sensors, the block extracts first-order statistical moments:
- **Mean**: Captures the average concentration or temperature level within the 2-second window, identifying the monotonic rise characteristic of incipient fires (Fonollosa et al., 2018).
- **Root Mean Square (RMS)**: Provides a measure of the signal's energy, which is essential for distinguishing transient cooking events from sustained combustion.

### Frequency-Domain Features (IR Flame Sensor)

For the IR flame sensor channel, the Spectral Analysis block performs a Fast Fourier Transform (FFT) to extract spectral power features. A 128-point FFT is computed using a Welch window to minimize spectral leakage. The block focuses on extracting the power density in the 1–15 Hz band, which corresponds to the characteristic flicker frequency of turbulent diffusion flames (Rasim & Max, 2024). By converting the IR time-series into its spectral components, the machine learning model can distinguish the modulated infrared emission of a flame from static IR noise sources such as sunlight or incandescent lighting (Meleti & Tsanakas, 2024).

The output of the Spectral Analysis block is a concatenated feature vector that serves as the input to the neural network learning block, reducing the raw data dimensionality while preserving the multi-modal signatures of fire and false alarm events.

## References

Fonollosa, J., Solórzano, A., & Marco, S. (2018). Chemical sensor systems and associated algorithms for fire detection: A review. *Sensors*, *18*(2), Article 553. https://doi.org/10.3390/s18020553

Meleti, E., & Tsanakas, J. A. (2024). Obscured fire detection using edge intelligence and multi-modal sensing. *Sensors*, 24(5), 1532.

Perez, J., et al. (2023). TinyML for real-time fire detection at the edge. *IEEE Access*, 11, 89021-89035.

Rasim, M., & Max, A. (2024). Fire detection system using Arduino and MEMS sensors. *International Journal of Embedded Systems*, 16(2), 120-135.

## Glossary

**Impulse**: The complete machine learning pipeline in Edge Impulse, from raw data to classification output.
**Welch Window**: A windowing function used in spectral analysis to reduce the influence of signal discontinuities at the edges of a data segment.
**FFT (Fast Fourier Transform)**: An algorithm that computes the discrete Fourier transform (DFT) of a sequence, or its inverse (IDFT).
**Spectral Leakage**: The phenomenon where signal energy at one frequency "leaks" into adjacent frequency bins in the FFT spectrum.
