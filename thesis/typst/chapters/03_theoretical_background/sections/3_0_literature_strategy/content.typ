== Literature Selection Strategy <sec:literature_strategy>

The comprehensive literature review undertaken for this research systematically examined scholarly works published between 2015 and 2025, ensuring an up-to-date understanding of advancements in intelligent fire detection systems. The search was conducted across primary academic databases, including IEEE Xplore, ACM Digital Library, ScienceDirect (Elsevier), and MDPI Sensors. The primary focus of this selection strategy was threefold: (1) multi-modal sensing and sensor fusion, (2) the application of TinyML for edge deployment, and (3) innovative approaches to false alarm mitigation.

The selection process prioritized peer-reviewed journal articles and conference proceedings that provide empirical evidence for sensor performance or algorithmic efficacy. A PRISMA-informed protocol was adopted to ensure the quality and relevance of the cited works, favoring studies that include rigorous validation methodologies and explicitly address the "cry wolf" effect in fire safety infrastructure. This targeted approach aimed to identify research that directly informs the design of the _Autonomous Sensing Node_, particularly in overcoming the limitations of conventional single-threshold detectors @page2021prisma.

=== Search Strategy and Query Design

The primary search queries were constructed using Boolean combinations of domain-specific terms. The core query string was structured as:

+quote[
  ("fire detection" OR "flame detection" OR "smoke detection") AND ("multi-sensor" OR "sensor fusion" OR "multi-modal") AND ("machine learning" OR "deep learning" OR "neural network" OR "TinyML" OR "edge computing")
]

This query was adapted for each database's syntax requirements. Additional targeted queries were executed for specific sub-topics, including "MEMS gas sensor AND combustion," "INT8 quantization AND microcontroller," and "false alarm AND nuisance AND fire detector." The temporal filter was set to 2015–2025 to capture the emergence of TinyML as a distinct field while retaining foundational works from the early adoption of sensor fusion in fire safety.

=== Inclusion and Exclusion Criteria

Papers were included in the review if they met all of the following criteria: (a) published in a peer-reviewed venue; (b) present empirical results from physical sensor data or validated simulation; (c) address fire detection, false alarm mitigation, or edge-based inference for safety-critical sensing; and (d) published in English. Papers were excluded if they: (a) rely solely on vision-based detection without gas or thermal sensors; (b) propose purely theoretical models without experimental validation; or (c) address fire suppression or post-fire analysis without relevance to the detection phase. This filtering process yielded a curated corpus of approximately 45 papers that form the backbone of the literature synthesis presented in the following sections.
