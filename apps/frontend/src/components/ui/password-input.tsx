'use client';

import {
  forwardRef,
  useState,
  type InputHTMLAttributes,
} from 'react';

interface PasswordInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  error?: string;
  hint?: string;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, hint, id, className = '', ...props }, ref) => {
    const [visible, setVisible] = useState(false);

    const inputId =
      id ?? label.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="space-y-1.5">
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-ink"
        >
          {label}
        </label>

        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={visible ? 'text' : 'password'}
            className={[
              'w-full px-4 py-3 pr-11 text-sm text-ink bg-surface border rounded-md',
              'placeholder:text-ink-faint transition-colors duration-150',
              'focus:outline-none focus:ring-2 focus:border-brand',
              'disabled:bg-muted-surface disabled:text-ink-muted disabled:cursor-not-allowed',
              error
                ? 'border-error focus:border-error'
                : 'border-line hover:border-line-strong',
              className,
            ].join(' ')}
            style={
              error
                ? {
                    '--tw-ring-color': 'rgba(184,68,68,0.15)',
                  } as React.CSSProperties
                : {
                    '--tw-ring-color': 'rgba(42,96,73,0.15)',
                  } as React.CSSProperties
            }
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error
                ? `${inputId}-err`
                : hint
                  ? `${inputId}-hint`
                  : undefined
            }
            {...props}
          />

          <button
            type="button"
            onClick={() => setVisible((current) => !current)}
            aria-label={visible ? 'Hide password' : 'Show password'}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded text-ink-muted hover:text-ink-sub transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            {visible ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>

        {error && (
          <p
            id={`${inputId}-err`}
            role="alert"
            className="flex items-start gap-1.5 text-xs text-error mt-1"
          >
            <svg
              className="mt-px flex-shrink-0"
              width="12"
              height="12"
              viewBox="0 0 16 16"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm-.75 4.25a.75.75 0 011.5 0v3.5a.75.75 0 01-1.5 0v-3.5zm.75 6a.875.875 0 110-1.75.875.875 0 010 1.75z" />
            </svg>
            {error}
          </p>
        )}

        {hint && !error && (
          <p
            id={`${inputId}-hint`}
            className="text-xs text-ink-muted mt-1"
          >
            {hint}
          </p>
        )}
      </div>
    );
  },
);

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;

function EyeIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}