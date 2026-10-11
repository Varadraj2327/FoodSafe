import React from 'react';
import { ShieldCheck, Leaf } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showSubtitle = true }) => {
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className="flex items-center gap-2.5 group cursor-pointer select-none">
      <div className="relative flex items-center justify-center">
        {/* Outer subtle glow ring */}
        <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 opacity-20 blur-sm group-hover:opacity-40 transition duration-300" />
        
        {/* Shield Container */}
        <div className="relative flex items-center justify-center p-2 rounded-xl bg-emerald-900 text-emerald-400 dark:bg-emerald-950/80 dark:text-emerald-400 border border-emerald-700/30 shadow-sm">
          <ShieldCheck className={`${iconSizes[size]} transition-transform duration-300 group-hover:scale-105`} />
          <Leaf className="w-3.5 h-3.5 absolute -top-1 -right-1 text-emerald-400 fill-emerald-500/20" />
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={`font-bold tracking-tight font-heading ${textSizes[size]} text-slate-900 dark:text-emerald-50`}>
            Food<span className="text-emerald-600 dark:text-emerald-400">Safe</span>
          </span>
          <span className="px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50">
            Awareness
          </span>
        </div>
        {showSubtitle && (
          <span className="text-[11px] font-medium text-slate-500 dark:text-emerald-400/70 tracking-wide">
            Food Adulteration Safety System
          </span>
        )}
      </div>
    </div>
  );
};
