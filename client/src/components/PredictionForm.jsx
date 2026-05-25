import { Zap, AlertCircle, Loader, TrendingUp } from 'lucide-react';
import DaisyAlert from './DaisyAlert';
import DaisyCard from './DaisyCard';

export default function PredictionForm({
  formData,
  validationErrors,
  submitError,
  isLoading,
  backendStatus,
  onSubmit,
  onReset,
  onInputChange,
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Error Alert */}
      {submitError && (
        <DaisyAlert
          type="error"
          icon={<AlertCircle className="w-6 h-6" />}
          title="Submission Error"
          message={submitError}
        />
      )}

      {/* ======================== */}
      {/* SECTION 1: DATE & TIME */}
      {/* ======================== */}
      <DaisyCard
        variant="base-200"
        title="Date & Time Information"
        icon={<TrendingUp className="w-6 h-6 text-primary" />}
      >
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
                onChange={onInputChange}
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
                onChange={onInputChange}
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
                onChange={onInputChange}
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
                onChange={onInputChange}
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
      </DaisyCard>

      {/* ======================== */}
      {/* SECTION 2: ENVIRONMENT */}
      {/* ======================== */}
      <DaisyCard
        variant="base-200"
        title="Electricity & Environmental Data"
        icon={<Zap className="w-6 h-6 text-warning" />}
      >
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
                onChange={onInputChange}
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
                onChange={onInputChange}
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
      </DaisyCard>

      {/* ======================== */}
      {/* SECTION 3: CONSUMPTION */}
      {/* ======================== */}
      <DaisyCard
        variant="base-200"
        title="Historical Consumption Data"
        subtitle="From your smart meter or electricity app. All values in kilowatt-hours (kWh)."
      >

          <div className="divider">Recent Usage (Last 7 Days)</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
                onChange={onInputChange}
                className={`input input-bordered ${validationErrors.last_hour_kwh ? 'input-error' : ''}`}
                placeholder="2.5"
              />
              {validationErrors.last_hour_kwh && (
                <label className="label">
                  <span className="label-text-alt text-error text-xs">{validationErrors.last_hour_kwh}</span>
                </label>
              )}
            </div>

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
                onChange={onInputChange}
                className={`input input-bordered ${validationErrors.same_hour_yesterday_kwh ? 'input-error' : ''}`}
                placeholder="2.3"
              />
              {validationErrors.same_hour_yesterday_kwh && (
                <label className="label">
                  <span className="label-text-alt text-error text-xs">{validationErrors.same_hour_yesterday_kwh}</span>
                </label>
              )}
            </div>

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
                onChange={onInputChange}
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

          <div className="divider">Rolling Averages</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                onChange={onInputChange}
                className={`input input-bordered ${validationErrors.avg_24h_kwh ? 'input-error' : ''}`}
                placeholder="2.2"
              />
              {validationErrors.avg_24h_kwh && (
                <label className="label">
                  <span className="label-text-alt text-error text-xs">{validationErrors.avg_24h_kwh}</span>
                </label>
              )}
            </div>

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
                onChange={onInputChange}
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
      </DaisyCard>

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

        <button type="button" onClick={onReset} className="btn btn-outline btn-lg px-8">
          Reset Form
        </button>
      </div>
    </form>
  );
}
