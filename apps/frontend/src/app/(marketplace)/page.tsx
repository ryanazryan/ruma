import { getProductCategories } from '@/api/products'
import { getBrands } from '@/api/brands'
import { getProductViewModels } from '@/api/product-service'
import { Home } from '@/components/marketplace/Home'

export default async function MarketplaceHomePage() {
  const [categories, products, brands] = await Promise.all([
    getProductCategories(),
    getProductViewModels(),
    getBrands(),
  ])

  return (
    <Home
      categories={categories}
      products={products}
      brands={brands}
    />
  )
}