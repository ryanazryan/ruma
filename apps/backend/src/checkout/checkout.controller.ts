import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { CheckoutSummaryDto } from './dto/checkout-summary.dto';
import { UserRole } from '@prisma/client';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { SessionAuthGuard } from '../auth/guards/session-auth.guard';
import type { AuthenticatedRequest } from '../auth/guards/session-auth.guard';
import { PlaceOrderDto } from './dto/place-order.dto';

@Controller('customer/checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Get('summary')
  @UseGuards(SessionAuthGuard, RolesGuard)
  @Roles(UserRole.CUSTOMER)
  async getSummary(
    @Req() request: AuthenticatedRequest,
    @Query() dto: CheckoutSummaryDto,
  ) {
    const summary = await this.checkoutService.getSummary(
      request.userId,
      dto.addressId,
    );

    return {
      success: true,
      message: 'Checkout summary retrieved successfully.',
      data: summary,
    };
  }

  @Post()
  @UseGuards(SessionAuthGuard, RolesGuard)
  @Roles(UserRole.CUSTOMER)
  async placeOrder(
    @Req() request: AuthenticatedRequest,
    @Headers('idempotency-key') idempotencyKey: string | undefined,
    @Body() dto: PlaceOrderDto,
  ) {
    const result = await this.checkoutService.placeOrder(
      request.userId,
      dto,
      idempotencyKey,
    );

    return {
      success: true,
      message: 'Order placed successfully.',
      data: result,
    };
  }
}
