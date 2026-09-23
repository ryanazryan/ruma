'use client'

import Link from 'next/link'

import type { ApiBrand } from '@/api/brands'
import type { ApiProduct } from '@/api/products'
import { mapApiProduct } from '@/api/product-mapper'
import { ProductCard } from '@/components/marketplace/ProductCard'

interface BrandDetailProps {
    brand: ApiBrand
    products: ApiProduct[]
}

export function BrandDetail({
    brand,
    products,
}: BrandDetailProps) {
    const productViewModels = products.map(mapApiProduct)

    return (
        <main className="min-h-screen bg-canvas">
            <div className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8 lg:px-10">

                {/* Brand Hero */}
                <section className="relative my-6 overflow-hidden rounded-xl sm:my-8">
                    <div className="relative h-55 overflow-hidden sm:h-70 lg:h-80">
                        {brand.coverImageUrl ? (
                            <img
                                src={brand.coverImageUrl}
                                alt={`${brand.name} cover`}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center bg-muted-surface">
                                <span
                                    className="text-5xl font-semibold text-brand/20 sm:text-6xl"
                                    style={{
                                        fontFamily:
                                            'var(--font-fraunces), Georgia, serif',
                                    }}
                                >
                                    {brand.name}
                                </span>
                            </div>
                        )}

                        {/* Hero Overlay */}
                        <div className="absolute inset-0 bg-linear-to-r from-brand/85 via-brand/35 to-transparent" />

                        {/* Hero Content */}
                        <div className="absolute inset-0 flex flex-col justify-center px-7 sm:px-10 lg:px-12">
                            {/* Breadcrumb */}
                            <nav
                                className="mb-4 flex flex-wrap items-center gap-1.5 text-xs text-white/65"
                                aria-label="Breadcrumb"
                            >
                                <Link
                                    href="/"
                                    className="transition-colors hover:text-white"
                                >
                                    Home
                                </Link>

                                <span>/</span>

                                <Link
                                    href="/brands"
                                    className="transition-colors hover:text-white"
                                >
                                    Brands
                                </Link>

                                <span>/</span>

                                <span className="truncate text-white">
                                    {brand.name}
                                </span>
                            </nav>

                            {/* Brand Name */}
                            <h1
                                className="text-3xl font-light tracking-tight text-white sm:text-4xl lg:text-5xl"
                                style={{
                                    fontFamily:
                                        'var(--font-fraunces), Georgia, serif',
                                    fontStyle: 'italic',
                                }}
                            >
                                {brand.name}
                            </h1>

                            {/* Tagline */}
                            {brand.tagline && (
                                <p className="mt-2 text-sm text-white/75 sm:text-base">
                                    {brand.tagline}
                                </p>
                            )}
                        </div>
                    </div>
                </section>

                {/* Brand Information */}
                <section className="border-b border-line py-8 sm:py-10">
                    <div className="flex flex-col gap-8 md:flex-row md:items-start">

                        {/* Description */}
                        {brand.description && (
                            <div className="flex-1 md:max-w-[55%]">
                                <p className="text-sm leading-7 text-ink-sub sm:text-base">
                                    {brand.description}
                                </p>
                            </div>
                        )}

                        {/* Metadata */}
                        <div className="flex shrink-0 gap-10 sm:gap-14">
                            {brand.origin && (
                                <div>
                                    <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-ink-muted">
                                        Origin
                                    </p>

                                    <p className="text-sm font-medium text-ink">
                                        {brand.origin}
                                    </p>
                                </div>
                            )}

                            <div>
                                <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-ink-muted">
                                    Products
                                </p>

                                <p className="text-sm font-medium text-ink">
                                    {brand.productCount} items
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Brand Products */}
                <section className="py-10 sm:py-12">
                    <div className="mb-7">
                        <h2
                            className="text-xl font-semibold tracking-tight text-ink sm:text-2xl"
                            style={{
                                fontFamily:
                                    'var(--font-fraunces), Georgia, serif',
                            }}
                        >
                            {products.length} products from {brand.name}
                        </h2>
                    </div>

                    {productViewModels.length > 0 ? (
                        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
                            {productViewModels.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onProductClick={(slug) => {
                                        window.location.href = `/product/${slug}`
                                    }}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-xl border border-dashed border-line px-5 py-20 text-center">
                            <h3 className="text-sm font-semibold text-ink">
                                No products available
                            </h3>

                            <p className="mt-1 text-xs text-ink-muted">
                                This brand does not have any available
                                products yet.
                            </p>

                            <Link
                                href="/brands"
                                className="mt-5 inline-block text-xs font-medium text-brand hover:underline"
                            >
                                Back to brands
                            </Link>
                        </div>
                    )}
                </section>
            </div>
        </main>
    )
}