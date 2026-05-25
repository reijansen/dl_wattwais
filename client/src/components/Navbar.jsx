import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Moon, Sun, Zap, Menu } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const [isDark, setIsDark] = useState(false);

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches;
    const next = stored || (prefersDark ? 'dark' : 'light');

    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    setIsDark(next === 'dark');
  }, []);

  const navLinks = (
    <>
      <li>
        <Link to="/" className={isActive('/') ? 'active' : ''}>
          Home
        </Link>
      </li>
      <li>
        <Link to="/predict" className={isActive('/predict') ? 'active' : ''}>
          Predict
        </Link>
      </li>
      <li>
        <Link to="/results" className={isActive('/results') ? 'active' : ''}>
          Results
        </Link>
      </li>
      <li>
        <Link to="/about" className={isActive('/about') ? 'active' : ''}>
          About
        </Link>
      </li>
    </>
  );

  return (
    <nav className="navbar bg-base-100 border-b border-base-300 sticky top-0 z-50">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost gap-2 text-xl">
          <Zap className="w-6 h-6 text-primary" />
          <span className="text-gradient font-bold">WattwAIs</span>
        </Link>
      </div>

      <div className="flex-none gap-2">
        {/* Mobile menu */}
        <div className="dropdown dropdown-end lg:hidden">
          <label tabIndex={0} className="btn btn-ghost btn-circle">
            <Menu className="w-5 h-5" />
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-200 border border-base-300 rounded-box w-52"
          >
            {navLinks}
          </ul>
        </div>

        {/* Desktop links */}
        <ul className="menu menu-horizontal px-1 hidden lg:flex">{navLinks}</ul>

        {/* Theme toggle */}
        <div className="tooltip tooltip-bottom" data-tip={isDark ? 'Switch to light' : 'Switch to dark'}>
          <button
            type="button"
            className="btn btn-ghost btn-circle"
            aria-label="Toggle theme"
            onClick={() => {
              const next = isDark ? 'light' : 'dark';
              document.documentElement.setAttribute('data-theme', next);
              localStorage.setItem('theme', next);
              setIsDark(!isDark);
            }}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </nav>
  );
}
