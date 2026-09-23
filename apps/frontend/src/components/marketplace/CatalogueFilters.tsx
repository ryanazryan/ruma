'use client'

import {
    useEffect,
    useMemo,
    useState,
} from 'react'

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
    onChange: (
        value: CatalogueFilterState,
    ) => void
    mobileOpen?: boolean
    onMobileClose?: () => void
    resultCount?: number
}

type FilterSection =
    | 'category'
    | 'brand'
    | 'price'

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

function FilterArrow({
    open,
}: {
    open: boolean
}) {
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
                open
                    ? 'rotate-90'
                    : 'rotate-0',
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

interface CheckboxOptionProps {
    label: string
    checked: boolean
    onChange: () => void
}

function CheckboxOption({
    label,
    checked,
    onChange,
}: CheckboxOptionProps) {
    return (
        <button
            type="button"
            onClick={onChange}
            aria-pressed={checked}
            className="flex min-h-7 w-full items-center gap-3 py-1.5 text-left"
        >
            <span
                className={[
                    'flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px] border transition-colors',
                    checked
                        ? 'border-[#28684f] bg-[#28684f] text-white'
                        : 'border-[#d9d5ce] bg-white',
                ].join(' ')}
            >
                {checked && (
                    <svg
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                    >
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                )}
            </span>

            <span
                className={[
                    'min-w-0 flex-1 text-sm',
                    checked
                        ? 'font-medium text-foreground'
                        : 'text-muted-foreground',
                ].join(' ')}
            >
                {label}
            </span>
        </button>
    )
}

interface RadioOptionProps {
    label: string
    checked: boolean
    onChange: () => void
}

function RadioOption({
    label,
    checked,
    onChange,
}: RadioOptionProps) {
    return (
        <button
            type="button"
            onClick={onChange}
            aria-pressed={checked}
            className="flex min-h-7 w-full items-center gap-3 py-1.5 text-left"
        >
            <span
                className={[
                    'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors',
                    checked
                        ? 'border-[#28684f]'
                        : 'border-[#d9d5ce]',
                ].join(' ')}
            >
                {checked && (
                    <span className="h-2 w-2 rounded-full bg-[#28684f]" />
                )}
            </span>

            <span
                className={[
                    'text-sm',
                    checked
                        ? 'font-medium text-foreground'
                        : 'text-muted-foreground',
                ].join(' ')}
            >
                {label}
            </span>
        </button>
    )
}

function FilterSectionHeader({
    title,
    open,
    onClick,
}: {
    title: string
    open: boolean
    onClick: () => void
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex w-full items-center justify-between py-4 text-left"
        >
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground">
                {title}
            </span>

            <FilterArrow open={open} />
        </button>
    )
}

function FilterBody({
    categories,
    brands,
    value,
    onChange,
}: {
    categories: ProductCategory[]
    brands: ApiBrand[]
    value: CatalogueFilterState
    onChange: (
        value: CatalogueFilterState,
    ) => void
}) {
    const [
        draftMinPrice,
        setDraftMinPrice,
    ] = useState(
        value.minPrice !== undefined
            ? String(value.minPrice)
            : '',
    )

    const [
        draftMaxPrice,
        setDraftMaxPrice,
    ] = useState(
        value.maxPrice !== undefined
            ? String(value.maxPrice)
            : '',
    )

    useEffect(() => {
        setDraftMinPrice(
            value.minPrice !== undefined
                ? String(
                    value.minPrice,
                )
                : '',
        )

        setDraftMaxPrice(
            value.maxPrice !== undefined
                ? String(
                    value.maxPrice,
                )
                : '',
        )
    }, [
        value.minPrice,
        value.maxPrice,
    ])

    const updateCategory = (
        categoryId: string,
    ) => {
        onChange({
            ...value,
            categoryId:
                value.categoryId ===
                categoryId
                    ? undefined
                    : categoryId,
        })
    }

    const updateBrand = (
        brandId: string,
    ) => {
        onChange({
            ...value,
            brandId:
                value.brandId ===
                brandId
                    ? undefined
                    : brandId,
        })
    }

    const applyPrice = () => {
        const minValue =
            draftMinPrice.trim() === ''
                ? undefined
                : Number(
                    draftMinPrice.replace(
                        /\D/g,
                        '',
                    ),
                )

        const maxValue =
            draftMaxPrice.trim() === ''
                ? undefined
                : Number(
                    draftMaxPrice.replace(
                        /\D/g,
                        '',
                    ),
                )

        const validMin =
            minValue !== undefined &&
            !Number.isNaN(minValue)
                ? minValue
                : undefined

        const validMax =
            maxValue !== undefined &&
            !Number.isNaN(maxValue)
                ? maxValue
                : undefined

        onChange({
            ...value,
            minPrice: validMin,
            maxPrice: validMax,
        })
    }

    const selectPriceRange = (
        minPrice: number | undefined,
        maxPrice: number | undefined,
    ) => {
        setDraftMinPrice(
            minPrice !== undefined
                ? String(minPrice)
                : '',
        )

        setDraftMaxPrice(
            maxPrice !== undefined
                ? String(maxPrice)
                : '',
        )

        onChange({
            ...value,
            minPrice,
            maxPrice,
        })
    }

    const selectedPrice =
        priceRanges.find(
            (range) =>
                range.minPrice ===
                    value.minPrice &&
                range.maxPrice ===
                    value.maxPrice,
        )?.label ?? null

    return (
        <div>
            {/* =================================================
                CATEGORY
            ================================================== */}
            <div className="border-b border-line">
                <FilterSectionHeader
                    title="Category"
                    open={true}
                    onClick={() => undefined}
                />

                <div className="pb-5">
                    <div className="space-y-0.5">
                        {categories
                            .filter(
                                (
                                    category,
                                ) =>
                                    Boolean(
                                        category.name,
                                    ),
                            )
                            .map(
                                (
                                    category,
                                ) => (
                                    <CheckboxOption
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
                                            updateCategory(
                                                category.id,
                                            )
                                        }
                                    />
                                ),
                            )}
                    </div>
                </div>
            </div>

            {/* =================================================
                BRAND
            ================================================== */}
            <div className="border-b border-line">
                <FilterSectionHeader
                    title="Brand"
                    open={true}
                    onClick={() => undefined}
                />

                <div className="pb-5">
                    <div className="space-y-0.5">
                        {brands
                            .filter(
                                (
                                    brand,
                                ) =>
                                    brand.status ===
                                    'ACTIVE',
                            )
                            .sort(
                                (
                                    a,
                                    b,
                                ) =>
                                    a.name.localeCompare(
                                        b.name,
                                    ),
                            )
                            .map(
                                (
                                    brand,
                                ) => (
                                    <CheckboxOption
                                        key={
                                            brand.id
                                        }
                                        label={
                                            brand.name
                                        }
                                        checked={
                                            value.brandId ===
                                            brand.id
                                        }
                                        onChange={() =>
                                            updateBrand(
                                                brand.id,
                                            )
                                        }
                                    />
                                ),
                            )}
                    </div>
                </div>
            </div>

            {/* =================================================
                PRICE
            ================================================== */}
            <div className="border-b border-line">
                <FilterSectionHeader
                    title="Price"
                    open={true}
                    onClick={() => undefined}
                />

                <div className="pb-5">
                    <div className="space-y-0.5">
                        {priceRanges.map(
                            (
                                range,
                            ) => (
                                <RadioOption
                                    key={
                                        range.label
                                    }
                                    label={
                                        range.label
                                    }
                                    checked={
                                        selectedPrice ===
                                        range.label
                                    }
                                    onChange={() =>
                                        selectPriceRange(
                                            range.minPrice,
                                            range.maxPrice,
                                        )
                                    }
                                />
                            ),
                        )}
                    </div>

                    {/* Custom price */}
                    <div className="mt-5 border-t border-line pt-5">
                        <p className="mb-3 text-xs font-medium text-foreground">
                            Custom price
                        </p>

                        <div className="grid grid-cols-2 gap-2">
                            <input
                                type="text"
                                inputMode="numeric"
                                value={
                                    draftMinPrice
                                }
                                onChange={(
                                    event,
                                ) =>
                                    setDraftMinPrice(
                                        event.target.value.replace(
                                            /\D/g,
                                            '',
                                        ),
                                    )
                                }
                                placeholder="Min"
                                className="h-9 w-full rounded-md border border-line bg-white px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-brand"
                            />

                            <input
                                type="text"
                                inputMode="numeric"
                                value={
                                    draftMaxPrice
                                }
                                onChange={(
                                    event,
                                ) =>
                                    setDraftMaxPrice(
                                        event.target.value.replace(
                                            /\D/g,
                                            '',
                                        ),
                                    )
                                }
                                placeholder="Max"
                                className="h-9 w-full rounded-md border border-line bg-white px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-brand"
                            />
                        </div>

                        <button
                            type="button"
                            onClick={
                                applyPrice
                            }
                            className="mt-3 h-9 w-full rounded-md bg-foreground px-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
                        >
                            Apply Price
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function CatalogueFilters({
    categories,
    brands,
    value,
    onChange,
    mobileOpen = false,
    onMobileClose,
    resultCount,
}: CatalogueFiltersProps) {
    const [
        openSections,
        setOpenSections,
    ] = useState<
        Record<
            FilterSection,
            boolean
        >
    >({
        category: true,
        brand: true,
        price: true,
    })

    const activeFilterCount =
        useMemo(() => {
            return [
                value.categoryId,
                value.brandId,
                value.minPrice !==
                    undefined ||
                    value.maxPrice !==
                        undefined,
            ].filter(Boolean).length
        }, [value])

    const toggleSection = (
        section: FilterSection,
    ) => {
        setOpenSections(
            (current) => ({
                ...current,
                [section]:
                    !current[
                        section
                    ],
            }),
        )
    }

    const clearAll = () => {
        onChange({})

        if (onMobileClose) {
            onMobileClose()
        }
    }

    /*
     * ============================================================
     * DESKTOP
     * ============================================================
     */
    const desktopContent = (
        <aside className="hidden w-55 shrink-0 lg:block">
            <div className="sticky top-24">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground">
                        Filters
                    </h2>

                    {activeFilterCount >
                        0 && (
                        <button
                            type="button"
                            onClick={
                                clearAll
                            }
                            className="text-xs font-medium text-brand transition-colors hover:underline"
                        >
                            Clear all (
                            {
                                activeFilterCount
                            }
                            )
                        </button>
                    )}
                </div>

                {/* Category */}
                <div className="border-t border-line">
                    <button
                        type="button"
                        onClick={() =>
                            toggleSection(
                                'category',
                            )
                        }
                        className="flex w-full items-center justify-between py-4 text-left"
                    >
                        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground">
                            Category
                        </span>

                        <FilterArrow
                            open={
                                openSections.category
                            }
                        />
                    </button>

                    <FilterContent
                        open={
                            openSections.category
                        }
                    >
                        <div className="pb-5">
                            <div className="space-y-0.5">
                                {categories.map(
                                    (
                                        category,
                                    ) => (
                                        <CheckboxOption
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
                                                onChange(
                                                    {
                                                        ...value,
                                                        categoryId:
                                                            value.categoryId ===
                                                            category.id
                                                                ? undefined
                                                                : category.id,
                                                    },
                                                )
                                            }
                                        />
                                    ),
                                )}
                            </div>
                        </div>
                    </FilterContent>
                </div>

                {/* Brand */}
                <div className="border-t border-line">
                    <button
                        type="button"
                        onClick={() =>
                            toggleSection(
                                'brand',
                            )
                        }
                        className="flex w-full items-center justify-between py-4 text-left"
                    >
                        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground">
                            Brand
                        </span>

                        <FilterArrow
                            open={
                                openSections.brand
                            }
                        />
                    </button>

                    <FilterContent
                        open={
                            openSections.brand
                        }
                    >
                        <div className="pb-5">
                            <div className="space-y-0.5">
                                {brands
                                    .filter(
                                        (
                                            brand,
                                        ) =>
                                            brand.status ===
                                            'ACTIVE',
                                    )
                                    .sort(
                                        (
                                            a,
                                            b,
                                        ) =>
                                            a.name.localeCompare(
                                                b.name,
                                            ),
                                    )
                                    .map(
                                        (
                                            brand,
                                        ) => (
                                            <CheckboxOption
                                                key={
                                                    brand.id
                                                }
                                                label={
                                                    brand.name
                                                }
                                                checked={
                                                    value.brandId ===
                                                    brand.id
                                                }
                                                onChange={() =>
                                                    onChange(
                                                        {
                                                            ...value,
                                                            brandId:
                                                                value.brandId ===
                                                                brand.id
                                                                    ? undefined
                                                                    : brand.id,
                                                        },
                                                    )
                                                }
                                            />
                                        ),
                                    )}
                            </div>
                        </div>
                    </FilterContent>
                </div>

                {/* Price */}
                <div className="border-t border-line">
                    <button
                        type="button"
                        onClick={() =>
                            toggleSection(
                                'price',
                            )
                        }
                        className="flex w-full items-center justify-between py-4 text-left"
                    >
                        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground">
                            Price
                        </span>

                        <FilterArrow
                            open={
                                openSections.price
                            }
                        />
                    </button>

                    <FilterContent
                        open={
                            openSections.price
                        }
                    >
                        <PriceFilter
                            value={
                                value
                            }
                            onChange={
                                onChange
                            }
                        />
                    </FilterContent>
                </div>
            </div>
        </aside>
    )

    /*
     * ============================================================
     * MOBILE
     * ============================================================
     */
    return (
        <>
            {desktopContent}

            <div className="lg:hidden">
                {/* Mobile drawer overlay */}
                <div
                    className={[
                        'fixed inset-0 z-40 bg-black/40 transition-opacity duration-200',
                        mobileOpen
                            ? 'pointer-events-auto opacity-100'
                            : 'pointer-events-none opacity-0',
                    ].join(' ')}
                    onClick={
                        onMobileClose
                    }
                    aria-hidden="true"
                />

                {/* Mobile drawer */}
                <div
                    className={[
                        'fixed inset-x-0 bottom-0 z-50 flex max-h-[88vh] flex-col rounded-t-2xl bg-white transition-transform duration-300',
                        mobileOpen
                            ? 'translate-y-0'
                            : 'translate-y-full',
                    ].join(' ')}
                >
                    {/* Drag handle */}
                    <div className="flex justify-center pt-3 pb-1">
                        <div className="h-1 w-10 rounded-full bg-line-strong" />
                    </div>

                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-line px-5 py-4">
                        <div>
                            <h2 className="text-base font-semibold text-foreground">
                                Filters
                            </h2>

                            {activeFilterCount >
                                0 && (
                                <p className="mt-0.5 text-xs text-muted-foreground">
                                    {
                                        activeFilterCount
                                    }{' '}
                                    active
                                    filter
                                    {activeFilterCount >
                                    1
                                        ? 's'
                                        : ''}
                                </p>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={
                                onMobileClose
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-full text-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            aria-label="Close filters"
                        >
                            ×
                        </button>
                    </div>

                    {/* Content */}
                    <div className="overflow-y-auto px-5">
                        <div className="border-b border-line">
                            <button
                                type="button"
                                onClick={() =>
                                    toggleSection(
                                        'category',
                                    )
                                }
                                className="flex w-full items-center justify-between py-4 text-left"
                            >
                                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground">
                                    Category
                                </span>

                                <FilterArrow
                                    open={
                                        openSections.category
                                    }
                                />
                            </button>

                            <FilterContent
                                open={
                                    openSections.category
                                }
                            >
                                <div className="pb-5">
                                    <div className="space-y-0.5">
                                        {categories.map(
                                            (
                                                category,
                                            ) => (
                                                <CheckboxOption
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
                                                        onChange(
                                                            {
                                                                ...value,
                                                                categoryId:
                                                                    value.categoryId ===
                                                                    category.id
                                                                        ? undefined
                                                                        : category.id,
                                                            },
                                                        )
                                                    }
                                                />
                                            ),
                                        )}
                                    </div>
                                </div>
                            </FilterContent>
                        </div>

                        <div className="border-b border-line">
                            <button
                                type="button"
                                onClick={() =>
                                    toggleSection(
                                        'brand',
                                    )
                                }
                                className="flex w-full items-center justify-between py-4 text-left"
                            >
                                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground">
                                    Brand
                                </span>

                                <FilterArrow
                                    open={
                                        openSections.brand
                                    }
                                />
                            </button>

                            <FilterContent
                                open={
                                    openSections.brand
                                }
                            >
                                <div className="pb-5">
                                    <div className="space-y-0.5">
                                        {brands
                                            .filter(
                                                (
                                                    brand,
                                                ) =>
                                                    brand.status ===
                                                    'ACTIVE',
                                            )
                                            .sort(
                                                (
                                                    a,
                                                    b,
                                                ) =>
                                                    a.name.localeCompare(
                                                        b.name,
                                                    ),
                                            )
                                            .map(
                                                (
                                                    brand,
                                                ) => (
                                                    <CheckboxOption
                                                        key={
                                                            brand.id
                                                        }
                                                        label={
                                                            brand.name
                                                        }
                                                        checked={
                                                            value.brandId ===
                                                            brand.id
                                                        }
                                                        onChange={() =>
                                                            onChange(
                                                                {
                                                                    ...value,
                                                                    brandId:
                                                                        value.brandId ===
                                                                        brand.id
                                                                            ? undefined
                                                                            : brand.id,
                                                                },
                                                            )
                                                        }
                                                    />
                                                ),
                                            )}
                                    </div>
                                </div>
                            </FilterContent>
                        </div>

                        <div className="border-b border-line">
                            <button
                                type="button"
                                onClick={() =>
                                    toggleSection(
                                        'price',
                                    )
                                }
                                className="flex w-full items-center justify-between py-4 text-left"
                            >
                                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground">
                                    Price
                                </span>

                                <FilterArrow
                                    open={
                                        openSections.price
                                    }
                                />
                            </button>

                            <FilterContent
                                open={
                                    openSections.price
                                }
                            >
                                <PriceFilter
                                    value={
                                        value
                                    }
                                    onChange={
                                        onChange
                                    }
                                />
                            </FilterContent>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center gap-3 border-t border-line bg-white px-5 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
                        <button
                            type="button"
                            onClick={
                                clearAll
                            }
                            className="h-11 flex-1 rounded-md border border-line px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                        >
                            Clear all
                        </button>

                        <button
                            type="button"
                            onClick={
                                onMobileClose
                            }
                            className="h-11 flex-[1.5] rounded-md bg-foreground px-4 text-sm font-medium text-white transition-opacity hover:opacity-90"
                        >
                            Show{' '}
                            {resultCount ??
                                0}{' '}
                            products
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

function PriceFilter({
    value,
    onChange,
}: {
    value: CatalogueFilterState
    onChange: (
        value: CatalogueFilterState,
    ) => void
}) {
    const [
        draftMinPrice,
        setDraftMinPrice,
    ] = useState(
        value.minPrice !== undefined
            ? String(value.minPrice)
            : '',
    )

    const [
        draftMaxPrice,
        setDraftMaxPrice,
    ] = useState(
        value.maxPrice !== undefined
            ? String(value.maxPrice)
            : '',
    )

    useEffect(() => {
        setDraftMinPrice(
            value.minPrice !== undefined
                ? String(
                    value.minPrice,
                )
                : '',
        )

        setDraftMaxPrice(
            value.maxPrice !== undefined
                ? String(
                    value.maxPrice,
                )
                : '',
        )
    }, [
        value.minPrice,
        value.maxPrice,
    ])

    const selectedPrice =
        priceRanges.find(
            (range) =>
                range.minPrice ===
                    value.minPrice &&
                range.maxPrice ===
                    value.maxPrice,
        )?.label ?? null

    const selectPriceRange = (
        minPrice: number | undefined,
        maxPrice: number | undefined,
    ) => {
        setDraftMinPrice(
            minPrice !== undefined
                ? String(minPrice)
                : '',
        )

        setDraftMaxPrice(
            maxPrice !== undefined
                ? String(maxPrice)
                : '',
        )

        onChange({
            ...value,
            minPrice,
            maxPrice,
        })
    }

    const applyPrice = () => {
        const parsedMin =
            draftMinPrice.trim() === ''
                ? undefined
                : Number(
                    draftMinPrice.replace(
                        /\D/g,
                        '',
                    ),
                )

        const parsedMax =
            draftMaxPrice.trim() === ''
                ? undefined
                : Number(
                    draftMaxPrice.replace(
                        /\D/g,
                        '',
                    ),
                )

        onChange({
            ...value,
            minPrice:
                parsedMin !== undefined &&
                !Number.isNaN(parsedMin)
                    ? parsedMin
                    : undefined,
            maxPrice:
                parsedMax !== undefined &&
                !Number.isNaN(parsedMax)
                    ? parsedMax
                    : undefined,
        })
    }

    return (
        <div className="pb-5">
            {/* Preset ranges */}
            <div className="space-y-0.5">
                {priceRanges.map(
                    (range) => (
                        <RadioOption
                            key={
                                range.label
                            }
                            label={
                                range.label
                            }
                            checked={
                                selectedPrice ===
                                range.label
                            }
                            onChange={() =>
                                selectPriceRange(
                                    range.minPrice,
                                    range.maxPrice,
                                )
                            }
                        />
                    ),
                )}
            </div>

            {/* Custom price */}
            <div className="mt-5 border-t border-line pt-5">
                <p className="mb-3 text-xs font-medium text-foreground">
                    Custom price
                </p>

                <div className="grid grid-cols-2 gap-2">
                    <input
                        type="text"
                        inputMode="numeric"
                        value={
                            draftMinPrice
                        }
                        onChange={(
                            event,
                        ) =>
                            setDraftMinPrice(
                                event.target.value.replace(
                                    /\D/g,
                                    '',
                                ),
                            )
                        }
                        placeholder="Min"
                        className="h-9 w-full rounded-md border border-line bg-white px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-brand"
                    />

                    <input
                        type="text"
                        inputMode="numeric"
                        value={
                            draftMaxPrice
                        }
                        onChange={(
                            event,
                        ) =>
                            setDraftMaxPrice(
                                event.target.value.replace(
                                    /\D/g,
                                    '',
                                ),
                            )
                        }
                        placeholder="Max"
                        className="h-9 w-full rounded-md border border-line bg-white px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-brand"
                    />
                </div>

                <button
                    type="button"
                    onClick={
                        applyPrice
                    }
                    className="mt-3 h-9 w-full rounded-md bg-foreground px-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
                >
                    Apply Price
                </button>
            </div>
        </div>
    )
}