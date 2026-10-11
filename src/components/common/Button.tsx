import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl';

  const sizeStyles = {
    sm: 'px-3.5 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3.5 text-base gap-2.5 font-semibold',
  };

  const variantStyles = {
    primary: 'bg-emerald-800 hover:bg-emerald-700 text-white shadow-md shadow-emerald-900/10 hover:shadow-lg hover:shadow-emerald-900/20 dark:bg-emerald-600 dark:hover:bg-emerald-500 active:scale-[0.98]',
    secondary: 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 dark:bg-emerald-950 dark:hover:bg-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800/40',
    outline: 'border border-emerald-800/20 dark:border-emerald-500/30 text-emerald-900 dark:text-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/50',
    ghost: 'text-slate-700 dark:text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-900 dark:hover:text-emerald-300',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
    </button>
  );
};
