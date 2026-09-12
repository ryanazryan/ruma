import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { UserRole } from '@prisma/client';

import { ShippingService } from './shipping.service';
import { CalculateShippingDto } from './dto/calculate-shipping.dto';

import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import {
  SessionAuthGuard,
  type AuthenticatedRequest,
} from '../auth/guards/session-auth.guard';

@Controller('customer/cart')
export class ShippingController {
  constructor(
    private readonly shippingService: ShippingService,
  ) {}

  @Post('shipping-estimate')
  @UseGuards(SessionAuthGuard, RolesGuard)
  @Roles(UserRole.CUSTOMER)
  async calculateShipping(
    @Req() request: AuthenticatedRequest,
    @Body() dto: CalculateShippingDto,
  ) {
    const shipping =
      await this.shippingService.calculateShipping(
        request.userId,
        dto.addressId,
      );

    return {
      success: true,
      message: 'Shipping estimate retrieved successfully.',
      data: {
        shipping,
      },
    };
  }
}