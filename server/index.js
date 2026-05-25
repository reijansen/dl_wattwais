const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");
const path = require("path");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ message: "WattwAIs backend running" });
});

// Prediction endpoint
app.post("/predict", (req, res) => {
  // Validate input
  const requiredFields = [
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

  const missingFields = requiredFields.filter((field) => !(field in req.body));
  if (missingFields.length > 0) {
    return res.status(400).json({
      error: "Missing required fields",
      missing: missingFields,
    });
  }

  // Spawn Python process
  const python = spawn("python", [
    path.join(__dirname, "predict.py"),
    JSON.stringify(req.body),
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
    if (code !== 0) {
      console.error("Python error:", error);
      return res.status(500).json({
        error: "Prediction failed",
        details: error,
      });
    }

    try {
      const result = JSON.parse(output);
      res.json(result);
    } catch (parseError) {
      console.error("Parse error:", parseError);
      res.status(500).json({
        error: "Failed to parse prediction result",
        details: parseError.message,
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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    error: "Internal server error",
    details: err.message,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
  });
});

app.listen(PORT, () => {
  console.log(`✓ WattwAIs backend running on http://localhost:${PORT}`);
  console.log(`✓ POST http://localhost:${PORT}/predict to make predictions`);
});