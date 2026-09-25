import React from 'react';
import { motion, type HTMLMotionProps } from 'motion/react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-action-default hover:bg-action-hover active:bg-action-pressed text-text-inverse shadow-sm disabled:bg-action-disabled disabled:opacity-45',
  secondary:
    'bg-surface-muted hover:bg-surface-brand-subtle text-text-brand active:scale-[0.98] disabled:opacity-45',
  ghost:
    'bg-transparent hover:bg-surface-subtle text-text-brand active:scale-[0.98] disabled:opacity-45',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'py-2 px-4 text-xs rounded-full',
  md: 'py-3 px-5 text-sm rounded-full',
  lg: 'py-4 px-6 text-base rounded-full',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'lg',
  fullWidth = true,
  disabled,
  className = '',
  children,
  ...props
}) => {
  return (
    <motion.button
      whileTap={disabled ? undefined : { scale: 0.98 }}
      disabled={disabled}
      className={`font-semibold transition-all duration-200 cursor-pointer disabled:cursor-not-allowed select-none ${
        fullWidth ? 'w-full' : 'w-auto'
      } ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

