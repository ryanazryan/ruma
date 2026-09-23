import {
  getFilteredProducts,
  getProductCategories,
  getSortedProducts,
  searchProducts,
} from '@/api/products'

import { getBrands } from '@/api/brands'

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

  const query =
    params.q?.trim() ?? ''

  const categorySlug =
    params.category
      ?.trim()
      .toLowerCase() ?? ''

  const sort =
    params.sort
      ?.trim()
      .toLowerCase() ?? ''

  /*
   * Load categories and brands in parallel.
   *
   * Categories:
   * - Used to resolve category slug -> UUID
   *
   * Brands:
   * - Passed to CatalogueClient
   * - Used by CatalogueFilters
   */
  const [categories, brands] =
    await Promise.all([
      getProductCategories(),
      getBrands(),
    ])

  /*
   * Resolve URL category slug into
   * the actual category UUID.
   *
   * Example:
   * /catalogue?category=living
   *
   * living -> category.id
   */
  const selectedCategory =
    categorySlug
      ? categories.find(
          (category) =>
            category.slug
              ?.trim()
              .toLowerCase() ===
            categorySlug,
        )
      : undefined

  /*
   * Determine products based on URL state.
   *
   * Priority:
   *
   * 1. Search query
   * 2. Category
   * 3. Newest sort
   * 4. Default products
   */
  const products = query
    ? await searchProducts(query).then(
        (result) =>
          result.map(mapApiProduct),
      )
    : selectedCategory
      ? await getFilteredProducts({
          categoryId:
            selectedCategory.id,
        }).then(
          (result) =>
            result.map(mapApiProduct),
        )
      : sort === 'newest'
        ? await getSortedProducts(
            'newest',
            'desc',
          ).then(
            (result) =>
              result.map(mapApiProduct),
          )
        : await getProductViewModels()

  return (
    <CatalogueClient
      initialProducts={products}
      categories={categories}
      brands={brands}
    />
  )
}