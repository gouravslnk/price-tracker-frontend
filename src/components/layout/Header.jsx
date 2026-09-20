import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Menu, X, Eye, EyeOff } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useScraperMode } from '../../context/ScraperModeContext.jsx';

export const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { isHeaded, toggleHeaded } = useScraperMode();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: 'Dashboard', path: '/' },
    { name: 'Tracked Products', path: '/products' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-ine-950/95 backdrop-blur-xs border-b border-neutral-200 dark:border-ine-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand & Operational Indicator */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 flex items-center justify-center font-bold font-serif text-sm tracking-tighter group-hover:opacity-90 transition-opacity">
              INE
            </div>
            <div>
              <span className="font-serif font-bold text-base tracking-tight text-neutral-950 dark:text-white block leading-none">
                Price Tracker
              </span>
              <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-widest block mt-0.5">
                INE Mock Store
              </span>
            </div>
          </Link>

          {/* System Scraper Status Badge */}
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 bg-neutral-100 dark:bg-ine-900 border border-neutral-200 dark:border-ine-800 text-[11px] font-mono text-neutral-600 dark:text-neutral-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Scraper operational</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider transition-colors ${
                isActive(link.path)
                  ? 'text-neutral-950 dark:text-white font-bold border-b-2 border-neutral-950 dark:border-white'
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Actions (Headed Toggle + Theme Toggle) */}
        <div className="hidden md:flex items-center gap-3">
          
          {/* Observable Headed Browser Run Toggle Button */}
          <button
            onClick={toggleHeaded}
            className={`flex items-center gap-1.5 px-3 py-1.5 border text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
              isHeaded
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 dark:border-emerald-500/40 hover:bg-emerald-500/20'
                : 'bg-neutral-100 dark:bg-ine-900 text-neutral-500 dark:text-neutral-400 border-neutral-200 dark:border-ine-800 hover:text-neutral-950 dark:hover:text-white'
            }`}
            title={isHeaded ? "Visible Browser Mode ON: Scraper browser windows will open on screen" : "Headless Mode: Scraper runs in background without opening a window"}
          >
            {isHeaded ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <Eye className="w-3.5 h-3.5 text-emerald-500" />
                <span>Browser: Visible</span>
              </>
            ) : (
              <>
                <EyeOff className="w-3.5 h-3.5 text-neutral-400" />
                <span>Browser: Headless</span>
              </>
            )}
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white border border-neutral-200 dark:border-ine-800 hover:bg-neutral-100 dark:hover:bg-ine-900 transition-colors cursor-pointer"
            aria-label="Toggle theme"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleHeaded}
            className={`p-2 border text-xs font-mono transition-colors ${
              isHeaded
                ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                : 'text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-ine-800'
            }`}
            title="Toggle visible browser mode"
          >
            {isHeaded ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-ine-800"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-neutral-900 dark:text-white border border-neutral-200 dark:border-ine-800"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-neutral-200 dark:border-ine-800 bg-white dark:bg-ine-950 p-4 space-y-3">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 text-sm font-mono uppercase tracking-wider ${
                isActive(link.path)
                  ? 'bg-neutral-100 dark:bg-ine-900 font-bold text-neutral-950 dark:text-white'
                  : 'text-neutral-600 dark:text-neutral-400'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};
