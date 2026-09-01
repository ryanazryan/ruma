import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WishlistService {
  constructor(private readonly prisma: PrismaService) {}

  async getWishlist(userId: string) {
    return this.prisma.wishlistItem.findMany({
      where: {
        userId,
      },
      include: {
        product: {
          include: {
            brand: true,
            category: true,
            media: {
              orderBy: {
                sortOrder: 'asc',
              },
              take: 1,
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async addToWishlist(userId: string, productId: string) {
    const product = await this.prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    const existingItem = await this.prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existingItem) {
      throw new ConflictException('Product is already in your wishlist.');
    }

    return this.prisma.wishlistItem.create({
      data: {
        userId,
        productId,
      },
      include: {
        product: {
          include: {
            brand: true,
            category: true,
            media: {
              orderBy: {
                sortOrder: 'asc',
              },
              take: 1,
            },
          },
        },
      },
    });
  }

  async removeFromWishlist(userId: string, productId: string) {
    const wishlistItem = await this.prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (!wishlistItem) {
      throw new NotFoundException('Product is not in your wishlist.');
    }

    await this.prisma.wishlistItem.delete({
      where: {
        id: wishlistItem.id,
      },
    });

    return wishlistItem;
  }
}
