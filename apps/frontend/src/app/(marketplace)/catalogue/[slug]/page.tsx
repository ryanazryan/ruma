import { notFound } from 'next/navigation'

import {
  getProductBySlug,
  getProductRating,
  getProductReviews,
  getRelatedProducts,
} from '@/api/products'
import { ProductDetail } from '@/components/marketplace/ProductDetail'

interface ProductDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

export const dynamic = 'force-dynamic'

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params

  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  const [ratingResponse, reviewsResponse, relatedProductsResponse] =
    await Promise.all([
      getProductRating(product.id),
      getProductReviews(product.id),
      getRelatedProducts(product.id),
    ])

  const rating = ratingResponse.data.rating
  const reviews = reviewsResponse.data.reviews
  const relatedProducts = relatedProductsResponse

  return (
    <ProductDetail
      product={product}
      rating={rating}
      reviews={reviews}
      relatedProducts={relatedProducts}
    />
  )
}