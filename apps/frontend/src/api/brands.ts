import { apiRequest } from './client'
import type { ApiProduct } from './products'

export interface ApiBrand {
    id: string
    name: string
    slug: string
    tagline: string | null
    description: string | null
    origin: string | null
    logoUrl: string | null
    logoPublicId?: string | null
    coverImageUrl: string | null
    coverImagePublicId?: string | null
    featured: boolean
    status: string
    productCount: number
    createdAt: string
    updatedAt: string
}

export interface ApiBrandDetail extends ApiBrand {
    products: ApiProduct[]
}

interface BrandsResponse {
    success: boolean
    message: string
    data: {
        brands: ApiBrand[]
    }
}

interface BrandDetailResponse {
    success: boolean
    message: string
    data: {
        brand: ApiBrandDetail
    }
}

export async function getBrands(): Promise<ApiBrand[]> {
    const response =
        await apiRequest<BrandsResponse>('/brands')

    return response.data.brands
}

export async function getBrandBySlug(
    slug: string,
): Promise<{
    brand: ApiBrand
    products: ApiProduct[]
}> {
    const response =
        await apiRequest<BrandDetailResponse>(
            `/brands/${encodeURIComponent(slug)}`,
        )

    return {
        brand: response.data.brand,
        products: response.data.brand.products,
    }
}