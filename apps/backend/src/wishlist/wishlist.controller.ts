import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import { UserRole } from '@prisma/client'

import { Roles } from '../auth/decorators/roles.decorator'
import { RolesGuard } from '../auth/guards/roles.guard'
import {
  SessionAuthGuard,
} from '../auth/guards/session-auth.guard'
import type {
  AuthenticatedRequest,
} from '../auth/guards/session-auth.guard'

import { WishlistService } from './wishlist.service'

@Controller('customer/wishlist')
export class WishlistController {
  constructor(
    private readonly wishlistService: WishlistService,
  ) {}

  @Get()
  @UseGuards(SessionAuthGuard, RolesGuard)
  @Roles(UserRole.CUSTOMER)
  async getWishlist(
    @Req() request: AuthenticatedRequest,
  ) {
    const items =
      await this.wishlistService.getWishlist(
        request.userId,
      )

    return {
      success: true,
      message: 'Customer wishlist retrieved successfully.',
      data: {
        items,
      },
    }
  }

  @Post(':productId')
  @UseGuards(SessionAuthGuard, RolesGuard)
  @Roles(UserRole.CUSTOMER)
  async addToWishlist(
    @Req() request: AuthenticatedRequest,
    @Param('productId') productId: string,
  ) {
    const item =
      await this.wishlistService.addToWishlist(
        request.userId,
        productId,
      )

    return {
      success: true,
      message: 'Product added to wishlist successfully.',
      data: {
        item,
      },
    }
  }

  @Delete(':productId')
  @UseGuards(SessionAuthGuard, RolesGuard)
  @Roles(UserRole.CUSTOMER)
  async removeFromWishlist(
    @Req() request: AuthenticatedRequest,
    @Param('productId') productId: string,
  ) {
    await this.wishlistService.removeFromWishlist(
      request.userId,
      productId,
    )

    return {
      success: true,
      message: 'Product removed from wishlist successfully.',
      data: null,
    }
  }
}