#!/usr/bin/env python3
"""
WattwAIs Prediction Script
Loads the Keras model and makes predictions on incoming data
"""

import sys
import json
import os
import pickle
import numpy as np
from pathlib import Path

# Set up paths
SCRIPT_DIR = Path(__file__).parent
MODEL_PATH = SCRIPT_DIR / "best_wattwais_model.keras"
PREPROCESSOR_PATH = SCRIPT_DIR / "preprocessing" / "preprocessor.pkl"
FEATURE_ORDER_PATH = SCRIPT_DIR / "preprocessing" / "feature_order.json"
CATEGORIES_PATH = SCRIPT_DIR / "preprocessing" / "categories.json"
SCALER_PATH = SCRIPT_DIR / "preprocessing" / "scaler.json"

def load_model():
    """Load the Keras model"""
    try:
        from tensorflow import keras
        model = keras.models.load_model(str(MODEL_PATH))
        return model
    except Exception as e:
        raise Exception(f"Failed to load model: {str(e)}")

def load_preprocessor():
    """Load the preprocessor pickle file"""
    try:
        with open(PREPROCESSOR_PATH, "rb") as f:
            preprocessor = pickle.load(f)
        return preprocessor
    except Exception as e:
        raise Exception(f"Failed to load preprocessor: {str(e)}")

def load_feature_order():
    """Load feature order JSON"""
    try:
        with open(FEATURE_ORDER_PATH, "r") as f:
            return json.load(f)
    except Exception as e:
        raise Exception(f"Failed to load feature order: {str(e)}")

def load_categories():
    """Load categories JSON"""
    try:
        with open(CATEGORIES_PATH, "r") as f:
            return json.load(f)
    except Exception as e:
        raise Exception(f"Failed to load categories: {str(e)}")

def load_scaler():
    """Load scaler JSON"""
    try:
        with open(SCALER_PATH, "r") as f:
            return json.load(f)
    except Exception as e:
        raise Exception(f"Failed to load scaler: {str(e)}")

def map_frontend_to_model(frontend_input):
    """
    Map frontend-friendly input to model feature names
    
    Frontend inputs:
    - hour, day_of_week, month, is_weekend (temporal)
    - electricity_rate_php_kwh (price)
    - temperature (current temp)
    - last_hour_kwh (lag_1)
    - same_hour_yesterday_kwh (lag_24)
    - same_hour_last_week_kwh (lag_168)
    - avg_24h_kwh (rolling_24)
    - avg_7d_kwh (rolling_168)
    - day (optional, derived from other info)
    - region_id (optional, default: Exp_135)
    - region (optional, default: Bergen)
    - municipality (optional, default: Asker)
    """
    
    # Extract required fields
    hour = frontend_input.get("hour")
    day_of_week = frontend_input.get("day_of_week")
    month = frontend_input.get("month")
    is_weekend = frontend_input.get("is_weekend")
    temperature = frontend_input.get("temperature")
    electricity_rate = frontend_input.get("electricity_rate_php_kwh")
    lag_1 = frontend_input.get("last_hour_kwh")
    lag_24 = frontend_input.get("same_hour_yesterday_kwh")
    lag_168 = frontend_input.get("same_hour_last_week_kwh")
    rolling_24 = frontend_input.get("avg_24h_kwh")
    rolling_168 = frontend_input.get("avg_7d_kwh")
    
    # Optional fields with defaults
    day = frontend_input.get("day", 15)  # Mid-month default
    region_id = frontend_input.get("region_id", "Exp_135")
    region = frontend_input.get("region", "Bergen")
    municipality = frontend_input.get("municipality", "Asker")
    participation_phase = frontend_input.get("participation_phase", "Phase_1")
    control_price_phase2 = frontend_input.get("control_price_phase2", "Price group")
    group_phase2 = frontend_input.get("group_phase2", "Ber_1")
    
    # Temperature lags (use same temperature as approximation if not provided)
    temperature_24 = frontend_input.get("temperature_24", temperature)
    temperature_48 = frontend_input.get("temperature_48", temperature)
    temperature_72 = frontend_input.get("temperature_72", temperature)
    
    model_input = {
        # Temporal features
        "hour": hour,
        "day_of_week": day_of_week,
        "month": month,
        "day": day,
        "is_weekend": is_weekend,
        
        # Price/rate feature
        "Experiment_price_NOK_kWh": electricity_rate,
        
        # Temperature features
        "Temperature": temperature,
        "Temperature24": temperature_24,
        "Temperature48": temperature_48,
        "Temperature72": temperature_72,
        
        # Lag features (previous demand values)
        "lag_1": lag_1,
        "lag_24": lag_24,
        "lag_168": lag_168,
        
        # Rolling average features
        "rolling_24": rolling_24,
        "rolling_168": rolling_168,
        
        # Categorical features
        "ID": region_id,
        "Region": region,
        "Municipality": municipality,
        "Participation_Phase": participation_phase,
        "Control_Price_Phase2": control_price_phase2,
        "Group_Phase2": group_phase2,
    }
    
    return model_input

def preprocess_input(model_input, preprocessor, scaler_data, categories_data):
    """
    Preprocess input for model prediction
    
    This function:
    1. Encodes categorical features using one-hot encoding
    2. Scales numeric features using the scaler
    """
    
    # Define numeric and categorical features
    numeric_features = [
        "hour", "day_of_week", "month", "day", "is_weekend",
        "Experiment_price_NOK_kWh", "Temperature", "Temperature24",
        "Temperature48", "Temperature72", "lag_1", "lag_24",
        "lag_168", "rolling_24", "rolling_168"
    ]
    
    categorical_features = ["ID", "Region", "Municipality", 
                           "Participation_Phase", "Control_Price_Phase2", "Group_Phase2"]
    
    # Extract numeric features
    numeric_values = []
    for feature in numeric_features:
        value = model_input.get(feature, 0)
        numeric_values.append(float(value) if value is not None else 0.0)
    
    # Scale numeric features
    scaler_means = scaler_data["mean"]
    scaler_scales = scaler_data["scale"]
    
    scaled_numeric = [
        (value - mean) / scale
        for value, mean, scale in zip(numeric_values, scaler_means, scaler_scales)
    ]
    
    # One-hot encode categorical features
    encoded_categorical = []
    categories = categories_data["categories"]
    
    for cat_feature in categorical_features:
        cat_value = model_input.get(cat_feature, "")
        cat_options = categories.get(cat_feature, [])
        
        # Create one-hot encoding
        for option in cat_options:
            encoded_categorical.append(1.0 if cat_value == option else 0.0)
    
    # Combine all features
    all_features = scaled_numeric + encoded_categorical
    
    return np.array([all_features])

def predict(input_data):
    """Main prediction function"""
    try:
        # Load all necessary files
        model = load_model()
        scaler_data = load_scaler()
        categories_data = load_categories()
        feature_order = load_feature_order()
        
        # Map frontend input to model input
        model_input = map_frontend_to_model(input_data)
        
        # Preprocess
        processed_input = preprocess_input(model_input, None, scaler_data, categories_data)
        
        # Make prediction
        prediction = model.predict(processed_input, verbose=0)
        predicted_kwh = float(prediction[0][0])
        
        # Calculate estimates
        # Assuming prediction is hourly demand
        daily_kwh = predicted_kwh * 24
        monthly_kwh = daily_kwh * 30  # Approximate month as 30 days
        
        # Calculate monthly bill in PHP
        electricity_rate = float(input_data.get("electricity_rate_php_kwh", 0))
        monthly_bill_php = monthly_kwh * electricity_rate
        
        return {
            "success": True,
            "prediction": {
                "hourly_kwh": round(predicted_kwh, 2),
                "daily_kwh": round(daily_kwh, 2),
                "monthly_kwh": round(monthly_kwh, 2),
                "monthly_bill_php": round(monthly_bill_php, 2),
            },
            "input_received": {
                "hour": input_data.get("hour"),
                "day_of_week": input_data.get("day_of_week"),
                "month": input_data.get("month"),
                "temperature_celsius": input_data.get("temperature"),
                "electricity_rate_php_kwh": electricity_rate,
            },
        }
    
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
        }

if __name__ == "__main__":
    try:
        # Get input from command line argument
        if len(sys.argv) < 2:
            raise ValueError("No input provided")
        
        input_json = json.loads(sys.argv[1])
        
        # Make prediction
        result = predict(input_json)
        
        # Output as JSON
        print(json.dumps(result))
        
        # Exit with appropriate code
        sys.exit(0 if result.get("success") else 1)
    
    except json.JSONDecodeError as e:
        print(json.dumps({
            "success": False,
            "error": f"Invalid JSON input: {str(e)}"
        }))
        sys.exit(1)
    except Exception as e:
        print(json.dumps({
            "success": False,
            "error": f"Error: {str(e)}"
        }))
        sys.exit(1)