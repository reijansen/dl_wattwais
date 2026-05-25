import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import DaisyCard from '../components/DaisyCard';

export default function Results() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-3">
          <span className="text-gradient">Prediction</span> Results
        </h1>
        <p className="text-base-content/70 text-lg">Your electricity demand forecast and bill estimation</p>
      </div>

      <DaisyCard variant="base-200" className="shadow-lg">
        <div className="flex flex-col items-center text-center py-10">
          <AlertCircle className="w-16 h-16 text-warning mb-4 opacity-80" />
          <h2 className="text-2xl font-bold mb-2">No saved results yet</h2>
          <p className="text-base-content/70 mb-6 max-w-md">
            Results are shown right after you run a prediction. To keep WattwAIs simple and beginner-friendly, we don't store
            predictions yet (no database/auth).
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/predict" className="btn btn-primary">
              Go to Predict
            </Link>
            <Link to="/" className="btn btn-ghost">
              Back Home
            </Link>
          </div>
        </div>
      </DaisyCard>
    </div>
  );
}

