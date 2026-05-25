import { useState, useEffect } from 'react';
import { Zap, AlertCircle, CheckCircle, WifiOff, Loader, TrendingUp } from 'lucide-react';
import { checkBackendHealth, predictDemand } from '../services/api';

export default function Predict() {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  // Backend connection state
  const [backendStatus, setBackendStatus] = useState('checking');

  // Form state with auto-filled values
  const [formData, setFormData] = useState({
    hour: 12,
    day_of_week: 3,
    month: 5,
    is_weekend: 0,
    electricity_rate_php_kwh: 7.50,
    temperature: 25.0,
    last_hour_kwh: 2.5,
    same_hour_yesterday_kwh: 2.3,
    same_hour_last_week_kwh: 2.4,
    avg_24h_kwh: 2.2,
    avg_7d_kwh: 2.1,
  });

  // Validation errors
  const [validationErrors, setValidationErrors] = useState({});

  // Loading & results
  const [isLoading, setIsLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  // ============================================================================
  // INITIALIZATION & AUTO-FILL
  // ============================================================================

  /**
   * Auto-fill current date/time on component mount
   */
  useEffect(() => {
    const checkConnection = async () => {
      const result = await checkBackendHealth();
      setBackendStatus(result.success ? 'connected' : 'disconnected');
    };

    checkConnection();

    // Auto-fill current date/time
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay(); // 0-6 (Sunday-Saturday)
    const month = now.getMonth() + 1; // 1-12
    const isWeekend = day === 0 || day === 6 ? 1 : 0;

    setFormData(prev => ({
      ...prev,
      hour,
      day_of_week: day,
      month,
      is_weekend: isWeekend,
    }));
  }, []);

  // ============================================================================
  // VALIDATION LOGIC
  // ============================================================================

  /**
   * Validates all form inputs and returns errors
   * @returns {Object} - Error object with field names as keys
   */
  function validateForm() {
    const errors = {};

    // Temporal validations
    if (formData.hour < 0 || formData.hour > 23) {
      errors.hour = 'Hour must be between 0 and 23';
    }
    if (formData.day_of_week < 0 || formData.day_of_week > 6) {
      errors.day_of_week = 'Day of week must be between 0 and 6';
    }
    if (formData.month < 1 || formData.month > 12) {
      errors.month = 'Month must be between 1 and 12';
    }
    if (formData.is_weekend !== 0 && formData.is_weekend !== 1) {
      errors.is_weekend = 'Weekend must be 0 or 1';
    }

    // Numeric validations
    if (formData.electricity_rate_php_kwh < 0) {
      errors.electricity_rate_php_kwh = 'Electricity rate cannot be negative';
    }
    if (!Number.isFinite(formData.temperature)) {
      errors.temperature = 'Temperature must be a valid number';
    }

    // Consumption validations (must be >= 0)
    if (formData.last_hour_kwh < 0) {
      errors.last_hour_kwh = 'Usage cannot be negative';
    }
    if (formData.same_hour_yesterday_kwh < 0) {
      errors.same_hour_yesterday_kwh = 'Usage cannot be negative';
    }
    if (formData.same_hour_last_week_kwh < 0) {
      errors.same_hour_last_week_kwh = 'Usage cannot be negative';
    }
    if (formData.avg_24h_kwh < 0) {
      errors.avg_24h_kwh = 'Average cannot be negative';
    }
    if (formData.avg_7d_kwh < 0) {
      errors.avg_7d_kwh = 'Average cannot be negative';
    }

    return errors;
  }

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  /**
   * Handle input field changes
   */
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    const parsedValue = type === 'number' ? parseFloat(value) : value;

    setFormData(prev => ({
      ...prev,
      [name]: isNaN(parsedValue) ? '' : parsedValue,
    }));

    // Clear error for this field when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setSubmitError('Please fix the errors above before submitting');
      return;
    }

    // Clear previous errors
    setValidationErrors({});
    setSubmitError(null);
    setPredictionResult(null);

    // Make prediction request
    setIsLoading(true);

    try {
      const result = await predictDemand(formData);

      if (result.success) {
        setPredictionResult(result.data);
      } else {
        setSubmitError(`Prediction failed: ${result.error}`);
        if (result.details) {
          console.log('Details:', result.details);
        }
      }
    } catch (error) {
      setSubmitError('An unexpected error occurred. Please try again.');
      console.error('Form submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle form reset
   */
  const handleReset = () => {
    setFormData(prev => ({
      ...prev,
      electricity_rate_php_kwh: 7.50,
      temperature: 25.0,
      last_hour_kwh: 2.5,
      same_hour_yesterday_kwh: 2.3,
      same_hour_last_week_kwh: 2.4,
      avg_24h_kwh: 2.2,
      avg_7d_kwh: 2.1,
    }));
    setValidationErrors({});
    setSubmitError(null);
    setPredictionResult(null);
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* ======================== */}
      {/* PAGE HEADER */}
      {/* ======================== */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4">
          <span className="text-gradient">Predict Your</span>
        </h1>
        <h1 className="text-5xl font-bold mb-6">Electricity Demand</h1>
        <p className="text-base-content/70 text-lg max-w-2xl mx-auto">
          Enter your consumption data and environmental details to get an AI-powered prediction of your electricity usage
        </p>
      </div>

      {/* ======================== */}
      {/* BACKEND STATUS */}
      {/* ======================== */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {backendStatus === 'connected' ? (
          <div className="badge badge-success gap-2 px-4 py-3 text-sm">
            <CheckCircle className="w-4 h-4" />
            Backend Connected
          </div>
        ) : (
          <div className="badge badge-error gap-2 px-4 py-3 text-sm">
            <WifiOff className="w-4 h-4" />
            Backend Disconnected
          </div>
        )}
      </div>

      {/* ======================== */}
      {/* MAIN FORM */}
      {/* ======================== */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error Alert */}
        {submitError && (
          <div className="alert alert-error shadow-lg gap-3">
            <AlertCircle className="w-6 h-6 flex-shrink-0" />
            <div>
              <h3 className="font-bold">Submission Error</h3>
              <p className="text-sm">{submitError}</p>
            </div>
          </div>
        )}

        {/* ======================== */}
        {/* SECTION 1: DATE & TIME */}
        {/* ======================== */}
        <div className="card bg-base-200 shadow-lg">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-primary" />
              Date & Time Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Hour */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Hour of Day</span>
                  <span className="label-text-alt text-xs">0-23 (24h format)</span>
                </label>
                <input
                  type="number"
                  name="hour"
                  min="0"
                  max="23"
                  value={formData.hour}
                  onChange={handleInputChange}
                  className={`input input-bordered ${validationErrors.hour ? 'input-error' : ''}`}
                  placeholder="14"
                />
                {validationErrors.hour && (
                  <label className="label">
                    <span className="label-text-alt text-error text-xs">{validationErrors.hour}</span>
                  </label>
                )}
              </div>

              {/* Day of Week */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Day of Week</span>
                  <span className="label-text-alt text-xs">0=Sun, 6=Sat</span>
                </label>
                <input
                  type="number"
                  name="day_of_week"
                  min="0"
                  max="6"
                  value={formData.day_of_week}
                  onChange={handleInputChange}
                  className={`input input-bordered ${validationErrors.day_of_week ? 'input-error' : ''}`}
                  placeholder="3"
                />
                {validationErrors.day_of_week && (
                  <label className="label">
                    <span className="label-text-alt text-error text-xs">{validationErrors.day_of_week}</span>
                  </label>
                )}
              </div>

              {/* Month */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Month</span>
                  <span className="label-text-alt text-xs">1-12</span>
                </label>
                <input
                  type="number"
                  name="month"
                  min="1"
                  max="12"
                  value={formData.month}
                  onChange={handleInputChange}
                  className={`input input-bordered ${validationErrors.month ? 'input-error' : ''}`}
                  placeholder="5"
                />
                {validationErrors.month && (
                  <label className="label">
                    <span className="label-text-alt text-error text-xs">{validationErrors.month}</span>
                  </label>
                )}
              </div>

              {/* Weekend */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Weekend?</span>
                  <span className="label-text-alt text-xs">0=No, 1=Yes</span>
                </label>
                <input
                  type="number"
                  name="is_weekend"
                  min="0"
                  max="1"
                  value={formData.is_weekend}
                  onChange={handleInputChange}
                  className={`input input-bordered ${validationErrors.is_weekend ? 'input-error' : ''}`}
                  placeholder="0"
                />
                {validationErrors.is_weekend && (
                  <label className="label">
                    <span className="label-text-alt text-error text-xs">{validationErrors.is_weekend}</span>
                  </label>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ======================== */}
        {/* SECTION 2: ENVIRONMENT */}
        {/* ======================== */}
        <div className="card bg-base-200 shadow-lg">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-6 flex items-center gap-2">
              <Zap className="w-6 h-6 text-warning" />
              Electricity & Environmental Data
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Electricity Rate */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Electricity Rate</span>
                  <span className="label-text-alt text-xs">₱ per kWh</span>
                </label>
                <input
                  type="number"
                  name="electricity_rate_php_kwh"
                  min="0"
                  step="0.01"
                  value={formData.electricity_rate_php_kwh}
                  onChange={handleInputChange}
                  className={`input input-bordered ${validationErrors.electricity_rate_php_kwh ? 'input-error' : ''}`}
                  placeholder="7.50"
                />
                {validationErrors.electricity_rate_php_kwh && (
                  <label className="label">
                    <span className="label-text-alt text-error text-xs">{validationErrors.electricity_rate_php_kwh}</span>
                  </label>
                )}
                <label className="label">
                  <span className="label-text-alt text-xs text-base-content/60">Check your latest utility bill</span>
                </label>
              </div>

              {/* Temperature */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Temperature</span>
                  <span className="label-text-alt text-xs">Degrees Celsius (°C)</span>
                </label>
                <input
                  type="number"
                  name="temperature"
                  step="0.1"
                  value={formData.temperature}
                  onChange={handleInputChange}
                  className={`input input-bordered ${validationErrors.temperature ? 'input-error' : ''}`}
                  placeholder="25"
                />
                {validationErrors.temperature && (
                  <label className="label">
                    <span className="label-text-alt text-error text-xs">{validationErrors.temperature}</span>
                  </label>
                )}
                <label className="label">
                  <span className="label-text-alt text-xs text-base-content/60">Current outdoor temperature</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* ======================== */}
        {/* SECTION 3: CONSUMPTION */}
        {/* ======================== */}
        <div className="card bg-base-200 shadow-lg">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-6">Historical Consumption Data</h2>
            <p className="text-sm text-base-content/70 mb-6">
              From your smart meter or electricity app. All values in kilowatt-hours (kWh)
            </p>

            {/* Recent Usage */}
            <div className="divider">Recent Usage (Last 7 Days)</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Last Hour */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Previous Hour</span>
                  <span className="label-text-alt text-xs">Electricity usage during the previous hour</span>
                </label>
                <input
                  type="number"
                  name="last_hour_kwh"
                  min="0"
                  step="0.1"
                  value={formData.last_hour_kwh}
                  onChange={handleInputChange}
                  className={`input input-bordered ${validationErrors.last_hour_kwh ? 'input-error' : ''}`}
                  placeholder="2.5"
                />
                {validationErrors.last_hour_kwh && (
                  <label className="label">
                    <span className="label-text-alt text-error text-xs">{validationErrors.last_hour_kwh}</span>
                  </label>
                )}
              </div>

              {/* Yesterday Same Hour */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Yesterday (Same Hour)</span>
                  <span className="label-text-alt text-xs">Usage during the same hour yesterday</span>
                </label>
                <input
                  type="number"
                  name="same_hour_yesterday_kwh"
                  min="0"
                  step="0.1"
                  value={formData.same_hour_yesterday_kwh}
                  onChange={handleInputChange}
                  className={`input input-bordered ${validationErrors.same_hour_yesterday_kwh ? 'input-error' : ''}`}
                  placeholder="2.3"
                />
                {validationErrors.same_hour_yesterday_kwh && (
                  <label className="label">
                    <span className="label-text-alt text-error text-xs">{validationErrors.same_hour_yesterday_kwh}</span>
                  </label>
                )}
              </div>

              {/* Last Week Same Hour */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Last Week (Same Hour)</span>
                  <span className="label-text-alt text-xs">Usage during the same hour last week</span>
                </label>
                <input
                  type="number"
                  name="same_hour_last_week_kwh"
                  min="0"
                  step="0.1"
                  value={formData.same_hour_last_week_kwh}
                  onChange={handleInputChange}
                  className={`input input-bordered ${validationErrors.same_hour_last_week_kwh ? 'input-error' : ''}`}
                  placeholder="2.4"
                />
                {validationErrors.same_hour_last_week_kwh && (
                  <label className="label">
                    <span className="label-text-alt text-error text-xs">{validationErrors.same_hour_last_week_kwh}</span>
                  </label>
                )}
              </div>
            </div>

            {/* Averages */}
            <div className="divider">Rolling Averages</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 24h Average */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">24-Hour Average</span>
                  <span className="label-text-alt text-xs">Average hourly usage over the last 24 hours</span>
                </label>
                <input
                  type="number"
                  name="avg_24h_kwh"
                  min="0"
                  step="0.1"
                  value={formData.avg_24h_kwh}
                  onChange={handleInputChange}
                  className={`input input-bordered ${validationErrors.avg_24h_kwh ? 'input-error' : ''}`}
                  placeholder="2.2"
                />
                {validationErrors.avg_24h_kwh && (
                  <label className="label">
                    <span className="label-text-alt text-error text-xs">{validationErrors.avg_24h_kwh}</span>
                  </label>
                )}
              </div>

              {/* 7d Average */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">7-Day Average</span>
                  <span className="label-text-alt text-xs">Average hourly usage over the last 7 days</span>
                </label>
                <input
                  type="number"
                  name="avg_7d_kwh"
                  min="0"
                  step="0.1"
                  value={formData.avg_7d_kwh}
                  onChange={handleInputChange}
                  className={`input input-bordered ${validationErrors.avg_7d_kwh ? 'input-error' : ''}`}
                  placeholder="2.1"
                />
                {validationErrors.avg_7d_kwh && (
                  <label className="label">
                    <span className="label-text-alt text-error text-xs">{validationErrors.avg_7d_kwh}</span>
                  </label>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ======================== */}
        {/* FORM ACTIONS */}
        {/* ======================== */}
        <div className="flex gap-3 justify-center pt-6">
          <button
            type="submit"
            disabled={isLoading || backendStatus === 'disconnected'}
            className="btn btn-primary btn-lg gap-2 px-12"
          >
            {isLoading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Predicting...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                Get Prediction
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="btn btn-outline btn-lg px-8"
          >
            Reset Form
          </button>
        </div>
      </form>

      {/* ======================== */}
      {/* PREDICTION RESULTS */}
      {/* ======================== */}
      {predictionResult && (
        <div className="card bg-gradient-to-br from-success/10 to-primary/10 shadow-xl border-2 border-success">
          <div className="card-body">
            <h2 className="card-title text-3xl mb-8 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-success" />
              Your Electricity Prediction
            </h2>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {/* Hourly */}
              <div className="bg-base-100 rounded-lg p-6 border-l-4 border-l-primary">
                <div className="text-xs uppercase tracking-wide text-base-content/60 font-semibold mb-2">
                  Hourly Usage
                </div>
                <div className="text-4xl font-bold text-primary mb-1">
                  {predictionResult.predicted_hourly_kwh?.toFixed(2)}
                </div>
                <div className="text-sm text-base-content/70">kWh</div>
              </div>

              {/* Daily */}
              <div className="bg-base-100 rounded-lg p-6 border-l-4 border-l-info">
                <div className="text-xs uppercase tracking-wide text-base-content/60 font-semibold mb-2">
                  Daily Estimate
                </div>
                <div className="text-4xl font-bold text-info mb-1">
                  {predictionResult.estimated_daily_kwh?.toFixed(2)}
                </div>
                <div className="text-sm text-base-content/70">kWh</div>
              </div>

              {/* Monthly */}
              <div className="bg-base-100 rounded-lg p-6 border-l-4 border-l-warning">
                <div className="text-xs uppercase tracking-wide text-base-content/60 font-semibold mb-2">
                  Monthly Estimate
                </div>
                <div className="text-4xl font-bold text-warning mb-1">
                  {predictionResult.estimated_monthly_kwh?.toFixed(2)}
                </div>
                <div className="text-sm text-base-content/70">kWh</div>
              </div>

              {/* Bill */}
              <div className="bg-base-100 rounded-lg p-6 border-l-4 border-l-success">
                <div className="text-xs uppercase tracking-wide text-base-content/60 font-semibold mb-2">
                  Monthly Bill
                </div>
                <div className="text-4xl font-bold text-success mb-1">
                  ₱{predictionResult.estimated_monthly_bill_php?.toFixed(2)}
                </div>
                <div className="text-sm text-base-content/70">PHP</div>
              </div>
            </div>

            {/* Details */}
            <div className="divider">Prediction Details</div>
            <pre className="bg-base-300 p-4 rounded-lg overflow-x-auto text-xs font-mono text-base-content/80">
              {JSON.stringify(predictionResult, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
