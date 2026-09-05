import { getBrands } from '@/api/brands'
import {
  getProductCategories,
  searchProducts,
} from '@/api/products'
import { mapApiProduct } from '@/api/product-mapper'
import { getProductViewModels } from '@/api/product-service'
import { CatalogueClient } from '@/components/marketplace/CatalogueClient'

export const dynamic = 'force-dynamic'

interface CataloguePageProps {
  searchParams: Promise<{
    q?: string
  }>
}

export default async function CataloguePage({
  searchParams,
}: CataloguePageProps) {
  const params = await searchParams
  const query = params.q?.trim() ?? ''

  const [products, categories, brands] =
    await Promise.all([
      query
        ? searchProducts(query).then((result) =>
            result.map(mapApiProduct),
          )
        : getProductViewModels(),
      getProductCategories(),
      getBrands(),
    ])

  return (
    <CatalogueClient
      initialProducts={products}
      categories={categories}
      brands={brands}
    />
  )
}