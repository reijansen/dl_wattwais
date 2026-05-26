# WattwAIs - Deep Learning Electricity Demand Prediction

A full-stack deep learning application that predicts household electricity consumption using a trained Keras deep learning model. Features an Express.js backend API and React+Vite frontend.

## Project Overview

WattwAIs predicts hourly household electricity demand and calculates estimated daily, monthly consumption and bills based on historical usage patterns, weather data, and electricity rates.

**Tech Stack:**
- Backend: Node.js + Express.js
- Frontend: React + Vite
- ML Model: Keras/TensorFlow
- Preprocessing: Python + scikit-learn

## Project Structure

```
dl_wattwais/
├── server/                      # Express.js backend API
│   ├── index.js                # Main server file
│   ├── predict.py              # Python ML inference script
│   ├── best_wattwais_model.keras  # Trained Keras model
│   ├── package.json            # Node.js dependencies
│   ├── preprocessing/          # Feature preprocessing files
│   │   ├── scaler.json
│   │   ├── feature_order.json
│   │   ├── categories.json
│   │   └── preprocessor.pkl
│   ├── data/                   # Sample data & results
│   └── tfjs_model/             # TensorFlow.js model (alternative)
│       ├── model.json
│       └── weights.json
├── client/                      # React+Vite frontend
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Page components
│   │   └── services/
│   │       └── api.js          # API client
│   ├── package.json
│   └── vite.config.js
├── dl_wattwais.ipynb           # Jupyter notebook with training code
└── regenerate_preprocessor.py  # Script to regenerate preprocessing files
```

## Quick Start

### Backend Setup

```bash
cd server
npm install
pip install tensorflow numpy pandas scikit-learn joblib
npm run dev
```

Server starts on `http://localhost:5000`

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

## API Endpoints

### Health Check
```
GET http://localhost:5000/
```

### Electricity Demand Prediction
```
POST http://localhost:5000/predict
Content-Type: application/json
```

#### Required Input Fields

| Field | Type | Description |
|-------|------|-------------|
| `hour` | number | Hour of day (0-23) |
| `day_of_week` | number | Day of week (0=Sunday, 6=Saturday) |
| `month` | number | Month (1-12) |
| `is_weekend` | number | Weekend indicator (0 or 1) |
| `electricity_rate_php_kwh` | number | Rate in PHP per kWh |
| `temperature` | number | Current temperature in Celsius |
| `last_hour_kwh` | number | Electricity from last hour |
| `same_hour_yesterday_kwh` | number | Demand at same hour yesterday |
| `same_hour_last_week_kwh` | number | Demand at same hour last week |
| `avg_24h_kwh` | number | Average demand (last 24h) |
| `avg_7d_kwh` | number | Average demand (last 7 days) |

#### Example Request

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

#### Example Response

```json
{
  "success": true,
  "prediction": {
    "hourly_kwh": 2.35,
    "daily_kwh": 56.40,
    "monthly_kwh": 1692.00,
    "monthly_bill_php": 12690.00
  },
  "input_used": {
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
}
```

## Installation & Setup

### Prerequisites

- Node.js 20+ LTS
- Python 3.8+ with TensorFlow
- scikit-learn and joblib for preprocessing

### Step 1: Clone Repository

```bash
git clone https://github.com/reijansen/dl_wattwais.git
cd dl_wattwais
```

### Step 2: Install Backend

```bash
cd server
npm install
pip install tensorflow numpy pandas scikit-learn joblib
```

Verify preprocessing files exist:
```
server/preprocessing/
├── scaler.json
├── feature_order.json
├── categories.json
└── preprocessor.pkl
```

### Step 3: Install Frontend

```bash
cd ../client
npm install
```

### Step 4: Run Both Services

Terminal 1 - Backend:
```bash
cd server
npm run dev
```

Terminal 2 - Frontend:
```bash
cd client
npm run dev
```

## Development

### Backend Scripts

```bash
npm run dev      # Start with auto-reload (nodemon)
npm start        # Start production server
```

### Frontend Scripts

```bash
npm run dev      # Development server with HMR
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Model Training

The Keras model and preprocessing files are pre-trained. To regenerate preprocessing files:

```bash
python regenerate_preprocessor.py
```

For full training workflow, see `dl_wattwais.ipynb` Jupyter notebook.

## Troubleshooting

### Preprocessor Load Errors

If `/predict` returns a 500 error with pickle/unpickle issues:

1. Regenerate preprocessing files:
   ```bash
   python regenerate_preprocessor.py
   ```

2. Ensure binary files are transferred correctly (use zip for safety)

3. Verify files can be loaded:
   ```bash
   python -c "import joblib; joblib.load('server/preprocessing/preprocessor.pkl')"
   ```

### Port Already in Use

Backend (5000):
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

Frontend (5173):
```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5173
kill -9 <PID>
```

### Python Dependencies

Reinstall Python dependencies:
```bash
pip install --upgrade pip
pip install tensorflow numpy pandas scikit-learn joblib
```

## Features

### Backend API
- Health check endpoint (`GET /`)
- Electricity prediction endpoint (`POST /predict`)
- Input validation and error handling
- CORS enabled for frontend integration

### Frontend
- React components for prediction form
- Results display with visualizations
- Navigation between pages
- DaisyUI components for UI
- Tremor charts for data visualization

## File Descriptions

### Server
- `index.js` - Express server setup and API routes
- `predict.py` - Python script that loads Keras model and makes predictions
- `best_wattwais_model.keras` - Trained Keras deep learning model
- `preprocessing/scaler.json` - Feature scaling parameters
- `preprocessing/feature_order.json` - Feature column order
- `preprocessing/categories.json` - Categorical feature mappings
- `preprocessing/preprocessor.pkl` - Serialized scikit-learn preprocessor

### Client
- `src/main.jsx` - Entry point
- `src/App.jsx` - Main app component
- `src/components/` - Reusable UI components (Form, Results, etc.)
- `src/pages/` - Page components (Home, Predict, Results, About)
- `src/services/api.js` - API client for backend communication

## Environment Variables

Create `.env` files if needed:

**server/.env** (optional):
```
PORT=5000
NODE_ENV=development
```

**client/.env** (optional):
```
VITE_API_URL=http://localhost:5000
```

## Git Configuration

The project includes:
- Root `.gitignore` - Covers Node.js, Python, IDE, and OS files
- `.gitattributes` - Handles line endings and binary files
- Preserves model files, preprocessing files, and data folders

## Performance Notes

- Model inference runs via Python subprocess on each prediction
- For high-volume predictions, consider containerizing with Docker
- Frontend uses Vite for fast development and optimized builds

## License

ISC

## Repository

GitHub: https://github.com/reijansen/dl_wattwais
