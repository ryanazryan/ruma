import { registerAs } from '@nestjs/config';

const DEFAULT_TOKEN_TTL_HOURS = 24;

function getPositiveInteger(
  value: string | undefined,
  fallback: number,
): number {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export const authConfig = registerAs('auth', () => ({
  frontendPublicUrl:
    process.env.FRONTEND_PUBLIC_URL?.replace(/\/$/, '') ??
    'http://localhost:3000',
  verificationTokenTtlHours: getPositiveInteger(
    process.env.VERIFICATION_TOKEN_TTL_HOURS,
    DEFAULT_TOKEN_TTL_HOURS,
  ),
  resendApiKey: process.env.RESEND_API_KEY,
  resendFromEmail: process.env.RESEND_FROM_EMAIL,
}));
