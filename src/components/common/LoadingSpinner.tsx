import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading food safety data...',
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 space-y-3 ${className}`}>
      <div className="relative flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-emerald-200 dark:border-emerald-950 border-t-emerald-600 dark:border-t-emerald-400 animate-spin" />
        <Loader2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 absolute animate-pulse" />
      </div>
      {message && (
        <p className="text-xs font-semibold text-slate-500 dark:text-emerald-300/80 tracking-wide font-heading">
          {message}
        </p>
      )}
    </div>
  );
};
