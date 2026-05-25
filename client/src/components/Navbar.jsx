import { Link, useLocation } from 'react-router-dom';
import { Zap } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar bg-base-100 border-b border-base-300 sticky top-0 z-50">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost gap-2 text-xl">
          <Zap className="w-6 h-6 text-primary" />
          <span className="text-gradient font-bold">WattwAIs</span>
        </Link>
      </div>

      <div className="flex-none gap-2">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link
              to="/"
              className={isActive('/') ? 'active' : ''}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/predict"
              className={isActive('/predict') ? 'active' : ''}
            >
              Predict
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className={isActive('/about') ? 'active' : ''}
            >
              About
            </Link>
          </li>
        </ul>

        {/* Theme toggle button */}
        <div className="form-control">
          <label className="label cursor-pointer">
            <input
              type="checkbox"
              className="toggle toggle-primary"
              onChange={(e) => {
                if (e.target.checked) {
                  document.documentElement.setAttribute('data-theme', 'dark');
                  localStorage.setItem('theme', 'dark');
                } else {
                  document.documentElement.setAttribute('data-theme', 'light');
                  localStorage.setItem('theme', 'light');
                }
              }}
              defaultChecked={localStorage.getItem('theme') === 'dark'}
            />
          </label>
        </div>
      </div>
    </nav>
  );
}
