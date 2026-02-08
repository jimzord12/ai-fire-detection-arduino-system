import pandas as pd
import glob
import os
import matplotlib.pyplot as plt
import seaborn as sns

def load_data(raw_data_path):
    all_files = glob.glob(os.path.join(raw_data_path, "**/*.csv"), recursive=True)
    
    dataframes = []
    for filename in all_files:
        # Path structure: data/raw/<label>/<scenario>/<file>.csv
        # or data/raw/<label>/<file>.csv
        parts = os.path.normpath(filename).split(os.sep)
        # Find index of 'raw'
        try:
            raw_idx = parts.index('raw')
            label = parts[raw_idx + 1]
            # scenario is optional, could be the rest before filename
            scenario = "_".join(parts[raw_idx + 2:-1]) if len(parts) > raw_idx + 3 else "default"
        except (ValueError, IndexError):
            label = "unknown"
            scenario = "unknown"

        df = pd.read_csv(filename)
        df['label'] = label
        df['scenario'] = scenario
        df['filename'] = os.path.basename(filename)
        dataframes.append(df)
    
    if not dataframes:
        return pd.DataFrame()
        
    return pd.concat(dataframes, ignore_index=True)

def main():
    raw_data_path = "../raw"
    df = load_data(raw_data_path)
    
    if df.empty:
        print("No data found!")
        return

    print(f"Loaded {len(df)} rows from {df['filename'].nunique()} files.")
    print("\nClass distribution:")
    print(df['label'].value_counts())
    
    # Basic statistics
    print("\nBasic Statistics:")
    print(df.describe())
    
    # Save the aggregated data for easier notebook use
    output_path = "aggregated_data.csv"
    df.to_csv(output_path, index=False)
    print(f"\nAggregated data saved to {output_path}")

    # Plotting distributions
    sensors = ['smoke', 'voc', 'co', 'flame', 'temp', 'hum']
    
    plt.figure(figsize=(15, 10))
    for i, sensor in enumerate(sensors, 1):
        plt.subplot(2, 3, i)
        sns.boxplot(x='label', y=sensor, data=df)
        plt.title(f'{sensor.capitalize()} Distribution by Class')
    
    plt.tight_layout()
    plt.savefig('sensor_distributions.png')
    print("Distribution plot saved as sensor_distributions.png")

if __name__ == "__main__":
    main()
