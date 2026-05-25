# Phase 2 - Quick Reference Guide

## 🚀 Start Backend
```bash
cd server
npm run dev
```

Expected output:
```
✓ WattwAIs backend running on http://localhost:5000
✓ POST http://localhost:5000/predict to make predictions
```

---

## 📡 API Endpoint

**URL:** `http://localhost:5000/predict`  
**Method:** POST  
**Content-Type:** application/json

---

## ✅ Sample Request (Thunder Client / Postman)

### Headers
```
Content-Type: application/json
```

### Body (JSON)
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

---

## ✅ Expected Response (Status 200)

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

## 📋 Required Input Fields

| Field | Type | Range | Example |
|-------|------|-------|---------|
| `hour` | number | 0-23 | 14 |
| `day_of_week` | number | 0-6 | 3 |
| `month` | number | 1-12 | 5 |
| `is_weekend` | number | 0 or 1 | 0 |
| `electricity_rate_php_kwh` | number | ≥ 0 | 7.50 |
| `temperature` | number | any | 25.5 |
| `last_hour_kwh` | number | ≥ 0 | 2.5 |
| `same_hour_yesterday_kwh` | number | ≥ 0 | 2.3 |
| `same_hour_last_week_kwh` | number | ≥ 0 | 2.4 |
| `avg_24h_kwh` | number | ≥ 0 | 2.2 |
| `avg_7d_kwh` | number | ≥ 0 | 2.1 |

---

## 🔄 Input Mapping (Backend Auto-Conversion)

Frontend sends → Backend converts to model format:

```
electricity_rate_php_kwh → Experiment_price_NOK_kWh
temperature → Temperature
temperature → Temperature24, Temperature48, Temperature72
last_hour_kwh → lag_1
same_hour_yesterday_kwh → lag_24
same_hour_last_week_kwh → lag_168
avg_24h_kwh → rolling_24
avg_7d_kwh → rolling_168
```

**Auto-filled categorical fields:**
- ID: "Unknown"
- Region: "Unknown"
- Municipality: "Unknown"
- Participation_Phase: "Phase_2"
- Control_Price_Phase2: "Price group"
- Group_Phase2: "H1"

---

## ❌ Error Response Example (Status 400)

**Missing field:**
```json
{
  "error": "Invalid input",
  "details": ["Missing required field: temperature"]
}
```

**Invalid hour:**
```json
{
  "error": "Invalid input",
  "details": ["hour must be a number between 0 and 23"]
}
```

**Multiple errors:**
```json
{
  "error": "Invalid input",
  "details": [
    "hour must be a number between 0 and 23",
    "last_hour_kwh must not be negative"
  ]
}
```

---

## 🧪 Quick Test (cURL)

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

---

## 📊 Response Fields Explained

| Field | Calculation | Example |
|-------|---|---|
| `predicted_hourly_kwh` | Direct model output | 2.35 |
| `estimated_daily_kwh` | hourly × 24 | 56.40 |
| `estimated_monthly_kwh` | daily × 30 | 1692.00 |
| `estimated_monthly_bill_php` | monthly × rate | 12690.00 |

**Bill Calculation:**
```
2.35 kWh/hour × 24 hours = 56.40 kWh/day
56.40 kWh/day × 30 days = 1692.00 kWh/month
1692.00 kWh × ₱7.50/kWh = ₱12,690.00/month
```

---

## 🎯 Test Scenarios

### Scenario 1: Afternoon (Success ✓)
```json
{ "hour": 14, "day_of_week": 3, "month": 5, "is_weekend": 0, "electricity_rate_php_kwh": 7.50, "temperature": 25.5, "last_hour_kwh": 2.5, "same_hour_yesterday_kwh": 2.3, "same_hour_last_week_kwh": 2.4, "avg_24h_kwh": 2.2, "avg_7d_kwh": 2.1 }
```
Expected: ✓ Valid response with predictions

### Scenario 2: Missing Field (Error ✗)
```json
{ "hour": 14, "day_of_week": 3, "month": 5 }
```
Expected: ✗ 400 error - missing fields list

### Scenario 3: Invalid Hour (Error ✗)
```json
{ "hour": 25, "day_of_week": 3, "month": 5, ... }
```
Expected: ✗ 400 error - hour out of range

### Scenario 4: Negative Value (Error ✗)
```json
{ ..., "last_hour_kwh": -2.5, ... }
```
Expected: ✗ 400 error - must not be negative

---

## 💡 Key Implementation Details

### Validation Checks
- ✓ All 11 required fields present
- ✓ hour: 0-23
- ✓ day_of_week: 0-6  
- ✓ month: 1-12
- ✓ is_weekend: 0 or 1
- ✓ All numeric values are valid numbers
- ✓ kwh/rate values ≥ 0

### Mapping Process
1. Accept frontend-friendly inputs
2. Validate all fields
3. Map to model feature names
4. Auto-fill categorical fields
5. Send to Python
6. Calculate estimates
7. Return JSON

### Error Handling
- Invalid input → 400 Bad Request
- Python/model error → 500 Internal Server Error
- All errors returned as JSON with details

---

## 🔧 Testing in Postman/Thunder Client

**Steps:**
1. Create new POST request
2. URL: `http://localhost:5000/predict`
3. Headers: `Content-Type: application/json`
4. Body: Paste sample request JSON above
5. Click Send
6. See response (should be 200 with predictions)

---

## 📚 Full Documentation

For more details:
- [PHASE2_EXAMPLES.md](./PHASE2_EXAMPLES.md) - More examples & error cases
- [PHASE2_SUMMARY.md](./PHASE2_SUMMARY.md) - Architecture & improvements
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - Complete reference

---

## ✅ Checklist

- [ ] Backend running: `npm run dev`
- [ ] Can curl/Postman the endpoint
- [ ] Valid request returns 200 with predictions
- [ ] Missing field returns 400 error
- [ ] Invalid hour returns 400 error
- [ ] Response has all 4 prediction fields
- [ ] Bill calculation is correct
- [ ] Ready to build React frontend

---

**Last Updated:** May 26, 2026
