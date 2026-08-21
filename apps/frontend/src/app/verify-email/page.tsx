'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { verifyEmail } from '../../lib/api';

type VerificationState = 'loading' | 'success' | 'error';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const hasValidToken = token !== null && token.trim() !== '';

  const [state, setState] = useState<VerificationState>(
    hasValidToken ? 'loading' : 'error',
  );
  const [message, setMessage] = useState(
    hasValidToken ? '' : 'Verification token is missing.',
  );

  useEffect(() => {
    if (!hasValidToken || token === null) {
      return;
    }

    let cancelled = false;

    async function verify(tokenValue: string) {
      try {
        const response = await verifyEmail(tokenValue);

        if (cancelled) {
          return;
        }

        setState('success');
        setMessage(response.message);
      } catch (requestError) {
        if (cancelled) {
          return;
        }

        setState('error');
        setMessage(
          requestError instanceof Error
            ? requestError.message
            : 'Unable to verify your email.',
        );
      }
    }

    void verify(token);

    return () => {
      cancelled = true;
    };
  }, [hasValidToken, token]);

  if (state === 'loading') {
    return (
      <PageFrame>
        <h1 className="text-2xl font-semibold text-slate-900">
          Verifying your email
        </h1>

        <p className="mt-3 text-slate-600">
          Please wait while we verify your email address.
        </p>
      </PageFrame>
    );
  }

  if (state === 'success') {
    return (
      <PageFrame>
        <h1 className="text-2xl font-semibold text-slate-900">
          Email verified
        </h1>

        <p className="mt-3 text-slate-600">{message}</p>

        <Link
          className="mt-6 inline-block rounded-md bg-emerald-700 px-4 py-2 font-medium text-white hover:bg-emerald-800"
          href="/"
        >
          Continue
        </Link>
      </PageFrame>
    );
  }

  return (
    <PageFrame>
      <h1 className="text-2xl font-semibold text-slate-900">
        Email verification failed
      </h1>

      <p className="mt-3 text-red-700">{message}</p>

      <Link
        className="mt-6 inline-block font-medium text-emerald-700 hover:underline"
        href="/verify-email/resend"
      >
        Request a new verification email
      </Link>
    </PageFrame>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <PageFrame>
          <h1 className="text-2xl font-semibold text-slate-900">
            Verifying your email
          </h1>

          <p className="mt-3 text-slate-600">
            Please wait while we verify your email address.
          </p>
        </PageFrame>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}

function PageFrame({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto flex min-h-screen max-w-lg items-center px-6 py-12">
      <section className="w-full rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        {children}
      </section>
    </main>
  );
}