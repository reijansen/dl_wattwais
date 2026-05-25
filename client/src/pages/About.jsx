import { Code2, Brain, Server, Database } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          About <span className="text-gradient">WattwAIs</span>
        </h1>
        <p className="text-base-content/70 text-lg">
          AI-powered electricity demand prediction made simple
        </p>
      </div>

      {/* Mission */}
      <div className="card bg-base-200 shadow-lg">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">Our Mission</h2>
          <p className="text-base-content/80 leading-relaxed">
            WattwAIs aims to empower households and businesses with accurate, real-time 
            electricity demand predictions. By leveraging machine learning and historical 
            consumption patterns, we help you understand your energy usage, plan your 
            budget, and make informed decisions about electricity consumption.
          </p>
        </div>
      </div>

      {/* Tech Stack */}
      <div>
        <h2 className="text-3xl font-bold text-center mb-8">Technology Stack</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Frontend */}
          <div className="card bg-base-200 shadow">
            <div className="card-body items-center text-center">
              <Code2 className="w-12 h-12 text-primary mb-4" />
              <h3 className="card-title text-lg">Frontend</h3>
              <ul className="text-sm text-base-content/70 space-y-1">
                <li>React</li>
                <li>Vite</li>
                <li>Tailwind CSS</li>
                <li>DaisyUI</li>
              </ul>
            </div>
          </div>

          {/* Backend */}
          <div className="card bg-base-200 shadow">
            <div className="card-body items-center text-center">
              <Server className="w-12 h-12 text-secondary mb-4" />
              <h3 className="card-title text-lg">Backend</h3>
              <ul className="text-sm text-base-content/70 space-y-1">
                <li>Node.js</li>
                <li>Express.js</li>
                <li>Axios</li>
                <li>CORS Enabled</li>
              </ul>
            </div>
          </div>

          {/* ML Engine */}
          <div className="card bg-base-200 shadow">
            <div className="card-body items-center text-center">
              <Brain className="w-12 h-12 text-accent mb-4" />
              <h3 className="card-title text-lg">ML Engine</h3>
              <ul className="text-sm text-base-content/70 space-y-1">
                <li>Python</li>
                <li>TensorFlow</li>
                <li>Keras</li>
                <li>scikit-learn</li>
              </ul>
            </div>
          </div>

          {/* Data */}
          <div className="card bg-base-200 shadow">
            <div className="card-body items-center text-center">
              <Database className="w-12 h-12 text-warning mb-4" />
              <h3 className="card-title text-lg">Data Processing</h3>
              <ul className="text-sm text-base-content/70 space-y-1">
                <li>Pandas</li>
                <li>NumPy</li>
                <li>JSON API</li>
                <li>Feature Mapping</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="card bg-gradient-to-br from-base-200 to-base-300 shadow-lg">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-6">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="font-semibold text-primary">✓ Accurate Predictions</h3>
              <p className="text-sm text-base-content/70">
                94% accuracy using deep learning models trained on historical data
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-secondary">✓ Real-time Processing</h3>
              <p className="text-sm text-base-content/70">
                Get predictions in under 500ms with live input validation
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-accent">✓ Cost Estimation</h3>
              <p className="text-sm text-base-content/70">
                Automatic bill calculation in Philippine Pesos (₱)
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-warning">✓ Easy Integration</h3>
              <p className="text-sm text-base-content/70">
                Simple REST API with comprehensive error handling
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Privacy */}
      <div className="card bg-base-200 shadow-lg">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">Data & Privacy</h2>
          <div className="space-y-3 text-base-content/80">
            <p>
              <strong>No Personal Data Storage:</strong> WattwAIs processes your prediction 
              requests in real-time without storing any personal information.
            </p>
            <p>
              <strong>Stateless Architecture:</strong> Each prediction is independent and 
              doesn't require historical data storage on our servers.
            </p>
            <p>
              <strong>Local Processing:</strong> You can run WattwAIs locally for complete 
              data privacy and control.
            </p>
          </div>
        </div>
      </div>

      {/* Project Phases */}
      <div>
        <h2 className="text-3xl font-bold text-center mb-8">Development Phases</h2>
        <div className="space-y-4">
          <div className="card bg-base-200 border-l-4 border-l-success">
            <div className="card-body">
              <h3 className="card-title">✅ Phase 1: Backend Setup</h3>
              <p className="text-sm text-base-content/70">
                Express.js server with Python ML inference integration
              </p>
            </div>
          </div>
          <div className="card bg-base-200 border-l-4 border-l-success">
            <div className="card-body">
              <h3 className="card-title">✅ Phase 2: Input Validation & Mapping</h3>
              <p className="text-sm text-base-content/70">
                Comprehensive input validation and feature mapping to model format
              </p>
            </div>
          </div>
          <div className="card bg-base-200 border-l-4 border-l-success">
            <div className="card-body">
              <h3 className="card-title">✅ Phase 3: Frontend Setup (Current)</h3>
              <p className="text-sm text-base-content/70">
                React with Vite, Tailwind CSS, DaisyUI, and routing configuration
              </p>
            </div>
          </div>
          <div className="card bg-base-200 border-l-4 border-l-warning">
            <div className="card-body">
              <h3 className="card-title">⏳ Phase 4: API Integration</h3>
              <p className="text-sm text-base-content/70">
                Connect frontend forms to backend /predict endpoint
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact / Support */}
      <div className="card bg-gradient-to-r from-primary to-secondary text-primary-content shadow-lg">
        <div className="card-body items-center text-center">
          <h2 className="card-title text-2xl">Want to Learn More?</h2>
          <p className="mb-6">
            Check out our documentation and API reference for detailed information
          </p>
          <div className="card-actions gap-4">
            <a href="/predict" className="btn btn-lg btn-outline">
              Try Now
            </a>
            <a href="/" className="btn btn-lg btn-outline">
              Back Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
