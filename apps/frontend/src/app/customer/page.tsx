export default function CustomerPage() {
  return (
    <main className="min-h-screen bg-canvas">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <h1
          className="text-3xl font-semibold tracking-tight text-ink"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Customer Dashboard
        </h1>

        <p className="mt-2 text-sm text-ink-muted">
          Welcome to your Ruma account.
        </p>
      </div>
    </main>
  );
}