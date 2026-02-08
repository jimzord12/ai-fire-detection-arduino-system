import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import confusion_matrix
import os

def main():
    # Setup
    output_dir = '../figures'
    os.makedirs(output_dir, exist_ok=True)
    sns.set_theme(style="whitegrid")
    plt.rcParams['figure.figsize'] = [12, 8]

    # Load data
    try:
        df = pd.read_csv('../notebooks/aggregated_data.csv')
    except FileNotFoundError:
        df = pd.read_csv('aggregated_data.csv')

    if 'humid' in df.columns:
        df['hum'] = df['hum'].fillna(df['humid'])
        df = df.drop(columns=['humid'])
    
    df = df.dropna(subset=['smoke', 'voc', 'co', 'flame', 'temp', 'hum'])
    sensors = ['smoke', 'voc', 'co', 'flame', 'temp', 'hum']

    # 1. Class Distribution
    plt.figure(figsize=(10, 6))
    sns.countplot(x='label', data=df, hue='label', palette='viridis', legend=False)
    plt.title('Distribution of Samples per Class')
    plt.savefig(os.path.join(output_dir, 'class_distribution.png'), dpi=300, bbox_inches='tight')
    plt.close()

    # 2. Correlation Analysis
    corr = df[sensors].corr()
    plt.figure(figsize=(10, 8))
    sns.heatmap(corr, annot=True, cmap='coolwarm', fmt=".2f")
    plt.title('Sensor Correlation Heatmap')
    plt.savefig(os.path.join(output_dir, 'sensor_correlation.png'), dpi=300, bbox_inches='tight')
    plt.close()

    # 3. Sensor Values by Class (Boxplots)
    fig, axes = plt.subplots(2, 3, figsize=(18, 12))
    axes = axes.flatten()
    for i, sensor in enumerate(sensors):
        sns.boxplot(ax=axes[i], x='label', y=sensor, data=df, hue='label', palette='viridis', legend=False)
        axes[i].set_title(f'{sensor.capitalize()} vs Label')
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, 'sensor_boxplots.png'), dpi=300, bbox_inches='tight')
    plt.close()

    # 4. Feature Importance
    X = df[sensors]
    y = df['label']
    le = LabelEncoder()
    y_encoded = le.fit_transform(y)
    X_train, X_test, y_train, y_test = train_test_split(X, y_encoded, test_size=0.2, random_state=42)
    
    rf = RandomForestClassifier(n_estimators=100, random_state=42)
    rf.fit(X_train, y_train)
    
    importances = pd.DataFrame({'feature': sensors, 'importance': rf.feature_importances_})
    importances = importances.sort_values('importance', ascending=False)
    
    plt.figure(figsize=(10, 6))
    sns.barplot(x='importance', y='feature', data=importances, hue='feature', palette='magma', legend=False)
    plt.title('Feature Importance for Fire Detection')
    plt.savefig(os.path.join(output_dir, 'feature_importance.png'), dpi=300, bbox_inches='tight')
    plt.close()

    # 5. Confusion Matrix
    y_pred = rf.predict(X_test)
    cm = confusion_matrix(y_test, y_pred)
    plt.figure(figsize=(8, 6))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=le.classes_, yticklabels=le.classes_)
    plt.xlabel('Predicted')
    plt.ylabel('Actual')
    plt.title('Confusion Matrix')
    plt.savefig(os.path.join(output_dir, 'confusion_matrix.png'), dpi=300, bbox_inches='tight')
    plt.close()

    print(f"All figures saved to {output_dir}")

if __name__ == "__main__":
    main()
