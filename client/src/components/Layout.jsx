import Navbar from './Navbar';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="bg-base-200 border-t border-base-300 py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-base-content/60 text-sm">
            © 2026 WattwAIs - Electricity Demand Prediction
          </p>
          <p className="text-base-content/40 text-xs mt-2">
            Powered by React, Express.js, and Machine Learning
          </p>
        </div>
      </footer>
    </div>
  );
}
