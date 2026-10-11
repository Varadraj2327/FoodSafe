import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { Button } from '../components/common/Button';
import { apiService } from '../services/api';
import { useAuth } from '../context/useAuth';
import type { Food } from '../types';
import {
  ArrowLeft,
  ShieldAlert,
  AlertTriangle,
  TestTube2,
  Calendar,
  BookOpen,
  Heart
} from 'lucide-react';

export const FoodDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [food, setFood] = useState<Food | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Favorite state
  const [isFavorite, setIsFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    let active = true;

    apiService
      .getFoodById(id)
      .then((data) => {
        if (active) {
          setFood(data);
          setError(null);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        console.error('Error fetching food details:', err);
        if (active) {
          if (axios.isAxiosError(err) && err.response?.status === 404) {
            setError(`Food item with ID #${id} was not found in our safety database.`);
          } else {
            setError('Unable to connect to the FoodSafe backend API server.');
          }
          setLoading(false);
        }
      });

    if (isAuthenticated) {
      apiService
        .checkFavorite(Number(id))
        .then((favStatus) => {
          if (active) setIsFavorite(favStatus);
        })
        .catch(() => {});
    }

    return () => {
      active = false;
    };
  }, [id, retryCount, isAuthenticated]);

  const toggleFavorite = async () => {
    if (!food || !isAuthenticated) return;

    try {
      setFavLoading(true);
      if (isFavorite) {
        await apiService.removeFavorite(food.id);
        setIsFavorite(false);
      } else {
        await apiService.addFavorite(food.id);
        setIsFavorite(true);
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    } finally {
      setFavLoading(false);
    }
  };

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setRetryCount((prev) => prev + 1);
  };

  if (loading) {
    return <LoadingSpinner message={`Fetching safety profile for item #${id}...`} />;
  }

  if (error || !food) {
    return (
      <div className="space-y-6 py-8 text-center max-w-xl mx-auto">
        <ErrorMessage
          title="Food Item Not Found"
          message={error || 'The requested food commodity could not be retrieved.'}
          onRetry={handleRetry}
        />
        <Button
          variant="outline"
          icon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => navigate('/foods')}
        >
          Back to Commodities Index
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4 animate-in fade-in duration-300">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/foods')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-800 dark:text-emerald-400 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Commodities</span>
        </button>

        <div className="flex items-center gap-2">
          {isAuthenticated && (
            <button
              onClick={toggleFavorite}
              disabled={favLoading}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                isFavorite
                  ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-emerald-200 border-slate-200 dark:border-slate-700'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current text-rose-500' : ''}`} />
              <span>{isFavorite ? 'Favorited' : 'Add to Favorites'}</span>
            </button>
          )}

          <Badge variant="emerald" icon={<TestTube2 className="w-3.5 h-3.5" />}>
            {food.category?.name || 'Category'}
          </Badge>
        </div>
      </div>


      {/* Main Title Banner Card */}
      <Card className="p-6 md:p-8 space-y-4 border-emerald-900/15 dark:border-emerald-500/20 overflow-hidden">
        {food.image_path && (
          <div className="h-64 sm:h-80 -mx-6 -mt-6 sm:-mx-8 sm:-mt-8 mb-4 overflow-hidden bg-slate-100 dark:bg-slate-900 border-b border-emerald-900/10 dark:border-emerald-500/20">
            <img
              src={apiService.getImageUrl(food.image_path)}
              alt={food.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider font-heading">
              Adulteration Safety Profile
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-900 dark:text-emerald-50 mt-1">
              {food.name}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
              <Calendar className="w-3.5 h-3.5" />
              Verified Protocol
            </span>
          </div>
        </div>

        {food.description && (
          <p className="text-sm sm:text-base text-slate-600 dark:text-emerald-100/80 leading-relaxed pt-2 border-t border-slate-100 dark:border-slate-800">
            {food.description}
          </p>
        )}
      </Card>


      {/* Grid: Adulterants & Health Risks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="space-y-3 border-emerald-900/10 dark:border-emerald-500/15">
          <div className="flex items-center gap-2.5 text-emerald-800 dark:text-emerald-400">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-900/10 dark:border-emerald-500/20">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold font-heading text-slate-900 dark:text-emerald-100">
              Identified Adulterants
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 dark:text-emerald-200/80 leading-relaxed pt-1">
            {food.adulterants || 'No specific adulterant records documented.'}
          </p>
        </Card>

        <Card className="space-y-3 bg-amber-500/5 dark:bg-amber-950/20 border-amber-500/20">
          <div className="flex items-center gap-2.5 text-amber-700 dark:text-amber-400">
            <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/30">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold font-heading text-amber-950 dark:text-amber-100">
              Health &amp; Toxic Risks
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-amber-900/80 dark:text-amber-200/80 leading-relaxed pt-1">
            {food.health_risks || 'No severe toxicity risks reported.'}
          </p>
        </Card>
      </div>

      {/* Step-by-step Consumer Testing Precautions */}
      <Card className="p-6 md:p-8 space-y-4 border-emerald-900/15 dark:border-emerald-500/20">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-800 text-white dark:bg-emerald-600 shadow-sm">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <Badge variant="emerald" size="sm">
              Household DART Protocol
            </Badge>
            <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-emerald-50 mt-0.5">
              Consumer Safety &amp; Testing Instructions
            </h2>
          </div>
        </div>

        {food.consumer_precautions ? (
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-3 text-xs sm:text-sm text-slate-700 dark:text-emerald-200 leading-relaxed whitespace-pre-line">
            {food.consumer_precautions}
          </div>
        ) : (
          <p className="text-xs text-slate-500">No test instructions listed.</p>
        )}
      </Card>
    </div>
  );
};
