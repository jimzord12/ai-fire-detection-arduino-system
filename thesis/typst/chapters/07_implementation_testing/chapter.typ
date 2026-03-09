= Implementation and Testing <ch:implementation_testing>

== Introduction
This chapter describes the data collection process, the implementation of the TinyML pipeline, and the subsequent experimental evaluation of the fire detection system.

== Data Collection Methodology
#include "sections/7_2_methodology/sections/6_1_safety_protocols_during_data_collection/content.typ"
#include "sections/7_2_methodology/sections/6_2_rationale_for_three_class_classification/content.typ"
#include "sections/7_2_methodology/sections/6_3_sampling_parameters/content.typ"
#include "sections/7_2_methodology/sections/6_4_class_specific_data_collection_scenarios/content.typ"
#include "sections/7_2_methodology/sections/6_5_environmental_variance/content.typ"
#include "sections/7_2_methodology/sections/6_6_dataset_organization_labeling_and_storage/content.typ"

== TinyML Implementation
#include "sections/7_3_implementation/sections/7_1_edge_impulse_project_setup/content.typ"
#include "sections/7_3_implementation/sections/7_2_impulse_design_and_dsp_blocks/content.typ"
#include "sections/7_3_implementation/sections/7_3_model_architecture_and_training/content.typ"
#include "sections/7_3_implementation/sections/7_4_arduino_firmware_development/content.typ"
#include "sections/7_3_implementation/sections/7_5_heuristic_post_processing_and_hybrid_triggering_logic/content.typ"
#include "sections/7_3_implementation/sections/7_6_logic_for_alarm_triggering/content.typ"
#include "sections/7_3_implementation/sections/7_7_quantization_strategy/content.typ"

== Testing & Experimental Results
#include "sections/7_4_results/sections/8_1_test_environment_description/content.typ"
#include "sections/7_4_results/sections/8_2_dataset_summary/content.typ"
#include "sections/7_4_results/sections/8_3_training_and_validation_metrics/content.typ"
#include "sections/7_4_results/sections/8_4_ablation_study/content.typ"
#include "sections/7_4_results/sections/8_5_environment_specific_performance/content.typ"
#include "sections/7_4_results/sections/8_6_on_device_performance_metrics/content.typ"
#include "sections/7_4_results/sections/8_7_validation_of_clean_fire_detection/content.typ"
#include "sections/7_4_results/sections/8_8_comparison_with_baseline_approaches/content.typ"

== Summary
The implementation and testing chapter confirmed the technical feasibility of the multi-sensor fusion approach, achieving high accuracy and low latency. The next chapter will discuss these findings and provide conclusions.
