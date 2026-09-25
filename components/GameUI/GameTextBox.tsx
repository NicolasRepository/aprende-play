'use client';

import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface GameTextBoxProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'error' | 'highlight';
  size?: 'sm' | 'md' | 'lg';
  highContrast?: boolean;
}

const variantStyles = {
  default: 'bg-white text-gray-800 border-brand-200',
  success: 'bg-green-50 text-green-800 border-green-300',
  error: 'bg-red-50 text-red-800 border-red-300',
  highlight: 'bg-brand-50 text-brand-800 border-brand-300',
};

const hcVariantStyles = {
  default: 'bg-black text-white border-white',
  success: 'bg-black text-white border-white',
  error: 'bg-black text-white border-white',
  highlight: 'bg-black text-white border-white',
};

const sizeStyles = {
  sm: 'p-3 text-sm rounded-lg',
  md: 'p-4 text-base rounded-xl',
  lg: 'p-6 text-xl rounded-2xl',
};

export const GameTextBox = forwardRef<HTMLDivElement, GameTextBoxProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      highContrast = false,
      children,
      ...props
    },
    ref
  ) => {
    const variants = highContrast ? hcVariantStyles : variantStyles;
    return (
      <div
        ref={ref}
        className={cn(
          'border-2 font-medium transition-all duration-200',
          variants[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
GameTextBox.displayName = 'GameTextBox';
