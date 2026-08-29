'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import Button from '../ui/button';
import { logoutUser } from '../../lib/api';

interface LogoutButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function LogoutButton({
  variant = 'ghost',
  size = 'md',
  className = '',
}: LogoutButtonProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      await logoutUser();

      router.replace('/login');
    } catch (error) {
      console.error('Logout failed:', error);

      setIsLoggingOut(false);
    }
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      loading={isLoggingOut}
      onClick={handleLogout}
      className={className}
    >
      {isLoggingOut ? 'Signing out…' : 'Sign out'}
    </Button>
  );
}