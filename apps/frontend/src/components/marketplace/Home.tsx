import Link from 'next/link'
import Image from 'next/image'
import type { ProductViewModel } from '@/types/product'
import type { ApiBrand } from '@/api/brands'
import { ProductCard } from '@/components/marketplace/ProductCard'

type Category = {
    id: string
    name: string
    slug?: string
    imageUrl?: string | null
    productCount?: number
}

type Brand = {
    id: string
    name: string
    slug?: string
    logoUrl?: string | null
}

type HomeProps = {
    categories: Category[]
    products: ProductViewModel[]
    brands: ApiBrand[]
}

export function Home({
    categories,
    products,
    brands,
}: HomeProps) {
    const newArrivals = products.slice(0, 8)
    const featuredCategories = categories.slice(0, 6)
    const featuredBrands = brands.slice(0, 6)

    return (
        <main className="bg-canvas text-ink">
            {/* Hero */}
            <section className="mx-auto max-w-350 px-4 pt-4 lg:px-8 lg:pt-6">
                <div className="grid min-h-130 overflow-hidden rounded-2xl bg-brand lg:grid-cols-2">
                    <div className="flex flex-col justify-center px-8 py-14 text-white sm:px-12 lg:px-16">
                        <p className="mb-5 text-sm font-medium uppercase tracking-[0.18em] text-white/70">
                            Ruma Marketplace
                        </p>

                        <h1
                            className="max-w-xl text-5xl leading-[1.05] sm:text-6xl"
                            style={{ fontFamily: 'Fraunces, Georgia, serif' }}
                        >
                            Curated living, considered choices.
                        </h1>

                        <p className="mt-6 max-w-lg text-base leading-relaxed text-white/80 sm:text-lg">
                            Discover thoughtfully selected products from trusted brands,
                            all in one place.
                        </p>

                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link
                                href="/catalogue"
                                className="inline-flex h-11 items-center justify-center rounded-full bg-white px-6 text-sm font-medium text-brand transition hover:bg-white/90"
                            >
                                Shop now
                            </Link>

                            <Link
                                href="/catalogue"
                                className="inline-flex h-11 items-center justify-center rounded-full border border-white/30 px-6 text-sm font-medium text-white transition hover:bg-white/10"
                            >
                                Explore products
                            </Link>
                        </div>

                        <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4 text-sm text-white/70">
                            <div>
                                <p className="font-medium text-white">Trusted brands</p>
                                <p className="mt-1">Curated selection</p>
                            </div>

                            <div>
                                <p className="font-medium text-white">Easy shopping</p>
                                <p className="mt-1">Simple and seamless</p>
                            </div>

                            <div>
                                <p className="font-medium text-white">Secure checkout</p>
                                <p className="mt-1">Safe transactions</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative min-h-80 lg:min-h-full">
                        <img
                            src="https://images.unsplash.com/photo-1600494603989-9650cf6ddd3d?auto=format&fit=crop&w=1400&q=80"
                            alt="Ruma curated home collection"
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                    </div>
                </div>
            </section>

            {/* Shop by Category */}
            <section className="mx-auto max-w-350 px-4 py-16 lg:px-8 lg:py-20">
                <div className="mb-8 flex items-end justify-between gap-4">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-[0.18em] text-ink-muted">
                            Explore
                        </p>

                        <h2
                            className="mt-2 text-3xl sm:text-4xl"
                            style={{ fontFamily: 'Fraunces, Georgia, serif' }}
                        >
                            Shop by category
                        </h2>
                    </div>

                    <Link
                        href="/catalogue"
                        className="hidden text-sm font-medium text-ink underline underline-offset-4 sm:block"
                    >
                        View all
                    </Link>
                </div>

                {featuredCategories.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                        {featuredCategories.map((category) => (
                            <Link
                                key={category.id}
                                href={`/catalogue?category=${category.slug}`}
                                className="group overflow-hidden rounded-2xl border border-line bg-white"
                            >
                                <div className="relative aspect-4/3 overflow-hidden bg-cream-dark">
                                    {category.imageUrl ? (
                                        <Image
                                            src={category.imageUrl}
                                            alt={category.name}
                                            fill
                                            className="object-cover transition duration-500 group-hover:scale-105"
                                            sizes="(max-width: 768px) 50vw, 33vw"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center">
                                            <span
                                                className="text-3xl text-ink/20"
                                                style={{ fontFamily: 'Fraunces, Georgia, serif' }}
                                            >
                                                Ruma
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center justify-between p-4">
                                    <h3 className="text-sm font-medium text-ink">
                                        {category.name}
                                    </h3>

                                    {typeof category.productCount === 'number' && (
                                        <span className="text-xs text-ink-muted">
                                            {category.productCount} products
                                        </span>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-2xl border border-dashed border-line px-6 py-16 text-center text-sm text-ink-muted">
                        No categories available yet.
                    </div>
                )}
            </section>

            {/* New Arrivals */}
            <section className="bg-white">
                <div className="mx-auto max-w-350 px-4 py-16 lg:px-8 lg:py-20">
                    <div className="mb-8 flex items-end justify-between gap-4">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-[0.18em] text-ink-muted">
                                Fresh picks
                            </p>

                            <h2
                                className="mt-2 text-3xl sm:text-4xl"
                                style={{ fontFamily: 'Fraunces, Georgia, serif' }}
                            >
                                New arrivals
                            </h2>
                        </div>

                        <Link
                            href="/catalogue"
                            className="hidden text-sm font-medium text-ink underline underline-offset-4 sm:block"
                        >
                            View all
                        </Link>
                    </div>

                    {newArrivals.length > 0 ? (
                        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
                            {newArrivals.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-line px-6 py-16 text-center text-sm text-ink-muted">
                            No products available yet.
                        </div>
                    )}
                </div>
            </section>

            {/* Our Brands */}
            <section className="mx-auto max-w-350 px-4 py-16 lg:px-8 lg:py-20">
                <div className="mb-8 flex items-end justify-between gap-4">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-[0.18em] text-ink-muted">
                            Trusted names
                        </p>

                        <h2
                            className="mt-2 text-3xl sm:text-4xl"
                            style={{ fontFamily: 'Fraunces, Georgia, serif' }}
                        >
                            Our brands
                        </h2>
                    </div>

                    <Link
                        href="/catalogue"
                        className="hidden text-sm font-medium text-ink underline underline-offset-4 sm:block"
                    >
                        Shop all
                    </Link>
                </div>

                {featuredBrands.length > 0 ? (
                    <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-line bg-white sm:grid-cols-3 lg:grid-cols-4">
                        {featuredBrands.map((brand) => (
                            <Link
                                key={brand.id}
                                href={`/catalogue?brandId=${brand.id}`}
                                className="group flex min-h-37.5 items-center justify-center border-b border-r border-line p-6 transition hover:bg-cream"
                            >
                                {brand.logoUrl ? (
                                    <div className="flex h-28 w-full items-center justify-center">
                                        <img
                                            src={brand.logoUrl}
                                            alt={`${brand.name} logo`}
                                            className="h-20 max-w-72 object-contain"
                                        />
                                    </div>
                                ) : (
                                    <span
                                        className="text-center text-xl font-medium text-ink"
                                        style={{ fontFamily: 'Fraunces, Georgia, serif' }}
                                    >
                                        {brand.name}
                                    </span>
                                )}
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-2xl border border-dashed border-line px-6 py-16 text-center text-sm text-ink-muted">
                        No brands available yet.
                    </div>
                )}
            </section>

            {/* Editorial */}
            <section className="mx-auto max-w-350 px-4 pb-16 lg:px-8 lg:pb-20">
                <div className="grid overflow-hidden rounded-2xl bg-[#dfe9df] lg:grid-cols-2">
                    <div className="relative min-h-90">
                        <img
                            src="https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80"
                            alt="Curated lifestyle collection"
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                    </div>

                    <div className="flex flex-col justify-center px-8 py-14 sm:px-12 lg:px-16">
                        <p className="text-xs font-medium uppercase tracking-[0.18em] text-ink-muted">
                            The Ruma edit
                        </p>

                        <h2
                            className="mt-3 max-w-lg text-4xl leading-tight sm:text-5xl"
                            style={{ fontFamily: 'Fraunces, Georgia, serif' }}
                        >
                            Thoughtful products for everyday living.
                        </h2>

                        <p className="mt-5 max-w-lg text-sm leading-relaxed text-ink-muted sm:text-base">
                            Explore a considered collection of products selected for
                            everyday use, quality, and lasting value.
                        </p>

                        <div className="mt-8">
                            <Link
                                href="/catalogue"
                                className="inline-flex h-11 items-center justify-center rounded-full bg-ink px-6 text-sm font-medium text-white transition hover:bg-ink/90"
                            >
                                Discover the collection
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}