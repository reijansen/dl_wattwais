import { useState } from 'react';
import { Zap, AlertCircle } from 'lucide-react';

export default function Predict() {
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

  const [isLoading, setIsLoading] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setHasSubmitted(true);

    try {
      // Placeholder: API call will be implemented in Phase 4
      console.log('Form submitted with data:', formData);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          <span className="text-gradient">Predict Your</span>
        </h1>
        <h1 className="text-4xl font-bold mb-4">Electricity Demand</h1>
        <p className="text-base-content/70 text-lg">
          Enter your details below to get an AI-powered electricity prediction
        </p>
      </div>

      {/* Alert Box - Phase 4 Coming Soon */}
      <div className="alert alert-info">
        <AlertCircle className="w-6 h-6" />
        <span>
          <strong>Phase 3 Preview:</strong> This form is scaffolded and ready for backend integration in Phase 4
        </span>
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="space-y-8">
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
