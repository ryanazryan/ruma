'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

import AuthLayout from '../../components/auth/AuthLayout';
import Input from '../../components/ui/input';
import Button from '../../components/ui/button';
import Alert from '../../components/ui/alert';
import FormHeading from '../../components/ui/form-heading';
import StatusCard from '../../components/ui/status-card';
import { forgotPassword } from '../../lib/api';

type PageState = 'idle' | 'loading' | 'success' | 'error';

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [state, setState] = useState<PageState>('idle');
  const [error, setError] = useState('');

  const isLoading = state === 'loading';

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError('');

    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      setState('error');
      setError('Email address is required.');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      setState('error');
      setError('Enter a valid email address.');
      return;
    }

    setState('loading');

    try {
      await forgotPassword(normalizedEmail);
      setState('success');
    } catch (requestError) {
      setState('error');
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'We were unable to send a reset link. Please try again later.',
      );
    }
  }

  if (state === 'success') {
    return (
      <AuthLayout>
        <StatusCard
          iconBg="#eef6f2"
          iconColor="#2a6049"
          icon={<MailIcon />}
          title="Check your inbox"
          description="If an account exists for that email address, we've sent password reset instructions."
        >
          <div className="space-y-4">
            <p className="text-sm text-ink-muted leading-relaxed">
              Check your email and follow the reset link to choose a new
              password.
            </p>

            <button
              type="button"
              onClick={() => setState('idle')}
              className="text-sm text-brand font-medium hover:underline underline-offset-4"
            >
              Didn&apos;t receive it? Try again
            </button>

            <Button
              type="button"
              variant="secondary"
              size="lg"
              className="w-full"
              onClick={() => router.push('/login')}
            >
              Back to sign in
            </Button>
          </div>
        </StatusCard>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="space-y-8">
        <FormHeading
          title="Forgot your password?"
          subtitle="Enter the email address for your account and we'll send you a reset link."
        />

        {state === 'error' && error && (
          <Alert
            variant="error"
            title={
              error === 'Email address is required.'
                ? 'Email required'
                : 'Unable to send reset link'
            }
          >
            {error}
          </Alert>
        )}

        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          <Input
            label="Email address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);

              if (state === 'error') {
                setState('idle');
                setError('');
              }
            }}
            disabled={isLoading}
            autoComplete="email"
            required
          />

          <Button
            type="submit"
            className="w-full"
            size="lg"
            loading={isLoading}
          >
            {isLoading ? 'Sending reset link…' : 'Send reset link'}
          </Button>
        </form>

        <div className="text-center">
          <button
            type="button"
            onClick={() => router.push('/login')}
            className="text-sm text-brand font-medium hover:underline underline-offset-4 transition-colors"
          >
            Back to sign in
          </button>
        </div>
      </div>
    </AuthLayout>
  );
}

function MailIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <polyline points="3 7 12 13 21 7" />
    </svg>
  );
}