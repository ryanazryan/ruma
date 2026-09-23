'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

import type { ApiBrand } from '@/api/brands'

interface BrandsPageProps {
    brands: ApiBrand[]
}

export function BrandsPage({
    brands,
}: BrandsPageProps) {
    const [searchQuery, setSearchQuery] = useState('')

    const activeBrands = useMemo(() => {
        return brands
            .filter(
                (brand) =>
                    brand.status.toUpperCase() === 'ACTIVE',
            )
            .sort((a, b) =>
                a.name.localeCompare(b.name),
            )
    }, [brands])

    const filteredBrands = useMemo(() => {
        const query = searchQuery.trim().toLowerCase()

        if (!query) {
            return activeBrands
        }

        return activeBrands.filter((brand) => {
            return (
                brand.name
                    .toLowerCase()
                    .includes(query) ||
                brand.tagline
                    ?.toLowerCase()
                    .includes(query) ||
                brand.description
                    ?.toLowerCase()
                    .includes(query)
            )
        })
    }, [activeBrands, searchQuery])

    const featuredBrands = useMemo(() => {
        return filteredBrands.filter(
            (brand) => brand.featured,
        )
    }, [filteredBrands])

    const allBrands = useMemo(() => {
        return filteredBrands
    }, [filteredBrands])

    return (
        <main className="min-h-screen bg-canvas">
            <div className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-8 lg:px-10 lg:py-14">

                {/* =====================================================
                    PAGE HEADER
                ====================================================== */}
                <section className="max-w-2xl">
                    <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-brand">
                        Makers &amp; curators
                    </p>

                    <h1
                        className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
                        style={{
                            fontFamily:
                                'var(--font-fraunces), Georgia, serif',
                        }}
                    >
                        Our brands
                    </h1>

                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-muted sm:text-base">
                        Discover the brands available on Ruma
                        and explore their products.
                    </p>
                </section>

                {/* =====================================================
                    SEARCH
                ====================================================== */}
                <section className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative w-full sm:max-w-md">
                        <svg
                            width="17"
                            height="17"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.75"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint"
                            aria-hidden="true"
                        >
                            <circle
                                cx="11"
                                cy="11"
                                r="7"
                            />
                            <path d="m20 20-4-4" />
                        </svg>

                        <input
                            type="search"
                            value={searchQuery}
                            onChange={(event) =>
                                setSearchQuery(
                                    event.target.value,
                                )
                            }
                            placeholder="Search brands..."
                            className="h-11 w-full rounded-lg border border-line bg-white pl-10 pr-4 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-brand"
                        />
                    </div>

                    <p className="text-xs text-ink-muted">
                        {filteredBrands.length}{' '}
                        {filteredBrands.length === 1
                            ? 'brand'
                            : 'brands'}
                    </p>
                </section>

                {/* =====================================================
                    FEATURED BRANDS
                ====================================================== */}
                {featuredBrands.length > 0 && (
                    <section className="mt-12">
                        <div className="mb-5">
                            <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-ink">
                                Featured
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                            {featuredBrands.map((brand) => (
                                <Link
                                    key={brand.id}
                                    href={`/brands/${brand.slug}`}
                                    className="group"
                                >
                                    <article className="grid min-h-55 grid-cols-1 overflow-hidden rounded-lg border border-line bg-white transition-all duration-300 hover:border-line-strong hover:shadow-sm sm:grid-cols-[38%_62%]">

                                        {/* Image */}
                                        <div className="relative min-h-52.5 overflow-hidden bg-muted-surface sm:min-h-full">
                                            {brand.coverImageUrl ? (
                                                <img
                                                    src={
                                                        brand.coverImageUrl
                                                    }
                                                    alt={
                                                        brand.name
                                                    }
                                                    loading="lazy"
                                                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center p-8">
                                                    {brand.logoUrl ? (
                                                        <img
                                                            src={
                                                                brand.logoUrl
                                                            }
                                                            alt={`${brand.name} logo`}
                                                            loading="lazy"
                                                            className="max-h-32 max-w-[80%] object-contain transition-transform duration-500 group-hover:scale-105"
                                                        />
                                                    ) : (
                                                        <div className="flex h-20 w-20 items-center justify-center rounded-full border border-line bg-white">
                                                            <span
                                                                className="text-2xl font-semibold text-brand"
                                                                aria-hidden="true"
                                                            >
                                                                {brand.name
                                                                    .charAt(
                                                                        0,
                                                                    )
                                                                    .toUpperCase()}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex flex-col justify-between p-5 sm:p-6">
                                            <div>
                                                <h3
                                                    className="text-xl italic tracking-tight text-ink"
                                                    style={{
                                                        fontFamily:
                                                            'var(--font-fraunces), Georgia, serif',
                                                    }}
                                                >
                                                    {brand.name}
                                                </h3>

                                                {brand.tagline && (
                                                    <p className="mt-1.5 text-xs font-medium text-brand">
                                                        {
                                                            brand.tagline
                                                        }
                                                    </p>
                                                )}

                                                {brand.description && (
                                                    <p className="mt-4 line-clamp-3 text-sm leading-6 text-ink-muted">
                                                        {
                                                            brand.description
                                                        }
                                                    </p>
                                                )}
                                            </div>

                                            <div className="mt-6 flex items-end justify-between gap-4">
                                                {brand.origin ? (
                                                    <span className="text-xs text-ink-faint">
                                                        {
                                                            brand.origin
                                                        }
                                                    </span>
                                                ) : (
                                                    <span />
                                                )}

                                                <span className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-brand transition-transform duration-300 group-hover:translate-x-0.5">
                                                    {brand.productCount}{' '}
                                                    {brand.productCount ===
                                                    1
                                                        ? 'product'
                                                        : 'products'}

                                                    <svg
                                                        width="14"
                                                        height="14"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="1.75"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        aria-hidden="true"
                                                    >
                                                        <line
                                                            x1="5"
                                                            y1="12"
                                                            x2="19"
                                                            y2="12"
                                                        />
                                                        <polyline points="12 5 19 12 12 19" />
                                                    </svg>
                                                </span>
                                            </div>
                                        </div>
                                    </article>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* =====================================================
                    ALL BRANDS
                ====================================================== */}
                <section
                    className={
                        featuredBrands.length > 0
                            ? 'mt-14'
                            : 'mt-12'
                    }
                >
                    <div className="mb-4 border-b border-line pb-4">
                        <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-ink">
                            All brands
                        </h2>
                    </div>

                    {allBrands.length > 0 ? (
                        <div className="divide-y divide-line border-b border-line">
                            {allBrands.map((brand) => (
                                <Link
                                    key={brand.id}
                                    href={`/brands/${brand.slug}`}
                                    className="group block"
                                >
                                    <article className="flex min-h-22 items-center gap-4 py-4 transition-colors hover:bg-white sm:gap-5">

                                        {/* Logo */}
                                        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-md border border-line bg-muted-surface p-2.5">
                                            {brand.logoUrl ? (
                                                <img
                                                    src={
                                                        brand.logoUrl
                                                    }
                                                    alt={`${brand.name} logo`}
                                                    loading="lazy"
                                                    className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                                                />
                                            ) : (
                                                <span
                                                    className="text-base font-semibold text-brand"
                                                    aria-hidden="true"
                                                >
                                                    {brand.name
                                                        .charAt(
                                                            0,
                                                        )
                                                        .toUpperCase()}
                                                </span>
                                            )}
                                        </div>

                                        {/* Name + tagline */}
                                        <div className="min-w-0 flex-1">
                                            <h3 className="truncate text-sm font-semibold text-ink transition-colors group-hover:text-brand">
                                                {brand.name}
                                            </h3>

                                            {brand.tagline && (
                                                <p className="mt-0.5 truncate text-xs text-ink-muted">
                                                    {
                                                        brand.tagline
                                                    }
                                                </p>
                                            )}
                                        </div>

                                        {/* Origin */}
                                        <div className="hidden shrink-0 text-right sm:block">
                                            {brand.origin && (
                                                <span className="text-xs text-ink-faint">
                                                    {
                                                        brand.origin
                                                    }
                                                </span>
                                            )}
                                        </div>

                                        {/* Product count */}
                                        <div className="hidden shrink-0 items-center gap-1 text-xs font-medium text-brand sm:flex">
                                            {brand.productCount}{' '}
                                            {brand.productCount ===
                                            1
                                                ? 'product'
                                                : 'products'}

                                            <svg
                                                width="14"
                                                height="14"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.75"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                aria-hidden="true"
                                            >
                                                <line
                                                    x1="5"
                                                    y1="12"
                                                    x2="19"
                                                    y2="12"
                                                />
                                                <polyline points="12 5 19 12 12 19" />
                                            </svg>
                                        </div>

                                        {/* Mobile arrow */}
                                        <div className="flex shrink-0 items-center gap-1 text-brand sm:hidden">
                                            <span className="text-[11px] font-medium">
                                                {
                                                    brand.productCount
                                                }
                                            </span>

                                            <svg
                                                width="15"
                                                height="15"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.75"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                aria-hidden="true"
                                            >
                                                <polyline points="9 18 15 12 9 6" />
                                            </svg>
                                        </div>
                                    </article>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-lg border border-dashed border-line py-20 text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted-surface">
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.75"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-ink-muted"
                                    aria-hidden="true"
                                >
                                    <circle
                                        cx="11"
                                        cy="11"
                                        r="7"
                                    />
                                    <path d="m20 20-4-4" />
                                </svg>
                            </div>

                            <h3 className="mt-4 text-sm font-semibold text-ink">
                                No brands found
                            </h3>

                            <p className="mt-1 text-xs text-ink-muted">
                                Try searching with a different
                                brand name.
                            </p>

                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        setSearchQuery('')
                                    }
                                    className="mt-5 text-xs font-medium text-brand hover:underline"
                                >
                                    Clear search
                                </button>
                            )}
                        </div>
                    )}
                </section>
            </div>
        </main>
    )
}