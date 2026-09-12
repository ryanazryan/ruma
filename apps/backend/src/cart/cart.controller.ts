import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Req,
  Delete,
  UseGuards,
} from '@nestjs/common';

import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UserRole } from '@prisma/client';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { SessionAuthGuard } from '../auth/guards/session-auth.guard';
import type { AuthenticatedRequest } from '../auth/guards/session-auth.guard';
import { UpdateCartQuantityDto } from './dto/update-cart.quantity.dto';
import { UpdateCartSelectionDto } from './dto/update-cart-selection.dto';

@Controller('customer/cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('items')
  @UseGuards(SessionAuthGuard, RolesGuard)
  @Roles(UserRole.CUSTOMER)
  async addToCart(
    @Req() request: AuthenticatedRequest,
    @Body() dto: AddToCartDto,
  ) {
    const cartItem = await this.cartService.addToCart(
      request.userId,
      dto.productId,
      dto.quantity,
    );

    return {
      success: true,
      message: 'Product added to cart successfully.',
      data: {
        cartItem,
      },
    };
  }

  @Get()
  @UseGuards(SessionAuthGuard, RolesGuard)
  @Roles(UserRole.CUSTOMER)
  async getMyCart(@Req() request: AuthenticatedRequest) {
    const cart = await this.cartService.getMyCart(request.userId);

    return {
      success: true,
      message: 'Shopping cart retrieved successfully.',
      data: {
        cart,
      },
    };
  }

  @Patch('items/:itemId')
  @UseGuards(SessionAuthGuard, RolesGuard)
  @Roles(UserRole.CUSTOMER)
  async updateQuantity(
    @Req() request: AuthenticatedRequest,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateCartQuantityDto,
  ) {
    const cartItem = await this.cartService.updateQuantity(
      request.userId,
      itemId,
      dto.quantity,
    );

    return {
      success: true,
      message: 'Cart item quantity updated successfully.',
      data: {
        cartItem,
      },
    };
  }

  @Delete('items/:itemId')
  @UseGuards(SessionAuthGuard, RolesGuard)
  @Roles(UserRole.CUSTOMER)
  async removeItem(
    @Req() request: AuthenticatedRequest,
    @Param('itemId') itemId: string,
  ) {
    const cart = await this.cartService.removeItem(request.userId, itemId);

    return {
      success: true,
      message: 'Cart item removed successfully.',
      data: {
        cart,
      },
    };
  }

  @Patch('items/:itemId/selection')
  @UseGuards(SessionAuthGuard, RolesGuard)
  @Roles(UserRole.CUSTOMER)
  async updateSelection(
    @Req() request: AuthenticatedRequest,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateCartSelectionDto,
  ) {
    const cartItem = await this.cartService.updateSelection(
      request.userId,
      itemId,
      dto.isSelected,
    );

    return {
      success: true,
      message: 'Cart item selection updated successfully.',
      data: {
        cartItem,
      },
    };
  }
}
