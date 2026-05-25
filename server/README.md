# WattwAIs Backend Server

Express.js backend for ML-powered electricity demand prediction using a Keras deep learning model.

## 📋 Quick Overview

The WattwAIs backend predicts hourly household electricity consumption and estimates daily/monthly usage and bills.

**Tech Stack:**
- Node.js + Express.js
- Python 3 with TensorFlow/Keras
- JSON-based preprocessing files
- CORS enabled for frontend integration

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ LTS
- Python 3.8+ with TensorFlow installed
- scikit-learn + joblib (for loading the fitted preprocessor)
- Keras model file: `best_wattwais_model.keras`
- Preprocessing files in `preprocessing/` directory

### Troubleshooting: `STACK_GLOBAL` / preprocessor load failures
If `/predict` returns a 500 with a pickle/unpickle error (commonly `STACK_GLOBAL requires str`), your local `preprocessing/preprocessor.pkl` is corrupted or was transferred incorrectly. Regenerate it from the training notebook, transfer it as a binary file (zipping is safest), and ensure it can be loaded with `joblib.load(...)`.

### Installation

1. **Install Node dependencies:**
   ```bash
   npm install
   ```

2. **Install Python dependencies:**
   ```bash
   pip install tensorflow numpy pandas scikit-learn joblib
   ```

3. **Verify files are in place:**
   ```
   server/
   ├── best_wattwais_model.keras
   ├── preprocessing/
   │   ├── scaler.json
   │   ├── feature_order.json
   │   ├── categories.json
   │   └── preprocessor.pkl
   └── predict.py
   ```

### Starting the Server

**Development (with auto-reload):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

**Expected output:**
```
✓ WattwAIs backend running on http://localhost:5000
✓ POST http://localhost:5000/predict to make predictions
```

---

## 📡 API Endpoint

### Health Check
```
GET http://localhost:5000/
```
Returns: `{"message":"WattwAIs backend running"}`

### Make Prediction
```
POST http://localhost:5000/predict
Content-Type: application/json
```

**Required fields in request body:**
```json
{
  "hour": 14,
  "day_of_week": 3,
  "month": 5,
  "is_weekend": 0,
  "electricity_rate_php_kwh": 7.50,
  "temperature": 25.5,
  "last_hour_kwh": 2.5,
  "same_hour_yesterday_kwh": 2.3,
  "same_hour_last_week_kwh": 2.4,
  "avg_24h_kwh": 2.2,
  "avg_7d_kwh": 2.1
}
```

**Success response (200):**
```json
{
  "success": true,
  "prediction": {
    "predicted_hourly_kwh": 2.35,
    "estimated_daily_kwh": 56.40,
    "estimated_monthly_kwh": 1692.00,
    "estimated_monthly_bill_php": 12690.00
  },
  "metadata": {
    "hour": 14,
    "day_of_week": 3,
    "month": 5,
    "temperature_celsius": 25.5,
    "electricity_rate_php_kwh": 7.50
  }
}
```

**Error response examples (400/500):**
```json
{
  "error": "Invalid input",
  "details": ["Missing required field: temperature"]
}
```

---

## 📚 Documentation

- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - Complete API reference with all fields and examples
- **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** - How to test endpoints with Postman, Thunder Client, and cURL

---

## 🏗️ Architecture

### File Structure
```
server/
├── index.js                  # Express server & route handlers
├── predict.py              # Python ML inference script
├── package.json            # Node dependencies
├── best_wattwais_model.keras    # Trained Keras model
├── preprocessing/
│   ├── scaler.json         # Feature scaling parameters
│   ├── feature_order.json  # Original model feature order
│   ├── categories.json     # Categorical feature mappings
│   └── preprocessor.pkl    # Scikit-learn preprocessor (backup)
├── data/
│   ├── model_results.csv   # Sample predictions
│   └── actual_vs_predicted_sample.csv
└── tfjs_model/            # (For future TensorFlow.js support)
```

### Data Flow

```
1. HTTP Request
   ↓
2. Express validates input
   ↓
3. Spawn Python process with JSON args
   ↓
4. predict.py:
   - Load Keras model
   - Load preprocessor & scaler
   - Map frontend fields → model features
   - Normalize numeric features
   - One-hot encode categorical features
   ↓
5. Keras model inference
   ↓
6. Calculate estimates (daily, monthly, bill)
   ↓
7. Return JSON response
```

---

## 🔄 Input Mapping

The backend automatically maps user-friendly input fields to the original model's features:

| User Input | Model Feature | Description |
|---|---|---|
| `hour` | `hour` | Hour of day (0-23) |
| `day_of_week` | `day_of_week` | Day of week (0-6) |
| `month` | `month` | Month (1-12) |
| `is_weekend` | `is_weekend` | Weekend flag (0/1) |
| `electricity_rate_php_kwh` | `Experiment_price_NOK_kWh` | Electricity price |
| `temperature` | `Temperature` | Current temperature |
| `last_hour_kwh` | `lag_1` | Previous hour demand |
| `same_hour_yesterday_kwh` | `lag_24` | 24-hour lag |
| `same_hour_last_week_kwh` | `lag_168` | 7-day lag |
| `avg_24h_kwh` | `rolling_24` | 24-hour rolling avg |
| `avg_7d_kwh` | `rolling_168` | 7-day rolling avg |

---

## 🧪 Testing

### Quick Test with cURL
```bash
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "hour": 14,
    "day_of_week": 3,
    "month": 5,
    "is_weekend": 0,
    "electricity_rate_php_kwh": 7.50,
    "temperature": 25.5,
    "last_hour_kwh": 2.5,
    "same_hour_yesterday_kwh": 2.3,
    "same_hour_last_week_kwh": 2.4,
    "avg_24h_kwh": 2.2,
    "avg_7d_kwh": 2.1
  }'
```

### Using Postman/Thunder Client
See [TESTING_GUIDE.md](./TESTING_GUIDE.md) for step-by-step instructions.

### Error Testing
```bash
# Test with missing fields
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{"hour": 14}'

# Should return 400 with missing field list
```

---

## 🔧 Configuration

### Change Server Port
Edit `index.js`:
```javascript
const PORT = 5000; // Change to your preferred port
```

### Modify Defaults
Edit `predict.py` in the `map_frontend_to_model()` function:
```python
day = frontend_input.get("day", 15)                    # Default day
region_id = frontend_input.get("region_id", "Exp_135") # Default region
# ... other defaults
```

---

## ⚠️ Troubleshooting

### Server won't start
- Ensure port 5000 is not in use: `lsof -i :5000` (macOS/Linux) or `netstat -ano | findstr :5000` (Windows)
- Try a different port if 5000 is occupied

### Python errors
- Verify TensorFlow is installed: `pip list | grep tensorflow`
- Check model file exists: `ls best_wattwais_model.keras`
- Ensure Python 3.8+: `python --version`

### Model loading fails
- File paths must be absolute or relative to `server/` directory
- Check file permissions: `chmod +r preprocessing/*.json`
- Verify `.keras` file is not corrupted

### Preprocessing errors
- Check JSON files are valid: use an online JSON validator
- Ensure all feature names in `feature_order.json` match the model

---

## 📊 Performance Notes

- **First prediction:** 2-3 seconds (model loading)
- **Subsequent predictions:** <500ms
- **Model caching:** Currently loads on each request (can be optimized)
- **Concurrency:** Express handles multiple requests naturally

### Future Optimizations
- Cache model in memory on startup
- Use connection pooling for Python subprocess
- Implement request queuing for high load

---

## 🔌 Connecting to Frontend

### Example React Integration
```javascript
// services/prediction.js
export const predictDemand = async (formData) => {
  const response = await fetch('http://localhost:5000/predict', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  return response.json();
};
```

Usage:
```javascript
// In React component
const [loading, setLoading] = useState(false);
const [prediction, setPrediction] = useState(null);

const handleSubmit = async (formData) => {
  setLoading(true);
  try {
    const result = await predictDemand(formData);
    setPrediction(result);
  } catch (error) {
    console.error('Prediction failed:', error);
  } finally {
    setLoading(false);
  }
};
```

---

## 📦 Dependencies

### Node.js
- `express@^5.2.1` - Web framework
- `cors@^2.8.6` - Cross-Origin Resource Sharing
- `nodemon@^3.1.14` - Dev auto-reload (dev only)

### Python
- `tensorflow@>=2.9.0` - Keras model support
- `numpy` - Array operations
- `pickle` (stdlib) - Preprocessor loading

---

## 🚀 Deployment

### Heroku
```bash
heroku create wattwais-backend
git push heroku main
heroku logs --tail
```

### AWS Lambda
Requires ZIP with dependencies - see AWS Lambda Python docs.

### Docker
```dockerfile
FROM node:20-slim
RUN apt-get update && apt-get install -y python3 python3-pip
WORKDIR /app
COPY . .
RUN npm install && pip install tensorflow numpy
EXPOSE 5000
CMD ["npm", "start"]
```

---

## 📝 Development

### Code Style
- Use 2-space indentation
- Follow Express.js best practices
- Error handling on all API routes
- Validate input before processing

### Debugging
```bash
# Enable verbose output
DEBUG=* npm run dev

# Python debugging
python -c "import predict; predict.predict({...})"
```

### Adding New Endpoints
1. Add route in `index.js`
2. Add validation
3. Call corresponding Python function
4. Return JSON response
5. Add tests and documentation

---

## 🤝 Contributing

1. Make changes to `index.js` or `predict.py`
2. Test with TESTING_GUIDE.md procedures
3. Update documentation if needed
4. Test error cases
5. Submit for review

---

## 📄 License

Part of the WattwAIs project.

---

## 📞 Support

For issues or questions:
1. Check [TESTING_GUIDE.md](./TESTING_GUIDE.md) troubleshooting section
2. Review [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for API details
3. Check server logs: Look for error messages in terminal

---

**Last Updated:** May 26, 2026
