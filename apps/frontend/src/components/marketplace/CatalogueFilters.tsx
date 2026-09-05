'use client'

import { useState } from 'react'
import type { ApiBrand } from '@/api/brands'
import type { ProductCategory } from '@/api/products'

export interface CatalogueFilterState {
    brandId?: string
    categoryId?: string
    minPrice?: number
    maxPrice?: number
}

interface CatalogueFiltersProps {
    categories: ProductCategory[]
    brands: ApiBrand[]
    value: CatalogueFilterState
    onChange: (value: CatalogueFilterState) => void
}

const priceRanges = [
    {
        label: 'Under Rp100.000',
        minPrice: undefined,
        maxPrice: 100000,
    },
    {
        label: 'Rp100.000 – Rp200.000',
        minPrice: 100000,
        maxPrice: 200000,
    },
    {
        label: 'Over Rp200.000',
        minPrice: 200000,
        maxPrice: undefined,
    },
]

function FilterArrow({ open }: { open: boolean }) {
    return (
        <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={[
                'transition-transform duration-300 ease-in-out',
                open ? 'rotate-90' : 'rotate-0',
            ].join(' ')}
            aria-hidden="true"
        >
            <polyline points="9 6 15 12 9 18" />
        </svg>
    )
}

function FilterContent({
    open,
    children,
}: {
    open: boolean
    children: React.ReactNode
}) {
    return (
        <div
            className={[
                'grid transition-[grid-template-rows,opacity] duration-300 ease-in-out',
                open
                    ? 'grid-rows-[1fr] opacity-100'
                    : 'grid-rows-[0fr] opacity-0',
            ].join(' ')}
        >
            <div className="overflow-hidden">
                {children}
            </div>
        </div>
    )
}

function RadioIndicator({ checked }: { checked: boolean }) {
    return (
        <span
            className={[
                'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors',
                checked
                    ? 'border-brand'
                    : 'border-line-strong',
            ].join(' ')}
        >
            {checked && (
                <span className="h-2 w-2 rounded-full bg-brand" />
            )}
        </span>
    )
}

function FilterOption({
    label,
    checked,
    onChange,
}: {
    label: string
    checked: boolean
    onChange: () => void
}) {
    return (
        <label className="group flex cursor-pointer items-center gap-2.5">
            <input
                type="radio"
                checked={checked}
                onChange={onChange}
                className="sr-only"
            />

            <RadioIndicator checked={checked} />

            <span
                className={[
                    'text-sm transition-colors',
                    checked
                        ? 'font-medium text-ink'
                        : 'text-ink-muted group-hover:text-ink',
                ].join(' ')}
            >
                {label}
            </span>
        </label>
    )
}

export function CatalogueFilters({
    categories,
    brands,
    value,
    onChange,
}: CatalogueFiltersProps) {
    const [openSections, setOpenSections] = useState({
        category: true,
        brand: true,
        price: true,
    })

    const activeFilterCount =
        (value.categoryId ? 1 : 0) +
        (value.brandId ? 1 : 0) +
        (value.minPrice !== undefined ||
            value.maxPrice !== undefined
            ? 1
            : 0)

    const selectedPrice =
        priceRanges.find(
            (range) =>
                range.minPrice === value.minPrice &&
                range.maxPrice === value.maxPrice,
        )?.label ?? null

    function toggleSection(
        section: keyof typeof openSections,
    ) {
        setOpenSections((current) => ({
            ...current,
            [section]: !current[section],
        }))
    }

    return (
        <aside className="hidden w-55 shrink-0 lg:block">
            <div className="sticky top-24">
                {/* Filter heading */}
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-ink">
                        Filters
                    </h2>

                    {activeFilterCount > 0 && (
                        <button
                            type="button"
                            onClick={() => onChange({})}
                            className="text-xs font-medium text-brand transition-colors hover:text-brand-dark"
                        >
                            Clear all ({activeFilterCount})
                        </button>
                    )}
                </div>

                {/* Category */}
                <section className="border-b border-line py-4">
                    <button
                        type="button"
                        onClick={() =>
                            toggleSection('category')
                        }
                        className="flex w-full items-center justify-between text-left"
                        aria-expanded={
                            openSections.category
                        }
                    >
                        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink">
                            Category
                        </span>

                        <span className="text-ink-muted">
                            <FilterArrow
                                open={
                                    openSections.category
                                }
                            />
                        </span>
                    </button>

                    <FilterContent
                        open={openSections.category}
                    >
                        <div className="mt-3 space-y-2.5">
                            {categories.length === 0 ? (
                                <p className="text-xs text-ink-faint">
                                    No categories available.
                                </p>
                            ) : (
                                <>
                                    <FilterOption
                                        label="All"
                                        checked={
                                            !value.categoryId
                                        }
                                        onChange={() =>
                                            onChange({
                                                ...value,
                                                categoryId:
                                                    undefined,
                                            })
                                        }
                                    />

                                    {categories.map(
                                        (category) => (
                                            <FilterOption
                                                key={
                                                    category.id
                                                }
                                                label={
                                                    category.name
                                                }
                                                checked={
                                                    value.categoryId ===
                                                    category.id
                                                }
                                                onChange={() =>
                                                    onChange({
                                                        ...value,
                                                        categoryId:
                                                            category.id,
                                                    })
                                                }
                                            />
                                        ),
                                    )}
                                </>
                            )}
                        </div>
                    </FilterContent>
                </section>

                {/* Brand */}
                <section className="border-b border-line py-4">
                    <button
                        type="button"
                        onClick={() =>
                            toggleSection('brand')
                        }
                        className="flex w-full items-center justify-between text-left"
                        aria-expanded={openSections.brand}
                    >
                        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink">
                            Brand
                        </span>

                        <span className="text-ink-muted">
                            <FilterArrow
                                open={
                                    openSections.brand
                                }
                            />
                        </span>
                    </button>

                    <FilterContent
                        open={openSections.brand}
                    >
                        <div className="mt-3 space-y-2.5">
                            {brands.length === 0 ? (
                                <p className="text-xs text-ink-faint">
                                    No brands available.
                                </p>
                            ) : (
                                <>
                                    <FilterOption
                                        label="All"
                                        checked={
                                            !value.brandId
                                        }
                                        onChange={() =>
                                            onChange({
                                                ...value,
                                                brandId:
                                                    undefined,
                                            })
                                        }
                                    />

                                    {brands.map((brand) => (
                                        <FilterOption
                                            key={brand.id}
                                            label={brand.name}
                                            checked={
                                                value.brandId ===
                                                brand.id
                                            }
                                            onChange={() =>
                                                onChange({
                                                    ...value,
                                                    brandId:
                                                        brand.id,
                                                })
                                            }
                                        />
                                    ))}
                                </>
                            )}
                        </div>
                    </FilterContent>
                </section>

                {/* Price */}
                <section className="py-4">
                    <button
                        type="button"
                        onClick={() =>
                            toggleSection('price')
                        }
                        className="flex w-full items-center justify-between text-left"
                        aria-expanded={openSections.price}
                    >
                        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink">
                            Price
                        </span>

                        <span className="text-ink-muted">
                            <FilterArrow
                                open={openSections.price}
                            />
                        </span>
                    </button>

                    <FilterContent
                        open={openSections.price}
                    >
                        <div className="mt-3 space-y-2.5">
                            <FilterOption
                                label="All prices"
                                checked={
                                    selectedPrice === null
                                }
                                onChange={() =>
                                    onChange({
                                        ...value,
                                        minPrice:
                                            undefined,
                                        maxPrice:
                                            undefined,
                                    })
                                }
                            />

                            {priceRanges.map((range) => (
                                <FilterOption
                                    key={range.label}
                                    label={range.label}
                                    checked={
                                        selectedPrice ===
                                        range.label
                                    }
                                    onChange={() =>
                                        onChange({
                                            ...value,
                                            minPrice:
                                                range.minPrice,
                                            maxPrice:
                                                range.maxPrice,
                                        })
                                    }
                                />
                            ))}
                        </div>
                    </FilterContent>
                </section>
            </div>
        </aside>
    )
}