import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  glass?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverEffect = true,
  glass = true,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl p-6 transition-all duration-300 ${
        glass ? 'glass-card' : 'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm'
      } ${hoverEffect ? 'hover:-translate-y-1 hover:shadow-md' : ''} ${className}`}
    >
      {children}
    </div>
  );
};
