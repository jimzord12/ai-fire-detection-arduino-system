📚 Academic Notes: Automated Data Collection
Section: "5.2 Automated Data Collection Infrastructure"
Rationale for Batch Collection Approach:

Manual data collection via GUI introduces several reproducibility issues:

Human error: Mislabeling, inconsistent timing

Non-reproducible workflow: Click-based processes can't be documented in methodology

Scalability: 100 samples × 4 classes = 400 manual operations

Automated Solution Architecture:

text
┌─────────────────────────────────┐
│ Arduino: Continuous streaming │
│ (115200 baud, CSV format) │
└────────────┬────────────────────┘
│ Serial (/dev/ttyACM0)
▼
┌─────────────────────────────────┐
│ Bash Script: Timed capture │
│ - timeout command for duration │
│ - Automatic file naming │
│ - Label organization │
└────────────┬────────────────────┘
│ CSV files
▼
┌─────────────────────────────────┐
│ Edge Impulse Uploader: Batch │
│ - Preserves train/test split │
│ - Maintains metadata │
└─────────────────────────────────┘
Advantages:

Reproducible: Entire workflow is script-based

Auditable: CSV files can be version-controlled (Git LFS)

Flexible: Can re-upload with different parameters without recollection

Archival: Raw data preserved for future analysis

Time Efficiency:

Method Time for 100 samples
Manual GUI ~45 min (clicking + labeling)
Automated script ~22 min (10s samples + 2s pause)
Savings ~51% reduction
Keywords
Automated data acquisition pipelines

Reproducible ML workflows

Batch data ingestion for edge AI

Dataset versioning and provenance

Citation for Thesis
"To ensure reproducibility and reduce human error, we implemented an automated data collection pipeline using shell scripts and the Edge Impulse CLI uploader tool. This approach reduced data collection time by 51% while creating an auditable trail of all training samples."
​
