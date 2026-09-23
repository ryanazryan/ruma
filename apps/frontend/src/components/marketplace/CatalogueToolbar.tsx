'use client'

export type CatalogueSort =
    | 'recommended'
    | 'newest'
    | 'price-asc'
    | 'price-desc'

interface CatalogueToolbarProps {
    productCount: number
    sort: CatalogueSort
    onSortChange: (sort: CatalogueSort) => void
    view: 'grid' | 'list'
    onViewChange: (view: 'grid' | 'list') => void
    onFilterClick?: () => void
    activeFilterCount?: number
}

export function CatalogueToolbar({
    productCount,
    sort,
    onSortChange,
    view,
    onViewChange,
    onFilterClick,
    activeFilterCount = 0,
}: CatalogueToolbarProps) {
    return (
        <div className="border-b border-line">
            {/* Mobile */}
            <div className="flex items-center gap-2 pb-4 sm:gap-3 lg:hidden">
                <button
                    type="button"
                    onClick={onFilterClick}
                    className="
                        inline-flex
                        h-9
                        shrink-0
                        items-center
                        gap-2
                        rounded-md
                        border
                        border-line
                        bg-white
                        px-3
                        text-sm
                        text-ink-muted
                        transition-colors
                        hover:text-ink
                    "
                >
                    <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                    >
                        <line
                            x1="4"
                            y1="6"
                            x2="20"
                            y2="6"
                        />
                        <line
                            x1="7"
                            y1="12"
                            x2="17"
                            y2="12"
                        />
                        <line
                            x1="10"
                            y1="18"
                            x2="14"
                            y2="18"
                        />
                    </svg>

                    <span>Filters</span>

                    {activeFilterCount > 0 && (
                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1.5 text-[10px] font-medium text-white">
                            {activeFilterCount}
                        </span>
                    )}
                </button>

                {/* Count only from sm upward */}
                <p className="hidden min-w-0 flex-1 text-center text-sm text-ink-muted sm:block">
                    <span className="font-medium text-ink">
                        {productCount}
                    </span>{' '}
                    products
                </p>

                <div className="relative ml-auto shrink-0">
                    <select
                        value={sort}
                        onChange={(event) =>
                            onSortChange(
                                event.target.value as CatalogueSort,
                            )
                        }
                        className="
                            h-9
                            min-w-27
                            appearance-none
                            rounded-md
                            border
                            border-line
                            bg-white
                            px-3
                            pr-8
                            text-xs
                            text-ink-muted
                            outline-none
                            focus:border-brand
                        "
                        aria-label="Sort products"
                    >
                        <option value="recommended">
                            Recommended
                        </option>

                        <option value="newest">
                            Newest
                        </option>

                        <option value="price-asc">
                            Price: Low to high
                        </option>

                        <option value="price-desc">
                            Price: High to low
                        </option>
                    </select>

                    <svg
                        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-muted"
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                    >
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </div>
            </div>

            {/* Desktop */}
            <div className="hidden items-center justify-between gap-4 pb-4 lg:flex">
                <p className="text-sm text-ink-muted">
                    <span className="font-medium text-ink">
                        {productCount}
                    </span>{' '}
                    products
                </p>

                <div className="flex items-center gap-2">
                    <div className="relative">
                        <select
                            value={sort}
                            onChange={(event) =>
                                onSortChange(
                                    event.target.value as CatalogueSort,
                                )
                            }
                            className="
                                h-10
                                min-w-34
                                appearance-none
                                rounded-md
                                border
                                border-line
                                bg-white
                                px-3
                                pr-9
                                text-sm
                                text-ink
                                outline-none
                                focus:border-brand
                            "
                            aria-label="Sort products"
                        >
                            <option value="recommended">
                                Recommended
                            </option>

                            <option value="newest">
                                Newest
                            </option>

                            <option value="price-asc">
                                Price: Low to high
                            </option>

                            <option value="price-desc">
                                Price: High to low
                            </option>
                        </select>

                        <svg
                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.75"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <polyline points="6 9 12 15 18 9" />
                        </svg>
                    </div>

                    <div className="flex items-center rounded-md border border-line">
                        <button
                            type="button"
                            onClick={() =>
                                onViewChange('grid')
                            }
                            className={[
                                'flex h-10 w-10 items-center justify-center rounded-l-md transition-colors',
                                view === 'grid'
                                    ? 'text-brand'
                                    : 'text-ink-muted hover:text-ink',
                            ].join(' ')}
                            aria-label="Grid view"
                            aria-pressed={
                                view === 'grid'
                            }
                        >
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
                                <rect
                                    x="4"
                                    y="4"
                                    width="6"
                                    height="6"
                                />
                                <rect
                                    x="14"
                                    y="4"
                                    width="6"
                                    height="6"
                                />
                                <rect
                                    x="4"
                                    y="14"
                                    width="6"
                                    height="6"
                                />
                                <rect
                                    x="14"
                                    y="14"
                                    width="6"
                                    height="6"
                                />
                            </svg>
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                onViewChange('list')
                            }
                            className={[
                                'flex h-10 w-10 items-center justify-center rounded-r-md transition-colors',
                                view === 'list'
                                    ? 'text-brand'
                                    : 'text-ink-muted hover:text-ink',
                            ].join(' ')}
                            aria-label="List view"
                            aria-pressed={
                                view === 'list'
                            }
                        >
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
                                <line
                                    x1="8"
                                    y1="6"
                                    x2="20"
                                    y2="6"
                                />
                                <line
                                    x1="8"
                                    y1="12"
                                    x2="20"
                                    y2="12"
                                />
                                <line
                                    x1="8"
                                    y1="18"
                                    x2="20"
                                    y2="18"
                                />
                                <line
                                    x1="4"
                                    y1="6"
                                    x2="4.01"
                                    y2="6"
                                />
                                <line
                                    x1="4"
                                    y1="12"
                                    x2="4.01"
                                    y2="12"
                                />
                                <line
                                    x1="4"
                                    y1="18"
                                    x2="4.01"
                                    y2="18"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}