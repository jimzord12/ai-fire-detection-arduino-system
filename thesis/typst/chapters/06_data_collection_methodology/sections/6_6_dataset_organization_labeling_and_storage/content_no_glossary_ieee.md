# Dataset Organization, Labeling, and Storage

The integrity and efficacy of any machine learning model heavily depend on the quality and structured organization of its training data. For the multi-sensor fire detection system, a rigorous approach was adopted for dataset organization, labeling, and storage to ensure optimal model training and evaluation. The methodology directly supports the three-class classification objective (fire, no_fire, false_alarm) and facilitates clear traceability from raw sensor readings to the final processed dataset.

## 6.6.1 Dataset Organization



## 6.6.2 Data Labeling and Traceability


Beyond the directory structure, each raw data file, typically in CSV format, includes metadata implicitly or explicitly. While the raw `.csv` files themselves primarily contain timestamped sensor readings (e.g., `timestamp, flame, smoke, voc, co, temp, humid`), the context provided by their path serves as the primary label. Tools and scripts within the project's `tools/` directory further process these raw `.csv` files, ensuring that labels are correctly propagated during feature extraction and model training phases (as suggested by the process of `upload_to_edge_impulse.sh`).

## 6.6.3 Data Storage and Management


For long-term preservation and version control, the raw data is treated as an integral part of the project's version-controlled assets. Although not directly committed in its entirety due to file size, a clear documentation strategy (e.g., `DATA_COLLECTION_GUIDE.md`) and scripts ensure the reproducibility of the dataset. Furthermore, for machine learning model development, processed and labeled data is integrated with platforms like Edge Impulse, which provides its own secure cloud storage and management for datasets used in TinyML pipeline development. This hybrid approach ensures both local development flexibility and robust cloud-based dataset management for model training.

### References