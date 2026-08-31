import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

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
}
