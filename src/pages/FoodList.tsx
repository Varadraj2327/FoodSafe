import React, { useEffect, useState } from 'react';
import { FoodCard } from '../components/common/FoodCard';
import { CategoryFilter } from '../components/common/CategoryFilter';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { Badge } from '../components/common/Badge';
import { apiService } from '../services/api';
import type { Category, Food } from '../types';
import { Search, Database } from 'lucide-react';

export const FoodList: React.FC = () => {
  const [foods, setFoods] = useState<Food[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let active = true;
    Promise.all([apiService.getFoods(), apiService.getCategories()])
      .then(([foodsData, categoriesData]) => {
        if (active) {
          setFoods(foodsData);
          setCategories(categoriesData);
          setError(false);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error loading foods list:', err);
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

  const filteredFoods = foods.filter((food) => {
    const matchesCategory = selectedCategory
      ? food.category?.name?.toLowerCase() === selectedCategory.toLowerCase()
      : true;

    const matchesSearch = searchFilter.trim()
      ? food.name.toLowerCase().includes(searchFilter.toLowerCase().trim()) ||
        food.adulterants?.toLowerCase().includes(searchFilter.toLowerCase().trim())
      : true;

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="emerald" icon={<Database className="w-3.5 h-3.5" />}>
            Food Commodity Index
          </Badge>
          <span className="text-xs text-slate-500 font-medium">
            {foods.length} Commodities Available
          </span>
        </div>

        <h1 className="text-3xl font-extrabold font-heading text-slate-900 dark:text-emerald-50">
          Food Safety &amp; Adulteration Directory
        </h1>

        <p className="text-sm text-slate-600 dark:text-emerald-100/70 max-w-2xl leading-relaxed">
          Browse food items to view common adulterants, health risk factors, and step-by-step household test protocols.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-emerald-900/10 dark:border-emerald-500/15 shadow-sm">
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-emerald-600 dark:text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Filter list..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-emerald-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          />
        </div>
      </div>

      {/* Content */}
      {loading && <LoadingSpinner message="Fetching food directory from backend..." />}

      {error && <ErrorMessage onRetry={handleRetry} />}

      {!loading && !error && (
        <>
          {filteredFoods.length === 0 ? (
            <div className="text-center py-16 space-y-3 bg-white/50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
              <p className="text-sm font-semibold text-slate-600 dark:text-emerald-200 font-heading">
                No food items match the selected filter.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSearchFilter('');
                }}
                className="text-xs text-emerald-700 dark:text-emerald-400 hover:underline font-semibold"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFoods.map((food) => (
                <FoodCard key={food.id} food={food} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
