import Navbar from './Navbar';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-base-100 flex flex-col overflow-x-hidden">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-6 lg:py-8">{children}</main>
      <footer className="footer footer-center bg-base-200 text-base-content border-t border-base-300 py-4">
        <aside className="text-xs text-base-content/60">
          <p>© 2026 WattwAIs</p>
        </aside>
      </footer>
    </div>
  );
}

