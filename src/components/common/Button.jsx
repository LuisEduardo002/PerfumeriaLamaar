import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

/**
 * Reusable Button Component with premium micro-interactions.
 */
export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  fullWidth = false,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none rounded-full cursor-pointer select-none disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-[#111111] text-white hover:bg-[#4B1E28] disabled:bg-slate-200 disabled:text-slate-400 shadow-sm hover:shadow-md',
    secondary: 'bg-[#F6F0E3] text-[#4B1E28] hover:bg-[#eee2c9] disabled:bg-slate-100 disabled:text-slate-400',
    outline: 'border border-[#CFCFCF] text-[#111111] hover:border-[#C8A450] hover:bg-[#FAF9F6] disabled:border-slate-200 disabled:text-slate-400',
    text: 'text-[#4B1E28] hover:text-[#111111] bg-transparent hover:underline px-0 py-0',
  };

  const sizes = {
    sm: 'text-xs px-4 py-2',
    md: 'text-sm px-6 py-3',
    lg: 'text-base px-8 py-4',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      className={clsx(
        baseStyles,
        variants[variant],
        variant !== 'text' && sizes[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
