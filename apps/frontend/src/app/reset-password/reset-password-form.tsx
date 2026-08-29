'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import AuthLayout from '../../components/auth/AuthLayout';
import PasswordInput from '../../components/ui/password-input';
import Button from '../../components/ui/button';
import Alert from '../../components/ui/alert';
import FormHeading from '../../components/ui/form-heading';
import StatusCard from '../../components/ui/status-card';
import { resetPassword } from '../../lib/api';

type PageState = 'idle' | 'loading' | 'error' | 'success';

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get('token') ?? '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [state, setState] = useState<PageState>(
    token ? 'idle' : 'error',
  );
  const [error, setError] = useState(
    token ? '' : 'Password reset link is invalid or missing.',
  );

  const isLoading = state === 'loading';

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError('');

    if (!token) {
      setState('error');
      setError('Password reset link is invalid or missing.');
      return;
    }

    if (newPassword.length < 8) {
      setState('error');
      setError('Password must be at least 8 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setState('error');
      setError('Password confirmation does not match.');
      return;
    }

    setState('loading');

    try {
      await resetPassword({
        token,
        newPassword,
        confirmPassword,
      });

      setState('success');
    } catch (requestError) {
      setState('error');
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Password reset failed. Please request a new reset link.',
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
          title="Password updated"
          description="You can now sign in with your new password."
        >
          <Button
            type="button"
            size="lg"
            className="w-full"
            onClick={() => router.push('/login')}
          >
            Sign in
          </Button>
        </StatusCard>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="space-y-8">
        <FormHeading
          title="Set new password"
          subtitle="Choose a new password for your Ruma account."
        />

        {state === 'error' && error && (
          <Alert
            variant="error"
            title="Unable to reset password"
          >
            {error}
          </Alert>
        )}

        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          <PasswordInput
            label="New password"
            placeholder="••••••••"
            value={newPassword}
            onChange={(event) => {
              setNewPassword(event.target.value);

              if (state === 'error') {
                setState('idle');
                setError('');
              }
            }}
            disabled={isLoading}
            autoComplete="new-password"
            hint="At least 8 characters"
            required
          />

          <PasswordInput
            label="Confirm new password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(event) => {
              setConfirmPassword(event.target.value);

              if (state === 'error') {
                setState('idle');
                setError('');
              }
            }}
            disabled={isLoading}
            autoComplete="new-password"
            required
          />

          <Button
            type="submit"
            className="w-full"
            size="lg"
            loading={isLoading}
          >
            {isLoading ? 'Updating password…' : 'Reset password'}
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