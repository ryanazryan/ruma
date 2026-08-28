import {
  forwardRef,
  type InputHTMLAttributes,
} from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, id, className = '', ...props }, ref) => {
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

        <input
          ref={ref}
          id={inputId}
          className={[
            'w-full px-4 py-3 text-sm text-ink bg-surface border rounded-md',
            'placeholder:text-ink-faint transition-colors duration-150',
            'focus:outline-none focus:border-brand focus:ring-2',
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

        {error && (
          <p
            id={`${inputId}-err`}
            role="alert"
            className="text-xs text-error mt-1"
          >
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

Input.displayName = 'Input';

export default Input;