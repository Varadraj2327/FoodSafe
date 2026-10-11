import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { apiService } from '../../services/api';
import type { AdminStats, Food } from '../../types';
import {
  Utensils,
  FolderTree,
  HelpCircle,
  ShieldCheck,
  Plus,
  ArrowRight,
  Activity,
  Image as ImageIcon,
  BarChart3
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentFoods, setRecentFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let active = true;
    Promise.all([apiService.getAdminStats(), apiService.getFoods()])
      .then(([statsData, foodsData]) => {
        if (active) {
          setStats(statsData);
          setRecentFoods(foodsData.slice(0, 4));
          setError(false);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error loading admin stats:', err);
        if (active) {
          setError(true);
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [retryCount]);


  const handleRetry = () => {
    setLoading(true);
    setError(false);
    setRetryCount((prev) => prev + 1);
  };

  if (loading) {
    return <LoadingSpinner message="Loading administrative metrics from FastAPI..." />;
  }

  if (error || !stats) {
    return (
      <ErrorMessage
        title="Failed to Load Dashboard Stats"
        message="Please verify that your JWT admin session is valid."
        onRetry={handleRetry}
      />
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="emerald" icon={<ShieldCheck className="w-3.5 h-3.5" />}>
            Logged in as {stats.admin_user}
          </Badge>
          <h1 className="text-3xl font-extrabold font-heading text-slate-900 dark:text-emerald-50 mt-1">
            System Administration Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/admin/analytics')}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-emerald-800 text-white hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 shadow-sm"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analytics Dashboard</span>
          </button>
          <button
            onClick={() => navigate('/admin/foods')}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Commodity</span>
          </button>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Foods */}
        <Card className="p-6 space-y-3 border-emerald-900/10 dark:border-emerald-500/15">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-emerald-400 font-heading uppercase tracking-wider">
              Food Commodities
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Utensils className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold font-heading text-slate-900 dark:text-emerald-50">
            {stats.food_count}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-emerald-300/70">
            Active food safety profiles
          </p>
        </Card>

        {/* Total Categories */}
        <Card className="p-6 space-y-3 border-emerald-900/10 dark:border-emerald-500/15">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-emerald-400 font-heading uppercase tracking-wider">
              Food Categories
            </span>
            <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
              <FolderTree className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold font-heading text-slate-900 dark:text-emerald-50">
            {stats.category_count}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-emerald-300/70">
            Categorized groups
          </p>
        </Card>

        {/* Quiz Questions */}
        <Card className="p-6 space-y-3 border-emerald-900/10 dark:border-emerald-500/15">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-emerald-400 font-heading uppercase tracking-wider">
              Awareness Quizzes
            </span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <HelpCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold font-heading text-slate-900 dark:text-emerald-50">
            {stats.quiz_count}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-emerald-300/70">
            Testing question bank
          </p>
        </Card>

        {/* System Health */}
        <Card className="p-6 space-y-3 border-emerald-900/10 dark:border-emerald-500/15">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-emerald-400 font-heading uppercase tracking-wider">
              Backend Status
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="text-lg font-extrabold font-heading text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            Operational
          </div>
          <p className="text-[11px] text-slate-500 dark:text-emerald-300/70">
            FastAPI + SQLite v1.0.0
          </p>
        </Card>

      </div>

      {/* Admin Quick Action Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <Card
          onClick={() => navigate('/admin/analytics')}
          className="p-6 cursor-pointer space-y-4 hover:border-emerald-500/40"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-700 dark:text-indigo-400">
              <BarChart3 className="w-6 h-6" />
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-emerald-50">
              Analytics Overview
            </h3>
            <p className="text-xs text-slate-600 dark:text-emerald-200/70 mt-1">
              Visualize user registrations, popular foods, category distribution, quiz trends, and user activity.
            </p>
          </div>
        </Card>

        <Card
          onClick={() => navigate('/admin/foods')}
          className="p-6 cursor-pointer space-y-4 hover:border-emerald-500/40"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
              <Utensils className="w-6 h-6" />
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-emerald-50">
              Manage Food Commodities
            </h3>
            <p className="text-xs text-slate-600 dark:text-emerald-200/70 mt-1">
              Add new food commodities, edit adulterants, update health risk warnings, or delete outdated items.
            </p>
          </div>
        </Card>

        <Card
          onClick={() => navigate('/admin/categories')}
          className="p-6 cursor-pointer space-y-4 hover:border-emerald-500/40"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-2xl bg-teal-500/10 text-teal-700 dark:text-teal-400">
              <FolderTree className="w-6 h-6" />
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-emerald-50">
              Manage Categories
            </h3>
            <p className="text-xs text-slate-600 dark:text-emerald-200/70 mt-1">
              Create, update, and manage commodity categories (e.g. Dairy, Spices, Sweeteners, Beverages).
            </p>
          </div>
        </Card>

        <Card
          onClick={() => navigate('/admin/quiz')}
          className="p-6 cursor-pointer space-y-4 hover:border-emerald-500/40"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-700 dark:text-amber-400">
              <HelpCircle className="w-6 h-6" />
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-emerald-50">
              Manage Quiz Questions
            </h3>
            <p className="text-xs text-slate-600 dark:text-emerald-200/70 mt-1">
              Create, edit, and maintain food safety awareness multiple choice questions and answer keys.
            </p>
          </div>
        </Card>

      </div>

      {/* Recent Commodities Section with Image Previews */}
      <Card className="p-6 space-y-4 border-emerald-900/10 dark:border-emerald-500/15">

        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-emerald-50">
              Recent Commodity Profiles
            </h3>
            <p className="text-xs text-slate-500 dark:text-emerald-300/70">
              Commodity items with uploaded image previews
            </p>
          </div>
          <button
            onClick={() => navigate('/admin/foods')}
            className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {recentFoods.map((item) => {
            const imgUrl = apiService.getImageUrl(item.image_path);
            return (
              <div
                key={item.id}
                onClick={() => navigate(`/foods/${item.id}`)}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 cursor-pointer hover:border-emerald-500/40 transition-all flex items-center gap-3"
              >
                {imgUrl ? (
                  <img
                    src={imgUrl}
                    alt={item.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-900 flex items-center justify-center text-slate-400 shrink-0">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-emerald-100 truncate font-heading">
                    {item.name}
                  </h4>
                  <span className="text-[10px] text-emerald-800 dark:text-emerald-400 font-semibold block truncate">
                    {item.category?.name || 'Commodity'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

    </div>
  );
};

