import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import LogoutButton from '../../components/auth/logout-button';
import { getCurrentUserWithCookie } from '../../lib/api';

export default async function CustomerPage() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');

    if (!sessionCookie?.value) {
        redirect('/login');
    }

    try {
        const response = await getCurrentUserWithCookie(
            `session=${sessionCookie.value}`,
        );

        return (
            <main className="min-h-screen bg-canvas">
                <div className="mx-auto max-w-7xl px-6 py-12">
                    <div className="flex items-start justify-between gap-6">
                        <div>
                            <p className="text-sm font-medium text-brand">
                                Welcome back
                            </p>

                            <h1
                                className="mt-1 text-3xl font-semibold tracking-tight text-ink"
                                style={{ fontFamily: 'var(--font-display)' }}
                            >
                                {response.data.user.fullName}
                            </h1>

                            <p className="mt-2 text-sm text-ink-muted">
                                Welcome to your Ruma account.
                            </p>

                            <p className="mt-1 text-sm text-ink-muted">
                                {response.data.user.email}
                            </p>
                        </div>

                        <LogoutButton />
                    </div>
                </div>
            </main>
        );
    } catch {
        redirect('/login');
    }
}