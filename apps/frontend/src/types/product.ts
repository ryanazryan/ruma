import type { ApiProduct } from '@/api/products'

export interface ProductViewModel {
  id: string
  sku: string
  name: string
  slug: string
  description: string

  price: number

  brandId: string
  brand: string

  categoryId: string
  category: string

  supplierId: string
supplier: string

  photo: string | null
  images: string[]

  createdAt: string
  updatedAt: string

  isNew: boolean
}