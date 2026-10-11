import React, { useEffect, useState } from 'react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { apiService } from '../../services/api';
import type {
  AnalyticsOverview,
  FoodAnalytics,
  QuizAnalyticsAdmin,
  UserAnalyticsAdmin
} from '../../types';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import {
  BarChart3,
  Users,
  Utensils,
  FolderTree,
  HelpCircle,
  TrendingUp,
  Heart,
  Activity,
  UserCheck,
  Award,
  Eye,
  Clock
} from 'lucide-react';

const COLORS = ['#10b981', '#14b8a6', '#f59e0b', '#3b82f6', '#ec4899', '#8b5cf6'];

export const AdminAnalytics: React.FC = () => {
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [foodData, setFoodData] = useState<FoodAnalytics | null>(null);
  const [quizData, setQuizData] = useState<QuizAnalyticsAdmin | null>(null);
  const [userData, setUserData] = useState<UserAnalyticsAdmin | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(false);

      const [ovRes, foodRes, quizRes, userRes] = await Promise.all([
        apiService.getAdminAnalyticsOverview(),
        apiService.getAdminAnalyticsFoods(),
        apiService.getAdminAnalyticsQuiz(),
        apiService.getAdminAnalyticsUsers(),
      ]);

      setOverview(ovRes);
      setFoodData(foodRes);
      setQuizData(quizRes);
      setUserData(userRes);
    } catch (err) {
      console.error('Failed to load analytics data:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Aggregating platform database analytics..." />;
  }

  if (error || !overview) {
    return (
      <ErrorMessage
        title="Failed to Load Analytics Dashboard"
        message="Please verify your administrator session credentials."
        onRetry={fetchAnalyticsData}
      />
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="emerald" icon={<BarChart3 className="w-3.5 h-3.5" />}>
            Real-Time System Metrics
          </Badge>
          <h1 className="text-3xl font-extrabold font-heading text-slate-900 dark:text-emerald-50 mt-1">
            Analytics & Insights Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
          <Clock className="w-3.5 h-3.5" />
          <span>Live SQL Database Analytics</span>
        </div>
      </div>

      {/* 1. Statistic Cards Grid (6 Metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        
        <Card className="p-4 space-y-2 border-emerald-900/10 dark:border-emerald-500/15">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Users</span>
            <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-black font-heading text-slate-900 dark:text-emerald-50">
            {overview.total_users}
          </div>
          <p className="text-[10px] text-slate-500">Registered Accounts</p>
        </Card>

        <Card className="p-4 space-y-2 border-emerald-900/10 dark:border-emerald-500/15">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400">Commodities</span>
            <Utensils className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          </div>
          <div className="text-2xl font-black font-heading text-slate-900 dark:text-emerald-50">
            {overview.total_foods}
          </div>
          <p className="text-[10px] text-slate-500">Food Safety Profiles</p>
        </Card>

        <Card className="p-4 space-y-2 border-emerald-900/10 dark:border-emerald-500/15">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400">Categories</span>
            <FolderTree className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-2xl font-black font-heading text-slate-900 dark:text-emerald-50">
            {overview.total_categories}
          </div>
          <p className="text-[10px] text-slate-500">Food Groupings</p>
        </Card>

        <Card className="p-4 space-y-2 border-emerald-900/10 dark:border-emerald-500/15">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400">Quiz Attempts</span>
            <HelpCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="text-2xl font-black font-heading text-slate-900 dark:text-emerald-50">
            {overview.total_quiz_attempts}
          </div>
          <p className="text-[10px] text-slate-500">Tests Completed</p>
        </Card>

        <Card className="p-4 space-y-2 border-emerald-900/10 dark:border-emerald-500/15">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400">Avg Quiz Score</span>
            <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-black font-heading text-emerald-600 dark:text-emerald-400">
            {overview.average_quiz_score}%
          </div>
          <p className="text-[10px] text-slate-500">Overall Mean</p>
        </Card>

        <Card className="p-4 space-y-2 border-emerald-900/10 dark:border-emerald-500/15">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Bookmarks</span>
            <Heart className="w-4 h-4 text-rose-600 dark:text-rose-400 fill-current" />
          </div>
          <div className="text-2xl font-black font-heading text-slate-900 dark:text-emerald-50">
            {overview.total_favorites}
          </div>
          <p className="text-[10px] text-slate-500">User Favorites</p>
        </Card>

      </div>

      {/* 2. Charts Section 1: Quiz Performance & Score Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Quiz Performance over time line chart */}
        <Card className="p-6 space-y-4 border-emerald-900/10 dark:border-emerald-500/15">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold font-heading text-slate-900 dark:text-emerald-50 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Quiz Performance Trend Over Time
            </h2>
            <span className="text-xs text-slate-400 font-mono">Daily Avg %</span>
          </div>

          <div className="h-64 w-full">
            {quizData?.performance_over_time && quizData.performance_over_time.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={quizData.performance_over_time}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#1e293b',
                      color: '#f8fafc',
                      borderRadius: '0.75rem',
                      fontSize: '12px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="average_percentage"
                    name="Average Score (%)"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#10b981' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No time-series quiz data recorded yet.
              </div>
            )}
          </div>
        </Card>

        {/* Score Distribution Bar Chart */}
        <Card className="p-6 space-y-4 border-emerald-900/10 dark:border-emerald-500/15">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold font-heading text-slate-900 dark:text-emerald-50 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              Quiz Score Distribution
            </h2>
            <span className="text-xs text-slate-400 font-mono">Attempt Buckets</span>
          </div>

          <div className="h-64 w-full">
            {quizData?.score_distribution ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={quizData.score_distribution}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="score_range" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#1e293b',
                      color: '#f8fafc',
                      borderRadius: '0.75rem',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="attempt_count" name="Attempts" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No score distribution data available.
              </div>
            )}
          </div>
        </Card>

      </div>

      {/* 3. Charts Section 2: Commodity Popularity & Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Most Viewed vs Favorited Foods Bar Chart */}
        <Card className="p-6 space-y-4 border-emerald-900/10 dark:border-emerald-500/15">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold font-heading text-slate-900 dark:text-emerald-50 flex items-center gap-2">
              <Eye className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              Most Viewed Commodity Profiles
            </h2>
            <span className="text-xs text-slate-400 font-mono">Top Commodities</span>
          </div>

          <div className="h-64 w-full">
            {foodData?.most_viewed_foods && foodData.most_viewed_foods.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={foodData.most_viewed_foods} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="food_name" type="category" tick={{ fontSize: 11 }} width={90} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#1e293b',
                      color: '#f8fafc',
                      borderRadius: '0.75rem',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="view_count" name="Total Views" fill="#14b8a6" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No commodity view data collected yet.
              </div>
            )}
          </div>
        </Card>

        {/* Category Distribution Pie Chart */}
        <Card className="p-6 space-y-4 border-emerald-900/10 dark:border-emerald-500/15">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold font-heading text-slate-900 dark:text-emerald-50 flex items-center gap-2">
              <FolderTree className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Commodity Category Distribution
            </h2>
            <span className="text-xs text-slate-400 font-mono">Share by Category</span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            {foodData?.category_distribution && foodData.category_distribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={foodData.category_distribution}
                    dataKey="food_count"
                    nameKey="category_name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={(entry: any) => `${entry.category_name}: ${entry.food_count}`}
                  >
                    {foodData.category_distribution.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#1e293b',
                      color: '#f8fafc',
                      borderRadius: '0.75rem',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No categories available.
              </div>
            )}
          </div>
        </Card>

      </div>

      {/* 4. User Registration Growth & Recent Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* User Registration Trend Chart */}
        <Card className="p-6 space-y-4 lg:col-span-2 border-emerald-900/10 dark:border-emerald-500/15">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold font-heading text-slate-900 dark:text-emerald-50 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              User Registration Growth
            </h2>
            <div className="flex items-center gap-2 text-xs">
              <Badge variant="emerald">Regular: {userData?.regular_users_count || 0}</Badge>
              <Badge variant="amber">Admin: {userData?.admin_users_count || 0}</Badge>
            </div>
          </div>

          <div className="h-56 w-full">
            {userData?.registration_trend && userData.registration_trend.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userData.registration_trend}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#1e293b',
                      color: '#f8fafc',
                      borderRadius: '0.75rem',
                      fontSize: '12px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="new_users"
                    name="New Registrations"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#3b82f6' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No user registration trends recorded yet.
              </div>
            )}
          </div>
        </Card>

        {/* Recent Activity Timeline Feed */}
        <Card className="p-6 space-y-4 border-emerald-900/10 dark:border-emerald-500/15">
          <h2 className="text-base font-bold font-heading text-slate-900 dark:text-emerald-50 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Recent Activity Feed
          </h2>

          <div className="space-y-3">
            {userData?.recent_activity && userData.recent_activity.length > 0 ? (
              userData.recent_activity.map((act, index) => {
                const formattedTime = new Date(act.timestamp).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <div
                    key={index}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-emerald-100">
                        {act.user_name || 'User'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{formattedTime}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-emerald-200/80 leading-snug">
                      {act.description}
                    </p>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-400 text-center py-6">No recent activity logged.</p>
            )}
          </div>
        </Card>

      </div>

    </div>
  );
};
