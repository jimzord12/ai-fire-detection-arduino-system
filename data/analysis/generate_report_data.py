import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix
import json

def main():
    # Load the aggregated data
    try:
        df = pd.read_csv('../notebooks/aggregated_data.csv')
    except FileNotFoundError:
        df = pd.read_csv('aggregated_data.csv')

    # Normalize humidity columns
    if 'humid' in df.columns:
        df['hum'] = df['hum'].fillna(df['humid'])
        df = df.drop(columns=['humid'])

    sensors = ['smoke', 'voc', 'co', 'flame', 'temp', 'hum']
    
    # Drop rows with NaN in sensors
    df = df.dropna(subset=sensors)
    
    X = df[sensors]
    y = df['label']

    le = LabelEncoder()
    y_encoded = le.fit_transform(y)

    X_train, X_test, y_train, y_test = train_test_split(X, y_encoded, test_size=0.2, random_state=42)

    rf = RandomForestClassifier(n_estimators=100, random_state=42)
    rf.fit(X_train, y_train)

    # Feature Importance
    importances = dict(zip(sensors, rf.feature_importances_.tolist()))
    
    # Classification Report
    y_pred = rf.predict(X_test)
    report = classification_report(y_test, y_pred, target_names=le.classes_, output_dict=True)
    
    # Confusion Matrix
    cm = confusion_matrix(y_test, y_pred).tolist()
    
    # Statistics per class
    stats = {}
    for label in df['label'].unique():
        label_df = df[df['label'] == label]
        stats[label] = label_df[sensors].agg(['mean', 'std', 'min', 'max']).to_dict()

    results = {
        'feature_importance': importances,
        'classification_report': report,
        'confusion_matrix': cm,
        'classes': le.classes_.tolist(),
        'sensor_stats': stats
    }

    with open('analysis_results.json', 'w') as f:
        json.dump(results, f, indent=4)

    print("Analysis results saved to analysis_results.json")

if __name__ == "__main__":
    main()
