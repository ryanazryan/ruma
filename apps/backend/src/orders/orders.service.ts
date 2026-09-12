import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MembershipService } from '../membership/membership.service';

const ORDER_LIFECYCLE = [
  'CREATED',
  'PENDING_PAYMENT',
  'PAID',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'COMPLETED',
  'CANCELLED',
] as const;

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly membershipService: MembershipService,
  ) {}

  async findMyOrders(userId: string) {
    return this.prisma.order.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        items: {
          select: {
            id: true,
            productId: true,
            productName: true,
            unitPrice: true,
            quantity: true,
            subtotal: true,
          },
        },
      },
    });
  }

  async findMyOrderById(userId: string, orderId: string) {
    const order = await this.prisma.order.findFirst({
      where: {
        id: orderId,
        userId,
      },
      include: {
        items: {
          select: {
            id: true,
            productId: true,
            productName: true,
            unitPrice: true,
            quantity: true,
            subtotal: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found.');
    }

    return order;
  }

  async getMyOrderTracking(userId: string, orderId: string) {
    const order = await this.prisma.order.findFirst({
      where: {
        id: orderId,
        userId,
      },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found.');
    }

    if (order.status === 'CANCELLED') {
      return {
        orderId: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        tracking: [
          {
            status: 'CREATED',
            completed: true,
          },
          {
            status: 'PENDING_PAYMENT',
            completed: false,
          },
          {
            status: 'CANCELLED',
            completed: true,
          },
        ],
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      };
    }

    const currentIndex = ORDER_LIFECYCLE.indexOf(
      order.status as (typeof ORDER_LIFECYCLE)[number],
    );

    const tracking = ORDER_LIFECYCLE.filter(
      (status) => status !== 'CANCELLED',
    ).map((status) => {
      const statusIndex = [
        'CREATED',
        'PENDING_PAYMENT',
        'PAID',
        'PROCESSING',
        'SHIPPED',
        'DELIVERED',
        'COMPLETED',
      ].indexOf(status);

      return {
        status,
        completed: statusIndex <= currentIndex,
      };
    });

    return {
      orderId: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      tracking,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }

  async cancelMyOrder(userId: string, orderId: string) {
    const order = await this.prisma.order.findFirst({
      where: {
        id: orderId,
        userId,
      },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        totalAmount: true,
        updatedAt: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found.');
    }

    const cancellableStatuses = ['PENDING_PAYMENT', 'PROCESSING'] as const;

    if (
      !cancellableStatuses.includes(
        order.status as (typeof cancellableStatuses)[number],
      )
    ) {
      throw new BadRequestException(
        'Order cannot be cancelled in its current status.',
      );
    }

    const cancelledOrder = await this.prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        status: 'CANCELLED',
      },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        totalAmount: true,
        updatedAt: true,
      },
    });

    return cancelledOrder;
  }

  async confirmMyOrder(userId: string, orderId: string) {
    const order = await this.prisma.order.findFirst({
      where: {
        id: orderId,
        userId,
      },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        totalAmount: true,
        updatedAt: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found.');
    }

    if (order.status !== 'DELIVERED') {
      throw new BadRequestException(
        'Order cannot be confirmed as received in its current status.',
      );
    }

    const completedOrder = await this.prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        status: 'COMPLETED',
      },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        totalAmount: true,
        updatedAt: true,
      },
    });

    return completedOrder;
  }
}
