import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

const ScraperModeContext = createContext();

export function ScraperModeProvider({ children }) {
  const [isHeaded, setIsHeaded] = useState(() => {
    const saved = localStorage.getItem('ine_scraper_headed');
    return saved !== null ? saved === 'true' : true; // Default to true so headed mode works out of the box for demos
  });

  const toggleHeaded = () => {
    setIsHeaded(prev => {
      const next = !prev;
      localStorage.setItem('ine_scraper_headed', String(next));
      if (next) {
        toast.info('Visible Browser Mode [ON]: Scraper browser will open visibly on screen.');
      } else {
        toast.info('Headless Mode [ON]: Scraper runs silently in background.');
      }
      return next;
    });
  };

  return (
    <ScraperModeContext.Provider value={{ isHeaded, setIsHeaded, toggleHeaded }}>
      {children}
    </ScraperModeContext.Provider>
  );
}

export function useScraperMode() {
  const context = useContext(ScraperModeContext);
  if (!context) {
    throw new Error('useScraperMode must be used within a ScraperModeProvider');
  }
  return context;
}
