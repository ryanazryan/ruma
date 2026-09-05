'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const categories = [
    {
        label: 'All Products',
        href: '/catalogue',
    },
    {
        label: 'Living',
        href: '/catalogue?category=living',
    },
    {
        label: 'Bedroom',
        href: '/catalogue?category=bedroom',
    },
    {
        label: 'Kitchen & Dining',
        href: '/catalogue?category=kitchen-dining',
    },
    {
        label: 'Outdoor',
        href: '/catalogue?category=outdoor',
    },
    {
        label: 'Lighting',
        href: '/catalogue?category=lighting',
    },
    {
        label: 'Wellness',
        href: '/catalogue?category=wellness',
    },
    {
        label: 'Brands',
        href: '/brands',
    },
    {
        label: 'New In',
        href: '/catalogue?sort=newest',
        accent: true,
    },
]

export function CategoryNav() {
    const pathname = usePathname()

    return (
        <nav
            className="w-full border-b border-line bg-surface"
            aria-label="Marketplace categories"
        >
            <div className="mx-auto w-full max-w-[1600px] overflow-x-auto px-5 sm:px-8 lg:px-10 xl:px-12">
                <div className="flex min-w-max items-center gap-8">
                    {categories.map((category) => {
                        const isAllProducts =
                            category.href === '/catalogue'

                        const isActive =
                            isAllProducts && pathname === '/catalogue'

                        return (
                            <Link
                                key={category.label}
                                href={category.href}
                                className={`
                                    relative
                                    flex
                                    h-11
                                    items-center
                                    whitespace-nowrap
                                    text-[12px]
                                    transition-colors
                                    duration-150
                                    ${
                                        category.accent
                                            ? 'text-gold hover:text-gold'
                                            : isActive
                                              ? 'text-brand'
                                              : 'text-ink-muted hover:text-ink'
                                    }
                                `}
                            >
                                {category.label}

                                {isActive && (
                                    <span
                                        className="
                                            absolute
                                            bottom-0
                                            left-0
                                            right-0
                                            h-px
                                            bg-brand
                                        "
                                    />
                                )}
                            </Link>
                        )
                    })}
                </div>
            </div>
        </nav>
    )
}