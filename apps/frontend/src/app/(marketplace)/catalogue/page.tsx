import { getBrands } from '@/api/brands'
import {
  getFilteredProducts,
  getProductCategories,
  getSortedProducts,
  searchProducts,
} from '@/api/products'
import { mapApiProduct } from '@/api/product-mapper'
import { getProductViewModels } from '@/api/product-service'
import { CatalogueClient } from '@/components/marketplace/CatalogueClient'

export const dynamic = 'force-dynamic'

interface CataloguePageProps {
  searchParams: Promise<{
    q?: string
    category?: string
    sort?: string
  }>
}

export default async function CataloguePage({
  searchParams,
}: CataloguePageProps) {
  const params = await searchParams

  const query = params.q?.trim() ?? ''
  const categorySlug = params.category?.trim().toLowerCase() ?? ''
  const sort = params.sort?.trim().toLowerCase() ?? ''

  const categories = await getProductCategories()

  const selectedCategory = categorySlug
    ? categories.find(
        (category) => category.slug === categorySlug,
      )
    : undefined

 const products =
  query
    ? await searchProducts(query).then((result) =>
        result.map(mapApiProduct),
      )
    : selectedCategory
      ? await getFilteredProducts({
          categoryId: selectedCategory.id,
        }).then((result) => result.map(mapApiProduct))
      : sort === 'newest'
        ? await getSortedProducts('newest', 'desc').then((result) =>
            result.map(mapApiProduct),
          )
        : await getProductViewModels()

  const brands = await getBrands()

  return (
    <CatalogueClient
      initialProducts={products}
      categories={categories}
      brands={brands}
    />
  )
}