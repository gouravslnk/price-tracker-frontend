import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/common/Button.jsx';

export const NotFound = () => {
  return (
    <div className="py-20 text-center space-y-4 max-w-md mx-auto">
      <div className="text-6xl font-serif font-bold text-neutral-950 dark:text-white">
        404
      </div>
      <h1 className="font-serif font-bold text-2xl text-neutral-900 dark:text-white">
        Page Not Found
      </h1>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed font-sans">
        The page or product route you are trying to access does not exist or may have been moved.
      </p>
      <div className="pt-4">
        <Link to="/">
          <Button variant="primary">
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            <span>Back to Dashboard</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};
