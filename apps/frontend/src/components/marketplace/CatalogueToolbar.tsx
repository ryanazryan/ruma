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
}

export function CatalogueToolbar({
    productCount,
    sort,
    onSortChange,
    view,
    onViewChange,
}: CatalogueToolbarProps) {
    return (
        <div className="border-b border-line">
            <div className="flex items-center justify-between gap-4 pb-4">
                {/* Product count */}
                <p className="text-sm text-ink-muted">
                    <span className="font-medium text-ink">
                        {productCount}
                    </span>{' '}
                    products
                </p>

                {/* Toolbar actions */}
                <div className="flex items-center gap-2">
                    {/* Sort */}
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
                                transition-colors
                                hover:border-line-strong
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

                        {/* Chevron */}
                        <svg
                            className="
                                pointer-events-none
                                absolute
                                right-3
                                top-1/2
                                -translate-y-1/2
                                text-ink-muted
                            "
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

                    {/* View switcher */}
                    <div className="flex items-center rounded-md border border-line">
                        {/* Grid */}
                        <button
                            type="button"
                            onClick={() => onViewChange('grid')}
                            className={[
                                'flex h-10 w-10 items-center justify-center rounded-l-md transition-colors',
                                view === 'grid'
                                    ? 'text-brand'
                                    : 'text-ink-muted hover:text-ink',
                            ].join(' ')}
                            aria-label="Grid view"
                            aria-pressed={view === 'grid'}
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

                        {/* List */}
                        <button
                            type="button"
                            onClick={() => onViewChange('list')}
                            className={[
                                'flex h-10 w-10 items-center justify-center rounded-r-md transition-colors',
                                view === 'list'
                                    ? 'text-brand'
                                    : 'text-ink-muted hover:text-ink',
                            ].join(' ')}
                            aria-label="List view"
                            aria-pressed={view === 'list'}
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