import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SessionAuthGuard } from '../auth/guards/session-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import type { AuthenticatedRequest } from '../auth/guards/session-auth.guard';
import { WishlistService } from './wishlist.service';

@Controller('customer/wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  @UseGuards(SessionAuthGuard, RolesGuard)
  @Roles(UserRole.CUSTOMER)
  async getWishlist(@Req() request: AuthenticatedRequest) {
    const wishlist = await this.wishlistService.getWishlist(request.userId);

    return {
      success: true,
      message: 'Wishlist retrieved successfully.',
      data: {
        wishlist,
      },
    };
  }

  @Post(':productId')
  @UseGuards(SessionAuthGuard, RolesGuard)
  @Roles(UserRole.CUSTOMER)
  async addToWishlist(
    @Req() request: AuthenticatedRequest,
    @Param('productId') productId: string,
  ) {
    const wishlistItem = await this.wishlistService.addToWishlist(
      request.userId,
      productId,
    );

    return {
      success: true,
      message: 'Product added to wishlist successfully.',
      data: {
        wishlistItem,
      },
    };
  }

  @Delete(':productId')
  @UseGuards(SessionAuthGuard, RolesGuard)
  @Roles(UserRole.CUSTOMER)
  async removeFromWishlist(
    @Req() request: AuthenticatedRequest,
    @Param('productId') productId: string,
  ) {
    await this.wishlistService.removeFromWishlist(request.userId, productId);

    return {
      success: true,
      message: 'Product removed from wishlist successfully.',
      data: null,
    };
  }
}
