import React from 'react';
import type { Category } from '../../types';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryName: string | null) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2 py-2">
      <button
        onClick={() => onSelectCategory(null)}
        className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all duration-200 border ${
          selectedCategory === null
            ? 'bg-emerald-800 text-white border-emerald-800 dark:bg-emerald-600 dark:border-emerald-600 shadow-sm'
            : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-emerald-200 border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 hover:bg-emerald-500/5'
        }`}
      >
        All Categories
      </button>

      {categories.map((cat) => {
        const isSelected = selectedCategory === cat.name;
        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.name)}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all duration-200 border ${
              isSelected
                ? 'bg-emerald-800 text-white border-emerald-800 dark:bg-emerald-600 dark:border-emerald-600 shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-emerald-200 border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 hover:bg-emerald-500/5'
            }`}
          >
            {cat.name}
          </button>
        );
      })}
    </div>
  );
};
