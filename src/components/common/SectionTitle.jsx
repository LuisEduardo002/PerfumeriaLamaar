import React from 'react';
import clsx from 'clsx';

/**
 * Reusable Section Title component for styling consistency.
 */
export default function SectionTitle({
  title,
  subtitle,
  centered = false,
  className = '',
  as: HeadingTag = 'h2',
}) {
  return (
    <div className={clsx('mb-12', centered && 'text-center', className)}>
      <HeadingTag className="text-3xl md:text-4xl font-serif font-bold text-slate-900 tracking-tight">
        {title}
      </HeadingTag>
      {subtitle && (
        <p className="text-slate-500 mt-3 text-sm md:text-base font-light max-w-xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}
