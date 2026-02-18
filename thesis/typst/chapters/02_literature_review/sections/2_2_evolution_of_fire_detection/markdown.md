Fire detection technology has evolved from simple mechanical thermal triggers to modern intelligent systems that utilize Micro-Electro-Mechanical Systems (MEMS) and Tiny Machine Learning (TinyML) for real-time edge inference. This transition is driven by the need to reduce false alarms and increase detection sensitivity through multi-criteria sensor fusion and localized artificial intelligence. [scribd](https://www.scribd.com/document/966031754/NFPA-72-2025)

## Generational Shifts

The evolution of fire detection is characterized by four distinct technological generations that have progressively moved toward higher sensitivity and lower false alarm rates. [academia](https://www.academia.edu/27260656/Historical_Development_of_Fire_Detection_System_Technology_on_Ships)

- **First Generation (1840s–1940s):** Early systems relied on thermal and mechanical triggers, often integrated with telegraph systems for city-wide notification. [epssecurity](https://www.epssecurity.com/news/eps-news/a-brief-history-of-fire-alarm-systems/)
- **Second Generation (1940s–1970s):** The introduction of ionization and photoelectric (optical) point-smoke detectors allowed for the detection of combustion particles before significant heat was generated. [proquest](https://www.proquest.com/scholarly-journals/historical-development-fire-detection-system/docview/1490550612/se-2)
- **Third Generation (1975–1990s):** Analog-addressable systems emerged, utilizing integrated circuits (ICs) for miniaturization and allowing individual detectors to communicate specific location data to a central panel. [forums.thefirepanel](https://forums.thefirepanel.com/t/history-of-fire-alarms-by-generation/3507)
- **Fourth Generation (2000s–Present):** Modern systems incorporate MEMS-based multi-gas sensing (VOC, CO, \(CO_2\)) and multi-criteria fusion to distinguish between real fires and nuisance sources like cooking fumes. [watchgas](https://watchgas.com/app/uploads/2025/02/The-New-Generation-of-MEMS-Based-Combustible-Gas-Sensors.pdf)

## Integration of AI

Artificial Intelligence (AI) has transitioned from a theoretical research tool to a core component of intelligent fire detection pipelines, primarily between 2015 and 2025. [pmc.ncbi.nlm.nih](https://pmc.ncbi.nlm.nih.gov/articles/PMC12331093/)

- **Pattern Recognition (2020–2022):** Research established the effectiveness of Back-Propagation Neural Networks (BPNN) and Support Vector Machines (SVM) in fusing multi-sensor data to improve accuracy by over 2.5% compared to rule-based systems. [pmc.ncbi.nlm.nih](https://pmc.ncbi.nlm.nih.gov/articles/PMC9228805/)
- **Deep Learning Pipelines (2023–2025):** Recent milestones include the use of Temporal Convolutional Networks (TCN) for time-series sensor data and hybrid ML models that maintain accuracy even when individual sensors fail. [pmc.ncbi.nlm.nih](https://pmc.ncbi.nlm.nih.gov/articles/PMC11991413/)
- **Vision-Sensor Fusion:** Advanced algorithms like FCMI-YOLO and YOLOFM were introduced in 2024–2025 to optimize the trade-off between detection speed and computational complexity on edge devices. [pmc.ncbi.nlm.nih](https://pmc.ncbi.nlm.nih.gov/articles/PMC10894257/)

## The Rise of TinyML

The emergence of "Edge AI" and TinyML represents a shift from cloud-dependent IoT systems to on-device inference, significantly reducing latency and enhancing privacy. [pmc.ncbi.nlm.nih](https://pmc.ncbi.nlm.nih.gov/articles/PMC12331093/)

- **Low-Power Inference:** Platforms like Edge Impulse have enabled the deployment of Keras-based neural networks directly onto microcontrollers such as the Arduino Nano 33 BLE and Arduino UNO R4. [blog.arduino](https://blog.arduino.cc/2023/02/13/using-sensor-fusion-and-tinyml-to-detect-fires/)
- **MEMS Miniaturization:** The adoption of MEMS-based catalytic and electrochemical gas sensors has allowed for complex sensing suites to operate on battery power with faster warm-up times and higher durability. [sciencedirect](https://www.sciencedirect.com/science/article/pii/S145239812500118X)
- **Privacy and Reliability:** By processing data locally (on-device), these systems eliminate the need for constant internet connectivity, which is critical for life-safety applications in remote or high-security environments. [pmc.ncbi.nlm.nih](https://pmc.ncbi.nlm.nih.gov/articles/PMC11991413/)

## Standardization Trends

International standards have adapted to the rise of intelligent systems by shifting from prescriptive hardware requirements to performance-based criteria for multi-criteria detectors. [accindia](https://www.accindia.org/document_management/NFPA-72-2025.pdf)

### Comparison of Regulatory Evolutions

| Standard     | Focus Area                | Recent Updates (2015–2025)                                                                                                                                                                                         |
| :----------- | :------------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **EN 54-29** | Multi-Sensor (Smoke/Heat) | Defines requirements for point detectors combining optical/ionization smoke and heat [standards.iteh](https://standards.iteh.ai/catalog/standards/cen/a3fb9236-0f4c-44c5-84d3-abd175969559/en-54-29-2015).         |
| **EN 54-31** | Multi-Sensor (Smoke/CO)   | Specifies criteria for detectors combining smoke, carbon monoxide, and optional heat sensors [standards.iteh](https://standards.iteh.ai/catalog/standards/cen/6d78459f-6378-4845-bf94-3e52a88692df/en-54-31-2014). |
| **NFPA 72**  | National Code (USA)       | 2025 edition mandates multi-criteria technology to replace traditional ionization/photoelectric units [scribd](https://www.scribd.com/document/966031754/NFPA-72-2025).                                            |
| **NFPA 72**  | Cybersecurity             | Introduces specific requirements to protect signaling systems from cyber-attacks [accindia](https://www.accindia.org/document_management/NFPA-72-2025.pdf).                                                        |

## References

- Edge Impulse. (2026). _Fire Detection Using Sensor Fusion and TinyML_. https://docs.edgeimpulse.com/projects/expert-network/fire-detection-sensor-fusion-arduino-nano-33
- European Committee for Standardization. (2015). _EN 54-29: Fire detection and fire alarm systems - Part 29: Multi-sensor fire detectors - Point detectors using a combination of smoke and heat sensors_. https://standards.iteh.ai/catalog/standards/cen/a3fb9236-0f4c-44c5-84d3-abd175969559/en-54-29-2015
- Lu, J., et al. (2025). FCMI-YOLO: An efficient deep learning-based algorithm for fire detection on edge devices. _Scientific Reports_. https://pmc.ncbi.nlm.nih.gov/articles/PMC12331093/
- National Fire Protection Association. (2025). _NFPA 72: National Fire Alarm and Signaling Code_ (2025 ed.). https://www.accindia.org/document_management/NFPA-72-2025.pdf
- Nekhil, R. (2023). _Using sensor fusion and tinyML to detect fires_. Arduino Blog. https://blog.arduino.cc/2023/02/13/using-sensor-fusion-and-tinyml-to-detect-fires/
- Zhao, et al. (2022). Research on Multi-Sensor Fusion Indoor Fire Perception Algorithm Based on TCN-APP-SVM. _Sensors_. https://pmc.ncbi.nlm.nih.gov/articles/PMC9228805/
