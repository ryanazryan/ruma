import { apiRequest } from './client'

export interface ApiBrand {
  id: string
  name: string
  slug: string
  status: string
  createdAt: string
  updatedAt: string
}

interface BrandsResponse {
  success: boolean
  message: string
  data: {
    brands: ApiBrand[]
  }
}

export async function getBrands(): Promise<ApiBrand[]> {
  const response = await apiRequest<BrandsResponse>('/brands')

  return response.data.brands
}