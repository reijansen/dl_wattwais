import { Link } from 'react-router-dom';
import { ArrowRight, Clock, DollarSign, Sparkles, TrendingDown, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-7">
          <div className="flex flex-wrap gap-2 mb-4">
            <div className="badge badge-outline">Deep learning</div>
            <div className="badge badge-outline">Demand forecast</div>
            <div className="badge badge-outline">₱ bill estimate</div>
          </div>

          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-tight">
            Predict electricity demand,
            <span className="text-gradient"> understand your bill</span>
          </h1>

          <p className="mt-4 text-lg text-base-content/75 max-w-2xl">
            WattwAIs uses a deep learning model to estimate hourly electricity demand and translate it into daily/monthly usage and an
            estimated monthly bill (₱).
          </p>

          <div className="mt-7 flex flex-col sm:flex-row gap-3">
            <Link to="/predict" className="btn btn-primary btn-lg gap-2">
              <Zap className="w-5 h-5" />
              Start prediction
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/about" className="btn btn-outline btn-lg gap-2">
              <Sparkles className="w-5 h-5" />
              How it works
            </Link>
          </div>

          <ul className="mt-8 text-sm text-base-content/70 space-y-2 max-w-xl">
            <li className="flex gap-2">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-base-content/40 flex-shrink-0" />
              <span>Use it for budget planning and quick “what-if” checks.</span>
            </li>
            <li className="flex gap-2">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-base-content/40 flex-shrink-0" />
              <span>Outputs include kWh estimates and an estimated monthly bill in ₱.</span>
            </li>
            <li className="flex gap-2">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-base-content/40 flex-shrink-0" />
              <span>No accounts, no database—results are shown instantly after prediction.</span>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-5">
          <div className="bg-base-200 border border-base-300 rounded-2xl p-6 lg:p-8">
            <h2 className="text-xl font-bold">A simple workflow</h2>
            <p className="text-base-content/70 mt-1">Three quick steps to get a forecast.</p>

            <ol className="mt-5 steps steps-vertical w-full">
              <li className="step step-primary">
                <div className="text-left">
                  <div className="font-semibold">Enter inputs</div>
                  <div className="text-sm text-base-content/70">Hour, temperature, and a few historical usage values.</div>
                </div>
              </li>
              <li className="step step-primary">
                <div className="text-left">
                  <div className="font-semibold">Predict</div>
                  <div className="text-sm text-base-content/70">Backend runs deep learning inference and returns estimates.</div>
                </div>
              </li>
              <li className="step step-primary">
                <div className="text-left">
                  <div className="font-semibold">Review results</div>
                  <div className="text-sm text-base-content/70">See kWh estimates and an estimated monthly bill in ₱.</div>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </div>

      {/* Features */}
      <div>
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold">Key Features</h2>
          <p className="text-base-content/70 mt-2">Designed for clarity: minimal inputs, readable outputs.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card bg-base-200 border border-base-300 shadow-sm">
            <div className="card-body items-center text-center gap-3 p-8">
              <TrendingDown className="w-12 h-12 text-primary" />
              <h3 className="text-xl font-bold">Accurate Predictions</h3>
              <p className="text-base-content/70">A deep learning model trained on historical electricity usage patterns.</p>
            </div>
          </div>

          <div className="card bg-base-200 border border-base-300 shadow-sm">
            <div className="card-body items-center text-center gap-3 p-8">
              <Clock className="w-12 h-12 text-secondary" />
              <h3 className="text-xl font-bold">Fast Workflow</h3>
              <p className="text-base-content/70">Input validation + inference designed to feel responsive and predictable.</p>
            </div>
          </div>

          <div className="card bg-base-200 border border-base-300 shadow-sm">
            <div className="card-body items-center text-center gap-3 p-8">
              <DollarSign className="w-12 h-12 text-accent" />
              <h3 className="text-xl font-bold">Bill Estimation</h3>
              <p className="text-base-content/70">Estimate daily/monthly usage and a monthly bill based on your rate.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="stats stats-vertical lg:stats-horizontal shadow w-full bg-base-200 border border-base-300">
        <div className="stat">
          <div className="stat-title">Model type</div>
          <div className="stat-value text-primary text-2xl">Deep Learning</div>
          <div className="stat-desc">TensorFlow / Keras</div>
        </div>
        <div className="stat">
          <div className="stat-title">Outputs</div>
          <div className="stat-value text-secondary text-2xl">kWh + ₱</div>
          <div className="stat-desc">Hourly, daily, monthly, bill</div>
        </div>
        <div className="stat">
          <div className="stat-title">Privacy</div>
          <div className="stat-value text-accent text-2xl">No storage</div>
          <div className="stat-desc">No DB / no auth</div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center py-2">
        <h2 className="text-3xl font-bold">Ready to predict your energy?</h2>
        <p className="text-base-content/70 mt-2 mb-6">Run a forecast and see how your inputs affect estimated usage and bill (₱).</p>
        <div className="flex justify-center">
          <Link to="/predict" className="btn btn-lg gap-2 btn-primary">
            <Zap className="w-5 h-5" />
            Go to Prediction Tool
          </Link>
        </div>
      </div>
    </div>
  );
}

