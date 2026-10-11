import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-xl mx-auto py-16 text-center space-y-6 animate-in fade-in duration-300">
      <Card className="p-8 space-y-6 border-emerald-900/15 dark:border-emerald-500/20">
        <div className="p-4 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 w-16 h-16 mx-auto flex items-center justify-center">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider font-heading">
            Error 404 — Page Not Found
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-emerald-50">
            Resource Out of Bounds
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-emerald-100/70 leading-relaxed">
            The page or safety route you are trying to access does not exist or has been moved.
          </p>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <Button
            variant="primary"
            icon={<Home className="w-4 h-4" />}
            onClick={() => navigate('/')}
          >
            Return to Home
          </Button>

          <Button
            variant="outline"
            icon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </div>
      </Card>
    </div>
  );
};
