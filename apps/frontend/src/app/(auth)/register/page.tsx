'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'

import AuthLayout from '@/components/auth/AuthLayout'

import Alert from '@/components/ui/alert'
import Button from '@/components/ui/button'
import FormHeading from '@/components/ui/form-heading'
import Input from '@/components/ui/input'
import PasswordInput from '@/components/ui/password-input'

import { registerUser } from '@/lib/api'

type FormValues = {
  fullName: string
  email: string
  password: string
  confirmPassword: string
}

const initialValues: FormValues = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
}

type FieldErrors = {
  fullName?: string
  email?: string
  password?: string
  confirmPassword?: string
}

function validate(values: FormValues): FieldErrors {
  const errors: FieldErrors = {}

  const fullName = values.fullName.trim()
  const email = values.email.trim()

  if (fullName.length < 3 || fullName.length > 100) {
    errors.fullName =
      'Full name must be between 3 and 100 characters.'
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    errors.email = 'Enter a valid email address.'
  }

  if (values.password.length < 8) {
    errors.password =
      'Password must be at least 8 characters.'
  }

  if (values.password !== values.confirmPassword) {
    errors.confirmPassword =
      'Password confirmation does not match.'
  }

  return errors
}

export default function RegisterPage() {
  const [values, setValues] = useState<FormValues>(initialValues)

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  const [serverError, setServerError] = useState('')

  const [successMessage, setSuccessMessage] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)

  const [isRegistered, setIsRegistered] = useState(false)

  const updateValue = (
    field: keyof FormValues,
    value: string,
  ) => {
    setValues((current) => ({
      ...current,
      [field]: value,
    }))

    setFieldErrors((current) => ({
      ...current,
      [field]: undefined,
    }))

    setServerError('')
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    setServerError('')

    const errors = validate(values)

    setFieldErrors(errors)

    if (Object.keys(errors).length > 0) {
      return
    }

    setIsSubmitting(true)

    try {
      const response = await registerUser({
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        password: values.password,
        confirmPassword: values.confirmPassword,
      })

      setSuccessMessage(response.message)
      setIsRegistered(true)
    } catch (requestError) {
      setServerError(
        requestError instanceof Error
          ? requestError.message
          : 'Unable to register your account.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isRegistered) {
    return (
      <AuthLayout>
        <RegistrationSuccess
          email={values.email.trim()}
          message={successMessage}
        />
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <div className="space-y-8">
        <FormHeading
          title="Create account"
          subtitle="Join Ruma to discover premium brands and curated collections."
        />

        {serverError && (
          <Alert
            variant="error"
            title="Something went wrong"
          >
            {serverError}
          </Alert>
        )}

        <form
          className="space-y-5"
          onSubmit={handleSubmit}
          noValidate
        >
          <Input
            label="Full name"
            name="fullName"
            type="text"
            placeholder="Your full name"
            value={values.fullName}
            onChange={(event) =>
              updateValue(
                'fullName',
                event.target.value,
              )
            }
            error={fieldErrors.fullName}
            disabled={isSubmitting}
            autoComplete="name"
            required
          />

          <Input
            label="Email address"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={values.email}
            onChange={(event) =>
              updateValue(
                'email',
                event.target.value,
              )
            }
            error={fieldErrors.email}
            disabled={isSubmitting}
            autoComplete="email"
            required
          />

          <PasswordInput
            label="Password"
            name="password"
            placeholder="••••••••"
            value={values.password}
            onChange={(event) =>
              updateValue(
                'password',
                event.target.value,
              )
            }
            error={fieldErrors.password}
            hint={
              !fieldErrors.password
                ? '8+ characters with letters, numbers, or symbols'
                : undefined
            }
            disabled={isSubmitting}
            autoComplete="new-password"
            required
          />

          <PasswordInput
            label="Confirm password"
            name="confirmPassword"
            placeholder="••••••••"
            value={values.confirmPassword}
            onChange={(event) =>
              updateValue(
                'confirmPassword',
                event.target.value,
              )
            }
            error={fieldErrors.confirmPassword}
            disabled={isSubmitting}
            autoComplete="new-password"
            required
          />

          <Button
            type="submit"
            className="w-full"
            size="lg"
            loading={isSubmitting}
          >
            {isSubmitting
              ? 'Creating account…'
              : 'Create account'}
          </Button>
        </form>

        <p className="text-sm text-center text-ink-muted">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-brand font-medium hover:text-brand-dark transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}

function RegistrationSuccess({
  email,
  message,
}: {
  email: string
  message: string
}) {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="w-16 h-16 rounded-full bg-brand-tint flex items-center justify-center">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#2a6049"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        </div>

        <div>
          <h1
            className="text-2xl font-semibold text-ink tracking-tight"
            style={{
              fontFamily:
                'var(--font-fraunces), Georgia, serif',
            }}
          >
            Check your inbox
          </h1>

          <p className="text-sm text-ink-muted mt-2 leading-relaxed">
            {message}
          </p>

          <p className="text-sm text-ink-muted mt-3 leading-relaxed">
            Registered email:{' '}
            <span className="font-medium text-ink">
              {email}
            </span>
          </p>
        </div>
      </div>

      <div className="p-4 rounded-md border border-line bg-muted-surface space-y-1">
        <p className="text-xs font-medium text-ink-sub">
          Didn&apos;t receive the email?
        </p>

        <p className="text-xs text-ink-muted">
          Check your spam folder, or request a new
          verification link below.
        </p>
      </div>

      <div className="space-y-3">
        <Link
          href="/verify-email/resend"
          className="flex items-center justify-center w-full h-12 px-6 rounded-md bg-cream border border-line text-brand font-medium hover:bg-cream-dark hover:border-line-strong transition-colors"
        >
          Resend verification email
        </Link>

        <p className="text-sm text-center text-ink-muted">
          Already verified?{' '}
          <Link
            href="/login"
            className="text-brand font-medium hover:text-brand-dark transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}