'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { useWishlist } from '@/components/providers/WishlistProvider'

export function Header() {
  const router = useRouter()

  const { wishlistCount } =
    useWishlist()

  const [searchQuery, setSearchQuery] =
    useState('')

  useEffect(() => {
    const trimmedQuery =
      searchQuery.trim()

    const timer = setTimeout(() => {
      if (trimmedQuery.length < 2) {
        router.replace('/catalogue')
        return
      }

      router.replace(
        `/catalogue?q=${encodeURIComponent(
          trimmedQuery,
        )}`,
      )
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery, router])

  return (
    <header className="w-full border-b border-line bg-surface">
      <div className="mx-auto flex h-18 w-full max-w-[1600px] items-center gap-6 px-5 sm:px-8 lg:px-10 xl:px-12">

        {/* Logo */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 text-ink transition-opacity hover:opacity-75"
          aria-label="Ruma home"
        >
          <span className="relative flex h-5 w-5 items-center justify-center">
            <span className="absolute inset-0 rounded-full border border-ink" />
            <span className="h-2 w-2 rounded-full bg-ink" />
          </span>

          <span
            className="text-[21px] font-semibold tracking-tight"
            style={{
              fontFamily:
                'var(--font-fraunces), Georgia, serif',
            }}
          >
            Ruma
          </span>
        </Link>

        {/* Search */}
        <div className="mx-auto w-full max-w-117.5">
          <form
            onSubmit={(event) => {
              event.preventDefault()
            }}
          >
            <label
              htmlFor="marketplace-search"
              className="sr-only"
            >
              Search products and brands
            </label>

            <div className="relative">
              <svg
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="7"
                />
                <line
                  x1="20"
                  y1="20"
                  x2="16.65"
                  y2="16.65"
                />
              </svg>

              <input
                id="marketplace-search"
                type="search"
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(
                    event.target.value,
                  )
                }
                placeholder="Search products, brands..."
                className="
                  h-10
                  w-full
                  rounded-md
                  border
                  border-line
                  bg-surface
                  pl-10
                  pr-4
                  text-sm
                  text-ink
                  placeholder:text-ink-faint
                  transition-colors
                  duration-150
                  focus:border-brand
                  focus:outline-none
                  focus:ring-2
                  focus:ring-brand/10
                "
              />
            </div>
          </form>
        </div>

        {/* Actions */}
        <div className="ml-auto flex shrink-0 items-center gap-5">

          {/* Wishlist */}
          <Link
            href="/wishlist"
            aria-label={
              wishlistCount > 0
                ? `Wishlist, ${wishlistCount} items`
                : 'Wishlist'
            }
            className="group relative flex h-9 w-9 items-center justify-center text-ink-muted transition-colors hover:text-ink"
          >
            <svg
              width="21"
              height="21"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" />
            </svg>

            {wishlistCount > 0 && (
              <span
                className="
                  absolute
                  -right-0.5
                  -top-0.5
                  flex
                  h-4.25
                  min-w-4.25
                  items-center
                  justify-center
                  rounded-full
                  bg-brand
                  px-1
                  text-[9px]
                  font-semibold
                  text-cream
                "
              >
                {wishlistCount > 99
                  ? '99+'
                  : wishlistCount}
              </span>
            )}
          </Link>

          {/* Account */}
          <Link
            href="/account"
            className="
              flex
              items-center
              gap-2
              text-sm
              text-ink
              transition-colors
              hover:text-brand
            "
          >
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle
                cx="12"
                cy="8"
                r="4"
              />
              <path d="M4 21c0-4.42 3.58-8 8-8s8 3.58 8 8" />
            </svg>

            <span>Account</span>
          </Link>
        </div>
      </div>
    </header>
  )
}