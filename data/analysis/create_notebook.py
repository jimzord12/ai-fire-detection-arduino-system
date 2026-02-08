import nbformat as nbf

def create_notebook():
    nb = nbf.v4.new_notebook()

    cells = []

    # Title
    cells.append(nbf.v4.new_markdown_cell("# AI Fire Detection - Data Analysis\nAnalysis of sensor data for fire, no_fire, and false_alarm classes."))

    # Imports
    cells.append(nbf.v4.new_code_cell("""import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix

# Set style
sns.set_theme(style="whitegrid")
plt.rcParams['figure.figsize'] = [12, 8]"""))

    # Load Data
    cells.append(nbf.v4.new_markdown_cell("## Load Aggregated Data"))
    cells.append(nbf.v4.new_code_cell("""df = pd.read_csv('aggregated_data.csv')
# Normalize humidity columns
if 'humid' in df.columns:
    df['hum'] = df['hum'].fillna(df['humid'])
    df = df.drop(columns=['humid'])

print(f"Loaded {len(df)} rows.")
df.head()"""))

    # Class Distribution
    cells.append(nbf.v4.new_markdown_cell("## Class Distribution\n\n**Why this diagram?** To verify dataset balance across our three target classes.\n\n**What information does it provide?** It tells us if we have enough samples for each scenario. A balanced dataset ensures the ML model doesn't become biased toward a specific class simply because it saw it more often during training."))
    cells.append(nbf.v4.new_code_cell("""plt.figure(figsize=(8, 6))
sns.countplot(x='label', data=df, hue='label', palette='viridis', legend=False)
plt.title('Distribution of Samples per Class')
plt.show()"""))

    # Correlation Analysis
    cells.append(nbf.v4.new_markdown_cell("## Correlation Analysis\n\n**Why this diagram?** To understand the linear relationships between different sensors.\n\n**What information does it provide?** It identifies which sensors move together (high correlation). For example, if Smoke and CO are highly correlated, they might be redundant. Low correlation between sensors suggests they provide unique, complementary information for the fusion model."))
    cells.append(nbf.v4.new_code_cell("""# Select only numeric sensor columns
sensors = ['smoke', 'voc', 'co', 'flame', 'temp', 'hum']
corr = df[sensors].corr()

plt.figure(figsize=(10, 8))
sns.heatmap(corr, annot=True, cmap='coolwarm', fmt=".2f")
plt.title('Sensor Correlation Heatmap')
plt.show()"""))

    # Sensor Distributions by Class
    cells.append(nbf.v4.new_markdown_cell("## Sensor Values by Class\n\n**Why this diagram?** To see how sensor readings fluctuate depending on the environment (Fire vs. False Alarm vs. No Fire).\n\n**What information does it provide?** The boxplots show the range, median, and outliers for each sensor. This helps us identify 'signature' sensors—for example, a high 'flame' value might only occur during 'fire', making it a strong discriminator."))
    cells.append(nbf.v4.new_code_cell("""fig, axes = plt.subplots(2, 3, figsize=(18, 12))
axes = axes.flatten()

for i, sensor in enumerate(sensors):
    sns.boxplot(ax=axes[i], x='label', y=sensor, data=df, hue='label', palette='viridis', legend=False)
    axes[i].set_title(f'{sensor.capitalize()} vs Label')

plt.tight_layout()
plt.show()"""))

    # Pairplot
    cells.append(nbf.v4.new_markdown_cell("## Pairplot of Sensors\n\n**Why this diagram?** To visualize multivariate relationships and how classes cluster together in 2D space.\n\n**What information does it provide?** It helps us see if certain combinations of sensors (e.g., Temp + Smoke) can clearly separate a 'fire' from a 'false_alarm'. If clusters overlap heavily, the classification task is more difficult and might require more complex ML logic."))
    cells.append(nbf.v4.new_code_cell("""# Sampling for faster plotting
sns.pairplot(df.sample(min(2000, len(df))), hue='label', vars=sensors, diag_kind='kde')
plt.show()"""))

    # Feature Importance (Quick RF)
    cells.append(nbf.v4.new_markdown_cell("## Feature Importance (Random Forest)\n\n**Why this diagram?** To mathematically rank which sensors contribute most to the model's decision-making process.\n\n**What information does it provide?** It identifies the 'most valuable' sensors. This is critical for TinyML deployment, as it might allow us to simplify the model or focus hardware resources on the most critical sensors without losing accuracy."))
    cells.append(nbf.v4.new_code_cell("""X = df[sensors].fillna(0)
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
plt.show()

y_pred = rf.predict(X_test)
print(classification_report(y_test, y_pred, target_names=le.classes_))"""))

    # Confusion Matrix
    cells.append(nbf.v4.new_markdown_cell("## Confusion Matrix\n\n**Why this diagram?** To see exactly where the model is succeeding or failing.\n\n**What information does it provide?** It shows which classes are being confused. For instance, it reveals if 'false_alarm' scenarios (like cooking) are being incorrectly flagged as 'fire'. This 'cost of error' is vital for safety systems where a missed fire is much worse than a false alarm."))
    cells.append(nbf.v4.new_code_cell("""cm = confusion_matrix(y_test, y_pred)
plt.figure(figsize=(8, 6))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=le.classes_, yticklabels=le.classes_)
plt.xlabel('Predicted')
plt.ylabel('Actual')
plt.title('Confusion Matrix')
plt.show()"""))

    nb['cells'] = cells

    with open('../notebooks/data_analysis.ipynb', 'w') as f:
        nbf.write(nb, f)

if __name__ == "__main__":
    create_notebook()