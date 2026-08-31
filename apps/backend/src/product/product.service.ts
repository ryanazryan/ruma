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
}
