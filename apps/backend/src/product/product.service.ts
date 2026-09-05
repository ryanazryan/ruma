import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  async getProducts() {
  return this.prisma.product.findMany({
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
  });
}

  async getProductById(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: {
        id: productId,
      },
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
    });

    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    return product;
  }

  async getCategories() {
    return this.prisma.category.findMany({
      where: {
        parentId: null,
      },
      include: {
        children: {
          orderBy: {
            name: 'asc',
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async searchProducts(query: string) {
    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
      return [];
    }

    return this.prisma.product.findMany({
      where: {
        name: {
          contains: normalizedQuery,
          mode: 'insensitive',
        },
      },
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
    });
  }

  async filterProducts(filters: {
    brandId?: string;
    supplierId?: string;
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
  }) {
    const where: {
      brandId?: string;
      supplierId?: string;
      categoryId?: string;
      price?: {
        gte?: number;
        lte?: number;
      };
    } = {};

    if (filters.brandId) {
      where.brandId = filters.brandId;
    }

    if (filters.supplierId) {
      where.supplierId = filters.supplierId;
    }

    if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.price = {};

      if (filters.minPrice !== undefined) {
        where.price.gte = filters.minPrice;
      }

      if (filters.maxPrice !== undefined) {
        where.price.lte = filters.maxPrice;
      }
    }

    return this.prisma.product.findMany({
      where,
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
    });
  }

  async sortProducts(sortBy: 'price' | 'newest', sortOrder: 'asc' | 'desc') {
    const orderBy =
      sortBy === 'price' ? { price: sortOrder } : { createdAt: sortOrder };

    return this.prisma.product.findMany({
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
      orderBy,
    });
  }

  async uploadProductMedia(productId: string, file: Buffer, mimeType: string) {
    const product = await this.prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    if (!mimeType.startsWith('image/')) {
      throw new BadRequestException('Only image files are supported.');
    }

    const lastMedia = await this.prisma.productMedia.aggregate({
      where: {
        productId,
      },
      _max: {
        sortOrder: true,
      },
    });

    const sortOrder = (lastMedia._max.sortOrder ?? -1) + 1;

    const uploadedImage = await this.cloudinary.uploadImage(
      file,
      `ruma/products/${productId}`,
    );

    try {
      const media = await this.prisma.productMedia.create({
        data: {
          productId,
          url: uploadedImage.secure_url,
          publicId: uploadedImage.public_id,
          sortOrder,
        },
      });

      return media;
    } catch (error) {
      await this.cloudinary.deleteImage(uploadedImage.public_id);

      if (error instanceof Error) {
        throw error;
      }

      throw new InternalServerErrorException('Unable to save product media.');
    }
  }

  async getProductMedia(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: {
        id: productId,
      },
      select: {
        id: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    return this.prisma.productMedia.findMany({
      where: {
        productId,
      },
      orderBy: {
        sortOrder: 'asc',
      },
    });
  }

  async getProductReviews(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: {
        id: productId,
      },
      select: {
        id: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    return this.prisma.productReview.findMany({
      where: {
        productId,
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getProductRating(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: {
        id: productId,
      },
      select: {
        id: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    const aggregate = await this.prisma.productReview.aggregate({
      where: {
        productId,
      },
      _avg: {
        rating: true,
      },
      _count: {
        rating: true,
      },
    });

    const distribution = await this.prisma.productReview.groupBy({
      by: ['rating'],
      where: {
        productId,
      },
      _count: {
        rating: true,
      },
      orderBy: {
        rating: 'desc',
      },
    });

    const ratingDistribution = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };

    for (const item of distribution) {
      ratingDistribution[item.rating as keyof typeof ratingDistribution] =
        item._count.rating;
    }

    return {
      averageRating: aggregate._avg.rating ?? null,
      totalReviews: aggregate._count.rating,
      ratingDistribution,
    };
  }

  async getRelatedProducts(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: {
        id: productId,
      },
      select: {
        id: true,
        brandId: true,
        categoryId: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    const candidates = await this.prisma.product.findMany({
      where: {
        id: {
          not: productId,
        },
        OR: [
          {
            categoryId: product.categoryId,
          },
          {
            brandId: product.brandId,
          },
        ],
      },
      include: {
        brand: true,
        supplier: true,
        category: true,
      },
    });

    const rankedProducts = candidates
      .map((candidate) => {
        let score = 0;

        if (candidate.categoryId === product.categoryId) {
          score += 2;
        }

        if (candidate.brandId === product.brandId) {
          score += 1;
        }

        return {
          candidate,
          score,
        };
      })
      .sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score;
        }

        return (
          b.candidate.createdAt.getTime() - a.candidate.createdAt.getTime()
        );
      })
      .slice(0, 8);

    return rankedProducts.map(({ candidate }) => candidate);
  }
}
