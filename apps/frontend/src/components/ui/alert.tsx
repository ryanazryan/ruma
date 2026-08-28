import type { ReactNode } from 'react';

type AlertVariant = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
  variant: AlertVariant;
  title?: string;
  children: ReactNode;
  className?: string;
}

const alertStyles: Record<
  AlertVariant,
  {
    wrapper: string;
    icon: string;
    title: string;
    body: string;
    iconElement: ReactNode;
  }
> = {
  success: {
    wrapper: 'bg-brand-tint border-[rgba(42,96,73,0.18)]',
    icon: 'text-brand',
    title: 'text-brand-dark',
    body: 'text-brand',
    iconElement: <SuccessIcon />,
  },
  error: {
    wrapper: 'bg-error-tint border-[rgba(184,68,68,0.18)]',
    icon: 'text-error',
    title: 'text-[#7a2424]',
    body: 'text-error',
    iconElement: <ErrorIcon />,
  },
  warning: {
    wrapper: 'bg-warning-tint border-[rgba(196,150,62,0.25)]',
    icon: 'text-[#7a5a0a]',
    title: 'text-[#7a5a0a]',
    body: 'text-[#a07c25]',
    iconElement: <WarningIcon />,
  },
  info: {
    wrapper: 'bg-[#f0f7ff] border-[rgba(59,130,246,0.18)]',
    icon: 'text-[#3b82f6]',
    title: 'text-[#1d4ed8]',
    body: 'text-[#2563eb]',
    iconElement: <InfoIcon />,
  },
};

export default function Alert({
  variant,
  title,
  children,
  className = '',
}: AlertProps) {
  const styles = alertStyles[variant];

  return (
    <div
      className={[
        'flex gap-3 p-4 rounded-md border',
        styles.wrapper,
        className,
      ].join(' ')}
      role="alert"
    >
      <span
        className={[
          'flex-shrink-0 mt-0.5',
          styles.icon,
        ].join(' ')}
        aria-hidden="true"
      >
        {styles.iconElement}
      </span>

      <div className="min-w-0 text-sm">
        {title && (
          <p className={`font-medium mb-0.5 ${styles.title}`}>
            {title}
          </p>
        )}

        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );
}

function SuccessIcon() {
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
    >
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function ErrorIcon() {
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
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function WarningIcon() {
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
    >
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function InfoIcon() {
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
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}