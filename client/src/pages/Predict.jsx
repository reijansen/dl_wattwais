import { useState, useEffect } from 'react';
import { Zap, AlertCircle, CheckCircle, WifiOff, Loader } from 'lucide-react';
import { checkBackendHealth, testPredictionWithSampleData } from '../services/api';

export default function Predict() {
  // Backend connection state
  const [backendStatus, setBackendStatus] = useState('checking'); // 'checking', 'connected', 'disconnected'
  const [isTestingHealth, setIsTestingHealth] = useState(false);
  const [isTestingPrediction, setIsTestingPrediction] = useState(false);
  const [healthResponse, setHealthResponse] = useState(null);
  const [predictionResponse, setPredictionResponse] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    hour: 12,
    day_of_week: 3,
    month: 5,
    is_weekend: 0,
    electricity_rate_php_kwh: 7.50,
    temperature: 25,
    last_hour_kwh: 2.5,
    same_hour_yesterday_kwh: 2.3,
    same_hour_last_week_kwh: 2.4,
    avg_24h_kwh: 2.2,
    avg_7d_kwh: 2.1,
  });

  // Check backend connection on component mount
  useEffect(() => {
    const checkConnection = async () => {
      const result = await checkBackendHealth();
      if (result.success) {
        setBackendStatus('connected');
      } else {
        setBackendStatus('disconnected');
      }
    };

    checkConnection();
  }, []);

  // Test backend health endpoint
  const handleHealthCheck = async () => {
    setIsTestingHealth(true);
    const result = await checkBackendHealth();
    setHealthResponse(result);

    if (result.success) {
      setBackendStatus('connected');
    } else {
      setBackendStatus('disconnected');
    }

    setIsTestingHealth(false);
  };

  // Test prediction with sample data
  const handleTestPrediction = async () => {
    setIsTestingPrediction(true);
    const result = await testPredictionWithSampleData();
    setPredictionResponse(result);
    setIsTestingPrediction(false);
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value,
    }));
  };

  // Handle form submit (placeholder)
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    // This will be connected in a later phase
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          <span className="text-gradient">Predict Your</span>
        </h1>
        <h1 className="text-4xl font-bold mb-4">Electricity Demand</h1>
        <p className="text-base-content/70 text-lg">
          Enter your details below to get an AI-powered electricity prediction
        </p>
      </div>

      {/* ===================== */}
      {/* BACKEND CONNECTION TEST */}
      {/* ===================== */}
      <div className="card bg-gradient-to-br from-base-200 to-base-300 shadow-lg border-l-4 border-l-info">
        <div className="card-body">
          <div className="flex items-start justify-between mb-4">
            <h2 className="card-title flex items-center gap-2">
              {backendStatus === 'checking' && (
                <>
                  <Loader className="w-5 h-5 animate-spin text-warning" />
                  Checking Backend Connection
                </>
              )}
              {backendStatus === 'connected' && (
                <>
                  <CheckCircle className="w-5 h-5 text-success" />
                  Backend Connected
                </>
              )}
              {backendStatus === 'disconnected' && (
                <>
                  <WifiOff className="w-5 h-5 text-error" />
                  Backend Disconnected
                </>
              )}
            </h2>
            <div className="badge badge-lg" variant={backendStatus === 'connected' ? 'success' : 'error'}>
              {backendStatus === 'checking' && 'Checking...'}
              {backendStatus === 'connected' && 'Connected'}
              {backendStatus === 'disconnected' && 'Disconnected'}
            </div>
          </div>

          <p className="text-sm text-base-content/70 mb-6">
            Backend running at: <code className="text-xs bg-base-300 px-2 py-1 rounded">http://localhost:5000</code>
          </p>

          {/* Health Check Button */}
          <div className="mb-6">
            <button
              onClick={handleHealthCheck}
              disabled={isTestingHealth}
              className="btn btn-primary btn-sm gap-2"
            >
              {isTestingHealth ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Test Backend Health
                </>
              )}
            </button>
          </div>

          {/* Health Check Response */}
          {healthResponse && (
            <div className={`alert alert-sm mb-4 ${healthResponse.success ? 'alert-success' : 'alert-error'}`}>
              {healthResponse.success ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>
                    <strong>✓ Backend is running!</strong> Server is responding correctly.
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5" />
                  <span>
                    <strong>✗ Backend is not responding:</strong> {healthResponse.error}
                  </span>
                </>
              )}
            </div>
          )}

          {/* Test Prediction Button */}
          <div className="mb-6">
            <button
              onClick={handleTestPrediction}
              disabled={isTestingPrediction || backendStatus === 'disconnected'}
              className="btn btn-secondary btn-sm gap-2"
            >
              {isTestingPrediction ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Testing Prediction...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Test Sample Prediction
                </>
              )}
            </button>
          </div>

          {/* Prediction Response */}
          {predictionResponse && (
            <div className={`alert alert-sm ${predictionResponse.success ? 'alert-success' : 'alert-error'}`}>
              {predictionResponse.success ? (
                <div className="w-full">
                  <CheckCircle className="w-5 h-5 inline-block mr-2" />
                  <strong>✓ Prediction successful!</strong>
                  <div className="mt-3 text-sm space-y-2">
                    <p><strong>Hourly:</strong> {predictionResponse.data?.predicted_hourly_kwh?.toFixed(2)} kWh</p>
                    <p><strong>Daily:</strong> {predictionResponse.data?.estimated_daily_kwh?.toFixed(2)} kWh</p>
                    <p><strong>Monthly:</strong> {predictionResponse.data?.estimated_monthly_kwh?.toFixed(2)} kWh</p>
                    <p><strong>Bill:</strong> ₱{predictionResponse.data?.estimated_monthly_bill_php?.toFixed(2)}</p>
                  </div>
                </div>
              ) : (
                <div className="w-full">
                  <AlertCircle className="w-5 h-5 inline-block mr-2" />
                  <strong>✗ Prediction failed:</strong>
                  <p className="mt-2 text-sm">{predictionResponse.error}</p>
                  {predictionResponse.details && (
                    <p className="mt-1 text-xs opacity-75">
                      {Array.isArray(predictionResponse.details) 
                        ? predictionResponse.details.join(', ')
                        : predictionResponse.details}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="divider my-4">API Connection Test Section</div>

          <div className="text-xs text-base-content/60">
            <p className="mb-2">
              <strong>📋 What this tests:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Backend server is running at http://localhost:5000</li>
              <li>API endpoints are accessible</li>
              <li>Sample prediction with default values</li>
              <li>Response formatting and data validation</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ========================== */}
      {/* PREDICTION FORM (SCAFFOLDED) */}
      {/* ========================== */}
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="alert alert-info">
          <AlertCircle className="w-6 h-6" />
          <span>
            <strong>Phase 4 - API Connection:</strong> Test section above verifies backend connectivity. 
            Full form submission integration coming in Phase 5.
          </span>
        </div>

        <div className="card bg-base-200 shadow-lg">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-6">Input Your Data</h2>

            {/* Temporal Fields */}
            <div className="divider">Temporal Information</div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Hour (0-23)</span>
                </label>
                <input
                  type="number"
                  name="hour"
                  min="0"
                  max="23"
                  value={formData.hour}
                  onChange={handleInputChange}
                  className="input input-bordered"
                  placeholder="14"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Day of Week (0-6)</span>
                </label>
                <input
                  type="number"
                  name="day_of_week"
                  min="0"
                  max="6"
                  value={formData.day_of_week}
                  onChange={handleInputChange}
                  className="input input-bordered"
                  placeholder="3"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Month (1-12)</span>
                </label>
                <input
                  type="number"
                  name="month"
                  min="1"
                  max="12"
                  value={formData.month}
                  onChange={handleInputChange}
                  className="input input-bordered"
                  placeholder="5"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Weekend (0 or 1)</span>
                </label>
                <input
                  type="number"
                  name="is_weekend"
                  min="0"
                  max="1"
                  value={formData.is_weekend}
                  onChange={handleInputChange}
                  className="input input-bordered"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Price & Temperature */}
            <div className="divider">Environmental Data</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Electricity Rate (₱/kWh)</span>
                </label>
                <input
                  type="number"
                  name="electricity_rate_php_kwh"
                  min="0"
                  step="0.01"
                  value={formData.electricity_rate_php_kwh}
                  onChange={handleInputChange}
                  className="input input-bordered"
                  placeholder="7.50"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Temperature (°C)</span>
                </label>
                <input
                  type="number"
                  name="temperature"
                  step="0.1"
                  value={formData.temperature}
                  onChange={handleInputChange}
                  className="input input-bordered"
                  placeholder="25"
                />
              </div>
            </div>

            {/* Historical Data */}
            <div className="divider">Historical Consumption Data</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Last Hour (kWh)</span>
                </label>
                <input
                  type="number"
                  name="last_hour_kwh"
                  min="0"
                  step="0.1"
                  value={formData.last_hour_kwh}
                  onChange={handleInputChange}
                  className="input input-bordered"
                  placeholder="2.5"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Yesterday Same Hour (kWh)</span>
                </label>
                <input
                  type="number"
                  name="same_hour_yesterday_kwh"
                  min="0"
                  step="0.1"
                  value={formData.same_hour_yesterday_kwh}
                  onChange={handleInputChange}
                  className="input input-bordered"
                  placeholder="2.3"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Last Week Same Hour (kWh)</span>
                </label>
                <input
                  type="number"
                  name="same_hour_last_week_kwh"
                  min="0"
                  step="0.1"
                  value={formData.same_hour_last_week_kwh}
                  onChange={handleInputChange}
                  className="input input-bordered"
                  placeholder="2.4"
                />
              </div>
            </div>

            {/* Rolling Averages */}
            <div className="divider">Rolling Averages</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">24h Average (kWh)</span>
                </label>
                <input
                  type="number"
                  name="avg_24h_kwh"
                  min="0"
                  step="0.1"
                  value={formData.avg_24h_kwh}
                  onChange={handleInputChange}
                  className="input input-bordered"
                  placeholder="2.2"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">7-day Average (kWh)</span>
                </label>
                <input
                  type="number"
                  name="avg_7d_kwh"
                  min="0"
                  step="0.1"
                  value={formData.avg_7d_kwh}
                  onChange={handleInputChange}
                  className="input input-bordered"
                  placeholder="2.1"
                />
              </div>
            </div>

            {/* Submit Button (Disabled for Phase 4) */}
            <div className="card-actions justify-center mt-8">
              <button
                type="submit"
                disabled
                className="btn btn-primary btn-lg gap-2 px-12 opacity-50 cursor-not-allowed"
              >
                <Zap className="w-5 h-5" />
                Submit Form (Available in Phase 5)
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
        <div className="card bg-base-200 shadow-lg">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-6">Input Your Data</h2>

            {/* Temporal Fields */}
            <div className="divider">Temporal Information</div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Hour (0-23)</span>
                </label>
                <input
                  type="number"
                  name="hour"
                  min="0"
                  max="23"
                  value={formData.hour}
                  onChange={handleInputChange}
                  className="input input-bordered"
                  placeholder="14"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Day of Week (0-6)</span>
                </label>
                <input
                  type="number"
                  name="day_of_week"
                  min="0"
                  max="6"
                  value={formData.day_of_week}
                  onChange={handleInputChange}
                  className="input input-bordered"
                  placeholder="3"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Month (1-12)</span>
                </label>
                <input
                  type="number"
                  name="month"
                  min="1"
                  max="12"
                  value={formData.month}
                  onChange={handleInputChange}
                  className="input input-bordered"
                  placeholder="5"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Weekend (0 or 1)</span>
                </label>
                <input
                  type="number"
                  name="is_weekend"
                  min="0"
                  max="1"
                  value={formData.is_weekend}
                  onChange={handleInputChange}
                  className="input input-bordered"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Price & Temperature */}
            <div className="divider">Environmental Data</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Electricity Rate (₱/kWh)</span>
                </label>
                <input
                  type="number"
                  name="electricity_rate_php_kwh"
                  min="0"
                  step="0.01"
                  value={formData.electricity_rate_php_kwh}
                  onChange={handleInputChange}
                  className="input input-bordered"
                  placeholder="7.50"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Temperature (°C)</span>
                </label>
                <input
                  type="number"
                  name="temperature"
                  step="0.1"
                  value={formData.temperature}
                  onChange={handleInputChange}
                  className="input input-bordered"
                  placeholder="25"
                />
              </div>
            </div>

            {/* Historical Data */}
            <div className="divider">Historical Consumption Data</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Last Hour (kWh)</span>
                </label>
                <input
                  type="number"
                  name="last_hour_kwh"
                  min="0"
                  step="0.1"
                  value={formData.last_hour_kwh}
                  onChange={handleInputChange}
                  className="input input-bordered"
                  placeholder="2.5"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Yesterday Same Hour (kWh)</span>
                </label>
                <input
                  type="number"
                  name="same_hour_yesterday_kwh"
                  min="0"
                  step="0.1"
                  value={formData.same_hour_yesterday_kwh}
                  onChange={handleInputChange}
                  className="input input-bordered"
                  placeholder="2.3"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Last Week Same Hour (kWh)</span>
                </label>
                <input
                  type="number"
                  name="same_hour_last_week_kwh"
                  min="0"
                  step="0.1"
                  value={formData.same_hour_last_week_kwh}
                  onChange={handleInputChange}
                  className="input input-bordered"
                  placeholder="2.4"
                />
              </div>
            </div>

            {/* Rolling Averages */}
            <div className="divider">Rolling Averages</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">24h Average (kWh)</span>
                </label>
                <input
                  type="number"
                  name="avg_24h_kwh"
                  min="0"
                  step="0.1"
                  value={formData.avg_24h_kwh}
                  onChange={handleInputChange}
                  className="input input-bordered"
                  placeholder="2.2"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">7-day Average (kWh)</span>
                </label>
                <input
                  type="number"
                  name="avg_7d_kwh"
                  min="0"
                  step="0.1"
                  value={formData.avg_7d_kwh}
                  onChange={handleInputChange}
                  className="input input-bordered"
                  placeholder="2.1"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="card-actions justify-center mt-8">
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary btn-lg gap-2 px-12"
              >
                <Zap className="w-5 h-5" />
                {isLoading ? 'Processing...' : 'Predict Demand'}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Submission Info */}
      {hasSubmitted && (
        <div className="alert alert-success">
          <span>Form structure is ready! Backend integration coming in Phase 4.</span>
        </div>
      )}
    </div>
  );
}
