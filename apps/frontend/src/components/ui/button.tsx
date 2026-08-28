import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 font-medium rounded-md transition-all duration-150 ' +
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand ' +
    'select-none';

  const variants = {
    primary:
      'bg-brand text-cream hover:bg-brand-dark active:bg-[#192e24] ' +
      'disabled:bg-brand-muted disabled:cursor-not-allowed',
    secondary:
      'bg-cream border border-line text-brand hover:bg-cream-dark ' +
      'hover:border-line-strong active:bg-[#ddd5c4] ' +
      'disabled:opacity-50 disabled:cursor-not-allowed',
    ghost:
      'bg-transparent text-brand hover:bg-brand-tint active:bg-brand-subtle ' +
      'disabled:opacity-50 disabled:cursor-not-allowed',
  };

  const sizes = {
    sm: 'text-xs px-3 py-2 h-8',
    md: 'text-sm px-5 py-2.5 h-10',
    lg: 'text-sm px-6 py-3 h-12 tracking-wide',
  };

  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={[
        base,
        variants[variant],
        sizes[size],
        className,
      ].join(' ')}
    >
      {loading && (
        <svg
          className="animate-spin w-4 h-4 -ml-0.5 flex-shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}

      {children}
    </button>
  );
}