import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'icon' | 'text';
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ 
  className, 
  variant = 'full', 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: {
      container: 'h-8',
      icon: 'h-6 w-6',
      text: 'text-lg'
    },
    md: {
      container: 'h-10',
      icon: 'h-8 w-8',
      text: 'text-xl'
    },
    lg: {
      container: 'h-12',
      icon: 'h-10 w-10',
      text: 'text-2xl'
    }
  };

  const currentSize = sizeClasses[size];

  if (variant === 'icon') {
    return (
      <div className={cn('relative', currentSize.container, className)}>
        <img 
          src="/images/branding/onlyfur-favicon.png" 
          alt="OnlyFur" 
          className={cn('object-contain', currentSize.icon)}
        />
      </div>
    );
  }

  if (variant === 'text') {
    return (
      <span className={cn(
        'font-bold bg-gradient-to-r from-orange-600 via-orange-500 to-purple-600 bg-clip-text text-transparent',
        currentSize.text,
        className
      )}>
        OnlyFur
      </span>
    );
  }

  return (
    <div className={cn('flex items-center', className)}>
      <img 
        src="/images/branding/onlyfur-logo.png" 
        alt="OnlyFur - Premium Furry Content Platform" 
        className={cn('object-contain', currentSize.container)}
      />
    </div>
  );
};

export default Logo;
