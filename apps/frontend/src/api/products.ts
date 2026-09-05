import { apiRequest } from './client'

export interface ProductMedia {
  id: string
  productId: string
  url: string
  publicId: string
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export interface ProductBrand {
  id: string
  name: string
  slug: string
  status: string
  createdAt: string
  updatedAt: string
}

export interface ProductSupplier {
  id: string
  name: string
  slug: string
  status: string
  createdAt: string
  updatedAt: string
}

export interface ProductCategory {
  id: string
  name: string
  slug: string
  parentId: string | null
  createdAt: string
  updatedAt: string
}

export interface ApiProduct {
  id: string
  sku: string
  name: string
  slug: string
  description: string | null
  price: number
  brandId: string
  supplierId: string
  categoryId: string
  createdAt: string
  updatedAt: string
  brand: ProductBrand
  supplier: ProductSupplier
  category: ProductCategory
  media: ProductMedia[]
}

interface ProductsResponse {
  success: boolean
  message: string
  data: {
    products: ApiProduct[]
  }
}

interface ProductResponse {
  success: boolean
  message: string
  data: {
    product: ApiProduct
  }
}

interface CategoriesResponse {
  success: boolean
  message: string
  data: {
    categories: ProductCategory[]
  }
}

export interface ProductFilterParams {
  brandId?: string
  supplierId?: string
  categoryId?: string
  minPrice?: number
  maxPrice?: number
}

export type ProductSortBy = 'price' | 'newest'
export type ProductSortOrder = 'asc' | 'desc'

export async function getProducts(): Promise<ApiProduct[]> {
  const response = await apiRequest<ProductsResponse>('/products')

  return response.data.products
}

export async function getProductBySlug(
  slug: string,
): Promise<ApiProduct | null> {
  const products = await getProducts()

  return products.find((product) => product.slug === slug) ?? null
}

export async function getProductById(
  productId: string,
): Promise<ApiProduct> {
  const response = await apiRequest<ProductResponse>(
    `/products/${productId}`,
  )

  return response.data.product
}

export async function getProductMedia(
  productId: string,
): Promise<ProductMedia[]> {
  const response = await apiRequest<{
    success: boolean
    message: string
    data: {
      media: ProductMedia[]
    }
  }>(`/products/${productId}/media`)

  return response.data.media
}

export async function getProductReviews(productId: string) {
  return apiRequest<{
    success: boolean
    message: string
    data: {
      reviews: Array<{
        id: string
        productId: string
        userId: string
        rating: number
        reviewText: string | null
        createdAt: string
        updatedAt: string
        user: {
          id: string
          fullName: string
        }
      }>
    }
  }>(`/products/${productId}/reviews`)
}

export async function getProductRating(productId: string) {
  return apiRequest<{
    success: boolean
    message: string
    data: {
      rating: {
        averageRating: number | null
        totalReviews: number
        ratingDistribution: {
          5: number
          4: number
          3: number
          2: number
          1: number
        }
      }
    }
  }>(`/products/${productId}/rating`)
}

export async function getRelatedProducts(
  productId: string,
): Promise<ApiProduct[]> {
  const response = await apiRequest<ProductsResponse>(
    `/products/${productId}/related`,
  )

  return response.data.products
}

export async function getProductCategories(): Promise<ProductCategory[]> {
  const response = await apiRequest<CategoriesResponse>(
    '/products/categories',
  )

  return response.data.categories
}

export async function searchProducts(
  query: string,
): Promise<ApiProduct[]> {
  const normalizedQuery = query.trim()

  if (!normalizedQuery) {
    return []
  }

  const response = await apiRequest<ProductsResponse>(
    `/products/search?q=${encodeURIComponent(normalizedQuery)}`,
  )

  return response.data.products
}

export async function getFilteredProducts(
  params: ProductFilterParams,
): Promise<ApiProduct[]> {
  const searchParams = new URLSearchParams()

  if (params.brandId) {
    searchParams.set('brandId', params.brandId)
  }

  if (params.supplierId) {
    searchParams.set('supplierId', params.supplierId)
  }

  if (params.categoryId) {
    searchParams.set('categoryId', params.categoryId)
  }

  if (params.minPrice !== undefined) {
    searchParams.set('minPrice', String(params.minPrice))
  }

  if (params.maxPrice !== undefined) {
    searchParams.set('maxPrice', String(params.maxPrice))
  }

  const query = searchParams.toString()

  const response = await apiRequest<ProductsResponse>(
    `/products/filter${query ? `?${query}` : ''}`,
  )

  return response.data.products
}

export async function getSortedProducts(
  sortBy: ProductSortBy,
  sortOrder: ProductSortOrder,
): Promise<ApiProduct[]> {
  const response = await apiRequest<ProductsResponse>(
    `/products/sort?sortBy=${encodeURIComponent(sortBy)}&sortOrder=${encodeURIComponent(sortOrder)}`,
  )

  return response.data.products
}

