# WattwAIs Phase 4 - Frontend API Connection Layer

Complete API connection setup for connecting React frontend to Express backend.

---

## 🎯 Phase 4 Summary

**Status:** ✅ COMPLETE

**What was built:**
- Enhanced API service layer with error handling
- Backend health check function
- Sample prediction test function
- API test section in Predict page
- Connection status indicator
- Success/error response display
- Loading states for API calls

---

## 🚀 Quick Start

### Prerequisites
- Backend running on `http://localhost:5000`
- Frontend running on `http://localhost:5173`

### Run Both Together

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
# Backend on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
# Frontend on http://localhost:5173
```

Then:
1. Open `http://localhost:5173/predict`
2. You should see "Backend Connected" at the top
3. Click "Test Backend Health" button
4. Click "Test Sample Prediction" button
5. See results displayed

---

## 📝 What Changed

### 1. Enhanced API Service (`src/services/api.js`)

**New functions:**
- `predictDemand(formData)` - Send prediction request
- `checkBackendHealth()` - Test if backend is running
- `testPredictionWithSampleData()` - Test with sample values

**Features:**
- Comprehensive error handling
- Timeout after 10 seconds
- Distinguishes between connection errors and validation errors
- Returns structured response with `success` flag
- Clear error messages for debugging

### 2. Updated Predict Page (`src/pages/Predict.jsx`)

**New state management:**
- `backendStatus` - 'checking', 'connected', or 'disconnected'
- `isTestingHealth` / `isTestingPrediction` - Loading states
- `healthResponse` / `predictionResponse` - API responses

**New features:**
- Backend connection test on page load
- "Test Backend Health" button
- "Test Sample Prediction" button
- Connection status indicator
- Success/error alerts
- Response display with formatted data
- Loading spinners

**UI Components:**
- Status card with icon (green/red/spinner)
- Badge showing connection status
- Alert boxes for success/error
- Formatted response data display

---

## 🔧 API Service Usage

### Check Backend Health

```javascript
import { checkBackendHealth } from './services/api';

const result = await checkBackendHealth();

if (result.success) {
  console.log('Backend is running');
} else {
  console.log('Backend error:', result.error);
}
```

**Response on success:**
```javascript
{
  success: true,
  status: 'Backend is running',
  data: { /* backend response */ }
}
```

**Response on error:**
```javascript
{
  success: false,
  error: 'Backend is not running',
  details: 'Cannot reach backend server at http://localhost:5000...'
}
```

---

### Make a Prediction

```javascript
import { predictDemand } from './services/api';

const inputData = {
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
  avg_7d_kwh: 2.1,
};

const result = await predictDemand(inputData);

if (result.success) {
  console.log('Hourly:', result.data.predicted_hourly_kwh);
  console.log('Daily:', result.data.estimated_daily_kwh);
  console.log('Monthly:', result.data.estimated_monthly_kwh);
  console.log('Bill:', result.data.estimated_monthly_bill_php);
} else {
  console.log('Error:', result.error);
  console.log('Details:', result.details);
}
```

**Response on success:**
```javascript
{
  success: true,
  data: {
    predicted_hourly_kwh: 2.35,
    estimated_daily_kwh: 56.40,
    estimated_monthly_kwh: 1692.00,
    estimated_monthly_bill_php: 12690.00
  },
  metadata: {
    hour: 14,
    day_of_week: 3,
    month: 5,
    temperature_celsius: 25.5,
    electricity_rate_php_kwh: 7.50
  }
}
```

**Response on validation error:**
```javascript
{
  success: false,
  error: 'Invalid input',
  details: ['hour must be a number between 0 and 23'],
  status: 400
}
```

---

### Test with Sample Data

```javascript
import { testPredictionWithSampleData } from './services/api';

const result = await testPredictionWithSampleData();
console.log(result);
```

---

## 🧪 Testing the Connection

### Method 1: UI Buttons (Easiest)

1. Start both backend and frontend
2. Go to `http://localhost:5173/predict`
3. See connection status at top of page
4. Click "Test Backend Health" button
5. Click "Test Sample Prediction" button
6. See results in alert boxes

### Method 2: Browser DevTools Console

```javascript
// In browser console on predict page:
import { checkBackendHealth, predictDemand } from './services/api.js';

// Test health
const health = await checkBackendHealth();
console.log(health);

// Test prediction
const pred = await predictDemand({
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
  avg_7d_kwh: 2.1,
});
console.log(pred);
```

### Method 3: Curl from Terminal

```bash
# Test health check
curl http://localhost:5000/

# Test prediction
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

## ✅ Verification Checklist

After starting both backend and frontend:

- [ ] Frontend loads at `http://localhost:5173`
- [ ] Go to `/predict` page
- [ ] Connection indicator shows "Backend Connected" (green check)
- [ ] Badge shows "Connected"
- [ ] Click "Test Backend Health" - shows success alert
- [ ] Click "Test Sample Prediction" - shows prediction results
- [ ] Results show 4 metrics (hourly, daily, monthly, bill)
- [ ] No red errors in browser console
- [ ] No errors in backend terminal

---

## 🔍 Error Cases & Troubleshooting

### Backend Not Running

**Symptom:** Page shows "Backend Disconnected"

**Solution:**
```bash
cd server
npm run dev
```

---

### Wrong Port

**Symptom:** "Cannot reach backend server at http://localhost:5000"

**Check:** Backend should be on port 5000

```bash
# Verify backend is running
curl http://localhost:5000/
```

---

### CORS Error

**Symptom:** Browser console shows CORS error

**Note:** Backend has CORS enabled, should not happen

**Check backend:**
```javascript
// server/index.js should have:
app.use(cors());
```

---

### Timeout

**Symptom:** Test takes >10 seconds then fails

**Reason:** API has 10-second timeout
**Solution:** Check backend is not hanging, restart it

---

### Validation Error Response

**Symptom:** Test shows "Invalid input" error

**Cause:** Input data doesn't pass validation

**Check:** All 11 fields present with correct types/ranges

---

## 📊 Response Status Codes

| Code | Meaning | When |
|------|---------|------|
| 200 | Success | Valid prediction |
| 400 | Bad Request | Invalid input |
| 500 | Server Error | Model/Python error |
| Timeout | Connection Error | Backend not running |

---

## 🎨 UI Components Used

### Status Display
- `<CheckCircle>` - Connected
- `<WifiOff>` - Disconnected  
- `<Loader>` - Checking
- `badge` - Status indicator

### Alerts
- `alert-success` - Green, check mark
- `alert-error` - Red, X mark
- `alert-info` - Blue, info mark

### Buttons
- `btn btn-primary` - Health check
- `btn btn-secondary` - Test prediction
- State: `disabled` while loading

---

## 📈 Data Flow

```
Frontend Form Input
    ↓
predictDemand() in api.js
    ↓
axios.post('/predict', data)
    ↓
Backend Validation
    ↓
Backend Processing
    ↓
Backend Response
    ↓
Frontend handles response
    ↓
Display Results or Error
```

---

## 🔐 Error Handling Strategy

### Try-Catch Blocks
Every async function wrapped in try-catch

### Error Type Detection
```javascript
if (error.response) {
  // Backend error: 400, 500, etc
  // Use error.response.data
} else if (error.request) {
  // No response: connection failed
  // Backend not running
} else {
  // Request setup error
  // Rarely happens
}
```

### User-Friendly Messages
- Technical details for debugging
- Simple messages for users
- Distinguishes connection vs validation errors

---

## 🎯 What's Working

| Feature | Status |
|---------|--------|
| Backend health check | ✅ Working |
| Sample prediction test | ✅ Working |
| Connection detection | ✅ Working |
| Error handling | ✅ Working |
| Loading states | ✅ Working |
| Response display | ✅ Working |
| Form input state | ✅ Working |

---

## ⏳ What's Next (Phase 5)

- [ ] Full form submission
- [ ] Form validation with error messages
- [ ] Results page population
- [ ] Historical predictions
- [ ] Prediction comparison
- [ ] UI polish and animations

---

## 📚 Code Examples

### Using API in a Component

```javascript
import { useState } from 'react';
import { predictDemand } from '../services/api';

export default function MyComponent() {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePredict = async () => {
    setIsLoading(true);
    const response = await predictDemand({
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
      avg_7d_kwh: 2.1,
    });
    setResult(response);
    setIsLoading(false);
  };

  return (
    <div>
      <button onClick={handlePredict} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Predict'}
      </button>
      
      {result?.success && (
        <p>Prediction: {result.data.predicted_hourly_kwh} kWh</p>
      )}
      
      {result?.error && (
        <p>Error: {result.error}</p>
      )}
    </div>
  );
}
```

---

## 🚀 Deployment Note

When deploying to production:

1. Update backend URL in `src/services/api.js`:
```javascript
const api = axios.create({
  baseURL: 'https://your-backend-domain.com',
  // ...
});
```

2. Or use environment variable:
```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
});
```

Then create `.env.production`:
```
VITE_API_URL=https://your-backend-domain.com
```

---

## ✨ Phase 4 Complete!

**Status:** ✅ API CONNECTION LAYER READY

**What you have:**
- Full API service with error handling
- Backend health monitoring
- Sample prediction testing
- Beautiful error/success UI
- Connection status indicator
- Ready for Phase 5 form submission

**Next step:** Phase 5 - Full form submission and results display

---

**Last Updated:** May 26, 2026
