= Analysis and Design <ch:analysis_design>

== Introduction
This chapter presents the theoretical framework for the project, detailing the sensor selection criteria and the architectural design of the hardware and software systems.

== Theoretical Background
This section covers the foundational physics and engineering principles behind MEMS sensors, the architecture of neural networks for edge deployment, and the rationale for the selected feature engineering techniques.

#include "sections/6_2_theory/sections/3_1_physics_and_operating_principles/content.typ"
#include "sections/6_2_theory/sections/3_2_characteristics_of_mems_sensors/content.typ"
#include "sections/6_2_theory/sections/3_3_principles_of_sensor_fusion/content.typ"
#include "sections/6_2_theory/sections/3_4_feature_engineering_for_fire_detection/content.typ"
#include "sections/6_2_theory/sections/3_5_neural_network_fundamentals/content.typ"
#include "sections/6_2_theory/sections/3_6_model_quantization_optimization/content.typ"
#include "sections/6_2_theory/sections/3_7_overview_of_edge_impulse_pipeline/content.typ"

== Sensor Selection & Characterization
The development of a multi-modal fire detection node requires careful selection of sensors based on their sensitivity, selectivity, and environmental response time. This section presents the criteria and finalized choice of sensing components.

#include "sections/6_3_sensors/sections/4_1_requirements_for_multi_modal_sensing/content.typ"
#include "sections/6_3_sensors/sections/4_2_detailed_examination_of_selected_sensors/content.typ"
#include "sections/6_3_sensors/sections/4_3_justification_of_sensor_choice/content.typ"
#include "sections/6_3_sensors/sections/4_4_sensor_calibration_protocols_and_baseline_behavior/content.typ"

== Hardware Platform & System Integration
Integrating diverse sensors into a single edge intelligence node necessitates a robust hardware architecture. This section describes the implementation of the "Asymmetric Multi-Processing" system on the Arduino UNO R4.

#include "sections/6_4_hardware/sections/5_1_the_autonomous_edge_node_architecture/content.typ"
#include "sections/6_4_hardware/sections/5_2_power_management_and_thermal_considerations/content.typ"
#include "sections/6_4_hardware/sections/5_3_physical_design_and_enclosure/content.typ"
#include "sections/6_4_hardware/sections/5_4_connectivity_and_location_awareness/content.typ"
#include "sections/6_4_hardware/sections/5_5_system_schematic_and_wiring_diagrams/content.typ"

== Summary
The analysis and design chapter established the theoretical and physical architecture of the fire detection node. The following chapter will detail the implementation of this design and the results of the experimental testing.
