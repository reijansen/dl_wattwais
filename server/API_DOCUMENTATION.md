# WattwAIs Backend API Documentation

## Overview
The WattwAIs backend is an Express.js server that provides machine learning-powered electricity demand predictions using a trained Keras deep learning model.

## Base URL
```
http://localhost:5000
```

## Endpoints

### 1. Health Check
**GET** `/`

Returns server status and confirms the backend is running.

**Response:**
```json
{
  "message": "WattwAIs backend running"
}
```

---

### 2. Predict Electricity Demand
**POST** `/predict`

Predicts hourly electricity demand and calculates estimated daily, monthly consumption and bills.

#### Request Headers
```
Content-Type: application/json
```

#### Request Body
Required fields:

| Field | Type | Description | Range/Example |
|-------|------|-------------|------------------|
| `hour` | number | Hour of day (0-23) | 0-23 |
| `day_of_week` | number | Day of week (0=Sunday to 6=Saturday) | 0-6 |
| `month` | number | Month (1-12) | 1-12 |
| `is_weekend` | number | Weekend indicator (0=weekday, 1=weekend) | 0 or 1 |
| `electricity_rate_php_kwh` | number | Electricity rate in PHP per kWh | e.g., 7.50 |
| `temperature` | number | Current temperature in °C | e.g., 25.5 |
| `last_hour_kwh` | number | Electricity demand from last hour (kWh) | e.g., 2.5 |
| `same_hour_yesterday_kwh` | number | Demand at same hour yesterday (kWh) | e.g., 2.3 |
| `same_hour_last_week_kwh` | number | Demand at same hour last week (kWh) | e.g., 2.4 |
| `avg_24h_kwh` | number | Average demand last 24 hours (kWh) | e.g., 2.2 |
| `avg_7d_kwh` | number | Average demand last 7 days (kWh) | e.g., 2.1 |

Optional fields (with defaults):

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `day` | number | 15 | Day of month (1-31) |
| `temperature_24` | number | same as `temperature` | Temp 24 hours ago (°C) |
| `temperature_48` | number | same as `temperature` | Temp 48 hours ago (°C) |
| `temperature_72` | number | same as `temperature` | Temp 72 hours ago (°C) |
| `region_id` | string | "Exp_135" | Region/experiment ID |
| `region` | string | "Bergen" | Geographic region |
| `municipality` | string | "Asker" | Municipality |
| `participation_phase` | string | "Phase_1" | Participation phase |
| `control_price_phase2` | string | "Price group" | Price control group |
| `group_phase2` | string | "Ber_1" | Group identifier |

#### Example Request

**Using curl:**
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

**Using JavaScript:**
```javascript
const data = {
  hour: 14,
  day_of_week: 3,
  month: 5,
  is_weekend: 0,
  electricity_rate_php_kwh: 7.50,
  temperature: 25.5,
  last_hour_kwh: 2.5,
  same_hour_yesterday_kwh: 2.3,
  same_hour_last_week_kwh: 2.4,
  avg_24h_kwh: 2.2,
  avg_7d_kwh: 2.1
};

fetch('http://localhost:5000/predict', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error(err));
```

#### Successful Response (200 OK)
```json
{
  "success": true,
  "prediction": {
    "hourly_kwh": 2.35,
    "daily_kwh": 56.40,
    "monthly_kwh": 1692.00,
    "monthly_bill_php": 12690.00
  },
  "input_received": {
    "hour": 14,
    "day_of_week": 3,
    "month": 5,
    "temperature_celsius": 25.5,
    "electricity_rate_php_kwh": 7.50
  }
}
```

#### Error Response - Missing Fields (400 Bad Request)
```json
{
  "error": "Missing required fields",
  "missing": ["temperature", "electricity_rate_php_kwh"]
}
```

#### Error Response - Prediction Failed (500 Internal Server Error)
```json
{
  "success": false,
  "error": "Prediction failed",
  "details": "Error message from Python script"
}
```

---

## Input Mapping

The backend maps frontend-friendly input fields to the original model's feature names:

| Frontend Input | Model Feature | Purpose |
|---|---|---|
| `hour` | `hour` | Hour of day |
| `day_of_week` | `day_of_week` | Day of week |
| `month` | `month` | Month of year |
| `is_weekend` | `is_weekend` | Weekend flag |
| `electricity_rate_php_kwh` | `Experiment_price_NOK_kWh` | Price per kWh |
| `temperature` | `Temperature` | Current temperature |
| `temperature_24` | `Temperature24` | 24-hour ago temperature |
| `temperature_48` | `Temperature48` | 48-hour ago temperature |
| `temperature_72` | `Temperature72` | 72-hour ago temperature |
| `last_hour_kwh` | `lag_1` | 1-hour lag demand |
| `same_hour_yesterday_kwh` | `lag_24` | 24-hour lag demand |
| `same_hour_last_week_kwh` | `lag_168` | 168-hour lag demand |
| `avg_24h_kwh` | `rolling_24` | 24-hour rolling average |
| `avg_7d_kwh` | `rolling_168` | 7-day rolling average |

---

## Response Fields Explained

**`hourly_kwh`** - Predicted hourly electricity demand in kilowatt-hours

**`daily_kwh`** - Estimated daily consumption (hourly prediction × 24)

**`monthly_kwh`** - Estimated monthly consumption (daily × 30)

**`monthly_bill_php`** - Estimated monthly bill in Philippine Pesos (monthly kWh × rate)

---

## Testing the API

See [TESTING_GUIDE.md](./TESTING_GUIDE.md) for detailed instructions on testing with Postman, Thunder Client, or cURL.

---

## Architecture

1. **Express Server** (`index.js`) - Receives HTTP requests and validates input
2. **Python Inference Script** (`predict.py`) - Handles ML model prediction
3. **Keras Model** (`best_wattwais_model.keras`) - Trained deep learning model
4. **Preprocessing** (`preprocessing/`) - Scaler, feature order, and categories files

### Data Flow

```
HTTP Request → Express Validation → Python Script 
→ Load Model & Preprocessor → Map Features → Scale & Encode 
→ Keras Prediction → Calculate Estimates → JSON Response
```

---

## Dependencies

### Node.js
- `express` - Web framework
- `cors` - Cross-Origin Resource Sharing

### Python
- `tensorflow` - Keras model loading
- `numpy` - Array operations

---

## Configuration

Server runs on port `5000` by default. To change, edit `index.js`:

```javascript
const PORT = 5000; // Change this value
```

---

## Error Handling

The API returns appropriate HTTP status codes:

| Status | Meaning | Example |
|--------|---------|---------|
| 200 | Success | Prediction completed |
| 400 | Bad Request | Missing required fields |
| 404 | Not Found | Invalid endpoint |
| 500 | Server Error | Model load failure, Python error |

---

## Performance Notes

- First prediction may take 2-3 seconds (model loading)
- Subsequent predictions are faster (model cached in memory for the request)
- For production, consider caching the loaded model to avoid reload overhead
