import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-canvas flex items-center justify-center px-6">
      <div className="text-center">
        <p className="text-[11px] font-medium text-brand uppercase tracking-widest mb-2">
          Ruma
        </p>

        <h1
          className="text-3xl font-semibold text-ink"
          style={{ fontFamily: 'Fraunces, Georgia, serif' }}
        >
          Customer Marketplace
        </h1>

        <p className="mt-3 text-sm text-ink-muted">
          Frontend integration in progress.
        </p>

        <Link
          href="/catalogue"
          className="inline-flex mt-6 h-11 items-center px-6 bg-brand text-white rounded-md text-sm font-medium hover:bg-brand-dark transition-colors"
        >
          Open Catalogue
        </Link>
      </div>
    </main>
  )
}