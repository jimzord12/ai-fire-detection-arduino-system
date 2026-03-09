The development of the autonomous multi-sensor fire detection node provides a foundation for several promising avenues of future research. As the field of edge intelligence evolves, the integration of advanced connectivity protocols, remote management capabilities, and cooperative sensing strategies will be essential for scaling the system to complex, large-scale environments.

## Remote Model Management and Over-the-Air (OTA) Updates

A critical next step for the "Autonomous Sensing Node" is the implementation of robust Over-the-Air (OTA) update mechanisms. In practical deployment scenarios, such as industrial facilities or high-rise buildings, manually accessing each node for firmware updates is labor-intensive and inefficient. Future work should focus on utilizing the ESP32-S3's dual-core architecture to perform background updates of the TinyML model on the RA4M1 core. This would allow for the seamless redeployment of optimized neural networks as new training data—such as localized "false alarm" signatures unique to a specific installation—is collected and processed in the cloud (Hymel et al., 2023).

## Transition to Long-Range Protocols for Forest Deployment

While the current prototype utilizes WiFi for indoor telemetry, many high-risk fire zones, such as remote forests or rural industrial sites, lack stable network infrastructure. Integrating long-range, low-power protocols like LoRaWAN represents a significant scalability opportunity. Future research should examine the trade-offs between the low bandwidth of LoRaWAN and the high-frequency sampling requirements of the multi-sensor array. A "hybrid-edge" approach, where only high-confidence classification results and compact "event snapshots" are transmitted over long distances, would enable the deployment of wide-area sensing fabrics for early wildfire detection (Alajlan & Ibrahim, 2022).

## Cooperative Sensing and Multi-Node Consensus

Finally, the transition from individual nodes to a "Cooperative Sensing Fabric" offers a pathway to even greater detection reliability. By implementing decentralized consensus algorithms, multiple nodes in a shared zone could validate each other's classification results. For example, a "fire" detection by one node could be confirmed by its neighbors through the exchange of classification metadata, effectively creating a spatially distributed "truth sensor" network. This cooperative approach would further mitigate the impact of isolated sensor failures or localized nuisance triggers, providing a more resilient and fault-tolerant safety architecture for smart cities and industrial complexes (Novac et al., 2021).

## References

Alajlan, N. N., & Ibrahim, D. M. (2022). TinyML: Enabling of inference deep learning models on ultra-low-power IoT edge devices for AI applications. *Micromachines*, *13*(6), Article 851. https://doi.org/10.3390/mi13060851

Hymel, S., et al. (2023). Edge Impulse: An MLOps platform for tiny machine learning. *Proceedings of Machine Learning and Systems*, *5*, 1-18.

Novac, P.-E., Boukli Hacene, G., Pegatoquet, A., Miramond, B., & Gripon, V. (2021). Quantization and deployment of deep neural networks on microcontrollers. *Sensors*, *21*(9), Article 2984. https://doi.org/10.3390/s21092984
