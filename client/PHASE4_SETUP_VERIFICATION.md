# Phase 4 - Complete Setup & Verification Guide

End-to-end guide for running backend and frontend together with API connection verification.

---

## 🎯 Phase 4 Overview

**Focus:** Connect frontend to backend via API

**What's implemented:**
- Enhanced API service with error handling
- Backend health check
- Sample prediction testing
- Visual connection status
- Success/error feedback UI

**Not implemented:**
- Full form submission (Phase 5)
- Form validation (Phase 5)
- Results page (Phase 5)

---

## 🚀 Complete Setup (From Scratch)

### Prerequisites

Ensure you have:
- Node.js 18+ installed
- Both `server/` and `client/` folders with npm dependencies
- Port 5000 available (backend)
- Port 5173 available (frontend)

### Step 1: Install Backend Dependencies (If Not Done)

```bash
cd server
npm install
```

### Step 2: Install Frontend Dependencies (If Not Done)

```bash
cd client
npm install
```

### Step 3: Start Backend (Terminal 1)

```bash
cd server
npm run dev
```

**Expected output:**
```
✓ WattwAIs backend running on http://localhost:5000
✓ Python inference script ready
```

**Leave this terminal running**

### Step 4: Start Frontend (Terminal 2)

```bash
cd client
npm run dev
```

**Expected output:**
```
VITE v8.0.12  ready in XXX ms
➜  Local:   http://localhost:5173/
```

**Leave this terminal running**

### Step 5: Open Browser

Visit: `http://localhost:5173/predict`

---

## ✅ Verification Steps

### Step 1: Check Connection Status

**What to see:**
- Title says "Predict Your Electricity Demand"
- Blue card with connection info at top
- Green check mark ✓
- Badge says "Connected"

**If disconnected:**
- Red X mark
- Badge says "Disconnected"
- Reason: Backend not running or wrong port

### Step 2: Test Backend Health

1. Find the blue card at top
2. Click button: "Test Backend Health"
3. Wait for loading (spinner appears)
4. See success alert:
   - Green background
   - ✓ Backend is running!
   - Server is responding correctly

### Step 3: Test Sample Prediction

1. In the same blue card
2. Click button: "Test Sample Prediction"
3. Wait for loading (spinner appears)
4. See success alert:
   - Green background
   - Prediction successful!
   - Shows 4 results:
     - Hourly: 2.35 kWh
     - Daily: 56.40 kWh
     - Monthly: 1692.00 kWh
     - Bill: ₱12,690.00

### Step 4: Check Browser Console

Press F12 to open DevTools → Console tab

**Should see:**
- No red errors
- No CORS errors
- No network errors
- Clean console output

---

## 🐛 Troubleshooting

### Symptom: "Backend Disconnected"

**Cause:** Backend not running

**Solution:**
```bash
cd server
npm run dev
```

Wait 5 seconds, refresh browser

---

### Symptom: Test buttons don't work

**Cause:** Backend not running or on wrong port

**Solution:**
```bash
# Verify backend is running
curl http://localhost:5000/

# Should return some JSON, not an error

# If error, start backend
cd server
npm run dev
```

---

### Symptom: "Cannot reach backend server at http://localhost:5000"

**Cause:** Backend on different port or firewall issue

**Solution:**

1. Check what port backend is on:
```bash
# Terminal 1 - look at backend output
# Should show: http://localhost:5000
```

2. If different port, update frontend:
```javascript
// client/src/services/api.js
const api = axios.create({
  baseURL: 'http://localhost:YOUR_PORT',  // Change port here
});
```

3. Restart frontend:
```bash
# Terminal 2
npm run dev
```

---

### Symptom: Port 5173 already in use

**Cause:** Another app using port 5173

**Solution:** Vite will auto-use next available port (5174, 5175, etc.)

Check terminal output for actual port:
```
Local:   http://localhost:5174/
```

---

### Symptom: "Prediction failed" with validation error

**Cause:** Backend received invalid data

**Solution:** This shouldn't happen with sample data. Check backend logs:
```bash
# Look at Terminal 1 output
# Should show prediction request received
```

---

## 📊 Testing Scenarios

### Scenario 1: Full Stack Working ✅

**Terminal 1:**
```
Python model loaded ✓
Preprocessor ready ✓
Express server running on port 5000 ✓
```

**Terminal 2:**
```
Vite dev server ready on port 5173 ✓
No build errors ✓
```

**Browser:**
```
http://localhost:5173/predict loads ✓
"Backend Connected" shows ✓
Click test buttons - both work ✓
Results display correctly ✓
```

---

### Scenario 2: Backend Not Running ❌

**Terminal 1:**
```
Not running (shows nothing)
```

**Terminal 2:**
```
Vite running normally
```

**Browser:**
```
http://localhost:5173/predict loads ✓
"Backend Disconnected" shows ✓
Click test buttons - both fail with error ✓
Error message explains backend not running ✓
```

---

### Scenario 3: Port Conflict ❌

**Problem:** Frontend can't reach backend on port 5000

**Terminal 2 console:**
```
VITE ready on localhost:5173
But can't reach backend at localhost:5000
```

**Browser:**
```
"Backend Disconnected"
Error: Cannot reach backend server at http://localhost:5000
```

**Solution:** Update `src/services/api.js` with correct port

---

## 🔍 Deep Debugging

### Check Backend Directly

```bash
# Terminal 3 (new)

# Test health endpoint
curl http://localhost:5000/

# Should return: Something like "OK" or JSON

# Test prediction endpoint  
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

# Should return JSON with prediction results
```

If curl works but browser doesn't, likely CORS issue (shouldn't happen - backend has CORS enabled)

---

### Check Frontend API Service

Browser DevTools → Console:

```javascript
// Verify api service exists
import { checkBackendHealth, predictDemand } from '/src/services/api.js';

// Test health
const result = await checkBackendHealth();
console.log(result);

// Should show:
// {success: true, status: "Backend is running", data: {...}}
// OR
// {success: false, error: "Backend is not running", ...}
```

---

### Check Network Tab

Browser DevTools → Network tab:

1. Click "Test Backend Health"
2. Look for request to `http://localhost:5000/`
3. Check response:
   - Status: Should be 200 (success) or error code
   - Headers: Should show JSON content-type
   - Response: Should be valid JSON

---

## 📋 Full Checklist

Complete setup verification:

- [ ] Backend installed: `cd server && npm install`
- [ ] Frontend installed: `cd client && npm install`
- [ ] Backend running: `cd server && npm run dev`
- [ ] Frontend running: `cd client && npm run dev`
- [ ] Browser opens: `http://localhost:5173/predict`
- [ ] Connection shows: "Backend Connected" (green)
- [ ] Health check works: Click button, see success alert
- [ ] Prediction works: Click button, see 4 metrics
- [ ] No console errors: Open DevTools, check console
- [ ] Results display: All 4 values (hourly, daily, monthly, bill)

---

## 🎯 What Each Button Does

### "Test Backend Health" Button

**Action:**
1. Sends GET request to `http://localhost:5000/`
2. Backend responds with status
3. Frontend shows response

**Success Alert:**
```
✓ Backend is running!
Server is responding correctly.
```

**Error Alert:**
```
✗ Backend is not responding
Error: [reason]
```

---

### "Test Sample Prediction" Button

**Action:**
1. Sends POST request with sample data
2. Backend validates and processes
3. Model makes prediction
4. Backend calculates estimates
5. Frontend displays results

**Success Alert:**
```
✓ Prediction successful!
Hourly: 2.35 kWh
Daily: 56.40 kWh
Monthly: 1692.00 kWh
Bill: ₱12,690.00
```

**Error Alert:**
```
✗ Prediction failed
Error: [reason]
Details: [specific fields with errors]
```

---

## 🚀 Next Steps After Verification

1. ✅ Confirm both buttons work
2. ✅ Confirm results display correctly
3. ✅ Commit to git
4. ✅ Plan Phase 5

**Phase 5 will:**
- Connect the form to API
- Handle form validation
- Display results on dedicated page
- Add prediction history

---

## 📚 Reference

### Endpoints Available

| Method | URL | Purpose |
|--------|-----|---------|
| GET | `http://localhost:5000/` | Health check |
| POST | `http://localhost:5000/predict` | Make prediction |

### Sample Data

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
  "predicted_hourly_kwh": 2.35,
  "estimated_daily_kwh": 56.40,
  "estimated_monthly_kwh": 1692.00,
  "estimated_monthly_bill_php": 12690.00
}
```

---

## ✨ You're All Set!

Backend and frontend are now connected and communicating.

**Status:** ✅ API Layer Working

**Next Phase:** Full form submission integration

---

**Last Updated:** May 26, 2026
