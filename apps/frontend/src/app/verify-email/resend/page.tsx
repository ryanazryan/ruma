import Link from 'next/link';
import { ResendVerificationForm } from '../../../components/resend-verification-form';

export default function ResendVerificationPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-lg items-center px-6 py-12">
      <section className="w-full rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">
          Resend verification email
        </h1>

        <p className="mt-2 text-slate-600">
          Enter the email address you used to register. If the account
          requires verification, we&apos;ll send a new verification email.
        </p>

        <div className="mt-8">
          <ResendVerificationForm />
        </div>

        <Link
          className="mt-6 inline-block font-medium text-emerald-700 hover:underline"
          href="/register"
        >
          Back to registration
        </Link>
      </section>
    </main>
  );
}