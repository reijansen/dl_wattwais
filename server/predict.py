#!/usr/bin/env python3
"""
WattwAIs Prediction Script - Phase 2
Simple inference script that:
1. Receives already-mapped model input
2. Loads the Keras model
3. Loads the preprocessor
4. Preprocesses and predicts
5. Returns hourly kWh prediction
"""

import sys
import json
import pickle
from pathlib import Path

try:
    import tensorflow as tf
    from tensorflow import keras
except ImportError:
    print(json.dumps({
        "success": False,
        "error": "TensorFlow not installed. Run: pip install tensorflow"
    }))
    sys.exit(1)

# ============================================================================
# CONFIGURATION
# ============================================================================

SCRIPT_DIR = Path(__file__).parent
MODEL_PATH = SCRIPT_DIR / "best_wattwais_model.keras"
PREPROCESSOR_PATH = SCRIPT_DIR / "preprocessing" / "preprocessor.pkl"

# ============================================================================
# LOAD RESOURCES
# ============================================================================

def load_model():
    """Load the Keras model"""
    try:
        model = keras.models.load_model(str(MODEL_PATH))
        return model
    except FileNotFoundError:
        raise FileNotFoundError(f"Model not found at {MODEL_PATH}")
    except Exception as e:
        raise Exception(f"Failed to load model: {str(e)}")

def load_preprocessor():
    """Load the scikit-learn preprocessor"""
    try:
        with open(PREPROCESSOR_PATH, "rb") as f:
            preprocessor = pickle.load(f)
        return preprocessor
    except FileNotFoundError:
        raise FileNotFoundError(f"Preprocessor not found at {PREPROCESSOR_PATH}")
    except Exception as e:
        raise Exception(f"Failed to load preprocessor: {str(e)}")

# ============================================================================
# PREDICTION
# ============================================================================

def predict(model_input):
    """
    Make a prediction with the loaded model
    
    Args:
        model_input (dict): Already-mapped model features
    
    Returns:
        dict: Result with success status and predicted kWh
    """
    try:
        # Load resources
        model = load_model()
        preprocessor = load_preprocessor()
        
        # Preprocess input
        # Convert input dict to format expected by preprocessor
        # The preprocessor expects a pandas DataFrame or dict-like object
        import pandas as pd
        df = pd.DataFrame([model_input])
        
        # Transform using preprocessor
        X = preprocessor.transform(df).astype("float32")
        
        # Make prediction
        prediction = model.predict(X, verbose=0)[0][0]
        
        # Ensure non-negative
        prediction = max(0.0, float(prediction))
        
        return {
            "success": True,
            "predicted_kwh": prediction
        }
    
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

# ============================================================================
# MAIN
# ============================================================================

if __name__ == "__main__":
    try:
        # Get input from command line argument
        if len(sys.argv) < 2:
            raise ValueError("No input provided")
        
        # Parse JSON input
        try:
            model_input = json.loads(sys.argv[1])
        except json.JSONDecodeError as e:
            print(json.dumps({
                "success": False,
                "error": f"Invalid JSON input: {str(e)}"
            }))
            sys.exit(1)
        
        # Make prediction
        result = predict(model_input)
        
        # Output as JSON
        print(json.dumps(result))
        
        # Exit with appropriate code
        sys.exit(0 if result.get("success") else 1)
    
    except Exception as e:
        print(json.dumps({
            "success": False,
            "error": str(e)
        }))
        sys.exit(1)