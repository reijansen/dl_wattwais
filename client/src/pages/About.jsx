import { Code2, Brain, Server, Database, CheckCircle2 } from 'lucide-react';
import DaisyBadge from '../components/DaisyBadge';
import DaisyCard from '../components/DaisyCard';

export default function About() {
  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-3">
          About <span className="text-gradient">WattwAIs</span>
        </h1>
        <p className="text-base-content/70 text-lg">
          AI-powered electricity demand prediction with a clean, beginner-friendly workflow.
        </p>
      </div>

      <DaisyCard variant="base-200" title="Our Mission" className="shadow-lg">
        <p className="text-base-content/80 leading-relaxed">
          WattwAIs helps you estimate hourly electricity demand and understand how it could translate into daily/monthly usage and
          bills. Under the hood, it uses a deep learning model (Keras/TensorFlow) trained on historical usage patterns. The goal is
          clarity: simple inputs, fast predictions, and a UI that makes results easy to interpret.
        </p>
      </DaisyCard>

      <div>
        <h2 className="text-3xl font-bold text-center mb-8">Technology Stack</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DaisyCard variant="base-200" className="shadow">
            <div className="flex flex-col items-center text-center gap-3">
              <Code2 className="w-10 h-10 text-primary" />
              <div className="text-lg font-bold">Frontend</div>
              <div className="flex flex-wrap justify-center gap-2">
                <DaisyBadge variant="outline">React</DaisyBadge>
                <DaisyBadge variant="outline">Vite</DaisyBadge>
                <DaisyBadge variant="outline">Tailwind</DaisyBadge>
                <DaisyBadge variant="outline">DaisyUI</DaisyBadge>
              </div>
            </div>
          </DaisyCard>

          <DaisyCard variant="base-200" className="shadow">
            <div className="flex flex-col items-center text-center gap-3">
              <Server className="w-10 h-10 text-secondary" />
              <div className="text-lg font-bold">Backend</div>
              <div className="flex flex-wrap justify-center gap-2">
                <DaisyBadge variant="outline">Node</DaisyBadge>
                <DaisyBadge variant="outline">Express</DaisyBadge>
                <DaisyBadge variant="outline">CORS</DaisyBadge>
              </div>
            </div>
          </DaisyCard>

          <DaisyCard variant="base-200" className="shadow">
            <div className="flex flex-col items-center text-center gap-3">
              <Brain className="w-10 h-10 text-accent" />
              <div className="text-lg font-bold">ML Engine</div>
              <div className="flex flex-wrap justify-center gap-2">
                <DaisyBadge variant="outline">Python</DaisyBadge>
                <DaisyBadge variant="outline">TensorFlow</DaisyBadge>
                <DaisyBadge variant="outline">Keras</DaisyBadge>
                <DaisyBadge variant="outline">scikit-learn</DaisyBadge>
              </div>
            </div>
          </DaisyCard>

          <DaisyCard variant="base-200" className="shadow">
            <div className="flex flex-col items-center text-center gap-3">
              <Database className="w-10 h-10 text-warning" />
              <div className="text-lg font-bold">Data</div>
              <div className="flex flex-wrap justify-center gap-2">
                <DaisyBadge variant="outline">Pandas</DaisyBadge>
                <DaisyBadge variant="outline">NumPy</DaisyBadge>
                <DaisyBadge variant="outline">JSON API</DaisyBadge>
              </div>
            </div>
          </DaisyCard>
        </div>
      </div>

      <DaisyCard variant="base-200" title="Key Features" className="shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
          {[
            { title: 'Deep learning predictions', text: 'Keras/TensorFlow model trained on historical usage patterns.' },
            { title: 'Fast results', text: 'Backend inference returns estimates quickly for interactive UX.' },
            { title: 'Bill estimation', text: 'Monthly bill is calculated from your input rate.' },
            { title: 'Beginner-friendly', text: 'No database, no auth, no complex setup.' },
          ].map((f) => (
            <div key={f.title} className="flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <div className="font-semibold">{f.title}</div>
                <div className="text-sm text-base-content/70">{f.text}</div>
              </div>
            </div>
          ))}
        </div>
      </DaisyCard>
    </div>
  );
}
