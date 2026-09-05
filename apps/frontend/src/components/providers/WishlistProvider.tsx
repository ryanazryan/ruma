'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  addToWishlist as apiAddToWishlist,
  getWishlist,
  removeFromWishlist as apiRemoveFromWishlist,
} from '@/api/wishlist'

import type { WishlistItem } from '@/api/wishlist'

interface WishlistContextValue {
  items: WishlistItem[]
  wishlistItems: string[]
  wishlistCount: number
  isLoading: boolean
  isProductWishlisted: (productId: string) => boolean
  toggleWishlist: (productId: string) => Promise<void>
  refreshWishlist: () => Promise<void>
}

const WishlistContext =
  createContext<WishlistContextValue | null>(null)

export function WishlistProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const refreshWishlist = useCallback(async () => {
    try {
      setIsLoading(true)

      const wishlist = await getWishlist()

      setItems(wishlist)
    } catch {
      setItems([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void refreshWishlist()
  }, [refreshWishlist])

  const wishlistItems = useMemo(
    () => items.map((item) => item.productId),
    [items],
  )

  const wishlistCount = items.length

  const isProductWishlisted = useCallback(
    (productId: string) => {
      return wishlistItems.includes(productId)
    },
    [wishlistItems],
  )

  const toggleWishlist = useCallback(
    async (productId: string) => {
      const existingItem = items.find(
        (item) => item.productId === productId,
      )

      try {
        if (existingItem) {
          await apiRemoveFromWishlist(productId)

          setItems((current) =>
            current.filter(
              (item) => item.productId !== productId,
            ),
          )

          return
        }

        const newItem = await apiAddToWishlist(productId)

        setItems((current) => [
          newItem,
          ...current,
        ])
      } catch (error) {
        console.error('Wishlist toggle failed:', error)

        throw error
      }
    },
    [items],
  )

  const value = useMemo(
    () => ({
      items,
      wishlistItems,
      wishlistCount,
      isLoading,
      isProductWishlisted,
      toggleWishlist,
      refreshWishlist,
    }),
    [
      items,
      wishlistItems,
      wishlistCount,
      isLoading,
      isProductWishlisted,
      toggleWishlist,
      refreshWishlist,
    ],
  )

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)

  if (!context) {
    throw new Error(
      'useWishlist must be used inside WishlistProvider.',
    )
  }

  return context
}