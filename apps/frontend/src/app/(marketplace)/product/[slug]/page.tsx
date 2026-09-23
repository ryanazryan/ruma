import {
  getProductBySlug,
  getProductRating,
  getProductReviews,
  getRelatedProducts,
} from '@/api/products'

import { ProductDetail } from '@/components/marketplace/ProductDetail'

interface ProductPageProps {
  params: Promise<{
    slug: string
  }>
}

export const dynamic = 'force-dynamic'

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { slug } = await params

  const product = await getProductBySlug(slug)

  if (!product) {
    return null
  }

  const [ratingResponse, reviewsResponse, relatedProducts] =
    await Promise.all([
      getProductRating(product.id),
      getProductReviews(product.id),
      getRelatedProducts(product.id),
    ])

  return (
    <ProductDetail
      product={product}
      rating={ratingResponse.data.rating}
      reviews={reviewsResponse.data.reviews}
      relatedProducts={relatedProducts}
    />
  )
}