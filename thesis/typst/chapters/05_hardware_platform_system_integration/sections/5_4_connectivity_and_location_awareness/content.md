I now have a solid replacement source. The Seoane et al. (2021) paper from _Computer Networks_ is peer-reviewed, fully accessible, and directly covers MQTT QoS, publish-subscribe architecture, and its suitability for constrained IoT devices — perfectly replacing the inaccessible Innamorati et al. (2025) reference. I'll now rebuild the section with this verified replacement.

---

# 5.4 Connectivity and Location Awareness

The autonomous fire detection node is not merely a sensing device; it functions as an intelligent edge reporter within a broader safety infrastructure. Once the on-device inference pipeline produces a classification result, that result must be transmitted reliably to a supervisory system while carrying sufficient contextual metadata to enable actionable emergency response. This section describes two complementary mechanisms that fulfil this requirement: a static location tagging scheme that encodes the physical deployment zone of each node, and an MQTT-based telemetry structure that conveys sensor readings and classification outputs to a remote broker.

## 5.4.1 Static Location Tagging (Zone_ID Implementation)

A fundamental limitation of many early IoT-based fire detection systems is their inability to report the _exact location_ of a detected event (See et al., 2020). When an alarm is raised without spatial context, emergency responders must physically search an entire facility, losing critical response time in the process. The present system addresses this limitation through a compile-time static location tagging mechanism, in which each deployed node is assigned a unique `Zone_ID` string prior to firmware flashing.

The `Zone_ID` is encoded directly in the firmware as a preprocessor constant and is appended to every outgoing MQTT message payload. Because the node is designed as a stationary autonomous unit rather than a mobile robot, a fixed identifier is both sufficient and operationally appropriate: the physical location of the sensor does not change between deployments, and runtime GPS acquisition would impose unnecessary power and latency overhead on the resource-constrained RA4M1 microcontroller. This design philosophy aligns with the broader principle that IoT sensor nodes can provide accurate location context by embedding the identity or address of each device directly in gateway messages, rather than relying on dynamic localisation algorithms (See et al., 2020).

In practice, the `Zone_ID` follows a hierarchical naming convention of the form `<building>/<floor>/<room>`, for example `BlockA/Floor2/Lab3`. This hierarchy mirrors established best practices for MQTT topic structuring, where topic levels flow from general to specific so that subscribing dashboards and alert engines can apply wildcard filters at any granularity (Kodali & Valdas, 2017). A building-management system may therefore subscribe to `BlockA/#` to receive all events from a single building, or to `BlockA/Floor2/Lab3/alert` for room-level granularity. The `Zone_ID` value is also embedded inside the JSON payload body, ensuring that location information is preserved even when message routing strips the topic prefix.

## 5.4.2 MQTT Telemetry Structure

The Message Queuing Telemetry Transport (MQTT) protocol was selected as the communication layer because of its publish–subscribe architecture, low protocol overhead, and demonstrated suitability for constrained embedded nodes communicating over Wi-Fi (See et al., 2020; Kodali & Valdas, 2017). MQTT operates on top of TCP/IP and introduces only a fixed 2-byte header per packet, making it significantly more bandwidth-efficient than HTTP-based alternatives for high-frequency sensor telemetry (Seoane et al., 2021). The ESP32-S3 co-processor on the Arduino UNO R4 WiFi handles all Wi-Fi stack operations and MQTT client tasks, offloading connectivity concerns from the RA4M1 inference core entirely.

The node publishes on two distinct topic branches. A **telemetry topic**, structured as `fire_node/<Zone_ID>/telemetry`, carries a periodic JSON payload containing raw sensor readings (smoke ADC, VOC index, CO ppm, IR flame ADC, temperature °C, humidity %RH) together with a Unix timestamp and firmware version string. An **alert topic**, structured as `fire_node/<Zone_ID>/alert`, is published only when the post-processing logic determines that the `fire` class confidence has exceeded the confirmation threshold across the required number of consecutive inference windows. This separation of passive telemetry from active alert messages is a recognised MQTT design principle, enabling fine-grained access control policies and allowing monitoring dashboards to distinguish between routine data streams and actionable alarms (Kodali & Valdas, 2017).

The alert payload includes the following fields: `zone_id`, `classification` (one of `fire`, `no_fire`, `false_alarm`), `confidence` (float, 0–1), `consecutive_hits` (integer), and individual sensor readings at the moment of trigger. Quality of Service (QoS) level 1 is applied to the alert topic, guaranteeing at-least-once delivery to the broker even under transient network disruptions — a critical requirement in a life-safety application (Seoane et al., 2021). Telemetry data is published at QoS 0 to minimise broker load during normal continuous monitoring. The broker retains the last alert message (`retain = true`), ensuring that a newly connected dashboard immediately receives the most recent system state without waiting for the next publish cycle.

---

## References

Kodali, R. K., & Valdas, A. (2017). MQTT implementation of IoT based fire alarm network. In _Proceedings of the 2017 International Conference on Electrical, Electronics, Communication, Computer, and Optimization Techniques (ICEECCOT)_ (pp. 1–5). IEEE. https://doi.org/10.1109/ICEECCOT.2017.8284656

See, Y. C., Muhamad Noor, M. H., & Ahmad Shukri, A. F. (2020). IoT-based fire safety system using MQTT communication protocol. _International Journal of Integrated Engineering_, _12_(6), 207–215. https://publisher.uthm.edu.my/ojs/index.php/ijie/article/view/6607

Seoane, V., Garcia-Rubio, C., Almenares, F., & Campo, C. (2021). Performance evaluation of CoAP and MQTT with security support for IoT environments. _Computer Networks_, _197_, 108338. https://doi.org/10.1016/j.comnet.2021.108338
