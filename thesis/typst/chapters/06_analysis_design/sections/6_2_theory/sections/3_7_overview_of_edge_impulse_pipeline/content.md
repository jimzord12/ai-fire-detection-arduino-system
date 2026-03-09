The development and deployment of the machine learning model for the autonomous fire detection node are facilitated by the Edge Impulse platform, an integrated development environment specifically designed for TinyML. Edge Impulse provides an end-to-end pipeline that streamlines the transition from raw sensor data to optimized, on-device inference. This section provides an overview of the key stages in the Edge Impulse pipeline as implemented in this research.

## Data Ingestion and Labeling

The first stage of the pipeline involves the ingestion of high-frequency sensor data. In this project, data from the multi-sensor array is streamed from the Arduino UNO R4 WiFi to the Edge Impulse studio via the `edge-impulse-data-forwarder` or as pre-recorded CSV files (Edge Impulse, 2024). During this phase, data is organized into three distinct classes—fire, no_fire, and false_alarm—forming the basis for supervised learning. The platform's interface allows for precise windowing and cropping of the data to ensure that only the most relevant signal segments are used for training.

## Impulse Design and Digital Signal Processing (DSP)

The "Impulse" represents the complete data processing block within the platform. It consists of three primary components:

1.  **Input Block**: Defines the time-series window size (e.g., 10 seconds) and the sampling frequency (10 Hz).
2.  **DSP Block**: Performs feature extraction to reduce the dimensionality and complexity of the raw data. In this research, a "Spectral Analysis" block is typically employed to extract both time-domain (mean, RMS) and frequency-domain (FFT) features, which are critical for identifying flame flicker and gas trends (Fonollosa et al., 2018).
3.  **Learning Block**: Specifies the neural network architecture, such as a Multi-Layer Perceptron (MLP), for classification.

## Model Training and Validation

Once the features are extracted, the platform facilitates the training of the neural network. Edge Impulse provides a cloud-based environment for hyperparameter tuning—allowing for the adjustment of layer depth, neuron count, and learning rates—and offers real-time visualization of training and validation metrics (accuracy and loss). The platform's "Data Explorer" tool is particularly useful for visualizing the separability of classes in the feature space using dimensionality reduction techniques like T-distributed Stochastic Neighbor Embedding (t-SNE) (Edge Impulse, 2024).

## Deployment and Optimization

The final stage of the pipeline is the deployment of the trained model to the microcontroller. Edge Impulse utilizes the EON Compiler to optimize the model for specific hardware architectures, such as the ARM Cortex-M4. This optimization includes the application of Post-Training Quantization (PTQ) to convert the model to an 8-bit integer (INT8) representation, significantly reducing RAM and Flash usage while maintaining inference speed (Perez et al., 2023). The model is finally exported as a self-contained C++ library, which is integrated into the Arduino firmware for real-time, on-device fire detection.

## References

Edge Impulse. (2024). *Edge Impulse Documentation*. https://docs.edgeimpulse.com/

Fonollosa, J., Solórzano, A., & Marco, S. (2018). Chemical sensor systems and associated algorithms for fire detection: A review. *Sensors*, *18*(2), Article 553. https://doi.org/10.3390/s18020553

Perez, J., et al. (2023). TinyML for real-time fire detection at the edge. *IEEE Access*, 11, 89021-89035.

## Glossary

**Impulse**: The complete data processing and learning pipeline within the Edge Impulse platform.
**DSP (Digital Signal Processing) Block**: A module used to extract features from raw data.
**EON Compiler**: Edge Impulse's deep learning compiler that optimizes models for low-power microcontrollers.
**Data Forwarder**: A tool that allows for real-time streaming of sensor data from a device to the Edge Impulse studio.
