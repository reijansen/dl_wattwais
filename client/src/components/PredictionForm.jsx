import { Zap, AlertCircle, Loader, TrendingUp, CalendarClock, Thermometer, Info } from 'lucide-react';
import DaisyAlert from './DaisyAlert';
import DaisyCard from './DaisyCard';

const DAYS = [
  { label: 'Sunday', value: 0 },
  { label: 'Monday', value: 1 },
  { label: 'Tuesday', value: 2 },
  { label: 'Wednesday', value: 3 },
  { label: 'Thursday', value: 4 },
  { label: 'Friday', value: 5 },
  { label: 'Saturday', value: 6 },
];

const MONTHS = [
  { label: 'January', value: 1 },
  { label: 'February', value: 2 },
  { label: 'March', value: 3 },
  { label: 'April', value: 4 },
  { label: 'May', value: 5 },
  { label: 'June', value: 6 },
  { label: 'July', value: 7 },
  { label: 'August', value: 8 },
  { label: 'September', value: 9 },
  { label: 'October', value: 10 },
  { label: 'November', value: 11 },
  { label: 'December', value: 12 },
];

function formatHourLabel(h) {
  const hour = Number(h);
  const period = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:00 ${period}`;
}

export default function PredictionForm({
  formData,
  validationErrors,
  submitError,
  isLoading,
  backendStatus,
  onSubmit,
  onReset,
  onInputChange,
  onUseCurrentDateTime,
  autoFillLoading = false,
  autoFillError = null,
  onUseWeather,
  weatherLoading = false,
  weatherError = null,
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {submitError && (
        <DaisyAlert
          type="error"
          icon={<AlertCircle className="w-6 h-6" />}
          title="Submission Error"
          message={submitError}
        />
      )}

      <DaisyAlert
        type="info"
        icon={<Info className="w-6 h-6" />}
        title="Quick note"
        message="Not sure what to enter? Approximate values may still be used for demonstration purposes. The model estimates household electricity demand and does not replace official utility billing."
      />

      {autoFillError ? (
        <DaisyAlert
          type="warning"
          icon={<AlertCircle className="w-6 h-6" />}
          title="Auto-fill unavailable"
          message={autoFillError}
        />
      ) : null}

      {weatherError ? (
        <DaisyAlert
          type="warning"
          icon={<AlertCircle className="w-6 h-6" />}
          title="Weather auto-fill unavailable"
          message={weatherError}
        />
      ) : null}

      {/* Date & time */}
      <DaisyCard
        variant="base-200"
        title="Date & Time"
        subtitle="These values describe when the prediction is being made. The app can auto-fill them using the current date and time, but you may adjust them for testing."
        icon={<TrendingUp className="w-6 h-6 text-primary" />}
        headerRight={
          <button
            type="button"
            onClick={onUseCurrentDateTime}
            className="btn btn-sm btn-outline gap-2"
            disabled={autoFillLoading}
          >
            {autoFillLoading ? <Loader className="w-4 h-4 animate-spin" /> : <CalendarClock className="w-4 h-4" />}
            {autoFillLoading ? 'Fetching…' : 'Use current date & time'}
          </button>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {/* Hour */}
          <div className="form-control">
            <label className="label flex-col items-start gap-1">
              <span className="label-text font-semibold">Prediction hour</span>
              <span className="label-text-alt text-xs">Choose the hour you want to forecast</span>
            </label>
            <select
              name="hour"
              value={formData.hour}
              onChange={onInputChange}
              className={`select select-bordered ${validationErrors.hour ? 'select-error' : ''}`}
            >
              {Array.from({ length: 24 }).map((_, h) => (
                <option key={h} value={h}>
                  {formatHourLabel(h)}
                </option>
              ))}
            </select>
            {validationErrors.hour && (
              <label className="label">
                <span className="label-text-alt text-error text-xs">{validationErrors.hour}</span>
              </label>
            )}
          </div>

          {/* Day */}
          <div className="form-control">
            <label className="label flex-col items-start gap-1">
              <span className="label-text font-semibold">Day of week</span>
              <span className="label-text-alt text-xs">Used to capture weekday/weekend patterns</span>
            </label>
            <select
              name="day_of_week"
              value={formData.day_of_week}
              onChange={onInputChange}
              className={`select select-bordered ${validationErrors.day_of_week ? 'select-error' : ''}`}
            >
              {DAYS.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
            {validationErrors.day_of_week && (
              <label className="label">
                <span className="label-text-alt text-error text-xs">{validationErrors.day_of_week}</span>
              </label>
            )}
          </div>

          {/* Month */}
          <div className="form-control">
            <label className="label flex-col items-start gap-1">
              <span className="label-text font-semibold">Month</span>
              <span className="label-text-alt text-xs">Seasonality may affect demand</span>
            </label>
            <select
              name="month"
              value={formData.month}
              onChange={onInputChange}
              className={`select select-bordered ${validationErrors.month ? 'select-error' : ''}`}
            >
              {MONTHS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
            {validationErrors.month && (
              <label className="label">
                <span className="label-text-alt text-error text-xs">{validationErrors.month}</span>
              </label>
            )}
          </div>
        </div>
      </DaisyCard>

      {/* Electricity & environment */}
      <DaisyCard
        variant="base-200"
        title="Electricity & Environmental Data"
        subtitle="Enter your current electricity rate and approximate outdoor temperature. The electricity rate is usually found on your latest utility bill."
        icon={<Zap className="w-6 h-6 text-warning" />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="form-control">
            <label className="label flex-col items-start gap-1">
              <span className="label-text font-semibold">Electricity rate (₱ per kWh)</span>
              <span className="label-text-alt text-xs">Example: 12.50</span>
            </label>
            <input
              type="number"
              name="electricity_rate_php_kwh"
              min="0"
              step="0.01"
              value={formData.electricity_rate_php_kwh}
              onChange={onInputChange}
              className={`input input-bordered ${validationErrors.electricity_rate_php_kwh ? 'input-error' : ''}`}
              placeholder="12.50"
            />
            {validationErrors.electricity_rate_php_kwh && (
              <label className="label">
                <span className="label-text-alt text-error text-xs">{validationErrors.electricity_rate_php_kwh}</span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label flex-col items-start gap-1">
              <span className="label-text font-semibold">Outdoor temperature (°C)</span>
              <span className="label-text-alt text-xs">Example: 31</span>
            </label>
            <div className="join">
              <span className="btn btn-outline join-item pointer-events-none">
                <Thermometer className="w-4 h-4" />
              </span>
              <input
                type="number"
                name="temperature"
                step="0.1"
                value={formData.temperature}
                onChange={onInputChange}
                className={`input input-bordered join-item w-full ${validationErrors.temperature ? 'input-error' : ''}`}
                placeholder="31"
              />
            </div>
            <div className="mt-2 flex items-center justify-between gap-2 flex-wrap">
              <span className="text-xs text-base-content/60">Tip: Use local weather for a more realistic demo.</span>
              <button
                type="button"
                className="btn btn-xs btn-outline gap-2"
                onClick={onUseWeather}
                disabled={!onUseWeather || weatherLoading}
              >
                {weatherLoading ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <Thermometer className="w-3.5 h-3.5" />}
                {weatherLoading ? 'Fetching…' : 'Use my local weather'}
              </button>
            </div>
            {validationErrors.temperature && (
              <label className="label">
                <span className="label-text-alt text-error text-xs">{validationErrors.temperature}</span>
              </label>
            )}
          </div>
        </div>
      </DaisyCard>

      {/* Historical consumption */}
      <DaisyCard
        variant="base-200"
        title="Historical Consumption"
        subtitle="These values represent recent household electricity usage. In a real smart meter setup, these would be collected automatically. For this demo, estimated values may also be used."
        icon={<Zap className="w-6 h-6 text-primary" />}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="form-control">
            <label className="label flex-col items-start gap-1">
              <span className="label-text font-semibold">Previous hour usage (kWh)</span>
              <span className="label-text-alt text-xs">Example: 1.25</span>
            </label>
            <input
              type="number"
              name="last_hour_kwh"
              min="0"
              step="0.01"
              value={formData.last_hour_kwh}
              onChange={onInputChange}
              className={`input input-bordered ${validationErrors.last_hour_kwh ? 'input-error' : ''}`}
              placeholder="1.25"
            />
            {validationErrors.last_hour_kwh && (
              <label className="label">
                <span className="label-text-alt text-error text-xs">{validationErrors.last_hour_kwh}</span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label flex-col items-start gap-1">
              <span className="label-text font-semibold">Same hour yesterday (kWh)</span>
              <span className="label-text-alt text-xs">Example: 1.10</span>
            </label>
            <input
              type="number"
              name="same_hour_yesterday_kwh"
              min="0"
              step="0.01"
              value={formData.same_hour_yesterday_kwh}
              onChange={onInputChange}
              className={`input input-bordered ${validationErrors.same_hour_yesterday_kwh ? 'input-error' : ''}`}
              placeholder="1.10"
            />
            {validationErrors.same_hour_yesterday_kwh && (
              <label className="label">
                <span className="label-text-alt text-error text-xs">{validationErrors.same_hour_yesterday_kwh}</span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label flex-col items-start gap-1">
              <span className="label-text font-semibold">Same hour last week (kWh)</span>
              <span className="label-text-alt text-xs">Example: 1.30</span>
            </label>
            <input
              type="number"
              name="same_hour_last_week_kwh"
              min="0"
              step="0.01"
              value={formData.same_hour_last_week_kwh}
              onChange={onInputChange}
              className={`input input-bordered ${validationErrors.same_hour_last_week_kwh ? 'input-error' : ''}`}
              placeholder="1.30"
            />
            {validationErrors.same_hour_last_week_kwh && (
              <label className="label">
                <span className="label-text-alt text-error text-xs">{validationErrors.same_hour_last_week_kwh}</span>
              </label>
            )}
          </div>
        </div>

        <div className="divider">Averages</div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label flex-col items-start gap-1">
              <span className="label-text font-semibold">Average over the last 24 hours (kWh)</span>
              <span className="label-text-alt text-xs">Example: 1.20</span>
            </label>
            <input
              type="number"
              name="avg_24h_kwh"
              min="0"
              step="0.01"
              value={formData.avg_24h_kwh}
              onChange={onInputChange}
              className={`input input-bordered ${validationErrors.avg_24h_kwh ? 'input-error' : ''}`}
              placeholder="1.20"
            />
            {validationErrors.avg_24h_kwh && (
              <label className="label">
                <span className="label-text-alt text-error text-xs">{validationErrors.avg_24h_kwh}</span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label flex-col items-start gap-1">
              <span className="label-text font-semibold">Average over the last 7 days (kWh)</span>
              <span className="label-text-alt text-xs">Example: 1.15</span>
            </label>
            <input
              type="number"
              name="avg_7d_kwh"
              min="0"
              step="0.01"
              value={formData.avg_7d_kwh}
              onChange={onInputChange}
              className={`input input-bordered ${validationErrors.avg_7d_kwh ? 'input-error' : ''}`}
              placeholder="1.15"
            />
            {validationErrors.avg_7d_kwh && (
              <label className="label">
                <span className="label-text-alt text-error text-xs">{validationErrors.avg_7d_kwh}</span>
              </label>
            )}
          </div>
        </div>
      </DaisyCard>

      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
        <button
          type="submit"
          disabled={isLoading || backendStatus === 'disconnected'}
          className="btn btn-primary btn-lg gap-2 px-10 hover:brightness-105 transition"
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

        <button type="button" onClick={onReset} className="btn btn-outline btn-lg px-8 hover:brightness-105 transition">
          Reset
        </button>
      </div>
    </form>
  );
}
