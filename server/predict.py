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
from pickle import UnpicklingError

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
        # Prefer joblib for sklearn pipelines/transformers (more robust for numpy-heavy objects).
        try:
            import joblib  # type: ignore
        except ImportError:
            joblib = None

        if joblib is not None:
            return joblib.load(PREPROCESSOR_PATH)

        with open(PREPROCESSOR_PATH, "rb") as f:
            return pickle.load(f)
    except FileNotFoundError:
        raise FileNotFoundError(f"Preprocessor not found at {PREPROCESSOR_PATH}")
    except (UnpicklingError, AttributeError, EOFError, ImportError, IndexError) as e:
        # Common failure modes for corrupted/incompatible pickles.
        raise Exception(
            "Preprocessor file could not be unpickled. "
            "It may be corrupted or created with an incompatible environment. "
            f"Regenerate it from the training notebook and replace {PREPROCESSOR_PATH}. "
            f"Original error: {str(e)}"
        )
    except Exception as e:
        # Some corruption cases surface as generic Exceptions with a tell-tale message.
        msg = str(e)
        if "STACK_GLOBAL" in msg or "pickle" in msg.lower():
            raise Exception(
                "Preprocessor file appears corrupted (pickle error). "
                f"Regenerate it from the training notebook and replace {PREPROCESSOR_PATH}. "
                f"Original error: {msg}"
            )
        raise Exception(f"Failed to load preprocessor: {msg}")

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
        # Get input from command line argument (or stdin)
        if len(sys.argv) < 2:
            raise ValueError("No input provided (pass JSON as argv[1] or use '-' to read stdin)")

        raw_input = sys.argv[1]
        if raw_input == "-":
            raw_input = sys.stdin.read()

        # Parse JSON input
        try:
            model_input = json.loads(raw_input)
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
