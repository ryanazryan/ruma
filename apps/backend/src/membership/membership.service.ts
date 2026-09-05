import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { MembershipStatus, OrderStatus } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

const MEMBERSHIP_THRESHOLD = 600_000;

const QUALIFYING_BRANDS = new Set([
  'moorlife',
  'cleo-oxygen',
]);

@Injectable()
export class MembershipService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async calculateQualifyingPurchaseValue(
    userId: string,
  ) {
    const orders = await this.prisma.order.findMany({
      where: {
        userId,
        status: OrderStatus.COMPLETED,
      },
      select: {
        items: {
          select: {
            subtotal: true,
            product: {
              select: {
                brand: {
                  select: {
                    slug: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    let qualifyingPurchaseValue = 0;

    for (const order of orders) {
      for (const item of order.items) {
        const brandSlug =
          item.product.brand.slug.toLowerCase();

        if (QUALIFYING_BRANDS.has(brandSlug)) {
          qualifyingPurchaseValue += item.subtotal;
        }
      }
    }

    return qualifyingPurchaseValue;
  }

  async evaluateCustomerMembership(
    userId: string,
  ) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        membershipStatus: true,
        membershipActivatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(
        'Customer not found.',
      );
    }

    const qualifyingPurchaseValue =
      await this.calculateQualifyingPurchaseValue(
        userId,
      );

    // Membership is permanent once activated.
    if (
      user.membershipStatus ===
      MembershipStatus.MEMBER
    ) {
      return {
        membershipStatus: MembershipStatus.MEMBER,
        membershipActivatedAt:
          user.membershipActivatedAt,
        qualifyingPurchaseValue,
        threshold: MEMBERSHIP_THRESHOLD,
      };
    }

    // Customer has not reached the threshold.
    if (
      qualifyingPurchaseValue <
      MEMBERSHIP_THRESHOLD
    ) {
      return {
        membershipStatus:
          MembershipStatus.NON_MEMBER,
        membershipActivatedAt: null,
        qualifyingPurchaseValue,
        threshold: MEMBERSHIP_THRESHOLD,
      };
    }

    // Customer has reached Rp600,000.
    const membershipActivatedAt =
      user.membershipActivatedAt ??
      new Date();

    const updatedUser =
      await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          membershipStatus:
            MembershipStatus.MEMBER,
          membershipActivatedAt,
        },
        select: {
          membershipStatus: true,
          membershipActivatedAt: true,
        },
      });

    return {
      membershipStatus:
        updatedUser.membershipStatus,
      membershipActivatedAt:
        updatedUser.membershipActivatedAt,
      qualifyingPurchaseValue,
      threshold: MEMBERSHIP_THRESHOLD,
    };
  }
}