# WattwAIs Backend Testing Guide

This guide shows how to test the `/predict` endpoint using different tools.

---

## Quick Start

1. **Start the backend server:**
   ```bash
   npm run dev
   # or
   npm start
   ```

2. **Server should print:**
   ```
   ✓ WattwAIs backend running on http://localhost:5000
   ✓ POST http://localhost:5000/predict to make predictions
   ```

3. **Test the health endpoint:**
   ```bash
   curl http://localhost:5000
   ```
   Should return: `{"message":"WattwAIs backend running"}`

---

## Test Case 1: Simple Prediction

### Sample Input (Wednesday, Afternoon, May)

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

### Expected Response

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

---

## Testing with cURL

### Basic Test
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

### Test Missing Fields (should return 400)
```bash
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "hour": 14,
    "day_of_week": 3
  }'
```

Response:
```json
{
  "error": "Missing required fields",
  "missing": ["month", "is_weekend", "electricity_rate_php_kwh", ...]
}
```

---

## Testing with Postman

### Step 1: Create New Request
1. Click **New** → **HTTP Request**
2. Set method to **POST**
3. Enter URL: `http://localhost:5000/predict`

### Step 2: Set Headers
- **Key:** `Content-Type`
- **Value:** `application/json`

### Step 3: Add Body
1. Click **Body** tab
2. Select **raw**
3. Select **JSON** from dropdown
4. Paste the JSON input:

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

### Step 4: Send Request
Click **Send** button

### Step 5: View Response
Response appears in the lower panel with:
- Status code (200 for success)
- Response body (JSON)
- Response time
- Response size

---

## Testing with Thunder Client (VS Code Extension)

### Installation
1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "Thunder Client"
4. Click Install

### Step 1: Open Thunder Client
- Click Thunder Client icon in Activity Bar
- Or press `Cmd+Shift+T` / `Ctrl+Shift+T`

### Step 2: Create Request
1. Click **New Request** (or +)
2. Change method dropdown to **POST**
3. Paste URL: `http://localhost:5000/predict`

### Step 3: Add Headers
1. Click **Headers** section
2. Add new header:
   - Key: `Content-Type`
   - Value: `application/json`

### Step 4: Add Body
1. Click **Body** section
2. Toggle **JSON** (if not already selected)
3. Paste the JSON input

### Step 5: Send
Click **Send** button

### Step 6: View Response
Response appears on the right side with:
- Status code
- Response time
- JSON response with syntax highlighting

### Saving Requests
1. Click **Save** button
2. Give it a name: "WattwAIs Predict"
3. Save to collection for reuse

---

## Test Scenarios

### Scenario 1: Peak Hours (Evening)
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
**Expected:** Higher consumption due to peak hours and hot weather

### Scenario 2: Early Morning
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
**Expected:** Lower consumption due to early morning and low activity

### Scenario 3: Weekend
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
**Expected:** Different pattern due to weekend behavior

### Scenario 4: With Optional Historical Temperature
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
**Expected:** More accurate prediction with historical temperature data

---

## Troubleshooting

### Server Not Running
```
Error: connect ECONNREFUSED 127.0.0.1:5000
```
**Solution:** Start the server with `npm run dev` or `npm start`

### Invalid JSON
```json
{
  "error": "Invalid JSON input: Expecting value: line 1 column..."
}
```
**Solution:** Check JSON syntax. Use a JSON validator: https://jsonlint.com/

### Missing Fields Error
```json
{
  "error": "Missing required fields",
  "missing": ["temperature", "electricity_rate_php_kwh"]
}
```
**Solution:** Add all required fields to the request

### Model Load Error
```json
{
  "success": false,
  "error": "Failed to load model: No such file or directory..."
}
```
**Solution:**
- Ensure `best_wattwais_model.keras` exists in server directory
- Check file paths in `predict.py`

### Python Not Found
```
'python' is not recognized as an internal or external command
```
**Solution:**
- Ensure Python is installed and in system PATH
- Try `python3` instead of `python`
- Check Python installation: `python --version`

### Timeout
```
Error: Request timeout
```
**Solution:**
- First prediction may take 2-3 seconds (model loading)
- Check if server is processing in terminal
- Increase timeout in Postman/Thunder Client settings

---

## Performance Testing

### Single Request
Use the test cases above

### Multiple Requests (Load Testing)
Using cURL with a loop:
```bash
for i in {1..10}; do
  curl -X POST http://localhost:5000/predict \
    -H "Content-Type: application/json" \
    -d '{...}'
done
```

Monitor server logs to see response times

---

## API Integration with Frontend

Once testing is confirmed, integrate with React frontend:

```javascript
// frontend/src/api/predict.js
export const getPrediction = async (inputData) => {
  const response = await fetch('http://localhost:5000/predict', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(inputData)
  });
  
  if (!response.ok) throw new Error('Prediction failed');
  return response.json();
};
```

Usage in React:
```javascript
const [prediction, setPrediction] = useState(null);
const [loading, setLoading] = useState(false);

const handlePredict = async (inputData) => {
  setLoading(true);
  try {
    const result = await getPrediction(inputData);
    setPrediction(result);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};
```

---

## Next Steps

1. ✅ Test `/predict` endpoint with sample data
2. ✅ Verify responses match expected format
3. ✅ Test error scenarios (missing fields, bad requests)
4. ✅ Connect frontend to backend
5. ✅ Deploy to production (e.g., Heroku, AWS)
