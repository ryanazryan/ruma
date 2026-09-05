'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

import type { ApiBrand } from '@/api/brands'
import {
    getFilteredProducts,
    getSortedProducts,
    type ApiProduct,
    type ProductCategory,
} from '@/api/products'
import { mapApiProduct } from '@/api/product-mapper'
import type { ProductViewModel } from '@/types/product'

import { useWishlist } from '@/components/providers/WishlistProvider'

import {
    CatalogueFilters,
    type CatalogueFilterState,
} from './CatalogueFilters'

import {
    CatalogueToolbar,
    type CatalogueSort,
} from './CatalogueToolbar'

import { ProductCard } from './ProductCard'

interface CatalogueClientProps {
    initialProducts: ProductViewModel[]
    categories: ProductCategory[]
    brands: ApiBrand[]
}

function mapProducts(products: ApiProduct[]): ProductViewModel[] {
    return products.map(mapApiProduct)
}

function sortProductsLocally(
    products: ProductViewModel[],
    sort: CatalogueSort,
): ProductViewModel[] {
    if (sort === 'recommended') {
        return products
    }

    const sorted = [...products]

    if (sort === 'price-asc') {
        sorted.sort((a, b) => a.price - b.price)
    }

    if (sort === 'price-desc') {
        sorted.sort((a, b) => b.price - a.price)
    }

    if (sort === 'newest') {
        sorted.sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
        )
    }

    return sorted
}

function formatPrice(price: number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(price)
}

export function CatalogueClient({
    initialProducts,
    categories,
    brands,
}: CatalogueClientProps) {
    const router = useRouter()

    const {
        isProductWishlisted,
    } = useWishlist()

    const [products, setProducts] =
        useState<ProductViewModel[]>(initialProducts)

    const [filters, setFilters] =
        useState<CatalogueFilterState>({})

    const [sort, setSort] =
        useState<CatalogueSort>('recommended')

    const [view, setView] =
        useState<'grid' | 'list'>('grid')

    const [isLoading, setIsLoading] =
        useState(false)

    const [error, setError] =
        useState<string | null>(null)

    useEffect(() => {
        setProducts(initialProducts)
        setFilters({})
        setSort('recommended')
    }, [initialProducts])

    const hasActiveFilters =
        Boolean(filters.brandId) ||
        Boolean(filters.categoryId) ||
        filters.minPrice !== undefined ||
        filters.maxPrice !== undefined

    const activeCategoryLabel = getCategoryLabel(
        categories,
        filters.categoryId,
    )

    const activeBrandLabel = getBrandLabel(
        brands,
        filters.brandId,
    )

    const activePriceLabel = getActivePriceLabel(filters)

    const activeFilterCount = [
        activeCategoryLabel,
        activeBrandLabel,
        activePriceLabel,
    ].filter(Boolean).length

    const visibleProducts = useMemo(() => {
        if (hasActiveFilters) {
            return sortProductsLocally(products, sort)
        }

        return sort === 'recommended'
            ? products
            : sortProductsLocally(products, sort)
    }, [products, sort, hasActiveFilters])

    async function handleFilterChange(
        nextFilters: CatalogueFilterState,
    ) {
        setFilters(nextFilters)
        setSort('recommended')
        setError(null)

        const hasFilters =
            Boolean(nextFilters.brandId) ||
            Boolean(nextFilters.categoryId) ||
            nextFilters.minPrice !== undefined ||
            nextFilters.maxPrice !== undefined

        if (!hasFilters) {
            setProducts(initialProducts)
            return
        }

        setIsLoading(true)

        try {
            const filteredProducts =
                await getFilteredProducts({
                    brandId: nextFilters.brandId,
                    categoryId: nextFilters.categoryId,
                    minPrice: nextFilters.minPrice,
                    maxPrice: nextFilters.maxPrice,
                })

            setProducts(mapProducts(filteredProducts))
        } catch {
            setError(
                'Unable to load filtered products. Please try again.',
            )
        } finally {
            setIsLoading(false)
        }
    }

    async function handleSortChange(
        nextSort: CatalogueSort,
    ) {
        setSort(nextSort)
        setError(null)

        if (nextSort === 'recommended') {
            if (!hasActiveFilters) {
                setProducts(initialProducts)
            }

            return
        }

        if (hasActiveFilters) {
            setProducts((current) =>
                sortProductsLocally(
                    current,
                    nextSort,
                ),
            )

            return
        }

        setIsLoading(true)

        try {
            let sortedProducts: ApiProduct[]

            if (nextSort === 'newest') {
                sortedProducts =
                    await getSortedProducts(
                        'newest',
                        'desc',
                    )
            } else if (nextSort === 'price-asc') {
                sortedProducts =
                    await getSortedProducts(
                        'price',
                        'asc',
                    )
            } else {
                sortedProducts =
                    await getSortedProducts(
                        'price',
                        'desc',
                    )
            }

            setProducts(
                mapProducts(sortedProducts),
            )
        } catch {
            setError(
                'Unable to sort products. Please try again.',
            )
        } finally {
            setIsLoading(false)
        }
    }

    function handleViewChange(
        nextView: 'grid' | 'list',
    ) {
        setView(nextView)
    }

    function removeCategoryFilter() {
        handleFilterChange({
            ...filters,
            categoryId: undefined,
        })
    }

    function removeBrandFilter() {
        handleFilterChange({
            ...filters,
            brandId: undefined,
        })
    }

    function removePriceFilter() {
        handleFilterChange({
            ...filters,
            minPrice: undefined,
            maxPrice: undefined,
        })
    }

    function clearFilters() {
        handleFilterChange({})
    }

    function getActivePriceLabel(
        currentFilters: CatalogueFilterState,
    ) {
        if (
            currentFilters.minPrice === undefined &&
            currentFilters.maxPrice === undefined
        ) {
            return null
        }

        if (currentFilters.maxPrice === 100000) {
            return 'Under Rp100.000'
        }

        if (
            currentFilters.minPrice === 100000 &&
            currentFilters.maxPrice === 200000
        ) {
            return 'Rp100.000 – Rp200.000'
        }

        if (
            currentFilters.minPrice === 200000 &&
            currentFilters.maxPrice === undefined
        ) {
            return 'Over Rp200.000'
        }

        return 'Price'
    }

    function getCategoryLabel(
        currentCategories: ProductCategory[],
        categoryId?: string,
    ) {
        if (!categoryId) {
            return null
        }

        return (
            currentCategories.find(
                (category) =>
                    category.id === categoryId,
            )?.name ?? 'Category'
        )
    }

    function getBrandLabel(
        currentBrands: ApiBrand[],
        brandId?: string,
    ) {
        if (!brandId) {
            return null
        }

        return (
            currentBrands.find(
                (brand) => brand.id === brandId,
            )?.name ?? 'Brand'
        )
    }

    return (
        <main className="min-h-screen bg-canvas">
            <div className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
                {/* Page heading */}
                <header className="mb-8">
                    <h1
                        className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
                        style={{
                            fontFamily:
                                'var(--font-fraunces), Georgia, serif',
                        }}
                    >
                        All Products
                    </h1>
                </header>

                <div className="relative">
                    {/* Error */}
                    {error && (
                        <div className="mb-6 flex items-center justify-between border border-error/20 bg-error-tint px-4 py-3">
                            <p className="text-sm text-error">
                                {error}
                            </p>

                            <button
                                type="button"
                                onClick={() => setError(null)}
                                className="text-xs font-medium text-error hover:underline"
                            >
                                Dismiss
                            </button>
                        </div>
                    )}

                    <div className="flex items-start gap-8">
                        {/* Filters */}
                        <CatalogueFilters
                            categories={categories}
                            brands={brands}
                            value={filters}
                            onChange={handleFilterChange}
                        />

                        {/* Product content */}
                        <section className="min-w-0 flex-1">
                            <CatalogueToolbar
                                productCount={
                                    visibleProducts.length
                                }
                                sort={sort}
                                onSortChange={
                                    handleSortChange
                                }
                                view={view}
                                onViewChange={
                                    handleViewChange
                                }
                            />

                            {/* Active filters */}
                            {hasActiveFilters && (
                                <div className="flex flex-wrap items-center gap-2 border-b border-line py-4">
                                    <span className="mr-1 text-[10px] font-medium uppercase tracking-[0.14em] text-ink-faint">
                                        Filters:
                                    </span>

                                    {activeCategoryLabel && (
                                        <button
                                            type="button"
                                            onClick={
                                                removeCategoryFilter
                                            }
                                            className="
                                                inline-flex
                                                items-center
                                                gap-2
                                                rounded-full
                                                bg-brand/10
                                                px-3.5
                                                py-2
                                                text-xs
                                                font-medium
                                                text-brand
                                                transition-colors
                                                hover:bg-brand/15
                                            "
                                        >
                                            <span>
                                                {
                                                    activeCategoryLabel
                                                }
                                            </span>

                                            <span
                                                className="text-brand/60"
                                                aria-hidden="true"
                                            >
                                                ×
                                            </span>
                                        </button>
                                    )}

                                    {activeBrandLabel && (
                                        <button
                                            type="button"
                                            onClick={
                                                removeBrandFilter
                                            }
                                            className="
                                                inline-flex
                                                items-center
                                                gap-2
                                                rounded-full
                                                bg-brand/10
                                                px-3.5
                                                py-2
                                                text-xs
                                                font-medium
                                                text-brand
                                                transition-colors
                                                hover:bg-brand/15
                                            "
                                        >
                                            <span>
                                                {
                                                    activeBrandLabel
                                                }
                                            </span>

                                            <span
                                                className="text-brand/60"
                                                aria-hidden="true"
                                            >
                                                ×
                                            </span>
                                        </button>
                                    )}

                                    {activePriceLabel && (
                                        <button
                                            type="button"
                                            onClick={
                                                removePriceFilter
                                            }
                                            className="
                                                inline-flex
                                                items-center
                                                gap-2
                                                rounded-full
                                                bg-brand/10
                                                px-3.5
                                                py-2
                                                text-xs
                                                font-medium
                                                text-brand
                                                transition-colors
                                                hover:bg-brand/15
                                            "
                                        >
                                            <span>
                                                {
                                                    activePriceLabel
                                                }
                                            </span>

                                            <span
                                                className="text-brand/60"
                                                aria-hidden="true"
                                            >
                                                ×
                                            </span>
                                        </button>
                                    )}

                                    {activeFilterCount > 0 && (
                                        <button
                                            type="button"
                                            onClick={clearFilters}
                                            className="
                                                ml-1
                                                text-xs
                                                font-medium
                                                text-brand
                                                transition-colors
                                                hover:text-brand-dark
                                            "
                                        >
                                            Clear All
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Loading */}
                            {isLoading ? (
                                <div className="flex min-h-105 items-center justify-center">
                                    <div className="flex items-center gap-3 text-sm text-ink-muted">
                                        <span
                                            className="
                                                h-4
                                                w-4
                                                animate-spin
                                                rounded-full
                                                border-2
                                                border-line
                                                border-t-brand
                                            "
                                            aria-hidden="true"
                                        />

                                        Loading products...
                                    </div>
                                </div>
                            ) : visibleProducts.length === 0 ? (
                                /* Empty state */
                                <div className="flex min-h-105 items-center justify-center">
                                    <div className="max-w-sm text-center">
                                        <h2
                                            className="text-2xl font-semibold tracking-tight text-ink"
                                            style={{
                                                fontFamily:
                                                    'var(--font-fraunces), Georgia, serif',
                                            }}
                                        >
                                            No products found
                                        </h2>

                                        <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                                            Try changing your
                                            filters to find
                                            other products.
                                        </p>

                                        {hasActiveFilters && (
                                            <button
                                                type="button"
                                                onClick={
                                                    clearFilters
                                                }
                                                className="
                                                    mt-6
                                                    text-xs
                                                    font-medium
                                                    uppercase
                                                    tracking-[0.16em]
                                                    text-brand
                                                    transition-colors
                                                    hover:text-brand-dark
                                                "
                                            >
                                                Clear Filters
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ) : view === 'grid' ? (
                                /* Grid view */
                                <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 lg:grid-cols-3">
                                    {visibleProducts.map(
                                        (product) => (
                                            <ProductCard
                                                key={product.id}
                                                product={product}
                                                onProductClick={() =>
                                                    router.replace(
                                                        `/catalogue/${product.slug}`,
                                                    )
                                                }
                                            />
                                        ),
                                    )}
                                </div>
                            ) : (
                                /* List view */
                                <div className="mt-5 space-y-4">
                                    {visibleProducts.map(
                                        (product) => {
                                            const saved =
                                                isProductWishlisted(
                                                    product.id,
                                                )

                                            return (
                                                <article
                                                    key={
                                                        product.id
                                                    }
                                                    className="
                                                        flex
                                                        gap-5
                                                        rounded-sm
                                                        border
                                                        border-line
                                                        bg-white
                                                        p-4
                                                        transition-shadow
                                                        hover:shadow-sm
                                                    "
                                                >
                                                    {/* Product image */}
                                                    <div className="group relative h-36 w-36 shrink-0 overflow-hidden rounded-sm bg-muted-surface">
                                                        <Link
                                                            href={`/catalogue/${product.slug}`}
                                                            aria-label={`View ${product.name}`}
                                                            className="block h-full w-full"
                                                        >
                                                            {product.photo ? (
                                                                <img
                                                                    src={
                                                                        product.photo
                                                                    }
                                                                    alt={
                                                                        product.name
                                                                    }
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
                                                        </Link>
                                                    </div>

                                                    {/* Product information */}
                                                    <div className="flex min-w-0 flex-1 flex-col justify-center">
                                                        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-brand">
                                                            {
                                                                product.brand
                                                            }
                                                        </p>

                                                        <Link
                                                            href={`/catalogue/${product.slug}`}
                                                            className="
                                                                mt-1
                                                                text-lg
                                                                font-medium
                                                                leading-snug
                                                                text-ink
                                                                transition-colors
                                                                hover:text-brand
                                                            "
                                                        >
                                                            {
                                                                product.name
                                                            }
                                                        </Link>

                                                        {product.category && (
                                                            <p className="mt-2 text-sm text-ink-muted">
                                                                {
                                                                    product.category
                                                                }
                                                            </p>
                                                        )}

                                                        <p className="mt-4 text-sm font-semibold text-ink">
                                                            {formatPrice(
                                                                product.price,
                                                            )}
                                                        </p>

                                                        {product.description && (
                                                            <p className="mt-2 line-clamp-2 max-w-3xl text-sm leading-relaxed text-ink-muted">
                                                                {
                                                                    product.description
                                                                }
                                                            </p>
                                                        )}

                                                        {saved && (
                                                            <span className="sr-only">
                                                                Saved to wishlist
                                                            </span>
                                                        )}
                                                    </div>
                                                </article>
                                            )
                                        },
                                    )}
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            </div>
        </main>
    )
}