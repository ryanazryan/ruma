import { Injectable, NotFoundException } from '@nestjs/common';

import { MembershipStatus } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

const MEMBER_DISCOUNT_PERCENTAGE = 25;
const MEMBER_DISCOUNT_BRANDS = new Set(['moorlife', 'cleo-oxygen']);

@Injectable()
export class PricingService {
  constructor(private readonly prisma: PrismaService) {}

  async getProductPrice(userId: string, productId: string) {
    const [user, product] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          membershipStatus: true,
        },
      }),

      this.prisma.product.findUnique({
        where: { id: productId },
        select: {
          id: true,
          name: true,
          price: true,
          brand: {
            select: {
              slug: true,
            },
          },
        },
      }),
    ]);

    if (!user) {
      throw new NotFoundException('Customer not found.');
    }

    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    const isMember = user.membershipStatus === MembershipStatus.MEMBER;

    const isMemberDiscountApplicable =
      isMember && MEMBER_DISCOUNT_BRANDS.has(product.brand.slug.toLowerCase());

    const discountPercentage = isMemberDiscountApplicable
      ? MEMBER_DISCOUNT_PERCENTAGE
      : 0;

    const finalPrice = isMemberDiscountApplicable
      ? Math.round(product.price * (1 - MEMBER_DISCOUNT_PERCENTAGE / 100))
      : product.price;

    return {
      productId: product.id,
      productName: product.name,
      originalPrice: product.price,
      finalPrice,
      discountPercentage,
      isMemberDiscountApplicable,
    };
  }
}
