'use client';

import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface GameButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  highContrast?: boolean;
}

const variantStyles = {
  primary: 'bg-brand-500 text-white hover:bg-brand-600 shadow-md shadow-brand-500/30',
  secondary: 'bg-brand-100 text-brand-700 hover:bg-brand-200',
  success: 'bg-green-500 text-white hover:bg-green-600 shadow-md shadow-green-500/30',
  danger: 'bg-red-500 text-white hover:bg-red-600 shadow-md shadow-red-500/30',
  ghost: 'bg-transparent text-brand-600 hover:bg-brand-50',
};

const hcVariantStyles = {
  primary: 'bg-white text-black border-2 border-white hover:bg-gray-200',
  secondary: 'bg-black text-white border-2 border-white hover:bg-gray-900',
  success: 'bg-white text-black border-2 border-white hover:bg-gray-200',
  danger: 'bg-white text-black border-2 border-white hover:bg-gray-200',
  ghost: 'bg-transparent text-white border-2 border-white hover:bg-white hover:text-black',
};

const sizeStyles = {
  sm: 'px-4 py-2 text-sm rounded-lg',
  md: 'px-6 py-3 text-base rounded-xl',
  lg: 'px-8 py-4 text-lg rounded-xl',
  xl: 'px-12 py-6 text-2xl rounded-2xl',
};

export const GameButton = forwardRef<HTMLButtonElement, GameButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      highContrast = false,
      children,
      ...props
    },
    ref
  ) => {
    const variants = highContrast ? hcVariantStyles : variantStyles;
    return (
      <button
        ref={ref}
        className={cn(
          'font-bold transition-all duration-200 active:scale-95 select-none',
          'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/40',
          'disabled:opacity-50 disabled:pointer-events-none',
          variants[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
GameButton.displayName = 'GameButton';
