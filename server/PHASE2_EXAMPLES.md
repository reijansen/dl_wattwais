# WattwAIs Phase 2 - Sample Requests & Responses

Complete examples for testing the updated backend with Thunder Client, Postman, or cURL.

---

## 🎯 Quick Reference

**Base URL:** `http://localhost:5000`

**Endpoint:** `POST /predict`

**Required Headers:**
```
Content-Type: application/json
```

---

## ✅ Example 1: Valid Request (Afternoon, May)

### Thunder Client / Postman Request

**Method:** POST
**URL:** `http://localhost:5000/predict`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
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

### Expected Response (Status: 200 OK)

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

---

## ✅ Example 2: Peak Evening (High Demand)

### Request Body

```json
{
  "hour": 19,
  "day_of_week": 5,
  "month": 7,
  "is_weekend": 0,
  "electricity_rate_php_kwh": 8.00,
  "temperature": 32.0,
  "last_hour_kwh": 3.2,
  "same_hour_yesterday_kwh": 3.1,
  "same_hour_last_week_kwh": 3.0,
  "avg_24h_kwh": 2.8,
  "avg_7d_kwh": 2.7
}
```

### Expected Response (Higher consumption due to evening peak + heat)

```json
{
  "success": true,
  "prediction": {
    "predicted_hourly_kwh": 3.15,
    "estimated_daily_kwh": 75.60,
    "estimated_monthly_kwh": 2268.00,
    "estimated_monthly_bill_php": 18144.00
  },
  "metadata": {
    "hour": 19,
    "day_of_week": 5,
    "month": 7,
    "temperature_celsius": 32.0,
    "electricity_rate_php_kwh": 8.00
  }
}
```

---

## ✅ Example 3: Early Morning (Low Demand)

### Request Body

```json
{
  "hour": 5,
  "day_of_week": 1,
  "month": 12,
  "is_weekend": 0,
  "electricity_rate_php_kwh": 6.50,
  "temperature": 18.0,
  "last_hour_kwh": 1.2,
  "same_hour_yesterday_kwh": 1.3,
  "same_hour_last_week_kwh": 1.1,
  "avg_24h_kwh": 1.8,
  "avg_7d_kwh": 1.9
}
```

### Expected Response (Lower consumption - early morning, cool weather)

```json
{
  "success": true,
  "prediction": {
    "predicted_hourly_kwh": 1.28,
    "estimated_daily_kwh": 30.72,
    "estimated_monthly_kwh": 921.60,
    "estimated_monthly_bill_php": 5990.40
  },
  "metadata": {
    "hour": 5,
    "day_of_week": 1,
    "month": 12,
    "temperature_celsius": 18.0,
    "electricity_rate_php_kwh": 6.50
  }
}
```

---

## ✅ Example 4: Weekend Afternoon

### Request Body

```json
{
  "hour": 12,
  "day_of_week": 0,
  "month": 6,
  "is_weekend": 1,
  "electricity_rate_php_kwh": 7.75,
  "temperature": 28.0,
  "last_hour_kwh": 2.8,
  "same_hour_yesterday_kwh": 2.6,
  "same_hour_last_week_kwh": 2.9,
  "avg_24h_kwh": 2.5,
  "avg_7d_kwh": 2.6
}
```

### Expected Response

```json
{
  "success": true,
  "prediction": {
    "predicted_hourly_kwh": 2.70,
    "estimated_daily_kwh": 64.80,
    "estimated_monthly_kwh": 1944.00,
    "estimated_monthly_bill_php": 15066.00
  },
  "metadata": {
    "hour": 12,
    "day_of_week": 0,
    "month": 6,
    "temperature_celsius": 28.0,
    "electricity_rate_php_kwh": 7.75
  }
}
```

---

## ❌ Error Examples

### Error 1: Missing Required Field

**Request Body (missing `temperature`):**
```json
{
  "hour": 14,
  "day_of_week": 3,
  "month": 5,
  "is_weekend": 0,
  "electricity_rate_php_kwh": 7.50,
  "last_hour_kwh": 2.5,
  "same_hour_yesterday_kwh": 2.3,
  "same_hour_last_week_kwh": 2.4,
  "avg_24h_kwh": 2.2,
  "avg_7d_kwh": 2.1
}
```

**Response (Status: 400 Bad Request):**
```json
{
  "error": "Invalid input",
  "details": ["Missing required field: temperature"]
}
```

---

### Error 2: Invalid Hour (Out of Range)

**Request Body (hour = 25):**
```json
{
  "hour": 25,
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

**Response (Status: 400 Bad Request):**
```json
{
  "error": "Invalid input",
  "details": ["hour must be a number between 0 and 23"]
}
```

---

### Error 3: Negative Value

**Request Body (negative last_hour_kwh):**
```json
{
  "hour": 14,
  "day_of_week": 3,
  "month": 5,
  "is_weekend": 0,
  "electricity_rate_php_kwh": 7.50,
  "temperature": 25.5,
  "last_hour_kwh": -2.5,
  "same_hour_yesterday_kwh": 2.3,
  "same_hour_last_week_kwh": 2.4,
  "avg_24h_kwh": 2.2,
  "avg_7d_kwh": 2.1
}
```

**Response (Status: 400 Bad Request):**
```json
{
  "error": "Invalid input",
  "details": ["last_hour_kwh must not be negative"]
}
```

---

### Error 4: Invalid day_of_week

**Request Body (day_of_week = 7, should be 0-6):**
```json
{
  "hour": 14,
  "day_of_week": 7,
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

**Response (Status: 400 Bad Request):**
```json
{
  "error": "Invalid input",
  "details": ["day_of_week must be a number between 0 and 6"]
}
```

---

### Error 5: Invalid is_weekend

**Request Body (is_weekend = 2, should be 0 or 1):**
```json
{
  "hour": 14,
  "day_of_week": 3,
  "month": 5,
  "is_weekend": 2,
  "electricity_rate_php_kwh": 7.50,
  "temperature": 25.5,
  "last_hour_kwh": 2.5,
  "same_hour_yesterday_kwh": 2.3,
  "same_hour_last_week_kwh": 2.4,
  "avg_24h_kwh": 2.2,
  "avg_7d_kwh": 2.1
}
```

**Response (Status: 400 Bad Request):**
```json
{
  "error": "Invalid input",
  "details": ["is_weekend must be 0 or 1"]
}
```

---

### Error 6: Multiple Validation Errors

**Request Body:**
```json
{
  "hour": 25,
  "day_of_week": 10,
  "month": 13,
  "is_weekend": 0,
  "electricity_rate_php_kwh": 7.50,
  "temperature": 25.5,
  "last_hour_kwh": -2.5,
  "same_hour_yesterday_kwh": 2.3,
  "same_hour_last_week_kwh": 2.4,
  "avg_24h_kwh": 2.2,
  "avg_7d_kwh": 2.1
}
```

**Response (Status: 400 Bad Request):**
```json
{
  "error": "Invalid input",
  "details": [
    "hour must be a number between 0 and 23",
    "day_of_week must be a number between 0 and 6",
    "month must be a number between 1 and 12",
    "last_hour_kwh must not be negative"
  ]
}
```

---

### Error 7: Python/Model Error

**Response (Status: 500 Internal Server Error):**
```json
{
  "error": "Prediction failed",
  "details": "Failed to load model: No such file or directory 'best_wattwais_model.keras'"
}
```

---

## 🔄 cURL Examples

### Basic Valid Request
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

### Pretty Print Response
```bash
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{...}' | python -m json.tool
```

### Test Missing Field
```bash
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "hour": 14,
    "day_of_week": 3,
    "month": 5
  }'
```

### Test Invalid Values
```bash
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "hour": 25,
    "day_of_week": 3,
    "month": 5,
    "is_weekend": 0,
    "electricity_rate_php_kwh": 7.50,
    "temperature": 25.5,
    "last_hour_kwh": -2.5,
    "same_hour_yesterday_kwh": 2.3,
    "same_hour_last_week_kwh": 2.4,
    "avg_24h_kwh": 2.2,
    "avg_7d_kwh": 2.1
  }'
```

---

## 📊 Input Mapping (Backend Magic)

The backend automatically maps frontend inputs to model features:

| Frontend Field | Model Feature | Used For |
|---|---|---|
| `hour` | `hour` | Hour of day |
| `day_of_week` | `day_of_week` | Day of week |
| `month` | `month` | Month |
| `is_weekend` | `is_weekend` | Weekend flag |
| `electricity_rate_php_kwh` | `Experiment_price_NOK_kWh` | Price |
| `temperature` | `Temperature` | Current temp |
| `temperature` | `Temperature24` | 24h lag (approx) |
| `temperature` | `Temperature48` | 48h lag (approx) |
| `temperature` | `Temperature72` | 72h lag (approx) |
| `last_hour_kwh` | `lag_1` | 1h lag demand |
| `same_hour_yesterday_kwh` | `lag_24` | 24h lag demand |
| `same_hour_last_week_kwh` | `lag_168` | 168h lag demand |
| `avg_24h_kwh` | `rolling_24` | 24h rolling avg |
| `avg_7d_kwh` | `rolling_168` | 7d rolling avg |

**Auto-filled categorical fields:**
- `ID`: "Unknown"
- `Region`: "Unknown"
- `Municipality`: "Unknown"
- `Participation_Phase`: "Phase_2"
- `Control_Price_Phase2`: "Price group"
- `Group_Phase2`: "H1"

---

## 📋 Input Validation Rules

### Temporal Fields
- `hour`: 0-23 (integer)
- `day_of_week`: 0-6 (0=Sunday, 6=Saturday)
- `month`: 1-12
- `is_weekend`: 0 or 1

### Numeric Fields (Must be valid numbers, ≥0)
- `electricity_rate_php_kwh`: ≥ 0
- `temperature`: Any valid number
- `last_hour_kwh`: ≥ 0
- `same_hour_yesterday_kwh`: ≥ 0
- `same_hour_last_week_kwh`: ≥ 0
- `avg_24h_kwh`: ≥ 0
- `avg_7d_kwh`: ≥ 0

---

## 🧪 Testing Checklist

- [ ] Start server: `npm run dev`
- [ ] Copy Example 1 request
- [ ] Paste in Postman/Thunder Client
- [ ] Verify response is valid JSON
- [ ] Check status code is 200
- [ ] Verify all 4 prediction fields present
- [ ] Test Example 2 (different hour/season)
- [ ] Test Example 3 (early morning)
- [ ] Test missing field error (400)
- [ ] Test invalid hour error (400)
- [ ] Test negative value error (400)

---

## 💡 Key Response Fields

| Field | Description | Example |
|---|---|---|
| `predicted_hourly_kwh` | Predicted hourly consumption | 2.35 |
| `estimated_daily_kwh` | Daily estimate (hourly × 24) | 56.40 |
| `estimated_monthly_kwh` | Monthly estimate (daily × 30) | 1692.00 |
| `estimated_monthly_bill_php` | Monthly bill in PHP (monthly × rate) | 12690.00 |

**Bill calculation example:**
- Hourly: 2.35 kWh
- Daily: 2.35 × 24 = 56.40 kWh
- Monthly: 56.40 × 30 = 1692.00 kWh
- Bill: 1692.00 × 7.50 = **₱12,690.00**

---

## 🎯 Quick Test Script

**Python:**
```python
import requests
import json

url = 'http://localhost:5000/predict'

data = {
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

response = requests.post(url, json=data)
print(json.dumps(response.json(), indent=2))
```

**JavaScript:**
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
.then(r => r.json())
.then(console.log);
```

---

## 🚀 Next Steps

1. Start the server: `npm run dev`
2. Pick Example 1 request above
3. Paste into Postman/Thunder Client
4. Click Send
5. Verify response matches expected format
6. Test error cases
7. Integrate with React frontend

---

**Last Updated:** May 26, 2026
