import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-line bg-cream">
      <div className="mx-auto max-w-350 px-4 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <p
              className="text-2xl font-semibold text-ink"
              style={{ fontFamily: 'Fraunces, Georgia, serif' }}
            >
              Ruma
            </p>

            <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-muted">
              Discover thoughtfully selected products from trusted brands,
              all in one place.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-ink">
              Shop
            </h3>

            <div className="mt-4 flex flex-col gap-3">
              <Link
                href="/catalogue"
                className="text-sm text-ink-muted transition-colors hover:text-brand"
              >
                Catalogue
              </Link>

              <Link
                href="/catalogue"
                className="text-sm text-ink-muted transition-colors hover:text-brand"
              >
                New Arrivals
              </Link>
            </div>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-ink">
              Account
            </h3>

            <div className="mt-4 flex flex-col gap-3">
              <Link
                href="/account"
                className="text-sm text-ink-muted transition-colors hover:text-brand"
              >
                My Account
              </Link>

              <Link
                href="/cart"
                className="text-sm text-ink-muted transition-colors hover:text-brand"
              >
                Shopping Cart
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-line pt-6 text-xs text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Ruma. All rights reserved.</p>

          <p>Marketplace platform</p>
        </div>
      </div>
    </footer>
  )
}