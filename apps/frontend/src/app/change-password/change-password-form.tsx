'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { useRouter } from 'next/navigation';

import AuthLayout from '../../components/auth/AuthLayout';
import PasswordInput from '../../components/ui/password-input';
import Button from '../../components/ui/button';
import Alert from '../../components/ui/alert';
import FormHeading from '../../components/ui/form-heading';
import StatusCard from '../../components/ui/status-card';
import { changePassword } from '../../lib/api';

type PageState =
  | 'idle'
  | 'loading'
  | 'wrongPassword'
  | 'validationError'
  | 'success';

export default function ChangePasswordForm() {
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [state, setState] = useState<PageState>('idle');
  const [error, setError] = useState('');

  const isLoading = state === 'loading';

  function clearError() {
    if (state !== 'idle') {
      setState('idle');
      setError('');
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError('');

    if (!currentPassword) {
      setState('validationError');
      setError('Current password is required.');
      return;
    }

    if (newPassword.length < 8) {
      setState('validationError');
      setError('Password must be at least 8 characters.');
      return;
    }

    if (!confirmPassword) {
      setState('validationError');
      setError('Password confirmation is required.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setState('validationError');
      setError('Password confirmation does not match.');
      return;
    }

    setState('loading');

    try {
      await changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      setState('success');
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : 'Unable to change your password.';

      if (
        message.toLowerCase().includes('current password') ||
        message.toLowerCase().includes('incorrect')
      ) {
        setState('wrongPassword');
      } else {
        setState('validationError');
      }

      setError(message);
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
          description="Your password has been changed successfully. Please sign in again to continue."
        >
          <Button
            type="button"
            size="lg"
            className="w-full"
            onClick={() => router.replace('/login')}
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
          title="Change password"
          subtitle="Enter your current password to confirm your identity, then choose a new one."
        />

        {(state === 'wrongPassword' ||
          state === 'validationError') &&
          error && (
            <Alert
              variant="error"
              title={
                state === 'wrongPassword'
                  ? 'Incorrect current password'
                  : 'Unable to change password'
              }
            >
              {error}
            </Alert>
          )}

        <form
          className="space-y-5"
          onSubmit={handleSubmit}
          noValidate
        >
          <PasswordInput
            label="Current password"
            placeholder="••••••••"
            value={currentPassword}
            onChange={(event) => {
              setCurrentPassword(event.target.value);
              clearError();
            }}
            disabled={isLoading}
            autoComplete="current-password"
            required
          />

          <div className="border-t border-line pt-5 space-y-5">
            <p className="text-xs uppercase tracking-[0.08em] text-ink-muted">
              New password
            </p>

            <PasswordInput
              label="New password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(event) => {
                setNewPassword(event.target.value);
                clearError();
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
                clearError();
              }}
              disabled={isLoading}
              autoComplete="new-password"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            loading={isLoading}
          >
            {isLoading ? 'Updating password…' : 'Update password'}
          </Button>
        </form>
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