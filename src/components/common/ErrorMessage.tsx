import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface ErrorMessageProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'Failed to load data',
  message = 'Unable to connect to the backend server. Please verify your connection or try again shortly.',
  onRetry,
}) => {
  return (
    <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-slate-800 dark:text-amber-200 space-y-4 max-w-xl mx-auto my-8">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-400 shrink-0">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-bold font-heading text-slate-900 dark:text-amber-100">
            {title}
          </h3>
          <p className="text-xs text-slate-600 dark:text-amber-200/80 leading-relaxed">
            {message}
          </p>
        </div>
      </div>

      {onRetry && (
        <div className="pt-2 flex justify-end">
          <Button
            variant="secondary"
            size="sm"
            onClick={onRetry}
            icon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Retry Request
          </Button>
        </div>
      )}
    </div>
  );
};
