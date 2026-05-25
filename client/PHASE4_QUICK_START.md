# Phase 4 - Quick Start & Commands

## ⚡ Quick Start (5 Steps)

```bash
# Terminal 1 - Start Backend
cd server
npm run dev

# Terminal 2 - Start Frontend
cd client
npm run dev

# Then in browser:
# 1. Go to http://localhost:5173/predict
# 2. See "Backend Connected" message
# 3. Click "Test Backend Health"
# 4. Click "Test Sample Prediction"
# 5. See results appear
```

---

## 🎯 What You'll See

### When Everything Works ✅
```
Backend Connected [green badge]
✓ Backend is running!
✓ Prediction successful!
Hourly: 2.35 kWh
Daily: 56.40 kWh
Monthly: 1692.00 kWh
Bill: ₱12,690.00
```

### When Backend Not Running ❌
```
Backend Disconnected [red badge]
✗ Backend is not responding
Cannot reach backend server at http://localhost:5000
```

---

## 📋 Terminal Commands

### Start Backend
```bash
cd server
npm run dev
```
Expected: `WattwAIs backend running on http://localhost:5000`

### Start Frontend
```bash
cd client
npm run dev
```
Expected: `Local: http://localhost:5173/`

### Test Backend with cURL
```bash
# Check if backend is running
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

## 📡 Backend/Frontend Running Together

**Setup:** 2 terminals needed

**Terminal 1:**
```bash
cd server
npm run dev
# Stays running
```

**Terminal 2:**
```bash
cd client
npm run dev
# Stays running
```

Both apps now communicate via HTTP.

---

## 🧪 Testing API Connection

### In Browser (Easiest)
1. Go to `http://localhost:5173/predict`
2. Click "Test Backend Health" button
3. Click "Test Sample Prediction" button
4. See results immediately

### Browser DevTools
1. Open DevTools (F12)
2. Go to Console tab
3. Copy-paste this code:

```javascript
import { predictDemand } from '/src/services/api.js';

const result = await predictDemand({
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

console.log(result);
```

---

## 🐛 Troubleshooting

### "Backend Disconnected"
```bash
# Make sure backend is running
cd server
npm run dev
```

### Backend on Different Port
Edit `src/services/api.js`:
```javascript
const api = axios.create({
  baseURL: 'http://localhost:YOUR_PORT',
});
```

### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000        # Mac/Linux
netstat -ano | grep 5000  # Windows

# Kill the process
kill -9 <PID>        # Mac/Linux
taskkill /PID <PID> /F  # Windows
```

### Frontend Dev Server Not Starting
```bash
# Check if port 5173 is in use
# Vite will auto-increment to 5174, 5175, etc.

# Or restart:
npm run dev
```

---

## ✅ Verification Steps

After starting backend and frontend:

1. **Frontend loads:**
   - `http://localhost:5173/predict` opens
   
2. **Backend detected:**
   - See "Backend Connected" message
   - Badge shows "Connected" in green
   
3. **Health check works:**
   - Click "Test Backend Health"
   - See success alert with ✓

4. **Prediction works:**
   - Click "Test Sample Prediction"
   - See results: Hourly, Daily, Monthly, Bill

5. **No console errors:**
   - Open DevTools (F12)
   - No red errors in console

---

## 📊 Files Modified

| File | Changes |
|------|---------|
| `src/services/api.js` | Enhanced with error handling |
| `src/pages/Predict.jsx` | Added API test section |

---

## 🎯 API Functions Available

### Import in any component:
```javascript
import { 
  predictDemand,
  checkBackendHealth,
  testPredictionWithSampleData
} from '../services/api';
```

### Usage:
```javascript
// Check if backend is running
const health = await checkBackendHealth();

// Make a prediction
const result = await predictDemand(formData);

// Test with sample
const test = await testPredictionWithSampleData();
```

---

## 🚀 Common Tasks

### Test Backend Health
```javascript
const result = await checkBackendHealth();
if (result.success) {
  console.log('Backend is running!');
} else {
  console.log('Backend error:', result.error);
}
```

### Send Prediction Request
```javascript
const result = await predictDemand({
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

if (result.success) {
  console.log('Prediction:', result.data);
} else {
  console.log('Error:', result.error);
}
```

### Display Results
```javascript
if (result.success) {
  console.log('Hourly: ' + result.data.predicted_hourly_kwh + ' kWh');
  console.log('Daily: ' + result.data.estimated_daily_kwh + ' kWh');
  console.log('Monthly: ' + result.data.estimated_monthly_kwh + ' kWh');
  console.log('Bill: ₱' + result.data.estimated_monthly_bill_php);
}
```

---

## 📚 Reference

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/` | GET | Health check |
| `/predict` | POST | Make prediction |

---

**Last Updated:** May 26, 2026
