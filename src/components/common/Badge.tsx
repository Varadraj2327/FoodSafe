import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'emerald' | 'amber' | 'blue' | 'slate' | 'rose';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'emerald',
  size = 'md',
  icon,
}) => {
  const variantStyles = {
    emerald: 'bg-emerald-100/80 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40',
    amber: 'bg-amber-100/80 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 dark:border-amber-800/40',
    blue: 'bg-teal-100/80 text-teal-900 dark:bg-teal-950/80 dark:text-teal-300 border-teal-200 dark:border-teal-800/40',
    slate: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    rose: 'bg-rose-100/80 text-rose-900 dark:bg-rose-950/80 dark:text-rose-300 border-rose-200 dark:border-rose-800/40',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[11px]',
    md: 'px-2.5 py-1 text-xs',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border tracking-wide ${sizeStyles[size]} ${variantStyles[variant]}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
};
