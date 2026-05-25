import { Link } from 'react-router-dom';
import { Zap, TrendingDown, Clock, DollarSign } from 'lucide-react';

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="hero min-h-[500px] bg-gradient-to-br from-base-200 to-base-300 rounded-lg">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold text-gradient mb-4">
              WattwAIs
            </h1>
            <p className="text-lg text-base-content/80 mb-8">
              Predict your electricity demand with AI-powered accuracy. Plan your energy consumption and manage your bills smarter.
            </p>
            <Link to="/predict" className="btn btn-primary btn-lg gap-2">
              <Zap className="w-5 h-5" />
              Start Predicting
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div>
        <h2 className="text-4xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="card bg-base-200 shadow-lg">
            <div className="card-body items-center text-center">
              <TrendingDown className="w-12 h-12 text-primary mb-4" />
              <h3 className="card-title text-xl">Accurate Predictions</h3>
              <p className="text-base-content/70">
                Machine learning model trained on real electricity usage patterns
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="card bg-base-200 shadow-lg">
            <div className="card-body items-center text-center">
              <Clock className="w-12 h-12 text-secondary mb-4" />
              <h3 className="card-title text-xl">Real-time Analysis</h3>
              <p className="text-base-content/70">
                Get instant predictions based on current conditions and historical data
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="card bg-base-200 shadow-lg">
            <div className="card-body items-center text-center">
              <DollarSign className="w-12 h-12 text-accent mb-4" />
              <h3 className="card-title text-xl">Cost Estimation</h3>
              <p className="text-base-content/70">
                Plan your monthly electricity budget with accurate bill forecasts
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats shadow w-full bg-base-200">
        <div className="stat">
          <div className="stat-title">Accuracy</div>
          <div className="stat-value text-primary">94%</div>
        </div>
        <div className="stat">
          <div className="stat-title">Predictions</div>
          <div className="stat-value text-secondary">1000+</div>
        </div>
        <div className="stat">
          <div className="stat-title">Avg. Response Time</div>
          <div className="stat-value text-accent">&lt; 500ms</div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="card bg-gradient-to-r from-primary to-secondary text-primary-content">
        <div className="card-body items-center text-center">
          <h2 className="card-title text-3xl">Ready to predict your energy?</h2>
          <p className="text-lg mb-6">
            Use our AI-powered prediction tool to estimate your electricity demand
          </p>
          <Link to="/predict" className="btn btn-lg gap-2 btn-outline">
            <Zap className="w-5 h-5" />
            Go to Prediction Tool
          </Link>
        </div>
      </div>
    </div>
  );
}
