import { forwardRef } from 'react';

export const Input = forwardRef(function Input({ label, error, className = '', ...props }, ref) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-label mb-1.5">{label}</label>
      )}
      <input
        ref={ref}
        className="ers-input ers-input-touch"
        {...props}
      />
      {error && <p className="mt-1.5 text-body-sm text-emergency-600" role="alert">{error}</p>}
    </div>
  );
});
