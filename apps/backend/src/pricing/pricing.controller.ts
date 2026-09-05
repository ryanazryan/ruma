import {
  Controller,
  Get,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';

import { PricingService } from './pricing.service';
import { SessionAuthGuard } from '../auth/guards/session-auth.guard';
import type { AuthenticatedRequest } from '../auth/guards/session-auth.guard';

@Controller('customer/pricing')
export class PricingController {
  constructor(
    private readonly pricingService: PricingService,
  ) {}

  @Get('product/:productId')
  @UseGuards(SessionAuthGuard)
  async getProductPrice(
    @Req() request: AuthenticatedRequest,
    @Param('productId') productId: string,
  ) {
    const pricing =
      await this.pricingService.getProductPrice(
        request.userId,
        productId,
      );

    return {
      success: true,
      message: 'Product pricing retrieved successfully.',
      data: {
        pricing,
      },
    };
  }
}