import { AlertCircle } from 'lucide-react';

export default function Results() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          <span className="text-gradient">Prediction</span> Results
        </h1>
        <p className="text-base-content/70 text-lg">
          Your electricity demand forecast and bill estimation
        </p>
      </div>

      {/* No Data State */}
      <div className="card bg-base-200 shadow-lg">
        <div className="card-body items-center text-center py-16">
          <AlertCircle className="w-16 h-16 text-warning mb-4 opacity-50" />
          <h2 className="card-title text-2xl mb-4">No Predictions Yet</h2>
          <p className="text-base-content/70 mb-6 max-w-md">
            Make a prediction from the Predict page to see your results here. 
            The results will include hourly, daily, and monthly estimates along with your bill forecast.
          </p>
          <a href="/predict" className="btn btn-primary">
            Go to Predict Page
          </a>
        </div>
      </div>

      {/* Placeholder Results Card (for reference) */}
      <div className="divider">Results Preview (Coming in Phase 4)</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-50 pointer-events-none">
        {/* Hourly Prediction */}
        <div className="card bg-base-200 shadow">
          <div className="card-body">
            <h3 className="card-title text-primary">Hourly Demand</h3>
            <p className="text-4xl font-bold mb-2">2.35 kWh</p>
            <p className="text-sm text-base-content/60">For the specified hour</p>
          </div>
        </div>

        {/* Daily Estimate */}
        <div className="card bg-base-200 shadow">
          <div className="card-body">
            <h3 className="card-title text-secondary">Daily Estimate</h3>
            <p className="text-4xl font-bold mb-2">56.40 kWh</p>
            <p className="text-sm text-base-content/60">If pattern continues all day</p>
          </div>
        </div>

        {/* Monthly Estimate */}
        <div className="card bg-base-200 shadow">
          <div className="card-body">
            <h3 className="card-title text-accent">Monthly Estimate</h3>
            <p className="text-4xl font-bold mb-2">1,692 kWh</p>
            <p className="text-sm text-base-content/60">If pattern continues all month</p>
          </div>
        </div>

        {/* Bill Forecast */}
        <div className="card bg-base-200 shadow">
          <div className="card-body">
            <h3 className="card-title">Monthly Bill</h3>
            <p className="text-4xl font-bold mb-2">₱12,690</p>
            <p className="text-sm text-base-content/60">Estimated cost for the month</p>
          </div>
        </div>
      </div>
    </div>
  );
}
