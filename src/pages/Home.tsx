import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SearchBar } from '../components/common/SearchBar';
import { FoodCard } from '../components/common/FoodCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { CorePillars } from '../components/landing/CorePillars';
import { CollegeBanner } from '../components/landing/CollegeBanner';
import { Badge } from '../components/common/Badge';
import { apiService } from '../services/api';
import type { Food } from '../types';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export const Home: React.FC = () => {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let active = true;
    apiService
      .getFoods()
      .then((data) => {
        if (active) {
          setFoods(data.slice(0, 4));
          setError(false);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error loading foods:', err);
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

  return (
    <div className="space-y-16 py-4">
      {/* Hero Section */}
      <section className="relative py-8 md:py-12">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2">
            <Badge variant="emerald" icon={<Sparkles className="w-3.5 h-3.5" />}>
              College Academic Capstone
            </Badge>
            <Badge variant="blue" icon={<ShieldCheck className="w-3.5 h-3.5" />}>
              FSSAI Guidelines &amp; DART Protocols
            </Badge>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-heading leading-tight">
            Detect Adulteration.{' '}
            <span className="block text-gradient-forest">
              Protect Your Health &amp; Family.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-emerald-100/80 max-w-2xl mx-auto leading-relaxed font-normal">
            Empowering households with scientific awareness, rapid home testing methods, and health risk analysis for everyday food items.
          </p>

          {/* Integrated Live Search Bar */}
          <div className="pt-4 max-w-2xl mx-auto">
            <SearchBar size="lg" placeholder="Search food items (e.g. Milk, Turmeric, Honey, Tea)..." />
          </div>
        </div>
      </section>

      {/* Featured Food Safety Directory */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-emerald-900/10 dark:border-emerald-500/10 pb-4">
          <div>
            <Badge variant="emerald" size="sm">
              Live Database
            </Badge>
            <h2 className="text-2xl font-bold font-heading text-slate-900 dark:text-emerald-50 mt-1">
              Featured Food Commodities
            </h2>
            <p className="text-xs text-slate-600 dark:text-emerald-200/70">
              Verified adulteration profiles and household safety tests.
            </p>
          </div>

          <Link
            to="/foods"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-400 hover:underline"
          >
            <span>View All Commodities</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading && <LoadingSpinner message="Fetching food database from FastAPI backend..." />}

        {error && <ErrorMessage onRetry={handleRetry} />}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {foods.map((food) => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        )}
      </section>

      {/* Pillars Section */}
      <CorePillars />

      {/* College Project Banner */}
      <CollegeBanner />
    </div>
  );
};
