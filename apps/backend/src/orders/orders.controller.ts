import { Controller, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { UserRole } from '@prisma/client';
import { OrdersService } from './orders.service';
import { SessionAuthGuard } from '../auth/guards/session-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('customer/orders')
@UseGuards(SessionAuthGuard, RolesGuard)
@Roles(UserRole.CUSTOMER)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async findMyOrders(@Req() request: Request) {
    return this.ordersService.findMyOrders(request.userId);
  }

  @Get(':id')
  async findMyOrderById(@Req() request: Request, @Param('id') orderId: string) {
    return this.ordersService.findMyOrderById(request.userId, orderId);
  }

  @Get(':id/tracking')
  async getMyOrderTracking(
    @Req() request: Request,
    @Param('id') orderId: string,
  ) {
    return this.ordersService.getMyOrderTracking(request.userId, orderId);
  }

  @Patch(':id/cancel')
  async cancelMyOrder(@Req() request: Request, @Param('id') orderId: string) {
    return this.ordersService.cancelMyOrder(request.userId, orderId);
  }

  @Patch(':id/confirm')
  async confirmMyOrder(@Req() request: Request, @Param('id') orderId: string) {
    return this.ordersService.confirmMyOrder(request.userId, orderId);
  }
}
