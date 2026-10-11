import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { Logo } from '../../components/common/Logo';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Shield, Lock, User, AlertCircle, ArrowRight } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await login(username.trim(), password.trim());
      navigate(from, { replace: true });
    } catch (err: unknown) {
      console.error('Login error:', err);
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const responseData = (err as { response?: { data?: { detail?: string } } }).response?.data;
        if (responseData?.detail) {
          setError(responseData.detail);
        } else {
          setError('Invalid credentials or backend server unreachable.');
        }
      } else {
        setError('Invalid credentials or backend server unreachable.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      
      {/* Background Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -z-10" />

      <div className="w-full max-w-md space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-block">
            <Logo size="lg" />
          </div>
          <p className="text-xs font-semibold text-slate-500 dark:text-emerald-300 font-heading uppercase tracking-wider">
            Admin Management Portal
          </p>
        </div>

        {/* Login Card */}
        <Card className="p-8 space-y-6 border-emerald-900/15 dark:border-emerald-500/20 shadow-xl">
          
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-lg font-bold font-heading text-slate-900 dark:text-emerald-50">
              Administrator Sign In
            </h2>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Username Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-emerald-200">
                Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-emerald-200">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full justify-center mt-2"
              disabled={loading}
              icon={loading ? undefined : <ArrowRight className="w-4 h-4" />}
            >
              {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
            </Button>

          </form>

          {/* Credentials Hint Box */}
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/40 text-[11px] text-slate-600 dark:text-emerald-300/80 space-y-1">
            <div className="font-bold text-emerald-800 dark:text-emerald-300 font-heading">
              Default Seeded Credentials:
            </div>
            <div>Username: <code className="font-mono text-emerald-700 dark:text-emerald-200 font-bold">admin</code></div>
            <div>Password: <code className="font-mono text-emerald-700 dark:text-emerald-200 font-bold">admin123</code></div>
          </div>

        </Card>

      </div>
    </div>
  );
};
