import React from 'react';

export function FramedScene({ children, className }) {
  return (
    <div
      className={
        className ||
        'rounded-2xl border border-ers-subtle bg-ers-surface shadow-ers-md p-3 sm:p-4'
      }
    >
      <div className="overflow-hidden rounded-xl bg-ers-bg">
        {children}
      </div>
    </div>
  );
}

