import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { Logo } from '../components/common/Logo';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { UserPlus, Lock, User, Mail, AlertCircle, ArrowRight, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

export const Register: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!username.trim() || !email.trim() || !password.trim()) {
      setError('Please fill out all required fields.');
      return;
    }

    if (username.trim().length < 3) {
      setError('Username must be at least 3 characters in length.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters in length.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter your password.');
      return;
    }

    try {
      setLoading(true);
      await register({
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password: password.trim(),
        full_name: fullName.trim() || undefined,
      });
      navigate('/profile', { replace: true });
    } catch (err: unknown) {
      console.error('Registration error:', err);
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const responseData = (err as { response?: { data?: { detail?: string } } }).response?.data;
        if (responseData?.detail) {
          setError(responseData.detail);
        } else {
          setError('Could not complete registration. Please check your inputs and try again.');
        }
      } else {
        setError('Could not complete registration. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 relative overflow-hidden py-10">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -z-10" />

      <div className="w-full max-w-md space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-block">
            <Logo size="lg" />
          </div>
          <h1 className="text-2xl font-bold font-heading text-slate-900 dark:text-emerald-50">
            Create Your FoodSafe Account
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Join our consumer awareness portal to save favorite commodities and track food safety quiz progress.
          </p>
        </div>

        {/* Register Card */}
        <Card className="p-8 space-y-6 border-emerald-900/15 dark:border-emerald-500/20 shadow-xl">
          
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-base font-bold font-heading text-slate-900 dark:text-emerald-50">
                Consumer Registration
              </h2>
            </div>
            <Link
              to="/login"
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Already registered?
            </Link>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name Input (Optional) */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-emerald-200">
                Full Name <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Jane Doe"
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
              </div>
            </div>

            {/* Username Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-emerald-200">
                Username <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. janedoe2026"
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  required
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-emerald-200">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane.doe@example.com"
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-emerald-200">
                Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
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

            {/* Confirm Password Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-emerald-200">
                Confirm Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type your password"
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  required
                />
                {confirmPassword && password === confirmPassword && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 absolute right-3 top-1/2 -translate-y-1/2" />
                )}
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
              {loading ? 'Creating Account...' : 'Create Consumer Account'}
            </Button>

          </form>

          {/* Footer Navigation Link */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Already registered?</span>
            <Link
              to="/login"
              className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Sign In to Account →
            </Link>
          </div>

        </Card>

      </div>
    </div>
  );
};
