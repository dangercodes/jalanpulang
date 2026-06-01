import { cn } from '@/utils/cn';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';

interface TextProps extends RNTextProps {
  className?: string;
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'arabic';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
}

export function Text({ className, variant = 'body', weight = 'normal', style, ...props }: TextProps) {
  const variantClasses = {
    h1: 'text-3xl font-interBold',
    h2: 'text-2xl font-interBold',
    h3: 'text-xl font-interSemiBold',
    body: 'text-base font-inter',
    caption: 'text-sm text-gray-500 dark:text-gray-400 font-inter',
    arabic: 'text-2xl leading-[60px] text-right font-scheherazade',
  };

  const weightClasses = {
    normal: 'font-inter',
    medium: 'font-interMedium',
    semibold: 'font-interSemiBold',
    bold: 'font-interBold',
  };

  return (
    <RNText
      className={cn(
        'text-gray-900 dark:text-gray-100', // Default color
        variantClasses[variant],
        weightClasses[weight],
        className
      )}
      style={style}
      {...props}
    />
  );
}
