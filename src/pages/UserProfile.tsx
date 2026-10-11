import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/useAuth';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { FoodCard } from '../components/common/FoodCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { apiService } from '../services/api';
import type { Food, UserUpdate, UserPersonalInsights } from '../types';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import {
  User as UserIcon,
  Mail,
  Calendar,
  ShieldCheck,
  Heart,
  Edit3,
  CheckCircle,
  AlertCircle,
  Lock,
  X,
  TrendingUp,
  Award,
  BookOpen
} from 'lucide-react';

export const UserProfile: React.FC = () => {
  const { user, logout } = useAuth();
  const [favorites, setFavorites] = useState<Food[]>([]);
  const [favLoading, setFavLoading] = useState(true);
  const [personalInsights, setPersonalInsights] = useState<UserPersonalInsights | null>(null);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formFullName, setFormFullName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([
      apiService.getFavorites(),
      apiService.getUserPersonalAnalytics()
    ])
      .then(([favData, insightData]) => {
        if (active) {
          setFavorites(favData);
          setPersonalInsights(insightData);
          setFavLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error loading profile analytics or favorites:', err);
        if (active) setFavLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const openEditModal = () => {
    if (user) {
      setFormFullName(user.full_name || '');
      setFormEmail(user.email || '');
      setFormPassword('');
      setFormError(null);
      setIsEditModalOpen(true);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formEmail.trim()) {
      setFormError('Email address is required.');
      return;
    }

    try {
      setSubmitting(true);
      setFormError(null);

      const payload: UserUpdate = {
        email: formEmail.trim(),
        full_name: formFullName.trim() || undefined,
        password: formPassword.trim() || undefined,
      };

      await apiService.updateProfile(payload);
      setSuccessMessage('Profile updated successfully! Refreshing session details...');
      setIsEditModalOpen(false);

      // Force reload page to refresh context profile data
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err: unknown) {
      console.error('Failed to update profile:', err);
      if (axios.isAxiosError(err) && err.response?.data?.detail) {
        setFormError(err.response.data.detail);
      } else {
        setFormError('Failed to update user profile.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return <LoadingSpinner message="Loading user profile credentials..." />;
  }

  const joinDateFormatted = user.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Active Member';

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4 animate-in fade-in duration-300">
      
      {/* Success Notification */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm flex items-center gap-2">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Profile Header Card */}
      <Card className="p-6 sm:p-8 border-emerald-900/15 dark:border-emerald-500/20 relative overflow-hidden">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            
            {/* User Avatar */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-500/15 text-emerald-800 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-2xl font-bold font-heading shadow-md">
              {user.full_name ? user.full_name.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-emerald-50">
                  {user.full_name || user.username}
                </h1>
                {user.is_admin && (
                  <Badge variant="emerald" size="sm" icon={<ShieldCheck className="w-3 h-3" />}>
                    Administrator
                  </Badge>
                )}
              </div>

              <p className="text-xs text-slate-500 dark:text-emerald-300/80 font-mono">
                @{user.username}
              </p>
            </div>

          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              icon={<Edit3 className="w-4 h-4" />}
              onClick={openEditModal}
              className="flex-1 sm:flex-none"
            >
              Edit Profile
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 flex-1 sm:flex-none"
            >
              Sign Out
            </Button>
          </div>
        </div>

        {/* Profile Details Metadata Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 text-xs">
          
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
            <UserIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Display Name</span>
              <span className="font-semibold text-slate-900 dark:text-emerald-100">{user.full_name || 'Not specified'}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
            <Mail className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Email Address</span>
              <span className="font-semibold text-slate-900 dark:text-emerald-100">{user.email}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
            <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Member Since</span>
              <span className="font-semibold text-slate-900 dark:text-emerald-100">{joinDateFormatted}</span>
            </div>
          </div>

        </div>

        {/* Personal User Insights Section */}
        {personalInsights && (
          <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-emerald-50">
                  Personal Learning & Safety Insights
                </h3>
                <p className="text-xs text-slate-500 dark:text-emerald-300/70">
                  Track your food safety quiz activity, performance stats, and saved bookmarks
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-xs font-medium">Quizzes Attempted</span>
                  <BookOpen className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="text-2xl font-bold font-heading text-slate-900 dark:text-emerald-50">
                  {personalInsights.total_quizzes_attempted}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-xs font-medium">Average Score</span>
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="text-2xl font-bold font-heading text-slate-900 dark:text-emerald-50">
                  {personalInsights.average_quiz_score}%
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-xs font-medium">Best Score</span>
                  <Award className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-2xl font-bold font-heading text-slate-900 dark:text-emerald-50">
                  {personalInsights.best_quiz_score}%
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-xs font-medium">Saved Favorites</span>
                  <Heart className="w-4 h-4 text-rose-500" />
                </div>
                <div className="text-2xl font-bold font-heading text-slate-900 dark:text-emerald-50">
                  {personalInsights.favorite_foods_count}
                </div>
              </div>
            </div>

            {/* Quiz Performance Chart */}
            {personalInsights.score_trend && personalInsights.score_trend.length > 0 && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Recent Quiz Score History
                </h4>
                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={personalInsights.score_trend}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                      <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          borderColor: '#334155',
                          borderRadius: '0.75rem',
                          color: '#f8fafc',
                          fontSize: '12px',
                        }}
                        formatter={(val: unknown) => [`${val}%`, 'Average Score']}
                      />
                      <Line
                        type="monotone"
                        dataKey="average_percentage"
                        stroke="#10b981"
                        strokeWidth={2.5}
                        dot={{ fill: '#10b981', r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        )}

      </Card>

      {/* Bookmarked Favorites Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-emerald-50">
                Bookmarked Favorites ({favorites.length})
              </h2>
              <p className="text-xs text-slate-500 dark:text-emerald-300/70">
                Quick access to your saved food safety commodity profiles
              </p>
            </div>
          </div>
        </div>

        {favLoading && <LoadingSpinner message="Loading saved favorites..." />}

        {!favLoading && favorites.length === 0 && (
          <Card className="p-8 text-center space-y-3 border-emerald-900/10 dark:border-emerald-500/15">
            <Heart className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700 dark:text-emerald-200">
              No Favorites Saved Yet
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Explore food commodities and click the heart icon to save items for quick reference.
            </p>
          </Card>
        )}

        {!favLoading && favorites.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((food) => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-md p-6 space-y-6 relative border-emerald-900/20 dark:border-emerald-500/30">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-emerald-50">
                  Edit User Profile
                </h3>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-500/10 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2 border border-rose-500/20">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-emerald-200">
                  Display / Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formFullName}
                    onChange={(e) => setFormFullName(e.target.value)}
                    placeholder="e.g. Varadraj Shewale"
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-emerald-200">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="admin@foodsafe.org"
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-emerald-200">
                  Change Password (Optional)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={formPassword}
                    onChange={(e) => setFormPassword(e.target.value)}
                    placeholder="Leave blank to keep existing password"
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={submitting}
                >
                  {submitting ? 'Saving...' : 'Save Profile Changes'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

    </div>
  );
};
