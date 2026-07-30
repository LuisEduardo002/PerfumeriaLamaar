import React from 'react';
import clsx from 'clsx';

/**
 * Reusable Input component with consistent visual styling.
 */
export default function Input({
  type = 'text',
  placeholder,
  value,
  onChange,
  className = '',
  icon: Icon,
  ...props
}) {
  return (
    <div className="relative w-full">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-slate-400" />
        </div>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={clsx(
          'w-full rounded-full border border-[#CFCFCF] bg-[#FAF9F6] text-[#111111] text-sm transition-all duration-300 focus:border-[#C8A450] focus:bg-white focus:outline-none',
          Icon ? 'pl-11 pr-4 py-3' : 'px-6 py-3',
          className
        )}
        {...props}
      />
    </div>
  );
}
