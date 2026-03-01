# Dataset Organization, Labeling, and Storage

The integrity and efficacy of any machine learning model heavily depend on the quality and structured organization of its training data. For the multi-sensor fire detection system, a rigorous approach was adopted for dataset organization, labeling, and storage to ensure optimal model training and evaluation. The methodology directly supports the three-class classification objective (fire, no_fire, false_alarm) and facilitates clear traceability from raw sensor readings to the final processed dataset.

## 6.6.1 Dataset Organization

The raw sensor data, collected from various class-specific scenarios (as detailed in Section 6.4), is systematically organized within the project's `data/raw/` directory. This directory is structured hierarchically to reflect the three primary classification labels:
*   `data/raw/fire/`: Contains all raw sensor logs pertaining to actual fire events.
*   `data/raw/no_fire/`: Houses raw sensor data representing normal ambient or non-alarming conditions.
*   `data/raw/false_alarm/`: Stores raw sensor readings captured during nuisance events that mimic fire signatures.

Within each class directory, further subdirectories are created to categorize data by specific scenarios (e.g., `data/raw/fire/close_low_vent/`, `data/raw/false_alarm/cooking/`). This granular organization ensures that data from distinct experimental conditions can be easily identified, accessed, and managed, providing a clear audit trail for the dataset's provenance. The `DATA_COLLECTION_GUIDE.md` provides explicit instructions on this directory structure, ensuring consistency across all collection efforts.

## 6.6.2 Data Labeling and Traceability

Accurate and consistent labeling is paramount for supervised machine learning. Each collected data sample is inherently labeled by its storage location within the `data/raw/{class}/{scenario}/` hierarchy. For instance, any `.csv` file residing in `data/raw/fire/smoldering/` is automatically associated with the "fire" class and the "smoldering" scenario. This intrinsic labeling mechanism, enforced by the `automated_data_collection.sh` script, minimizes human error and maintains high labeling fidelity.

Beyond the directory structure, each raw data file, typically in CSV format, includes metadata implicitly or explicitly. While the raw `.csv` files themselves primarily contain timestamped sensor readings (e.g., `timestamp, flame, smoke, voc, co, temp, humid`), the context provided by their path serves as the primary label. Tools and scripts within the project's `tools/` directory further process these raw `.csv` files, ensuring that labels are correctly propagated during feature extraction and model training phases (as suggested by the process of `upload_to_edge_impulse.sh`).

## 6.6.3 Data Storage and Management

The raw data collected is stored locally within the project repository under the `data/raw/` directory. This local storage approach ensures immediate accessibility for analysis, pre-processing, and iterative model development. Given the potentially large volume of time-series sensor data, efficient storage is crucial. The data is primarily stored as comma-separated values (CSV) files, a universally recognized and lightweight format that facilitates easy parsing and integration with various data analysis tools (e.g., Python scripts for feature engineering).

For long-term preservation and version control, the raw data is treated as an integral part of the project's version-controlled assets. Although not directly committed in its entirety due to file size, a clear documentation strategy (e.g., `DATA_COLLECTION_GUIDE.md`) and scripts ensure the reproducibility of the dataset. Furthermore, for machine learning model development, processed and labeled data is integrated with platforms like Edge Impulse, which provides its own secure cloud storage and management for datasets used in TinyML pipeline development. This hybrid approach ensures both local development flexibility and robust cloud-based dataset management for model training.

### References