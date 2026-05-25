# WattwAIs Backend - Example Requests

Copy and paste these examples directly into Postman, Thunder Client, or cURL to test the API.

---

## Example 1: Afternoon Prediction (May, Wednesday)

### Request
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

### Description
- Typical afternoon consumption in May
- Mid-week day
- Warm temperature
- Electricity rate: ₱7.50 per kWh

---

## Example 2: Peak Evening (Hot Summer Night)

### Request
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

### Description
- Peak evening hours (19:00 / 7 PM)
- Friday evening
- Hot summer month (July)
- High baseline demand
- Higher electricity rate

**Expected:** Higher consumption due to:
- AC usage (hot weather)
- Evening peak hours
- Cooking time

---

## Example 3: Early Morning (Winter Low Demand)

### Request
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

### Description
- Early morning (5:00 AM)
- Monday morning
- Winter month (December)
- Cool temperature
- Low baseline demand
- Cheaper electricity rate

**Expected:** Lower consumption due to:
- Early morning, most appliances off
- Cool weather (less AC)
- Low activity hours

---

## Example 4: Weekend Afternoon

### Request
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

### Description
- Sunday at noon
- Summer month (June)
- Weekend day (more people at home)
- Warm weather

**Expected:** Different pattern from weekday:
- More daytime appliance usage
- People at home all day
- Possibly higher consumption

---

## Example 5: With Historical Temperature Data

### Request
```json
{
  "hour": 14,
  "day_of_week": 3,
  "month": 5,
  "is_weekend": 0,
  "electricity_rate_php_kwh": 7.50,
  "temperature": 25.5,
  "temperature_24": 24.0,
  "temperature_48": 23.5,
  "temperature_72": 22.0,
  "last_hour_kwh": 2.5,
  "same_hour_yesterday_kwh": 2.3,
  "same_hour_last_week_kwh": 2.4,
  "avg_24h_kwh": 2.2,
  "avg_7d_kwh": 2.1
}
```

### Description
- Same as Example 1 but with historical temperature data
- Shows warming trend (22°C → 25.5°C over 72 hours)
- Can provide more accurate predictions

---

## Example 6: Default Region ID (Custom Household)

### Request
```json
{
  "hour": 10,
  "day_of_week": 2,
  "month": 3,
  "is_weekend": 0,
  "electricity_rate_php_kwh": 7.25,
  "temperature": 22.0,
  "last_hour_kwh": 2.0,
  "same_hour_yesterday_kwh": 2.1,
  "same_hour_last_week_kwh": 2.0,
  "avg_24h_kwh": 2.1,
  "avg_7d_kwh": 2.0,
  "day": 15,
  "region_id": "Exp_144",
  "region": "Oslo",
  "municipality": "Baerum"
}
```

### Description
- Includes optional region information
- Day is specified as 15 (mid-month)
- Custom region: Oslo, Baerum
- Specific experiment/household ID

---

## cURL Examples

### Basic Prediction
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

### Pretty Print Output
```bash
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{"hour": 14, ...}' | python -m json.tool
```

### Save to File
```bash
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{"hour": 14, ...}' > response.json
```

### Verbose Output (Debug)
```bash
curl -v -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{"hour": 14, ...}'
```

---

## Python Examples

### Using requests library
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
result = response.json()

print(f"Success: {result['success']}")
print(f"Hourly: {result['prediction']['hourly_kwh']} kWh")
print(f"Monthly Bill: ₱{result['prediction']['monthly_bill_php']}")
```

### Using urllib (no dependencies)
```python
import urllib.request
import json

url = 'http://localhost:5000/predict'
data = {...}  # Use any of the examples above

req = urllib.request.Request(
    url,
    data=json.dumps(data).encode('utf-8'),
    headers={'Content-Type': 'application/json'}
)

with urllib.request.urlopen(req) as response:
    result = json.loads(response.read())
    print(result)
```

---

## JavaScript/Node Examples

### Using fetch (Browser)
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
.then(result => {
  console.log('Hourly prediction:', result.prediction.hourly_kwh, 'kWh');
  console.log('Monthly bill:', result.prediction.monthly_bill_php, '₱');
})
.catch(err => console.error('Error:', err));
```

### Using axios (Node.js)
```javascript
const axios = require('axios');

const data = {...}; // Use any example above

axios.post('http://localhost:5000/predict', data)
  .then(response => {
    console.log('Prediction:', response.data.prediction);
  })
  .catch(error => {
    console.error('Error:', error.response.data);
  });
```

---

## Expected Response Format

All successful responses follow this structure:

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

### Field Explanations
- **hourly_kwh** - Predicted electricity demand for the specified hour
- **daily_kwh** - Estimated consumption if pattern repeats all day (hourly × 24)
- **monthly_kwh** - Estimated monthly consumption (daily × 30)
- **monthly_bill_php** - Estimated monthly bill in Philippine Pesos

---

## Error Response Examples

### Missing Required Fields
**Status:** 400 Bad Request
```json
{
  "error": "Missing required fields",
  "missing": ["temperature", "electricity_rate_php_kwh"]
}
```

### Server Error
**Status:** 500 Internal Server Error
```json
{
  "success": false,
  "error": "Prediction failed",
  "details": "Failed to load model: [specific error message]"
}
```

### Invalid JSON
**Status:** 500 Internal Server Error
```json
{
  "success": false,
  "error": "Invalid JSON input: Expecting value: line 1 column 1"
}
```

---

## Testing Checklist

- [ ] Server is running (`npm run dev`)
- [ ] Copy an example request
- [ ] Paste into Postman/Thunder Client or cURL
- [ ] Send request
- [ ] Verify response is valid JSON
- [ ] Check HTTP status code is 200
- [ ] Verify all prediction fields are present
- [ ] Check bill calculation: `monthly_kwh × electricity_rate` ≈ `monthly_bill_php`

---

## Tips for Testing

1. **Start with Example 1** - It's a typical, reliable baseline
2. **Compare Examples** - See how predictions change with different inputs
3. **Test Error Cases** - Try missing one required field to test validation
4. **Keep Response Format Consistent** - All responses should be valid JSON
5. **Monitor Server Logs** - Watch the terminal for errors and timing

---

**Ready to test?** Start the server with `npm run dev` and try Example 1!
