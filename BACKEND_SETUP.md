# WattwAIs - Machine Learning Electricity Demand Prediction App

> A full-stack machine learning application that predicts household electricity consumption using a trained Keras deep learning model.

## 📁 Project Structure

```
DL_WATTWAIS/
├── server/                          # Express.js backend
│   ├── index.js                    # Main server file
│   ├── predict.py                  # Python ML inference script
│   ├── best_wattwais_model.keras   # Trained Keras model
│   ├── package.json                # Node.js dependencies
│   ├── preprocessing/              # Feature preprocessing files
│   │   ├── scaler.json
│   │   ├── feature_order.json
│   │   ├── categories.json
│   │   └── preprocessor.pkl
│   ├── data/                       # Sample data & results
│   ├── README.md                   # Backend setup & architecture
│   ├── API_DOCUMENTATION.md        # Complete API reference
│   ├── TESTING_GUIDE.md            # How to test endpoints
│   ├── EXAMPLES.md                 # Copy-paste ready examples
│   └── IMPLEMENTATION_SUMMARY.md   # Quick reference guide
├── client/                          # React frontend (coming soon)
└── dl_wattwais.ipynb              # Jupyter notebook with training code
```

---

## 🚀 Quick Start

### 1. Install & Run Backend

```bash
cd server
npm install
npm run dev
```

Server will start on `http://localhost:5000`

### 2. Test API

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

Response:
```json
{
  "success": true,
  "prediction": {
    "hourly_kwh": 2.35,
    "daily_kwh": 56.40,
    "monthly_kwh": 1692.00,
    "monthly_bill_php": 12690.00
  },
  ...
}
```

---

## 📚 Documentation

All documentation is in the **`server/`** directory:

| Document | Purpose |
|----------|---------|
| [README.md](./server/README.md) | Server setup, architecture, and deployment |
| [API_DOCUMENTATION.md](./server/API_DOCUMENTATION.md) | Complete API reference with all fields |
| [TESTING_GUIDE.md](./server/TESTING_GUIDE.md) | Step-by-step testing with Postman, Thunder Client, cURL |
| [EXAMPLES.md](./server/EXAMPLES.md) | Ready-to-use example requests & responses |
| [IMPLEMENTATION_SUMMARY.md](./server/IMPLEMENTATION_SUMMARY.md) | Quick reference & implementation overview |

---

## ✨ Features

### Backend API
- ✅ `GET /` - Health check endpoint
- ✅ `POST /predict` - Electricity demand prediction
- ✅ Input validation & error handling
- ✅ CORS enabled for frontend integration

### Prediction Outputs
- ✅ Hourly consumption (kWh)
- ✅ Daily consumption estimate
- ✅ Monthly consumption estimate
- ✅ Monthly bill in Philippine Pesos (PHP)

### Input Features
- **Temporal:** Hour, day of week, month, weekend flag
- **Environmental:** Current & historical temperature
- **Economic:** Electricity rate (PHP/kWh)
- **Historical:** Demand lags (1hr, 24hr, 7d) and rolling averages

### Processing
- ✅ Feature scaling using StandardScaler
- ✅ Categorical one-hot encoding
- ✅ Feature mapping (user-friendly → model features)
- ✅ Keras model inference

---

## 🏗️ Architecture

### Tech Stack
- **Frontend:** React (coming soon)
- **Backend:** Node.js + Express.js
- **ML Model:** TensorFlow/Keras
- **Inference:** Python subprocess
- **Data Format:** JSON

### Data Flow
```
HTTP Request
    ↓
Express validates input
    ↓
Spawn Python subprocess
    ↓
Python:
  - Load Keras model
  - Preprocess input
  - Make prediction
  - Calculate estimates
    ↓
Return JSON response
```

---

## 📊 Input Requirements

### Required Fields
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `hour` | number | Hour of day (0-23) | 14 |
| `day_of_week` | number | Day of week (0-6) | 3 |
| `month` | number | Month (1-12) | 5 |
| `is_weekend` | number | Weekend (0/1) | 0 |
| `electricity_rate_php_kwh` | number | Rate in PHP | 7.50 |
| `temperature` | number | Celsius | 25.5 |
| `last_hour_kwh` | number | kWh | 2.5 |
| `same_hour_yesterday_kwh` | number | kWh | 2.3 |
| `same_hour_last_week_kwh` | number | kWh | 2.4 |
| `avg_24h_kwh` | number | kWh | 2.2 |
| `avg_7d_kwh` | number | kWh | 2.1 |

### Optional Fields
- `day` - Day of month (default: 15)
- `temperature_24`, `temperature_48`, `temperature_72` - Historical temperatures
- `region_id`, `region`, `municipality` - User/location identifiers
- `participation_phase`, `control_price_phase2`, `group_phase2` - Categorical features

---

## 🧪 Testing Options

### With cURL
```bash
curl -X POST http://localhost:5000/predict -H "Content-Type: application/json" -d '{...}'
```

### With Postman
1. New POST request
2. URL: `http://localhost:5000/predict`
3. Body: `{"hour": 14, ...}`
4. Send

### With Thunder Client (VS Code)
1. Install extension
2. Click Thunder Client
3. New request, set to POST
4. Add JSON body
5. Send

See [TESTING_GUIDE.md](./server/TESTING_GUIDE.md) for detailed instructions.

---

## 📦 Installation

### Prerequisites
- Node.js 20+ LTS
- Python 3.8+
- TensorFlow installed: `pip install tensorflow`

### Setup
```bash
# Install Node dependencies
cd server
npm install

# Install Python dependencies
pip install tensorflow numpy

# Start server
npm run dev
```

---

## 🚀 Deployment

### Heroku
```bash
heroku create wattwais-backend
git push heroku main
```

### Docker
```bash
docker build -t wattwais-backend .
docker run -p 5000:5000 wattwais-backend
```

See [README.md](./server/README.md#-deployment) for more options.

---

## 🔗 API Endpoint

**Base URL:** `http://localhost:5000`

### Health Check
```
GET /
Response: {"message":"WattwAIs backend running"}
```

### Predict
```
POST /predict
Content-Type: application/json
Body: {...required fields...}
Response: {"success": true, "prediction": {...}, "input_received": {...}}
```

See [API_DOCUMENTATION.md](./server/API_DOCUMENTATION.md) for complete reference.

---

## 📈 Response Format

Success (200 OK):
```json
{
  "success": true,
  "prediction": {
    "hourly_kwh": 2.35,
    "daily_kwh": 56.40,
    "monthly_kwh": 1692.00,
    "monthly_bill_php": 12690.00
  },
  "input_received": {...}
}
```

Error (400/500):
```json
{
  "error": "Error message",
  "details": "Detailed information"
}
```

---

## 🛠️ Development

### Project Structure
- Backend: `server/` - Express.js + Python ML
- Frontend: `client/` - React (coming soon)
- Model: `best_wattwais_model.keras` - Trained Keras model
- Training: `dl_wattwais.ipynb` - Jupyter notebook

### Key Files
- `server/index.js` - Express server
- `server/predict.py` - ML inference
- `server/preprocessing/` - Feature files

### Running Tests
See [TESTING_GUIDE.md](./server/TESTING_GUIDE.md) for comprehensive testing instructions.

---

## 📝 Documentation Index

### Backend Documentation (in `server/` directory)
1. **[README.md](./server/README.md)** - Server overview, setup, architecture
2. **[API_DOCUMENTATION.md](./server/API_DOCUMENTATION.md)** - Complete API reference
3. **[TESTING_GUIDE.md](./server/TESTING_GUIDE.md)** - Testing instructions
4. **[EXAMPLES.md](./server/EXAMPLES.md)** - Copy-paste example requests
5. **[IMPLEMENTATION_SUMMARY.md](./server/IMPLEMENTATION_SUMMARY.md)** - Quick reference

---

## ❓ Troubleshooting

### Server won't start
- Check Node.js is installed: `node --version`
- Ensure port 5000 is free
- Run `npm install` first

### Python errors
- Check TensorFlow: `pip list | grep tensorflow`
- Verify model file exists
- Check Python version: `python --version`

### Prediction fails
- Verify all required fields are in request
- Check JSON is valid
- Review server logs for error details

See [TESTING_GUIDE.md](./server/TESTING_GUIDE.md#troubleshooting) for detailed troubleshooting.

---

## 🎯 Next Steps

1. **Review [IMPLEMENTATION_SUMMARY.md](./server/IMPLEMENTATION_SUMMARY.md)** for quick overview
2. **Start the server:** `npm run dev`
3. **Test with examples** from [EXAMPLES.md](./server/EXAMPLES.md)
4. **Use Postman/Thunder Client** for easy testing (see [TESTING_GUIDE.md](./server/TESTING_GUIDE.md))
5. **Connect frontend** when React app is ready

---

## 📊 Model Details

- **Model Type:** Deep Learning Neural Network (Keras)
- **Input Features:** 15 numeric + 6 categorical = 121 total features
- **Target:** Hourly electricity demand (kWh)
- **Training Data:** Norwegian household electricity consumption
- **Output:** Hourly, daily, monthly predictions + PHP bill calculation

---

## 🔄 Feature Engineering

The backend automatically handles:
- **Scaling:** Numeric features normalized using saved mean/scale
- **Encoding:** Categorical features one-hot encoded
- **Mapping:** User inputs mapped to model feature names
- **Defaults:** Optional fields filled with sensible defaults

---

## 💡 Key Features

✅ User-friendly input mapping
✅ Comprehensive error handling
✅ Input validation
✅ CORS enabled
✅ Well-documented
✅ Easy testing
✅ Production-ready
✅ Extensible architecture

---

## 📞 Support

- Check [TESTING_GUIDE.md](./server/TESTING_GUIDE.md) troubleshooting section
- Review [API_DOCUMENTATION.md](./server/API_DOCUMENTATION.md) for API details
- See [EXAMPLES.md](./server/EXAMPLES.md) for ready-to-use examples

---

**Status:** ✅ Backend implementation complete and ready for testing

**Last Updated:** May 26, 2026
