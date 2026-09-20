import React from 'react';
import { Header } from './Header.jsx';

export const AppShell = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-ine-950 text-neutral-900 dark:text-neutral-100 font-sans antialiased">
      <Header />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="w-full border-t border-neutral-200 dark:border-ine-900 py-6 mt-12 bg-neutral-50/50 dark:bg-ine-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-500 dark:text-neutral-500">
          <div>
            INE PRICE TRACKER &middot; EVERYDAY GOODS, HONESTLY MONITORED
          </div>
          <div>
            CONNECTING TO INE MOCK STORE API
          </div>
        </div>
      </footer>
    </div>
  );
};
