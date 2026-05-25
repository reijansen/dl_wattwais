import { useState, useEffect, useRef } from 'react';
import { CheckCircle, WifiOff, Loader } from 'lucide-react';
import { checkBackendHealth, predictDemand } from '../services/api';
import PredictionResults from '../components/PredictionResults';
import PredictionForm from '../components/PredictionForm';

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
  const [predictionMetadata, setPredictionMetadata] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [autoFillStatus, setAutoFillStatus] = useState({ isLoading: false, error: null });
  const [didAutoTemp, setDidAutoTemp] = useState(false);
  const [weatherFillStatus, setWeatherFillStatus] = useState({ isLoading: false, error: null });

  const resultsRef = useRef(null);

  const recomputeWeekend = (dayOfWeek) => (dayOfWeek === 0 || dayOfWeek === 6 ? 1 : 0);

  async function fetchApiDateTime() {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);
    try {
      const res = await fetch('https://worldtimeapi.org/api/ip', { signal: controller.signal });
      if (!res.ok) throw new Error('time_api_failed');
      const data = await res.json();
      if (!data?.datetime) throw new Error('time_api_invalid');
      return new Date(data.datetime);
    } finally {
      clearTimeout(timeout);
    }
  }

  async function getLocationCoords() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) reject(new Error('geolocation_unsupported'));
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        (err) => reject(err),
        { enableHighAccuracy: false, timeout: 6000, maximumAge: 5 * 60 * 1000 }
      );
    });
  }

  async function fetchIpCoords() {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);
    try {
      const res = await fetch('https://ipapi.co/json/', { signal: controller.signal });
      if (!res.ok) throw new Error('ip_api_failed');
      const data = await res.json();
      const lat = Number(data?.latitude);
      const lon = Number(data?.longitude);
      if (!Number.isFinite(lat) || !Number.isFinite(lon)) throw new Error('ip_api_invalid');
      return { lat, lon };
    } finally {
      clearTimeout(timeout);
    }
  }

  async function fetchOutdoorTemperatureC({ lat, lon }) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${encodeURIComponent(
      lat
    )}&longitude=${encodeURIComponent(lon)}&current=temperature_2m`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4500);
    try {
      const res = await fetch(url, { signal: controller.signal });
      if (!res.ok) throw new Error('weather_api_failed');
      const data = await res.json();
      const temp = data?.current?.temperature_2m;
      const tempNum = Number(temp);
      if (!Number.isFinite(tempNum)) throw new Error('weather_api_invalid');
      return tempNum;
    } finally {
      clearTimeout(timeout);
    }
  }

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

    // Auto-fill current date/time (initial)
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay(); // 0-6 (Sunday-Saturday)
    const month = now.getMonth() + 1; // 1-12
    const isWeekend = recomputeWeekend(day);

    setFormData((prev) => ({
      ...prev,
      hour,
      day_of_week: day,
      month,
      is_weekend: isWeekend,
    }));

    // Auto-fill outdoor temperature using IP-based location (no permission prompt)
    (async () => {
      try {
        const coords = await fetchIpCoords();
        const temperature = await fetchOutdoorTemperatureC(coords);
        setFormData((prev) => (prev.temperature === 25.0 ? { ...prev, temperature } : prev));
        setDidAutoTemp(true);
      } catch {
        // silent fallback (user can still enter temperature manually)
      }
    })();
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
    const isNumericSelect = name === 'hour' || name === 'day_of_week' || name === 'month';
    const parsedValue = type === 'number' || isNumericSelect ? parseFloat(value) : value;

    setFormData((prev) => {
      const nextValue = isNaN(parsedValue) ? '' : parsedValue;
      const next = { ...prev, [name]: nextValue };

      if (name === 'day_of_week') {
        const day = Number(nextValue);
        next.is_weekend = recomputeWeekend(day);
      }

      return next;
    });

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
    setPredictionMetadata(null);

    // Make prediction request
    setIsLoading(true);

    try {
      const result = await predictDemand(formData);

      if (result.success) {
        setPredictionResult(result.data);
        setPredictionMetadata(result.metadata || null);
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

  useEffect(() => {
    if (!predictionResult) return;
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [predictionResult]);

  const handleUseCurrentDateTime = async () => {
    setAutoFillStatus({ isLoading: true, error: null });
    try {
      let now;
      try {
        now = await fetchApiDateTime();
      } catch {
        now = new Date();
      }

      const hour = now.getHours();
      const day = now.getDay();
      const month = now.getMonth() + 1;
      const isWeekend = recomputeWeekend(day);

      let temperature;
      try {
        const coords = await getLocationCoords();
        temperature = await fetchOutdoorTemperatureC(coords);
      } catch {
        try {
          const coords = await fetchIpCoords();
          temperature = await fetchOutdoorTemperatureC(coords);
        } catch {
          temperature = null;
        }
      }

      setFormData((prev) => ({
        ...prev,
        hour,
        day_of_week: day,
        month,
        is_weekend: isWeekend,
        ...(temperature === null ? {} : { temperature }),
      }));
      if (temperature !== null) setDidAutoTemp(true);
    } catch (e) {
      setAutoFillStatus({
        isLoading: false,
        error: 'Could not auto-fill from APIs. You can still select the values manually.',
      });
      return;
    }

    setAutoFillStatus({ isLoading: false, error: null });
  };

  const handleUseWeather = async () => {
    setWeatherFillStatus({ isLoading: true, error: null });
    try {
      let temperature;
      try {
        const coords = await getLocationCoords();
        temperature = await fetchOutdoorTemperatureC(coords);
      } catch {
        const coords = await fetchIpCoords();
        temperature = await fetchOutdoorTemperatureC(coords);
      }

      setFormData((prev) => ({ ...prev, temperature }));
      setDidAutoTemp(true);
      setWeatherFillStatus({ isLoading: false, error: null });
    } catch {
      setWeatherFillStatus({
        isLoading: false,
        error: 'Could not fetch local weather. You can still type an approximate temperature.',
      });
    }
  };

  /**
   * Handle form reset
   */
  const handleReset = () => {
    setFormData((prev) => ({
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
    setPredictionMetadata(null);
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
        {backendStatus === 'checking' ? (
          <div className="badge badge-ghost gap-2 px-4 py-3 text-sm">
            <Loader className="w-4 h-4 animate-spin" />
            Checking backend...
          </div>
        ) : backendStatus === 'connected' ? (
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
      <PredictionForm
        formData={formData}
        validationErrors={validationErrors}
        submitError={submitError}
        isLoading={isLoading}
        backendStatus={backendStatus}
        onSubmit={handleSubmit}
        onReset={handleReset}
        onInputChange={handleInputChange}
        onUseCurrentDateTime={handleUseCurrentDateTime}
        autoFillLoading={autoFillStatus.isLoading}
        autoFillError={autoFillStatus.error}
        onUseWeather={handleUseWeather}
        weatherLoading={weatherFillStatus.isLoading}
        weatherError={weatherFillStatus.error}
      />

      {/* ======================== */}
      {/* PREDICTION RESULTS */}
      {/* ======================== */}
      <div ref={resultsRef} className="pt-2 scroll-mt-6">
        <div className="divider">Results Dashboard</div>
        <PredictionResults
          prediction={predictionResult}
          metadata={predictionMetadata}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
