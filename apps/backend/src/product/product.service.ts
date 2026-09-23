import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreateProductDto } from './dto/create-product.dto';

function addProductNewStatus<
  T extends {
    newUntil: Date | null;
  },
>(product: T) {
  return {
    ...product,
    isNew: product.newUntil !== null && product.newUntil.getTime() > Date.now(),
  };
}

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  async getProducts() {
  const products = await this.prisma.product.findMany({
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

  return products.map(addProductNewStatus);
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
        inventory: true,
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

    return addProductNewStatus(product);
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

    const products = await this.prisma.product.findMany({
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

    return products.map(addProductNewStatus);
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

    const products = await this.prisma.product.findMany({
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

    return products.map(addProductNewStatus);
  }

  async sortProducts(sortBy: 'price' | 'newest', sortOrder: 'asc' | 'desc') {
    const products =
      sortBy === 'newest'
        ? await this.prisma.product.findMany({
            where: {
              newUntil: {
                gt: new Date(),
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
          })
        : await this.prisma.product.findMany({
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
              price: sortOrder,
            },
          });

    return products.map(addProductNewStatus);
  }

  async createProduct(dto: CreateProductDto, createdByUserId: string) {
    const existingProduct = await this.prisma.product.findFirst({
      where: {
        OR: [
          {
            sku: dto.sku,
          },
          {
            slug: dto.slug,
          },
        ],
      },
      select: {
        id: true,
        sku: true,
        slug: true,
      },
    });

    if (existingProduct) {
      if (existingProduct.sku === dto.sku) {
        throw new ConflictException('Product SKU already exists.');
      }

      throw new ConflictException('Product slug already exists.');
    }

    const brand = await this.prisma.brand.findUnique({
      where: {
        id: dto.brandId,
      },
      select: {
        id: true,
        status: true,
      },
    });

    if (!brand) {
      throw new NotFoundException('Brand not found.');
    }

    if (brand.status !== 'ACTIVE') {
      throw new BadRequestException('Brand is inactive.');
    }

    const supplier = await this.prisma.supplier.findUnique({
      where: {
        id: dto.supplierId,
      },
      select: {
        id: true,
        status: true,
      },
    });

    if (!supplier) {
      throw new NotFoundException('Supplier not found.');
    }

    if (supplier.status !== 'ACTIVE') {
      throw new BadRequestException('Supplier is inactive.');
    }

    const category = await this.prisma.category.findUnique({
      where: {
        id: dto.categoryId,
      },
      select: {
        id: true,
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found.');
    }

    let newUntil: Date | null = null;

    if (dto.newUntil) {
      newUntil = new Date(dto.newUntil);

      if (Number.isNaN(newUntil.getTime())) {
        throw new BadRequestException('Invalid newUntil date.');
      }

      if (newUntil.getTime() <= Date.now()) {
        throw new BadRequestException('newUntil must be a future date.');
      }
    }

    const product = await this.prisma.$transaction(async (tx) => {
      const createdProduct = await tx.product.create({
        data: {
          sku: dto.sku,
          name: dto.name,
          slug: dto.slug,
          description: dto.description,
          price: dto.price,
          newUntil,
          weightGram: dto.weightGram,
          lengthCm: dto.lengthCm,
          widthCm: dto.widthCm,
          heightCm: dto.heightCm,
          brandId: dto.brandId,
          supplierId: dto.supplierId,
          categoryId: dto.categoryId,
        },
      });

      const inventory = await tx.inventory.create({
        data: {
          productId: createdProduct.id,
          availableQuantity: dto.initialStock,
          reservedQuantity: 0,
          committedQuantity: 0,
          lowStockThreshold: dto.lowStockThreshold ?? 0,
        },
      });

      if (dto.initialStock > 0) {
        await tx.stockMovement.create({
          data: {
            inventoryId: inventory.id,
            type: 'IN',
            quantity: dto.initialStock,
            referenceType: 'PRODUCT_INITIAL_STOCK',
            referenceId: createdProduct.id,
            reason: 'Initial stock when product was created.',
            createdByUserId,
          },
        });
      }

      return tx.product.findUniqueOrThrow({
        where: {
          id: createdProduct.id,
        },
        include: {
          brand: true,
          supplier: true,
          category: true,
          inventory: true,
          media: {
            orderBy: {
              sortOrder: 'asc',
            },
          },
        },
      });
    });

    return addProductNewStatus(product);
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
        media: {
          orderBy: {
            sortOrder: 'asc',
          },
        },
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

    return rankedProducts.map(({ candidate }) =>
      addProductNewStatus(candidate),
    );
  }
}
