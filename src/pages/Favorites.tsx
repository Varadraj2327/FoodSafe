import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { FoodCard } from '../components/common/FoodCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { apiService } from '../services/api';
import type { Food } from '../types';
import { Heart, Search, Utensils, ArrowRight } from 'lucide-react';

export const Favorites: React.FC = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let active = true;
    apiService
      .getFavorites()
      .then((data) => {
        if (active) {
          setFavorites(data);
          setError(false);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching favorites:', err);
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

  const filteredFavorites = favorites.filter((food) =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
    food.category?.name?.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
    food.adulterants?.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="emerald" icon={<Heart className="w-3.5 h-3.5 fill-current" />}>
            Personal Safety Bookmarks
          </Badge>
          <h1 className="text-3xl font-extrabold font-heading text-slate-900 dark:text-emerald-50 mt-1">
            My Favorite Commodities
          </h1>
        </div>

        <Button
          variant="outline"
          size="sm"
          icon={<Utensils className="w-4 h-4" />}
          onClick={() => navigate('/foods')}
        >
          Explore All Commodities
        </Button>
      </div>

      {/* Toolbar / Search */}
      {favorites.length > 0 && (
        <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-emerald-900/10 dark:border-emerald-500/15 shadow-sm">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-emerald-600 dark:text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search saved favorites..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-emerald-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            />
          </div>
          <span className="text-xs text-slate-500 font-semibold hidden sm:inline">
            {filteredFavorites.length} Saved Items
          </span>
        </div>
      )}

      {/* Content states */}
      {loading && <LoadingSpinner message="Loading your bookmarked commodities..." />}

      {error && (
        <ErrorMessage
          title="Failed to Load Favorites"
          message="Please ensure your session is authenticated."
          onRetry={handleRetry}
        />
      )}

      {!loading && !error && favorites.length === 0 && (
        <Card className="p-12 text-center space-y-4 max-w-lg mx-auto border-emerald-900/10 dark:border-emerald-500/15">
          <div className="p-4 rounded-2xl bg-rose-500/10 text-rose-500 inline-block mx-auto">
            <Heart className="w-10 h-10" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-emerald-100">
              No Favorites Saved Yet
            </h3>
            <p className="text-xs text-slate-600 dark:text-emerald-200/70 max-w-sm mx-auto leading-relaxed">
              Bookmark food commodities while exploring the safety database to build your personalized reference list.
            </p>
          </div>
          <Button
            variant="primary"
            icon={<ArrowRight className="w-4 h-4" />}
            onClick={() => navigate('/foods')}
            className="mt-2"
          >
            Browse Commodities Database
          </Button>
        </Card>
      )}

      {!loading && !error && favorites.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFavorites.map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
      )}

    </div>
  );
};
