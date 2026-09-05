import { getProducts } from './products'
import { mapApiProduct } from './product-mapper'
import type { ProductViewModel } from '@/types/product'

export async function getProductViewModels(): Promise<ProductViewModel[]> {
  const products = await getProducts()

  return products.map(mapApiProduct)
}