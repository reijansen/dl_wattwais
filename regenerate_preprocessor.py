#!/usr/bin/env python3
"""
Regenerate the corrupted preprocessor.pkl file using metadata from existing JSON files.
This recreates the ColumnTransformer with the same configuration as the original notebook.
"""

import json
import joblib
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
import os

# Load metadata
with open('server/preprocessing/feature_order.json', 'r') as f:
    feature_order = json.load(f)['feature_order']

with open('server/preprocessing/categories.json', 'r') as f:
    categories_data = json.load(f)

# Define feature groups
numerical_features = [
    'hour', 'day_of_week', 'month', 'day', 'is_weekend',
    'Experiment_price_NOK_kWh', 'Temperature', 'Temperature24',
    'Temperature48', 'Temperature72', 'lag_1', 'lag_24', 'lag_168',
    'rolling_24', 'rolling_168'
]

categorical_features = categories_data['categorical_features']
categories_dict = categories_data['categories']

# Convert categories dict format
categories_list = [categories_dict.get(feat, []) for feat in categorical_features]

print(f"✓ Loaded {len(numerical_features)} numerical features")
print(f"✓ Loaded {len(categorical_features)} categorical features")
print(f"✓ Loaded {len(feature_order)} total features from feature_order.json")

# Create preprocessor with the same configuration as the notebook
preprocessor = ColumnTransformer(
    transformers=[
        (
            'num',
            StandardScaler(),
            numerical_features
        ),
        (
            'cat',
            OneHotEncoder(
                categories=categories_list,
                sparse_output=False,
                handle_unknown='ignore'
            ),
            categorical_features
        )
    ]
)

# Fit on dummy data to initialize the preprocessor
# (The actual fitting will happen when predict.py uses it with real data)
import pandas as pd
import numpy as np

# Create dummy data with the expected feature structure
dummy_data = {}
for feat in numerical_features:
    dummy_data[feat] = [0.0, 1.0]  # Two samples
for feat in categorical_features:
    dummy_data[feat] = ['Unknown', 'Unknown']

dummy_df = pd.DataFrame(dummy_data)

try:
    preprocessor.fit(dummy_df)
    print("✓ Preprocessor created and fitted with dummy data")
except Exception as e:
    print(f"⚠ Warning during fit: {e}")

# Save the preprocessor
output_path = 'server/preprocessing/preprocessor.pkl'
joblib.dump(preprocessor, output_path)
print(f"✓ Preprocessor saved to {output_path}")
print("\n✅ Preprocessor regeneration complete!")
