The integration of robust connectivity and location awareness is essential for transforming a standalone fire detection node into a networked safety system. For autonomous sensing nodes, connectivity enables real-time telemetry and remote alerting, while location awareness provides the critical spatial context necessary for effective emergency response. This section details the MQTT-based communication architecture and the static location tagging strategy implemented in this research.

## MQTT Telemetry and Network Architecture

Communication in the autonomous node is based on the Message Queuing Telemetry Transport (MQTT) protocol, a lightweight publish-subscribe messaging standard optimized for resource-constrained IoT devices. This protocol is particularly suited for fire detection applications due to its low overhead and support for varying Quality of Service (QoS) levels, ensuring that critical alarm messages are delivered reliably even in unstable network conditions.

As detailed in the system architecture, the ESP32-S3 co-processor manages the high-level networking stack, including WiFi association and MQTT message serialization. The node publishes data to a centralized MQTT broker under a structured topic hierarchy (e.g., `fire_system/nodes/[node_id]/telemetry`). The telemetry payload, formatted in JSON, includes the TinyML model's classification probabilities, raw sensor snapshots during significant events, and internal device health metrics (Rasim & Max, 2024). This decoupled approach allows the primary RA4M1 processor to remain focused on sensing and inference, while the ESP32-S3 handles the asynchronous communication tasks in the background, minimizing the risk of network-induced latency in the detection loop (Meleti & Tsanakas, 2024).

## Static Location Tagging and Zone Identification

While modern mobile devices utilize GNSS or Wi-Fi fingerprinting for dynamic positioning, stationary autonomous nodes rely on a static "Zone_ID" implementation for location awareness. In the context of building fire safety, identifying the specific room or floor of an incipient fire is more critical than high-precision coordinates.

Each node is assigned a unique `Zone_ID` during the firmware configuration phase, which is stored in the RA4M1's non-volatile memory (EEPROM). This identifier corresponds to a physical location within the building's digital twin or floor plan (e.g., "Kitchen_A1" or "Lab_Level_2"). When a "fire" state is identified by the on-device model, the classification metadata published via MQTT is automatically enriched with this `Zone_ID`. This spatial context allows building management systems and emergency responders to immediately pinpoint the origin of the threat, facilitating targeted evacuation and faster suppression (Wang et al., 2023). Furthermore, the `Zone_ID` enables "location-aware filtering" at the broker level, where alert priorities can be dynamically adjusted based on the occupancy or hazard level of the specific zone.

## References

Meleti, E., & Tsanakas, J. A. (2024). Obscured fire detection using edge intelligence and multi-modal sensing. *Sensors*, 24(5), 1532.

Rasim, M., & Max, A. (2024). Fire detection system using Arduino and MEMS sensors. *International Journal of Embedded Systems*, 16(2), 120-135.

Wang, L., et al. (2023). Fire detection and false alarm reduction using sensor fusion and deep learning. *Fire Safety Journal*, 138, 103812.

## Glossary

**MQTT (Message Queuing Telemetry Transport)**: A lightweight, publish-subscribe network protocol that transports messages between devices.
**JSON (JavaScript Object Notation)**: A lightweight data-interchange format that is easy for humans to read and write and easy for machines to parse and generate.
**Zone_ID**: A unique identifier assigned to a sensing node that represents its physical location in a building.
**EEPROM (Electrically Erasable Programmable Read-Only Memory)**: A type of non-volatile memory used in computers and other electronic devices to store small amounts of data.
**Publish-Subscribe**: A messaging pattern where senders (publishers) do not send messages directly to specific receivers (subscribers), but instead characterize published messages into classes without knowledge of which subscribers there may be.
