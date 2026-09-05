'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { ApiProduct } from '@/api/products'
import { useWishlist } from '@/components/providers/WishlistProvider'

interface ProductDetailProps {
    product: ApiProduct
    rating?: {
        averageRating: number | null
        totalReviews: number
        ratingDistribution: {
            5: number
            4: number
            3: number
            2: number
            1: number
        }
    }
    reviews?: Array<{
        id: string
        productId: string
        userId: string
        rating: number
        reviewText: string | null
        createdAt: string
        updatedAt: string
        user: {
            id: string
            fullName: string
        }
    }>
    relatedProducts?: ApiProduct[]
}

function formatPrice(price: number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(price)
}

function RatingStars({
    rating,
    size = 14,
}: {
    rating: number
    size?: number
}) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => {
                const filled = rating >= star

                return (
                    <svg
                        key={star}
                        width={size}
                        height={size}
                        viewBox="0 0 24 24"
                        fill={filled ? 'currentColor' : 'none'}
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className={
                            filled ? 'text-gold' : 'text-ink-faint'
                        }
                        aria-hidden="true"
                    >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                )
            })}
        </div>
    )
}

function RatingBar({
    stars,
    count,
    total,
}: {
    stars: number
    count: number
    total: number
}) {
    const percentage =
        total > 0 ? Math.round((count / total) * 100) : 0

    return (
        <div className="flex items-center gap-3">
            <span className="w-3 text-xs text-ink-muted">
                {stars}
            </span>

            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
                <div
                    className="h-full rounded-full bg-gold transition-all"
                    style={{ width: `${percentage}%` }}
                />
            </div>

            <span className="w-8 text-right text-xs text-ink-faint">
                {percentage}%
            </span>
        </div>
    )
}

export function ProductDetail({
    product,
    rating,
    reviews = [],
    relatedProducts = [],
}: ProductDetailProps) {
    const [activeImage, setActiveImage] = useState(0)

    const [activeTab, setActiveTab] = useState<
        'description' | 'details' | 'shipping'
    >('description')

    const {
        isProductWishlisted,
        toggleWishlist,
    } = useWishlist()

    const isWishlisted = isProductWishlisted(product.id)

    const images = [...product.media].sort(
        (a, b) => a.sortOrder - b.sortOrder,
    )

    const averageRating = rating?.averageRating ?? null
    const totalReviews = rating?.totalReviews ?? 0

    const ratingDistribution = rating?.ratingDistribution ?? {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
    }

    const handleWishlistToggle = async () => {
        try {
            await toggleWishlist(product.id)
        } catch (error) {
            console.error('Failed to update wishlist:', error)
        }
    }

    return (
        <main className="min-h-screen bg-canvas">
            <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
                {/* Breadcrumb */}
                <nav
                    className="mb-8 flex flex-wrap items-center gap-1.5 text-xs text-ink-muted"
                    aria-label="Breadcrumb"
                >
                    <Link
                        href="/"
                        className="hover:text-ink"
                    >
                        Home
                    </Link>

                    <span>/</span>

                    <Link
                        href="/catalogue"
                        className="hover:text-ink"
                    >
                        All Products
                    </Link>

                    <span>/</span>

                    <span className="text-ink">
                        {product.name}
                    </span>
                </nav>

                {/* Product */}
                <section className="flex flex-col gap-10 pb-16 lg:flex-row lg:gap-14">
                    {/* Gallery */}
                    <div className="lg:w-[55%]">
                        <div className="aspect-4/5 overflow-hidden rounded-sm bg-muted-surface">
                            {images.length > 0 ? (
                                <img
                                    src={images[activeImage].url}
                                    alt={product.name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center text-sm text-ink-faint">
                                    No image available
                                </div>
                            )}
                        </div>

                        {images.length > 1 && (
                            <div className="overflow-hidden">
                                <div className="flex gap-2 overflow-x-auto px-1 py-1">
                                    {images.map((image, index) => (
                                        <button
                                            key={image.id}
                                            type="button"
                                            onClick={() =>
                                                setActiveImage(index)
                                            }
                                            className={[
                                                'w-20 aspect-4/5 shrink-0 rounded-sm overflow-hidden',
                                                'transition-all',
                                                index === activeImage
                                                    ? 'ring-2 ring-brand ring-offset-1'
                                                    : 'opacity-60 hover:opacity-80',
                                            ].join(' ')}
                                        >
                                            <img
                                                src={image.url}
                                                alt={`${product.name} view ${index + 1}`}
                                                className="h-full w-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Product Information */}
                    <div className="lg:w-[45%] lg:sticky lg:top-24 lg:self-start">
                        <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.18em] text-brand">
                            {product.brand.name}
                        </p>

                        <h1
                            className="text-2xl font-semibold leading-snug tracking-tight text-ink sm:text-3xl"
                            style={{
                                fontFamily:
                                    'var(--font-fraunces), Georgia, serif',
                            }}
                        >
                            {product.name}
                        </h1>

                        <div className="mt-4 flex items-center gap-2">
                            {averageRating !== null ? (
                                <>
                                    <RatingStars rating={averageRating} />

                                    <span className="text-sm font-medium text-ink">
                                        {averageRating.toFixed(1)}
                                    </span>

                                    <span className="text-sm text-ink-muted">
                                        ({totalReviews} reviews)
                                    </span>
                                </>
                            ) : (
                                <span className="text-sm text-ink-muted">
                                    No reviews yet
                                </span>
                            )}
                        </div>

                        <p className="mt-5 text-2xl font-semibold text-ink">
                            {formatPrice(product.price)}
                        </p>

                        <p className="mt-2 text-xs text-ink-faint">
                            SKU: {product.sku}
                        </p>

                        <div className="mt-7 space-y-3">
                            <button
                                type="button"
                                className="h-12 w-full rounded-md bg-brand text-sm font-medium text-white transition-colors hover:bg-brand-dark"
                            >
                                Add to cart
                            </button>

                            {/* Wishlist */}
                            <button
                                type="button"
                                onClick={handleWishlistToggle}
                                className={[
                                    'flex h-12 w-full items-center justify-center gap-2 rounded-md border',
                                    'text-sm font-medium transition-colors',
                                    isWishlisted
                                        ? 'border-brand bg-brand/5 text-brand'
                                        : 'border-line text-ink-sub hover:border-line-strong hover:text-ink',
                                ].join(' ')}
                                aria-label={
                                    isWishlisted
                                        ? `Remove ${product.name} from wishlist`
                                        : `Add ${product.name} to wishlist`
                                }
                            >
                                <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill={isWishlisted ? 'currentColor' : 'none'}
                                    stroke="currentColor"
                                    strokeWidth="1.75"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    aria-hidden="true"
                                >
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z" />
                                </svg>

                                {isWishlisted
                                    ? 'Saved to wishlist'
                                    : 'Save to wishlist'}
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="mt-8 border-b border-line">
                            <div className="flex">
                                {(
                                    [
                                        'description',
                                        'details',
                                        'shipping',
                                    ] as const
                                ).map((tab) => (
                                    <button
                                        key={tab}
                                        type="button"
                                        onClick={() =>
                                            setActiveTab(tab)
                                        }
                                        className={`border-b-2 px-4 py-2.5 text-sm font-medium capitalize transition-colors ${activeTab === tab
                                            ? 'border-brand text-brand'
                                            : 'border-transparent text-ink-muted hover:text-ink'
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {activeTab === 'description' && (
                            <p className="mt-5 text-sm leading-relaxed text-ink-sub">
                                {product.description ||
                                    'No product description available.'}
                            </p>
                        )}

                        {activeTab === 'details' && (
                            <dl className="mt-5 space-y-3">
                                <div className="flex gap-4">
                                    <dt className="w-28 shrink-0 text-xs font-medium text-ink-muted">
                                        Category
                                    </dt>

                                    <dd className="text-xs text-ink-sub">
                                        {product.category.name}
                                    </dd>
                                </div>

                                <div className="flex gap-4">
                                    <dt className="w-28 shrink-0 text-xs font-medium text-ink-muted">
                                        Brand
                                    </dt>

                                    <dd className="text-xs text-ink-sub">
                                        {product.brand.name}
                                    </dd>
                                </div>

                                <div className="flex gap-4">
                                    <dt className="w-28 shrink-0 text-xs font-medium text-ink-muted">
                                        Supplier
                                    </dt>

                                    <dd className="text-xs text-ink-sub">
                                        {product.supplier.name}
                                    </dd>
                                </div>

                                <div className="flex gap-4">
                                    <dt className="w-28 shrink-0 text-xs font-medium text-ink-muted">
                                        SKU
                                    </dt>

                                    <dd className="text-xs text-ink-sub">
                                        {product.sku}
                                    </dd>
                                </div>
                            </dl>
                        )}

                        {activeTab === 'shipping' && (
                            <div className="mt-5 text-sm leading-relaxed text-ink-sub">
                                Shipping options and delivery estimates will be
                                available during checkout.
                            </div>
                        )}
                    </div>
                </section>

                {/* Reviews */}
                <section className="border-t border-line py-12">
                    <h2
                        className="mb-8 text-xl font-semibold text-ink"
                        style={{
                            fontFamily:
                                'var(--font-fraunces), Georgia, serif',
                        }}
                    >
                        Customer reviews
                    </h2>

                    <div className="flex flex-col gap-10 md:flex-row">
                        <div className="md:w-55 md:shrink-0">
                            <div className="text-4xl font-bold text-ink">
                                {averageRating !== null
                                    ? averageRating.toFixed(1)
                                    : '—'}
                            </div>

                            {averageRating !== null && (
                                <div className="mt-2">
                                    <RatingStars
                                        rating={averageRating}
                                        size={14}
                                    />
                                </div>
                            )}

                            <p className="mt-2 text-xs text-ink-muted">
                                Based on {totalReviews} reviews
                            </p>

                            <div className="mt-5 space-y-2">
                                {[5, 4, 3, 2, 1].map((stars) => (
                                    <RatingBar
                                        key={stars}
                                        stars={stars}
                                        count={
                                            ratingDistribution[
                                            stars as keyof typeof ratingDistribution
                                            ]
                                        }
                                        total={totalReviews}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="flex-1">
                            {reviews.length === 0 ? (
                                <div className="py-8 text-sm text-ink-muted">
                                    No reviews yet.
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {reviews.map((review) => (
                                        <article
                                            key={review.id}
                                            className="border-b border-line pb-6 last:border-b-0"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <RatingStars
                                                        rating={
                                                            review.rating
                                                        }
                                                        size={12}
                                                    />

                                                    <p className="mt-2 text-sm font-semibold text-ink">
                                                        {
                                                            review.user
                                                                .fullName
                                                        }
                                                    </p>
                                                </div>

                                                <time className="text-xs text-ink-faint">
                                                    {new Intl.DateTimeFormat(
                                                        'en-US',
                                                        {
                                                            dateStyle: 'medium',
                                                        },
                                                    ).format(
                                                        new Date(
                                                            review.createdAt,
                                                        ),
                                                    )}
                                                </time>
                                            </div>

                                            {review.reviewText && (
                                                <p className="mt-3 text-sm leading-relaxed text-ink-sub">
                                                    {review.reviewText}
                                                </p>
                                            )}
                                        </article>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <section className="border-t border-line py-12">
                        <h2
                            className="mb-7 text-xl font-semibold text-ink"
                            style={{
                                fontFamily:
                                    'var(--font-fraunces), Georgia, serif',
                            }}
                        >
                            You may also like
                        </h2>

                        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
                            {relatedProducts.map((related) => (
                                <Link
                                    key={related.id}
                                    href={`/catalogue/${related.slug}`}
                                    className="group"
                                >
                                    <div className="aspect-4/5 overflow-hidden rounded-sm bg-muted-surface">
                                        {related.media?.[0] ? (
                                            <img
                                                src={
                                                    related.media[0].url
                                                }
                                                alt={related.name}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-xs text-ink-faint">
                                                No image
                                            </div>
                                        )}
                                    </div>

                                    <p className="mt-3 text-[10px] font-medium uppercase tracking-[0.18em] text-brand">
                                        {related.brand.name}
                                    </p>

                                    <p className="mt-1 text-sm font-medium leading-snug text-ink group-hover:text-brand">
                                        {related.name}
                                    </p>

                                    <p className="mt-1 text-sm font-semibold text-ink">
                                        {formatPrice(related.price)}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </main>
    )
}