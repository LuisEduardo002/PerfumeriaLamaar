import React from 'react';
import clsx from 'clsx';

/**
 * Reusable Badge component for tags (e.g. categories, genders, stock indicators).
 */
export default function Badge({
  children,
  variant = 'primary',
  className = '',
}) {
  const baseStyles = 'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium tracking-wider uppercase';

  const variants = {
    primary: 'bg-[#F6F0E3] text-[#4B1E28]',
    secondary: 'bg-[#4B1E28] text-white',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
    warning: 'bg-amber-50 text-amber-700 border border-amber-100',
    danger: 'bg-rose-50 text-rose-700 border border-rose-100',
    outline: 'border border-[#C8A450] text-[#4B1E28]',
  };

  return (
    <span className={clsx(baseStyles, variants[variant], className)}>
      {children}
    </span>
  );
}
