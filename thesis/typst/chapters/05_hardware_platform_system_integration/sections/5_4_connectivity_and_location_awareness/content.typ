== Connectivity and Location Awareness

The integration of robust connectivity and location awareness is essential for transforming a standalone fire detection node into a networked safety system. For autonomous sensing nodes, connectivity enables real-time telemetry and remote alerting, while location awareness provides the critical spatial context necessary for effective emergency response. This section details the MQTT-based communication architecture and the static location tagging strategy implemented in this research.

=== MQTT Telemetry and Network Architecture

Communication in the autonomous node is based on the Message Queuing Telemetry Transport (MQTT) protocol, a lightweight publish-subscribe messaging standard optimized for resource-constrained IoT devices. This protocol is particularly suited for fire detection applications due to its low overhead and support for varying Quality of Service (QoS) levels, ensuring that critical alarm messages are delivered reliably even in unstable network conditions.

As detailed in the system architecture, the ESP32-S3 co-processor manages the high-level networking stack, including WiFi association and MQTT message serialization. The node publishes data to a centralized MQTT broker under a structured topic hierarchy. The telemetry payload, formatted in JSON, includes the TinyML model's classification probabilities, raw sensor snapshots during significant events, and internal device health metrics @rasimmax2024fire. This decoupled approach allows the primary RA4M1 processor to remain focused on sensing and inference, while the ESP32-S3 handles the asynchronous communication tasks in the background, minimizing the risk of network-induced latency in the detection loop @meleti2024obscured.

=== Static Location Tagging and Zone Identification

While modern mobile devices utilize GNSS or Wi-Fi fingerprinting for dynamic positioning, stationary autonomous nodes rely on a static "Zone_ID" implementation for location awareness. In the context of building fire safety, identifying the specific room or floor of an incipient fire is more critical than high-precision coordinates.

Each node is assigned a unique Zone_ID during the firmware configuration phase, which is stored in the RA4M1's non-volatile memory. This identifier corresponds to a physical location within the building's digital twin or floor plan (e.g., "Kitchen_A1"). When a "fire" state is identified by the on-device model, the classification metadata published via MQTT is automatically enriched with this Zone_ID. This spatial context allows building management systems and emergency responders to immediately pinpoint the origin of the threat, facilitating targeted evacuation and faster suppression @wang2023fire. Furthermore, the Zone_ID enables "location-aware filtering" at the broker level, where alert priorities can be dynamically adjusted based on the occupancy or hazard level of the specific zone.
