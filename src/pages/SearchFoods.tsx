import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchBar } from '../components/common/SearchBar';
import { FoodCard } from '../components/common/FoodCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { Badge } from '../components/common/Badge';
import { apiService } from '../services/api';
import type { Food } from '../types';
import { Search, Sparkles } from 'lucide-react';

export const SearchFoods: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let active = true;

    if (!queryParam.trim()) {
      Promise.resolve().then(() => {
        if (active) {
          setFoods([]);
          setLoading(false);
        }
      });
      return () => {
        active = false;
      };
    }

    apiService
      .searchFoods(queryParam)
      .then((results) => {
        if (active) {
          setFoods(results);
          setError(false);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error searching foods:', err);
        if (active) {
          setError(true);
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [queryParam, retryCount]);

  const handleSearchSubmit = (newQuery: string) => {
    setSearchParams(newQuery ? { q: newQuery } : {});
  };

  const handleRetry = () => {
    setLoading(true);
    setError(false);
    setRetryCount((prev) => prev + 1);
  };

  return (
    <div className="space-y-8 py-4">
      {/* Search Header */}
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <Badge variant="blue" icon={<Search className="w-3.5 h-3.5" />}>
          FastAPI Search Integration
        </Badge>

        <h1 className="text-3xl font-extrabold font-heading text-slate-900 dark:text-emerald-50">
          Search Food Adulteration Database
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-emerald-100/70">
          Search by commodity name or common adulterant to view verified home testing protocols.
        </p>

        <div className="pt-2 max-w-xl mx-auto">
          <SearchBar
            initialQuery={queryParam}
            onSearch={handleSearchSubmit}
            autoNavigate={false}
            placeholder="Type food name (e.g. Milk, Honey, Turmeric)..."
          />
        </div>
      </div>

      {/* Results Header */}
      {queryParam && (
        <div className="flex items-center justify-between border-b border-emerald-900/10 dark:border-emerald-500/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold font-heading text-slate-900 dark:text-emerald-100">
              Search Results for: &ldquo;<span className="text-emerald-700 dark:text-emerald-400">{queryParam}</span>&rdquo;
            </span>
          </div>

          <span className="text-xs font-semibold text-slate-500 dark:text-emerald-300">
            {foods.length} items found
          </span>
        </div>
      )}

      {/* Content */}
      {loading && <LoadingSpinner message={`Searching database for "${queryParam}"...`} />}

      {error && <ErrorMessage onRetry={handleRetry} />}

      {!loading && !error && (
        <>
          {!queryParam ? (
            <div className="text-center py-16 space-y-3 bg-white/50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
              <Sparkles className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto" />
              <p className="text-sm font-semibold text-slate-600 dark:text-emerald-200 font-heading">
                Enter a food commodity name above to begin searching.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                <span className="text-xs text-slate-400">Popular queries:</span>
                {['Milk', 'Turmeric', 'Honey', 'Tea'].map((sample) => (
                  <button
                    key={sample}
                    onClick={() => handleSearchSubmit(sample)}
                    className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40 hover:bg-emerald-200"
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </div>
          ) : foods.length === 0 ? (
            <div className="text-center py-16 space-y-3 bg-white/50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
              <p className="text-sm font-semibold text-slate-600 dark:text-emerald-200 font-heading">
                No food commodities matched &ldquo;{queryParam}&rdquo;.
              </p>
              <p className="text-xs text-slate-500">
                Try searching for Milk, Turmeric, Honey, or Tea.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {foods.map((food) => (
                <FoodCard key={food.id} food={food} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
