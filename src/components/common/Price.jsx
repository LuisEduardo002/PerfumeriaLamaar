import React from 'react';
import { formatPrice } from '../../utils/formatPrice';
import clsx from 'clsx';

/**
 * Reusable Price component to format and style prices consistently.
 */
export default function Price({
  value,
  size = 'md',
  className = '',
}) {
  const sizes = {
    sm: 'text-sm font-medium',
    md: 'text-base font-semibold',
    lg: 'text-xl md:text-2xl font-bold',
  };

  return (
    <span className={clsx('text-slate-900', sizes[size], className)}>
      {formatPrice(value)}
    </span>
  );
}
