import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from './Card';
import { Badge } from './Badge';
import { ShieldAlert, ArrowRight, TestTube2, AlertTriangle, Heart } from 'lucide-react';
import { apiService } from '../../services/api';
import { useAuth } from '../../context/useAuth';
import type { Food } from '../../types';

interface FoodCardProps {
  food: Food;
}

export const FoodCard: React.FC<FoodCardProps> = ({ food }) => {
  const { isAuthenticated } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const imageUrl = apiService.getImageUrl(food.image_path);

  useEffect(() => {
    let active = true;
    if (isAuthenticated) {
      apiService
        .checkFavorite(food.id)
        .then((favStatus) => {
          if (active) setIsFavorite(favStatus);
        })
        .catch(() => {});
    }
    return () => {
      active = false;
    };
  }, [food.id, isAuthenticated]);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) return;

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

  return (
    <Card className="flex flex-col justify-between h-full space-y-4 border border-emerald-900/10 dark:border-emerald-500/15 overflow-hidden group">
      <div className="space-y-3">
        
        {/* Commodity Header Image */}
        {imageUrl ? (
          <div className="relative h-44 -mx-6 -mt-6 mb-3 overflow-hidden bg-slate-100 dark:bg-slate-900 border-b border-emerald-900/10 dark:border-emerald-500/20">
            <img
              src={imageUrl}
              alt={food.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
              <Badge variant="emerald" size="sm">
                {food.category?.name || 'Commodity'}
              </Badge>

              {isAuthenticated && (
                <button
                  onClick={toggleFavorite}
                  disabled={favLoading}
                  className={`p-2 rounded-full backdrop-blur-md border transition-all duration-200 ${
                    isFavorite
                      ? 'bg-rose-500 text-white border-rose-400 shadow-md'
                      : 'bg-black/40 text-white/80 hover:text-white border-white/20 hover:bg-black/60'
                  }`}
                  title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                >
                  <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current text-white' : ''}`} />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Top bar with category badge fallback */
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-900/10 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400">
              <TestTube2 className="w-5 h-5" />
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="emerald" size="sm">
                {food.category?.name || 'Commodity'}
              </Badge>

              {isAuthenticated && (
                <button
                  onClick={toggleFavorite}
                  disabled={favLoading}
                  className={`p-2 rounded-xl border transition-all duration-200 ${
                    isFavorite
                      ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-rose-500 border-slate-200 dark:border-slate-700'
                  }`}
                  title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current text-rose-500' : ''}`} />
                </button>
              )}
            </div>
          </div>
        )}



        {/* Title & Description */}
        <div>
          <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-emerald-50 group-hover:text-emerald-600 transition-colors">
            {food.name}
          </h3>
          {food.description && (
            <p className="text-xs text-slate-600 dark:text-emerald-200/70 line-clamp-2 mt-1 leading-relaxed">
              {food.description}
            </p>
          )}
        </div>

        {/* Common Adulterants preview */}
        {food.adulterants && (
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 dark:text-emerald-300 font-heading">
              <ShieldAlert className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Common Adulterants</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-emerald-200/80 line-clamp-2 leading-normal">
              {food.adulterants}
            </p>
          </div>
        )}

        {/* Health Risk Tag */}
        {food.health_risks && (
          <div className="flex items-center gap-1.5 text-[11px] text-amber-700 dark:text-amber-300 font-medium">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{food.health_risks}</span>
          </div>
        )}

      </div>

      {/* Card Footer with Link button */}
      <div className="pt-3 border-t border-emerald-900/5 dark:border-emerald-500/10">
        <Link
          to={`/foods/${food.id}`}
          className="w-full inline-flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-800 hover:text-white dark:hover:bg-emerald-600 text-emerald-900 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40 transition-all duration-200"
        >
          <span>View Safety Protocol</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </Card>
  );
};
