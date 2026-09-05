'use client'

import Link from 'next/link'
import { useMemo } from 'react'

import { ProductCard } from '@/components/marketplace/ProductCard'
import { useWishlist } from '@/components/providers/WishlistProvider'
import type { ProductViewModel } from '@/types/product'

function EmptyWishlist() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-line bg-canvas">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-ink-faint"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z" />
        </svg>
      </div>

      <h2
        className="text-base font-semibold text-ink"
        style={{
          fontFamily: 'var(--font-fraunces), Georgia, serif',
        }}
      >
        Your wishlist is empty
      </h2>

      <p className="mt-1 max-w-sm text-sm leading-relaxed text-ink-muted">
        Save items you love by pressing the heart icon on any product.
        They&apos;ll all appear here.
      </p>

      <Link
        href="/catalogue"
        className="mt-5 inline-flex h-10 items-center rounded-md bg-brand px-5 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
      >
        Browse products
      </Link>
    </div>
  )
}

function WishlistSuggestions({
  products,
  wishlistProductIds,
}: {
  products: ProductViewModel[]
  wishlistProductIds: string[]
}) {
  const suggestions = useMemo(
    () =>
      products
        .filter((product) => !wishlistProductIds.includes(product.id))
        .slice(0, 4),
    [products, wishlistProductIds],
  )

  if (suggestions.length === 0) {
    return null
  }

  return (
    <section className="mt-10">
      <h3
        className="mb-5 text-base font-semibold text-ink"
        style={{
          fontFamily: 'var(--font-fraunces), Georgia, serif',
        }}
      >
        You might also like
      </h3>

      <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
        {suggestions.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onProductClick={() =>
              window.location.assign(`/catalogue/${product.slug}`)
            }
          />
        ))}
      </div>
    </section>
  )
}

export function WishlistPage() {
  const { items, isLoading } = useWishlist()

  const savedProducts = useMemo<ProductViewModel[]>(
    () =>
      items.map((item) => ({
        id: item.product.id,
        sku: item.product.sku,
        name: item.product.name,
        slug: item.product.slug,
        description: item.product.description,
        price: item.product.price,

        brandId: item.product.brandId,
        brand: item.product.brand.name,

        categoryId: item.product.categoryId,
        category: item.product.category.name,

        supplierId: item.product.supplierId,
        supplier: item.product.supplier.name,

        photo: item.product.media[0]?.url ?? null,

        images: [...item.product.media]
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((media) => media.url),

        createdAt: item.product.createdAt,
        updatedAt: item.product.updatedAt,

        // Wishlist API currently does not expose whether
        // the product is new.
        isNew: false,
      })),
    [items],
  )

  const wishlistProductIds = useMemo(
    () => items.map((item) => item.productId),
    [items],
  )

  const savedCount = savedProducts.length

  if (isLoading) {
    return (
      <main className="min-h-screen bg-canvas">
        <div className="mx-auto w-full max-w-7xl px-4 pt-8 pb-16 sm:px-6 lg:px-8">
          <p className="text-sm text-ink-muted">
            Loading wishlist...
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-canvas">
      <div className="mx-auto w-full max-w-7xl px-4 pt-8 pb-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-start justify-between gap-6">
          <div>
            <h1
              className="text-xl font-semibold tracking-tight text-ink"
              style={{
                fontFamily: 'var(--font-fraunces), Georgia, serif',
              }}
            >
              Wishlist
            </h1>

            {savedCount > 0 && (
              <p className="mt-0.5 text-sm text-ink-muted">
                {savedCount} saved{' '}
                {savedCount === 1 ? 'item' : 'items'}
              </p>
            )}
          </div>

          {savedCount > 0 && (
            <Link
              href="/catalogue"
              className="shrink-0 text-sm font-medium text-brand transition-colors hover:text-brand-dark"
            >
              Continue shopping →
            </Link>
          )}
        </div>

        {savedCount === 0 ? (
          <EmptyWishlist />
        ) : (
          <>
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
              {savedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onProductClick={() =>
                    window.location.assign(
                      `/catalogue/${product.slug}`,
                    )
                  }
                />
              ))}
            </div>

            <section className="mt-14 border-t border-line pt-10">
              <div className="flex flex-col items-start justify-between gap-6 rounded-sm bg-brand-tint p-6 md:flex-row md:items-center">
                <div>
                  <h3 className="mb-1 text-sm font-semibold text-ink">
                    You have {savedCount} item
                  {savedCount !== 1 ? 's' : ''} saved
                  </h3>

                  <p className="text-xs text-ink-muted">
                    Items in your wishlist are not reserved — shop when
                    you&apos;re ready.
                  </p>
                </div>

                <Link
                  href="/catalogue"
                  className="flex h-9 shrink-0 items-center rounded-md bg-brand px-4 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
                >
                  Continue shopping
                </Link>
              </div>

              <WishlistSuggestions
                products={savedProducts}
                wishlistProductIds={wishlistProductIds}
              />
            </section>
          </>
        )}
      </div>
    </main>
  )
}