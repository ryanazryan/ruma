'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

import AuthLayout from '../../components/auth/AuthLayout';
import Input from '../../components/ui/input';
import PasswordInput from '../../components/ui/password-input';
import Button from '../../components/ui/button';
import Alert from '../../components/ui/alert';
import FormHeading from '../../components/ui/form-heading';
import StatusCard from '../../components/ui/status-card';
import { loginUser } from '../../lib/api';

type LoginState = 'idle' | 'loading' | 'invalidCredentials' | 'success';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [state, setState] = useState<LoginState>('idle');
  const [error, setError] = useState('');

  const isLoading = state === 'loading';
  const isInvalid = state === 'invalidCredentials';

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError('');

    if (!email.trim()) {
      setState('invalidCredentials');
      setError('Email address is required.');
      return;
    }

    if (!password) {
      setState('invalidCredentials');
      setError('Password is required.');
      return;
    }

    setState('loading');

    try {
      await loginUser({
        email: email.trim(),
        password,
      });

      setState('success');

      window.setTimeout(() => {
        router.push('/customer');
      }, 1200);
    } catch (requestError) {
      setState('invalidCredentials');

      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Unable to sign in.',
      );
    }
  }

  if (state === 'success') {
    return (
      <AuthLayout>
        <StatusCard
          iconBg="#eef6f2"
          iconColor="#2a6049"
          icon={<SuccessIcon />}
          title="Welcome back"
          description="You've been signed in successfully. Redirecting to your account…"
        >
          <div className="space-y-3">
            <div className="h-1.5 rounded-full bg-line overflow-hidden">
              <div
                className="h-full bg-brand rounded-full animate-[progressFill_1.2s_ease-in-out_forwards]"
                style={{ width: '0%' }}
              />
            </div>

            <p className="text-xs text-ink-muted text-center">
              Taking you to your account
            </p>
          </div>

          <style jsx>{`
            @keyframes progressFill {
              from {
                width: 0%;
              }
              to {
                width: 100%;
              }
            }
          `}</style>
        </StatusCard>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="space-y-8">
        <FormHeading
          title="Sign in"
          subtitle="Welcome back. Enter your credentials to continue."
        />

        {isInvalid && error && (
          <Alert
            variant="error"
            title={
              error === 'Email address is required.'
                ? 'Email required'
                : error === 'Password is required.'
                  ? 'Password required'
                  : 'Incorrect email or password'
            }
          >
            {error === 'Email address is required.' ||
            error === 'Password is required.'
              ? error
              : 'Please check your credentials and try again. If you’ve forgotten your password, you can reset it below.'}
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

              if (isInvalid) {
                setState('idle');
                setError('');
              }
            }}
            disabled={isLoading}
            autoComplete="email"
            required
          />

          <div className="space-y-2">
            <PasswordInput
              label="Password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);

                if (isInvalid) {
                  setState('idle');
                  setError('');
                }
              }}
              disabled={isLoading}
              autoComplete="current-password"
              required
            />

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => router.push('/forgot-password')}
                className="text-xs text-brand hover:underline underline-offset-4 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1 rounded"
              >
                Forgot password?
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            loading={isLoading}
          >
            {isLoading ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>

        <p className="text-sm text-center text-ink-muted">
          Don&apos;t have an account?{' '}
          <button
            type="button"
            onClick={() => router.push('/register')}
            className="text-brand font-medium hover:underline underline-offset-4 transition-colors"
          >
            Create account
          </button>
        </p>
      </div>
    </AuthLayout>
  );
}

function SuccessIcon() {
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
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}