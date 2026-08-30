import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import ChangePasswordForm from './change-password-form';
import { getCurrentUserWithCookie } from '../../lib/api';

export default async function ChangePasswordPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session');

  if (!sessionCookie?.value) {
    redirect('/login');
  }

  try {
    await getCurrentUserWithCookie(
      `session=${sessionCookie.value}`,
    );
  } catch {
    redirect('/login');
  }

  return <ChangePasswordForm />;
}