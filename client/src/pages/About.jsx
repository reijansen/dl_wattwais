import { Link } from 'react-router-dom';
import {
  BadgeInfo,
  Brain,
  CheckCircle2,
  Cpu,
  Layers,
  Server,
  ShieldAlert,
  Sparkles,
  Wallet,
  Zap,
} from 'lucide-react';

import { Card, Metric, Text, Title } from '@tremor/react';
import DaisyAlert from '../components/DaisyAlert';
import DaisyBadge from '../components/DaisyBadge';
import DaisyCard from '../components/DaisyCard';
import DaisyCollapse from '../components/DaisyCollapse';

export default function About() {
  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {/* Hero */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Zap className="w-6 h-6 text-primary" />
          <h1 className="text-5xl font-extrabold tracking-tight">
            About <span className="text-gradient">WattwAIs</span>
          </h1>
        </div>
        <p className="text-base-content/70 text-lg max-w-3xl mx-auto">
          WattwAIs is a household electricity demand prediction app. It predicts hourly household demand and estimates daily/monthly
          usage and an estimated electricity bill (₱) using your provided electricity rate.
        </p>

        <div className="flex flex-wrap justify-center gap-2">
          <DaisyBadge variant="outline">Household demand</DaisyBadge>
          <DaisyBadge variant="outline">Hourly prediction</DaisyBadge>
          <DaisyBadge variant="outline">kWh + ₱ estimates</DaisyBadge>
          <DaisyBadge variant="outline">Deep learning</DaisyBadge>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/predict" className="btn btn-primary btn-lg gap-2">
            <Sparkles className="w-5 h-5" />
            Try a prediction
          </Link>
          <Link to="/" className="btn btn-outline btn-lg">
            Back to home
          </Link>
        </div>
      </div>

      {/* What it does / doesn't */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DaisyCard
          variant="base-200"
          title="What WattwAIs does"
          subtitle="A simple, demo-friendly workflow focused on household-level demand."
          icon={<CheckCircle2 className="w-6 h-6 text-primary" />}
        >
          <ul className="mt-4 space-y-2 text-sm text-base-content/80">
            <li className="flex gap-2">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-base-content/40 flex-shrink-0" />
              <span>Predicts hourly household electricity demand (kWh).</span>
            </li>
            <li className="flex gap-2">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-base-content/40 flex-shrink-0" />
              <span>Estimates daily, weekly, monthly, and annual usage derived from the hourly output.</span>
            </li>
            <li className="flex gap-2">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-base-content/40 flex-shrink-0" />
              <span>Computes estimated bills using the predicted demand and your electricity rate (₱/kWh).</span>
            </li>
          </ul>
        </DaisyCard>

        <DaisyCard
          variant="base-200"
          title="What it does not do"
          subtitle="Clear boundaries to keep results realistic in a demo."
          icon={<ShieldAlert className="w-6 h-6 text-warning" />}
        >
          <ul className="mt-4 space-y-2 text-sm text-base-content/80">
            <li className="flex gap-2">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-base-content/40 flex-shrink-0" />
              <span>Not appliance-level prediction (it does not estimate usage per device).</span>
            </li>
            <li className="flex gap-2">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-base-content/40 flex-shrink-0" />
              <span>Not an official billing calculator (taxes, fixed fees, and utility adjustments vary).</span>
            </li>
          </ul>
        </DaisyCard>
      </div>

      {/* Quick stats */}
      <div className="stats stats-vertical lg:stats-horizontal shadow w-full bg-base-200 border border-base-300">
        <div className="stat">
          <div className="stat-title">Prediction scope</div>
          <div className="stat-value text-primary text-2xl">Household</div>
          <div className="stat-desc">Hourly demand (kWh)</div>
        </div>
        <div className="stat">
          <div className="stat-title">Outputs</div>
          <div className="stat-value text-secondary text-2xl">kWh + ₱</div>
          <div className="stat-desc">Daily, monthly, bill</div>
        </div>
        <div className="stat">
          <div className="stat-title">Designed for</div>
          <div className="stat-value text-accent text-2xl">Demo</div>
          <div className="stat-desc">Beginner-friendly UI</div>
        </div>
      </div>

      {/* How to use */}
      <DaisyCard
        variant="base-200"
        title="How to use WattwAIs"
        subtitle="A quick step-by-step guide for non-technical users."
        icon={<BadgeInfo className="w-6 h-6 text-primary" />}
      >
        <ol className="steps steps-vertical lg:steps-horizontal w-full mt-4">
          <li className="step step-primary">
            <div className="text-left">
              <div className="font-semibold">Set date & time</div>
              <div className="text-sm text-base-content/70">Use current date/time, or adjust for testing.</div>
            </div>
          </li>
          <li className="step step-primary">
            <div className="text-left">
              <div className="font-semibold">Enter rate + temperature</div>
              <div className="text-sm text-base-content/70">Rate from your bill; temperature can auto-fill from local weather.</div>
            </div>
          </li>
          <li className="step step-primary">
            <div className="text-left">
              <div className="font-semibold">Add recent usage values</div>
              <div className="text-sm text-base-content/70">For demo, estimates are acceptable.</div>
            </div>
          </li>
          <li className="step step-primary">
            <div className="text-left">
              <div className="font-semibold">Submit prediction</div>
              <div className="text-sm text-base-content/70">Review hourly, daily, monthly, and bill estimates.</div>
            </div>
          </li>
        </ol>

        <div className="mt-6">
          <DaisyAlert
            type="info"
            icon={<Wallet className="w-6 h-6" />}
            title="Tip"
            message="Estimated bills are computed from predicted demand and your provided electricity rate. Utility bills may differ due to taxes, fixed fees, generation charges, and other adjustments."
          />
        </div>
      </DaisyCard>

      {/* Limitations */}
      <DaisyCard
        variant="base-200"
        title="Limitations"
        subtitle="Honest constraints to set expectations for demo users."
        icon={<ShieldAlert className="w-6 h-6 text-warning" />}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
          <div className="lg:col-span-2">
            <ul className="space-y-2 text-sm text-base-content/80">
              {[
                'Trained using available dataset context; real-world patterns may differ.',
                'Predicts household demand, not appliance-level consumption.',
                'Historical kWh inputs are manually entered for demo purposes.',
                'Smart meter integration would improve usability and data quality.',
                'Estimated bills may differ from official utility bills due to taxes, fixed fees, generation charges, and other adjustments.',
              ].map((t) => (
                <li key={t} className="flex gap-2">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-base-content/40 flex-shrink-0" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <Card className="bg-base-100 border border-base-300 shadow-sm min-w-0">
            <Title className="text-base-content">Demo-friendly</Title>
            <Text className="text-base-content/70 mt-1">
              The UI is designed to be easy to use, even if you only have approximate values.
            </Text>
            <div className="mt-4">
              <Text className="text-base-content/70">Focus</Text>
              <Metric className="text-base-content tabular-nums text-3xl sm:text-4xl leading-tight">Household</Metric>
            </div>
          </Card>
        </div>
      </DaisyCard>

      {/* Technical stack + architecture */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DaisyCard
          variant="base-200"
          title="Technical stack"
          subtitle="Organized by frontend, backend, and machine learning."
          icon={<Layers className="w-6 h-6 text-primary" />}
        >
          <div className="mt-4 space-y-3">
            <DaisyCollapse title="Frontend (UI)" defaultOpen>
              <div className="flex flex-wrap gap-2 pt-2">
                <DaisyBadge variant="outline">React</DaisyBadge>
                <DaisyBadge variant="outline">Vite</DaisyBadge>
                <DaisyBadge variant="outline">Tailwind CSS</DaisyBadge>
                <DaisyBadge variant="outline">DaisyUI</DaisyBadge>
                <DaisyBadge variant="outline">Tremor (analytics)</DaisyBadge>
              </div>
            </DaisyCollapse>

            <DaisyCollapse title="Backend (API + inference runner)">
              <div className="flex flex-wrap gap-2 pt-2">
                <DaisyBadge variant="outline">Node.js</DaisyBadge>
                <DaisyBadge variant="outline">Express</DaisyBadge>
                <DaisyBadge variant="outline">Python child process</DaisyBadge>
              </div>
            </DaisyCollapse>

            <DaisyCollapse title="Machine learning">
              <div className="flex flex-wrap gap-2 pt-2">
                <DaisyBadge variant="outline">TensorFlow / Keras</DaisyBadge>
                <DaisyBadge variant="outline">scikit-learn</DaisyBadge>
                <DaisyBadge variant="outline">ColumnTransformer</DaisyBadge>
                <DaisyBadge variant="outline">StandardScaler</DaisyBadge>
                <DaisyBadge variant="outline">OneHotEncoder</DaisyBadge>
              </div>
            </DaisyCollapse>
          </div>
        </DaisyCard>

        <DaisyCard
          variant="base-200"
          title="Project architecture"
          subtitle="High-level flow from user input to model output."
          icon={<Cpu className="w-6 h-6 text-secondary" />}
        >
          <div className="mt-4 bg-base-100 border border-base-300 rounded-2xl p-6">
            <ol className="steps steps-vertical w-full">
              <li className="step step-primary">
                <div className="text-left">
                  <div className="font-semibold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    User inputs
                  </div>
                  <div className="text-sm text-base-content/70">Date/time, rate, temperature, recent usage values.</div>
                </div>
              </li>
              <li className="step step-primary">
                <div className="text-left">
                  <div className="font-semibold flex items-center gap-2">
                    <Server className="w-4 h-4 text-secondary" />
                    Express backend
                  </div>
                  <div className="text-sm text-base-content/70">Validates inputs and calls Python inference.</div>
                </div>
              </li>
              <li className="step step-primary">
                <div className="text-left">
                  <div className="font-semibold flex items-center gap-2">
                    <Brain className="w-4 h-4 text-accent" />
                    Python inference
                  </div>
                  <div className="text-sm text-base-content/70">Loads preprocessor + Keras model and runs prediction.</div>
                </div>
              </li>
              <li className="step step-primary">
                <div className="text-left">
                  <div className="font-semibold flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-warning" />
                    Response + dashboard
                  </div>
                  <div className="text-sm text-base-content/70">Returns estimates and renders analytics in the UI.</div>
                </div>
              </li>
            </ol>
          </div>
        </DaisyCard>
      </div>
    </div>
  );
}

