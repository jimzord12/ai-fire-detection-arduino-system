== Future Work

The development of the autonomous multi-sensor fire detection node provides a foundation for several promising avenues of future research. As the field of edge intelligence evolves, the integration of advanced connectivity protocols, remote management capabilities, and cooperative sensing strategies will be essential for scaling the system to complex, large-scale environments.

=== Remote Model Management and Over-the-Air (OTA) Updates

A critical next step for the autonomous sensing node is the implementation of robust Over-the-Air (OTA) update mechanisms. In practical deployment scenarios, manually accessing each node for firmware updates is labor-intensive and inefficient. Future work should focus on utilizing the secondary co-processor to perform background updates of the TinyML model. This would allow for the seamless redeployment of optimized neural networks as new training data is collected and processed in the cloud @hymel2023edge.

=== Stress Testing and Noise-Injection for Reliability

Given the safety-critical nature of fire detection, future validation should move beyond static datasets toward dynamic **stress testing and noise-injection**. This involves intentionally corrupting sensor inputs with synthetic noise, simulated sensor drift, or adversarial environmental transients to identify the limits of the model's robustness. Such testing is essential for verifying that the "perfect" separability observed in laboratory conditions translates to a reliable safety margin in high-entropy real-world environments @muller2024classification.

While the current prototype utilizes WiFi for indoor telemetry, many high-risk fire zones lack stable network infrastructure. Integrating long-range, low-power protocols like LoRaWAN represents a significant scalability opportunity. Future research should examine the trade-offs between the low bandwidth of LoRaWAN and the high-frequency sampling requirements of the multi-sensor array. A hybrid-edge approach would enable the deployment of wide-area sensing fabrics for early wildfire detection @alajlan2022tinyml.

=== Cooperative Sensing and Multi-Node Consensus

Finally, the transition from individual nodes to a cooperative sensing fabric offers a pathway to even greater detection reliability. By implementing decentralized consensus algorithms, multiple nodes in a shared zone could validate each other's classification results. For example, a fire detection by one node could be confirmed by its neighbors through the exchange of classification metadata, effectively creating a spatially distributed truth sensor network. This cooperative approach would further mitigate the impact of isolated sensor failures or localized nuisance triggers @novac2021quantization.
