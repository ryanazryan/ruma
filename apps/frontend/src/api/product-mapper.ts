import type { ApiProduct } from './products'
import type { ProductViewModel } from '@/types/product'

export function mapApiProduct(
  product: ApiProduct,
): ProductViewModel {
  const images = [...product.media]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((media) => media.url)

  const createdAt = new Date(product.createdAt)
  const now = new Date()

  const diffInDays =
    (now.getTime() - createdAt.getTime()) /
    (1000 * 60 * 60 * 24)

  return {
    id: product.id,
    sku: product.sku,
    name: product.name,
    slug: product.slug,
    description: product.description ?? '',

    price: product.price,

    brandId: product.brandId,
    brand: product.brand.name,

    categoryId: product.categoryId,
    category: product.category.name,

    supplierId: product.supplierId,
    supplier: product.supplier.name,

    photo: images[0] ?? null,
    images,

    createdAt: product.createdAt,
    updatedAt: product.updatedAt,

    // Business rule:
    // Product is considered new for 30 days after creation.
    isNew: diffInDays >= 0 && diffInDays <= 30,
  }
}