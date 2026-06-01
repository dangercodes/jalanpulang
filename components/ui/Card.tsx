import { View, ViewProps } from 'react-native';
import { cn } from '@/utils/cn'; // We'll create this utility

interface CardProps extends ViewProps {
  className?: string;
  variant?: 'default' | 'elevated' | 'glass';
}

export function Card({ className, variant = 'default', style, ...props }: CardProps) {
  const baseClasses = 'rounded-2xl p-4';
  
  const variantClasses = {
    default: 'bg-surface-light dark:bg-surface-dark border border-gray-100 dark:border-gray-800',
    elevated: 'bg-surface-light dark:bg-surface-dark shadow-sm',
    glass: 'bg-white/80 dark:bg-gray-900/80',
  };

  return (
    <View 
      className={cn(baseClasses, variantClasses[variant], className)}
      style={style}
      {...props}
    />
  );
}
