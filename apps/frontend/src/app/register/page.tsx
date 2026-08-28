'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';

import { registerUser } from '../../lib/api';

type FormValues = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const initialValues: FormValues = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

function validate(values: FormValues): string | undefined {
  const fullName = values.fullName.trim();

  if (fullName.length < 3 || fullName.length > 100) {
    return 'Full name must be between 3 and 100 characters.';
  }

  if (!/^\S+@\S+\.\S+$/.test(values.email.trim())) {
    return 'Enter a valid email address.';
  }

  if (values.password.length < 8) {
    return 'Password must be at least 8 characters.';
  }

  if (values.password !== values.confirmPassword) {
    return 'Password confirmation does not match.';
  }

  return undefined;
}

export default function RegisterPage() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const updateValue = (field: keyof FormValues, value: string) => {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    const validationError = validate(values);

    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      await registerUser({
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        password: values.password,
        confirmPassword: values.confirmPassword,
      });

      setIsRegistered(true);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Unable to register your account.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isRegistered) {
    return (
      <PageFrame>
        <h1 className="text-2xl font-semibold text-slate-900">
          Registration successful
        </h1>

        <p className="mt-3 text-slate-600">
          Please check your email and open the verification link to activate
          your account.
        </p>

        <Link
          className="mt-6 inline-block font-medium text-emerald-700 hover:underline"
          href="/verify-email/resend"
        >
          Didn&apos;t receive an email? Resend verification
        </Link>
      </PageFrame>
    );
  }

  return (
    <PageFrame>
      <h1 className="text-2xl font-semibold text-slate-900">
        Create your account
      </h1>

      <p className="mt-2 text-slate-600">
        Register to begin using Ruma.
      </p>

      <form
        className="mt-8 space-y-5"
        onSubmit={handleSubmit}
        noValidate
      >
        <Field
          label="Full name"
          name="fullName"
          value={values.fullName}
          onChange={(value) => updateValue('fullName', value)}
          autoComplete="name"
        />

        <Field
          label="Email address"
          name="email"
          type="email"
          value={values.email}
          onChange={(value) => updateValue('email', value)}
          autoComplete="email"
        />

        <Field
          label="Password"
          name="password"
          type="password"
          value={values.password}
          onChange={(value) => updateValue('password', value)}
          autoComplete="new-password"
        />

        <Field
          label="Confirm password"
          name="confirmPassword"
          type="password"
          value={values.confirmPassword}
          onChange={(value) => updateValue('confirmPassword', value)}
          autoComplete="new-password"
        />

        {error ? (
          <p className="text-sm text-red-700">{error}</p>
        ) : null}

        <button
          className="w-full rounded-md bg-emerald-700 px-4 py-2 font-medium text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Registering…' : 'Register'}
        </button>
      </form>
    </PageFrame>
  );
}

function PageFrame({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto flex min-h-screen max-w-lg items-center px-6 py-12">
      <section className="w-full rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        {children}
      </section>
    </main>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  type = 'text',
  autoComplete,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete: string;
}) {
  return (
    <label
      className="block text-sm font-medium text-slate-700"
      htmlFor={name}
    >
      {label}

      <input
        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none ring-emerald-600 focus:ring-2"
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required
      />
    </label>
  );
}