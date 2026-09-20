import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plus, Sun, Moon, Menu, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext.jsx';
import { Button } from '../common/Button.jsx';

export const Header = () => {
  const { theme, toggleTheme } = useTheme();
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

        {/* Actions (Add Product + Theme Toggle) */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/products/add">
            <Button size="sm" variant="primary">
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </Button>
          </Link>

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
          <div className="pt-2">
            <Link to="/products/add" onClick={() => setMobileMenuOpen(false)}>
              <Button size="sm" variant="primary" className="w-full">
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
