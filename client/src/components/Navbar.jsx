import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Sun, Moon, Hexagon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useSettings } from '../context/SettingsContext';
import logo from '../../assets/swastik-logo.png';

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/programs', label: 'Academics' },
  { to: '/notices', label: 'Notice Board' },
  { to: '/about', label: 'About' },
  { to: '/faculty', label: 'Faculty' },
  { to: '/contact', label: 'Admissions' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { settings } = useSettings();

  return (
    <header className="sticky top-0 z-40 bg-paper/90 dark:bg-navy-900/90 backdrop-blur border-b border-navy-100 dark:border-navy-700">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 shrink-0" onClick={() => setOpen(false)}>
          <img src={logo} alt="Logo" className="h-10" />
          {/* <span className="font-display font-semibold text-lg text-navy dark:text-paper">
            {settings.collegeName}
          </span> */}
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-marigold-600 dark:text-marigold-300'
                    : 'text-navy-600 dark:text-navy-100 hover:text-marigold-600 dark:hover:text-marigold-300'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="p-2 rounded-full text-navy-600 dark:text-navy-100 hover:bg-navy-100 dark:hover:bg-navy-700 transition-colors"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Link
            to="/contact"
            className="bg-marigold hover:bg-marigold-500 text-navy-900 font-semibold text-sm px-4 py-2 rounded-full transition-colors"
          >
            Apply Now
          </Link>
        </div>

        <button
          className="md:hidden p-2 text-navy-700 dark:text-paper"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-navy-100 dark:border-navy-700 bg-paper dark:bg-navy-900 px-4 pb-4">
          <div className="flex flex-col gap-1 pt-2">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `py-2.5 text-sm font-medium border-b border-navy-100 dark:border-navy-700 ${
                    isActive ? 'text-marigold-600' : 'text-navy-700 dark:text-navy-100'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <div className="flex items-center justify-between pt-3">
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 text-sm text-navy-600 dark:text-navy-100"
              >
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                {theme === 'dark' ? 'Light mode' : 'Dark mode'}
              </button>
              <Link
                to="/contact"
                onClick={() => setOpen(false)}
                className="bg-marigold text-navy-900 font-semibold text-sm px-4 py-2 rounded-full"
              >
                Apply Now
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
