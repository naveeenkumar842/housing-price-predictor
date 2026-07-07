import React from 'react';

function LoadingSpinner({ size = 'md', message = 'Loading...' }) {
  const sizes = {
    sm: 'h-5 w-5',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  const sizeClass = sizes[size] || sizes.md;

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className={`${sizeClass} animate-spin rounded-full border-4 border-primary-200 border-t-primary-600`} />
      {message && <p className="mt-3 text-sm text-gray-600">{message}</p>}
    </div>
  );
}

export default LoadingSpinner;