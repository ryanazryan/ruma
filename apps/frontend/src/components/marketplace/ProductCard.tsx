'use client'

import type { ProductViewModel } from '@/types/product'
import { useWishlist } from '@/components/providers/WishlistProvider'

interface ProductCardProps {
    product: ProductViewModel
    onProductClick?: (slug: string) => void
}

function RatingStars({
    rating,
    size = 12,
}: {
    rating: number
    size?: number
}) {
    return (
        <div
            className="flex items-center gap-0.5"
            aria-label={`Rating ${rating.toFixed(1)} dari 5`}
        >
            {[1, 2, 3, 4, 5].map((n) => {
                const filled = rating >= n

                return (
                    <svg
                        key={n}
                        width={size}
                        height={size}
                        viewBox="0 0 24 24"
                        fill={filled ? '#c4963e' : 'none'}
                        stroke={filled ? '#c4963e' : '#d0cbc0'}
                        strokeWidth="1.5"
                        aria-hidden="true"
                    >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                )
            })}
        </div>
    )
}

function formatPrice(price: number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(price)
}

function HeartIcon({ filled }: { filled: boolean }) {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill={filled ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z" />
        </svg>
    )
}

export function ProductCard({
    product,
    onProductClick,
}: ProductCardProps) {
    const {
        isProductWishlisted,
        toggleWishlist,
    } = useWishlist()

    const saved = isProductWishlisted(product.id)

    const handleWishlistClick = async (
        event: React.MouseEvent<HTMLButtonElement>,
    ) => {
        event.stopPropagation()

        try {
            await toggleWishlist(product.id)
        } catch (error) {
            console.error('Failed to update wishlist:', error)
        }
    }

    return (
        <article className="group">
            <div className="relative">
                <button
                    type="button"
                    onClick={() => onProductClick?.(product.slug)}
                    className="block w-full text-left focus:outline-none"
                    aria-label={`Lihat produk ${product.name}`}
                >
                    <div className="relative mb-4 aspect-4/5 overflow-hidden rounded-sm bg-muted-surface">
                        {product.photo ? (
                            <img
                                src={product.photo}
                                alt={product.name}
                                loading="lazy"
                                className="
                                    h-full
                                    w-full
                                    object-cover
                                    transition-transform
                                    duration-700
                                    ease-out
                                    group-hover:scale-[1.04]
                                "
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs text-ink-faint">
                                No image
                            </div>
                        )}

                        <div
                            className="
                                pointer-events-none
                                absolute
                                inset-0
                                bg-black/0
                                transition-colors
                                duration-500
                                group-hover:bg-black/2
                            "
                        />

                        {product.isNew && (
                            <span
                                className="
                                    absolute
                                    left-3
                                    top-3
                                    rounded-sm
                                    bg-white
                                    px-2.5
                                    py-1
                                    text-[9px]
                                    font-medium
                                    uppercase
                                    tracking-[0.18em]
                                    text-ink
                                    shadow-sm
                                "
                            >
                                New
                            </span>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <p
                            className="
                                text-[10px]
                                font-medium
                                uppercase
                                tracking-[0.18em]
                                text-brand
                            "
                        >
                            {product.brand}
                        </p>

                        <p
                            className="
                                line-clamp-2
                                text-sm
                                font-medium
                                leading-snug
                                text-ink
                                transition-colors
                                duration-200
                                group-hover:text-brand
                            "
                        >
                            {product.name}
                        </p>

                        {product.category && (
                            <p className="text-xs text-ink-faint">
                                {product.category}
                            </p>
                        )}

                        <p className="pt-0.5 text-sm font-semibold text-ink">
                            {formatPrice(product.price)}
                        </p>
                    </div>
                </button>

                <button
                    type="button"
                    onClick={handleWishlistClick}
                    className={[
                        'absolute right-3 top-3 z-10',
                        'flex h-9 w-9 items-center justify-center',
                        'rounded-full bg-white/95 shadow-sm',
                        'text-ink-sub transition-all duration-200',
                        'hover:bg-white hover:text-brand',
                        saved
                            ? 'opacity-100 text-brand'
                            : 'opacity-0 group-hover:opacity-100',
                    ].join(' ')}
                    aria-label={
                        saved
                            ? `Remove ${product.name} from wishlist`
                            : `Add ${product.name} to wishlist`
                    }
                    title={
                        saved
                            ? 'Remove from wishlist'
                            : 'Add to wishlist'
                    }
                >
                    <HeartIcon filled={saved} />
                </button>
            </div>
        </article>
    )
}

export { RatingStars }