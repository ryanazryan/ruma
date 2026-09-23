import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { BrandStatus } from '@prisma/client'

import { CloudinaryService } from '../cloudinary/cloudinary.service'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class BrandService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  /**
   * Public brand listing.
   *
   * Only ACTIVE brands are exposed to customers.
   * productCount is derived from the Product relation.
   */
  async getBrands() {
    const brands = await this.prisma.brand.findMany({
      where: {
        status: BrandStatus.ACTIVE,
      },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: [
        {
          featured: 'desc',
        },
        {
          name: 'asc',
        },
      ],
    })

    return brands.map((brand) => this.mapBrand(brand))
  }

  /**
   * Get brand by ID.
   *
   * Kept for existing backend/admin usage.
   */
  async getBrandById(brandId: string) {
    const brand = await this.prisma.brand.findFirst({
      where: {
        id: brandId,
        status: BrandStatus.ACTIVE,
      },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    })

    if (!brand) {
      throw new NotFoundException('Brand not found.')
    }

    return this.mapBrand(brand)
  }

  /**
   * Public brand detail.
   *
   * Returns brand profile + products belonging to the brand.
   */
  async getBrandBySlug(slug: string) {
    const normalizedSlug = slug.trim().toLowerCase()

    const brand = await this.prisma.brand.findFirst({
      where: {
        slug: normalizedSlug,
        status: BrandStatus.ACTIVE,
      },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
        products: {
          include: {
            brand: true,
            supplier: true,
            category: true,
            media: {
              orderBy: {
                sortOrder: 'asc',
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    })

    if (!brand) {
      throw new NotFoundException('Brand not found.')
    }

    return {
      ...this.mapBrand(brand),
      products: brand.products.map((product) => ({
        ...product,
        isNew:
          product.newUntil !== null &&
          product.newUntil.getTime() >= Date.now(),
      })),
    }
  }

  async createBrand(
    name: string,
    slug: string,
    data?: {
      tagline?: string
      description?: string
      origin?: string
      featured?: boolean
    },
  ) {
    const normalizedName = name.trim()
    const normalizedSlug = slug.trim().toLowerCase()

    const existingBrand = await this.prisma.brand.findFirst({
      where: {
        OR: [
          {
            name: {
              equals: normalizedName,
              mode: 'insensitive',
            },
          },
          {
            slug: normalizedSlug,
          },
        ],
      },
    })

    if (existingBrand) {
      throw new ConflictException(
        'Brand name or slug already exists.',
      )
    }

    return this.prisma.brand.create({
      data: {
        name: normalizedName,
        slug: normalizedSlug,
        tagline: data?.tagline?.trim() || null,
        description: data?.description?.trim() || null,
        origin: data?.origin?.trim() || null,
        featured: data?.featured ?? false,
        status: BrandStatus.ACTIVE,
      },
    })
  }

  async updateBrand(
    brandId: string,
    data: {
      name?: string
      slug?: string
      tagline?: string
      description?: string
      origin?: string
      featured?: boolean
    },
  ) {
    const brand = await this.prisma.brand.findUnique({
      where: {
        id: brandId,
      },
    })

    if (!brand) {
      throw new NotFoundException('Brand not found.')
    }

    const normalizedName =
      data.name !== undefined
        ? data.name.trim()
        : undefined

    const normalizedSlug =
      data.slug !== undefined
        ? data.slug.trim().toLowerCase()
        : undefined

    if (
      normalizedName !== undefined ||
      normalizedSlug !== undefined
    ) {
      const existingBrand =
        await this.prisma.brand.findFirst({
          where: {
            id: {
              not: brandId,
            },
            OR: [
              ...(normalizedName !== undefined
                ? [
                    {
                      name: {
                        equals: normalizedName,
                        mode: 'insensitive' as const,
                      },
                    },
                  ]
                : []),
              ...(normalizedSlug !== undefined
                ? [
                    {
                      slug: normalizedSlug,
                    },
                  ]
                : []),
            ],
          },
        })

      if (existingBrand) {
        throw new ConflictException(
          'Brand name or slug already exists.',
        )
      }
    }

    return this.prisma.brand.update({
      where: {
        id: brandId,
      },
      data: {
        ...(normalizedName !== undefined
          ? { name: normalizedName }
          : {}),

        ...(normalizedSlug !== undefined
          ? { slug: normalizedSlug }
          : {}),

        ...(data.tagline !== undefined
          ? {
              tagline: data.tagline.trim() || null,
            }
          : {}),

        ...(data.description !== undefined
          ? {
              description:
                data.description.trim() || null,
            }
          : {}),

        ...(data.origin !== undefined
          ? {
              origin: data.origin.trim() || null,
            }
          : {}),

        ...(data.featured !== undefined
          ? {
              featured: data.featured,
            }
          : {}),
      },
    })
  }

  async updateBrandStatus(
    brandId: string,
    status: BrandStatus,
  ) {
    const brand = await this.prisma.brand.findUnique({
      where: {
        id: brandId,
      },
    })

    if (!brand) {
      throw new NotFoundException('Brand not found.')
    }

    if (brand.status === status) {
      return brand
    }

    return this.prisma.brand.update({
      where: {
        id: brandId,
      },
      data: {
        status,
      },
    })
  }

  async uploadBrandLogo(
    brandId: string,
    file: Buffer,
    mimeType: string,
  ) {
    const brand = await this.prisma.brand.findUnique({
      where: {
        id: brandId,
      },
    })

    if (!brand) {
      throw new NotFoundException('Brand not found.')
    }

    if (!mimeType.startsWith('image/')) {
      throw new BadRequestException(
        'Only image files are supported.',
      )
    }

    const uploadedImage =
      await this.cloudinary.uploadImage(
        file,
        `ruma/brands/${brandId}`,
      )

    try {
      const updatedBrand =
        await this.prisma.brand.update({
          where: {
            id: brandId,
          },
          data: {
            logoUrl: uploadedImage.secure_url,
            logoPublicId: uploadedImage.public_id,
          },
        })

      if (brand.logoPublicId) {
        await this.cloudinary.deleteImage(
          brand.logoPublicId,
        )
      }

      return updatedBrand
    } catch (error) {
      await this.cloudinary.deleteImage(
        uploadedImage.public_id,
      )

      if (error instanceof Error) {
        throw error
      }

      throw new InternalServerErrorException(
        'Unable to save brand logo.',
      )
    }
  }

  async uploadBrandCover(
    brandId: string,
    file: Buffer,
    mimeType: string,
  ) {
    const brand = await this.prisma.brand.findUnique({
      where: {
        id: brandId,
      },
    })

    if (!brand) {
      throw new NotFoundException('Brand not found.')
    }

    if (!mimeType.startsWith('image/')) {
      throw new BadRequestException(
        'Only image files are supported.',
      )
    }

    const uploadedImage =
      await this.cloudinary.uploadImage(
        file,
        `ruma/brands/${brandId}/cover`,
      )

    try {
      const updatedBrand =
        await this.prisma.brand.update({
          where: {
            id: brandId,
          },
          data: {
            coverImageUrl: uploadedImage.secure_url,
            coverImagePublicId:
              uploadedImage.public_id,
          },
        })

      if (brand.coverImagePublicId) {
        await this.cloudinary.deleteImage(
          brand.coverImagePublicId,
        )
      }

      return updatedBrand
    } catch (error) {
      await this.cloudinary.deleteImage(
        uploadedImage.public_id,
      )

      if (error instanceof Error) {
        throw error
      }

      throw new InternalServerErrorException(
        'Unable to save brand cover image.',
      )
    }
  }

  private mapBrand(
    brand: {
      id: string
      name: string
      slug: string
      tagline: string | null
      description: string | null
      origin: string | null
      logoUrl: string | null
      coverImageUrl: string | null
      featured: boolean
      status: BrandStatus
      createdAt: Date
      updatedAt: Date
      _count?: {
        products: number
      }
    },
  ) {
    return {
      id: brand.id,
      name: brand.name,
      slug: brand.slug,
      tagline: brand.tagline,
      description: brand.description,
      origin: brand.origin,
      logoUrl: brand.logoUrl,
      coverImageUrl: brand.coverImageUrl,
      featured: brand.featured,
      status: brand.status,
      productCount: brand._count?.products ?? 0,
      createdAt: brand.createdAt,
      updatedAt: brand.updatedAt,
    }
  }
}