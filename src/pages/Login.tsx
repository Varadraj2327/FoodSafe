import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { Logo } from '../components/common/Logo';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { ShieldCheck, Lock, User, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/profile';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please enter your username/email and password.');
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
    <div className="min-h-[80vh] flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -z-10" />

      <div className="w-full max-w-md space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-block">
            <Logo size="lg" />
          </div>
          <h1 className="text-2xl font-bold font-heading text-slate-900 dark:text-emerald-50">
            Welcome Back to FoodSafe
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Sign in to track your safety quizzes, save favorite commodities, and view personal insights.
          </p>
        </div>

        {/* Login Card */}
        <Card className="p-8 space-y-6 border-emerald-900/15 dark:border-emerald-500/20 shadow-xl">
          
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-base font-bold font-heading text-slate-900 dark:text-emerald-50">
                User Sign In
              </h2>
            </div>
            <Link
              to="/register"
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Need an account?
            </Link>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Username or Email Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-emerald-200">
                Username or Email Address
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="enter username or email"
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 dark:text-emerald-200">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
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
              {loading ? 'Authenticating...' : 'Sign In'}
            </Button>

          </form>

          {/* Footer Navigation Links */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Don't have an account?</span>
            <Link
              to="/register"
              className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Create Free Account →
            </Link>
          </div>

          <div className="text-center">
            <Link
              to="/admin/login"
              className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-emerald-400 underline"
            >
              Are you an Administrator? Access Admin Portal
            </Link>
          </div>

        </Card>

      </div>
    </div>
  );
};
