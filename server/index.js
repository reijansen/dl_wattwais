const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");
const path = require("path");

const app = express();
const PORT = 5000;

// ============================================================================
// CONFIGURATION & UTILITIES
// ============================================================================

// Frontend-friendly input field names
const REQUIRED_FIELDS = [
  "hour",
  "day_of_week",
  "month",
  "is_weekend",
  "electricity_rate_php_kwh",
  "temperature",
  "last_hour_kwh",
  "same_hour_yesterday_kwh",
  "same_hour_last_week_kwh",
  "avg_24h_kwh",
  "avg_7d_kwh",
];

// Hidden categorical fields (auto-filled)
const CATEGORICAL_DEFAULTS = {
  ID: "Unknown",
  Region: "Unknown",
  Municipality: "Unknown",
  Participation_Phase: "Phase_2",
  Control_Price_Phase2: "Price group",
  Group_Phase2: "H1",
};

// ============================================================================
// INPUT VALIDATION
// ============================================================================

/**
 * Validates frontend input for electricity prediction
 * @param {Object} input - User input object
 * @returns {Object} - { valid: boolean, errors: string[] }
 */
function validateInput(input) {
  const errors = [];

  // Check required fields exist
  REQUIRED_FIELDS.forEach((field) => {
    if (!(field in input)) {
      errors.push(`Missing required field: ${field}`);
    }
  });

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  // Validate ranges and types
  const { hour, day_of_week, month, is_weekend } = input;

  if (typeof hour !== "number" || hour < 0 || hour > 23) {
    errors.push("hour must be a number between 0 and 23");
  }

  if (typeof day_of_week !== "number" || day_of_week < 0 || day_of_week > 6) {
    errors.push("day_of_week must be a number between 0 and 6");
  }

  if (typeof month !== "number" || month < 1 || month > 12) {
    errors.push("month must be a number between 1 and 12");
  }

  if (typeof is_weekend !== "number" || (is_weekend !== 0 && is_weekend !== 1)) {
    errors.push("is_weekend must be 0 or 1");
  }

  // Validate numeric fields (must be numbers, non-negative)
  const numericFields = [
    "electricity_rate_php_kwh",
    "temperature",
    "last_hour_kwh",
    "same_hour_yesterday_kwh",
    "same_hour_last_week_kwh",
    "avg_24h_kwh",
    "avg_7d_kwh",
  ];

  numericFields.forEach((field) => {
    const value = input[field];
    if (typeof value !== "number" || isNaN(value)) {
      errors.push(`${field} must be a valid number`);
    }
  });

  // Validate non-negative fields (kwh and rates)
  const nonNegativeFields = [
    "electricity_rate_php_kwh",
    "last_hour_kwh",
    "same_hour_yesterday_kwh",
    "same_hour_last_week_kwh",
    "avg_24h_kwh",
    "avg_7d_kwh",
  ];

  nonNegativeFields.forEach((field) => {
    if (typeof input[field] === "number" && input[field] < 0) {
      errors.push(`${field} must not be negative`);
    }
  });

  return { valid: errors.length === 0, errors };
}

// ============================================================================
// INPUT MAPPING
// ============================================================================

/**
 * Maps frontend-friendly inputs to model feature names
 * @param {Object} frontendInput - User input with friendly field names
 * @returns {Object} - Input with model feature names
 */
function mapInputToModel(frontendInput) {
  const modelInput = {
    // Temporal features (pass through)
    hour: frontendInput.hour,
    day_of_week: frontendInput.day_of_week,
    month: frontendInput.month,
    day: 15, // Default to mid-month
    is_weekend: frontendInput.is_weekend,

    // Price feature (map name)
    Experiment_price_NOK_kWh: frontendInput.electricity_rate_php_kwh,

    // Temperature features (use same value for all lags)
    Temperature: frontendInput.temperature,
    Temperature24: frontendInput.temperature,
    Temperature48: frontendInput.temperature,
    Temperature72: frontendInput.temperature,

    // Lag features (map names)
    lag_1: frontendInput.last_hour_kwh,
    lag_24: frontendInput.same_hour_yesterday_kwh,
    lag_168: frontendInput.same_hour_last_week_kwh,

    // Rolling average features (map names)
    rolling_24: frontendInput.avg_24h_kwh,
    rolling_168: frontendInput.avg_7d_kwh,

    // Categorical features (auto-filled)
    ...CATEGORICAL_DEFAULTS,
  };

  return modelInput;
}

// ============================================================================
// CALCULATIONS
// ============================================================================

/**
 * Calculates bill and consumption estimates
 * @param {number} hourlyKwh - Predicted hourly consumption in kWh
 * @param {number} electricityRate - Rate in PHP per kWh
 * @returns {Object} - Estimates object
 */
function calculateEstimates(hourlyKwh, electricityRate) {
  const dailyKwh = hourlyKwh * 24;
  const monthlyKwh = dailyKwh * 30;
  const monthlyBill = monthlyKwh * electricityRate;

  return {
    predicted_hourly_kwh: Math.round(hourlyKwh * 100) / 100,
    estimated_daily_kwh: Math.round(dailyKwh * 100) / 100,
    estimated_monthly_kwh: Math.round(monthlyKwh * 100) / 100,
    estimated_monthly_bill_php: Math.round(monthlyBill * 100) / 100,
  };
}

// ============================================================================
// MIDDLEWARE
// ============================================================================

app.use(cors());
app.use(express.json());

// ============================================================================
// ROUTES
// ============================================================================

/**
 * Health check endpoint
 */
app.get("/", (req, res) => {
  res.json({ message: "WattwAIs backend running" });
});

/**
 * Prediction endpoint
 * POST /predict
 * Body: Frontend-friendly input fields
 * Response: Predictions and estimates
 */
app.post("/predict", (req, res) => {
  // ---- Step 1: Validate input ----
  const validation = validateInput(req.body);
  if (!validation.valid) {
    return res.status(400).json({
      error: "Invalid input",
      details: validation.errors,
    });
  }

  // ---- Step 2: Map to model features ----
  const modelInput = mapInputToModel(req.body);

  // ---- Step 3: Call Python inference ----
  const python = spawn("python", [
    path.join(__dirname, "predict.py"),
    JSON.stringify(modelInput),
  ]);

  let output = "";
  let error = "";

  python.stdout.on("data", (data) => {
    output += data.toString();
  });

  python.stderr.on("data", (data) => {
    error += data.toString();
  });

  python.on("close", (code) => {
    try {
      // ---- Step 4: Parse prediction result ----
      const prediction = JSON.parse(output);

      if (!prediction.success) {
        if (error) console.error("Python stderr:", error);
        return res.status(500).json({
          error: "Model error",
          details: prediction.error || error || "Unknown error",
          exit_code: code,
        });
      }

      const hourlyKwh = prediction.predicted_kwh;

      // ---- Step 5: Calculate estimates ----
      const estimates = calculateEstimates(
        hourlyKwh,
        req.body.electricity_rate_php_kwh
      );

      // ---- Step 6: Return response ----
      res.json({
        success: true,
        prediction: estimates,
        metadata: {
          hour: req.body.hour,
          day_of_week: req.body.day_of_week,
          month: req.body.month,
          temperature_celsius: req.body.temperature,
          electricity_rate_php_kwh: req.body.electricity_rate_php_kwh,
        },
      });
    } catch (parseError) {
      if (error) console.error("Python stderr:", error);
      if (code !== 0) console.error("Python exit code:", code);
      console.error("Parse error:", parseError);
      res.status(500).json({
        error: "Failed to process prediction",
        details: error || parseError.message,
        exit_code: code,
      });
    }
  });

  // Handle spawn errors
  python.on("error", (err) => {
    console.error("Spawn error:", err);
    res.status(500).json({
      error: "Failed to start prediction process",
      details: err.message,
    });
  });
});

// ============================================================================
// ERROR HANDLERS
// ============================================================================

app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({
    error: "Internal server error",
    details: err.message,
  });
});

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
  });
});

// ============================================================================
// START SERVER
// ============================================================================

app.listen(PORT, () => {
  console.log(`✓ WattwAIs backend running on http://localhost:${PORT}`);
  console.log(`✓ POST http://localhost:${PORT}/predict to make predictions`);
});
