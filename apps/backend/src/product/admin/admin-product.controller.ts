import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { UserRole } from '@prisma/client';

import { SessionAuthGuard } from '../../auth/guards/session-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

import { CreateProductDto } from '../dto/create-product.dto';
import { ProductService } from '../product.service';
import type { AuthenticatedRequest } from '../../auth/guards/session-auth.guard';

@Controller('admin/products')
@UseGuards(SessionAuthGuard, RolesGuard)
export class AdminProductController {
  constructor(
    private readonly productService: ProductService,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN)
  async createProduct(
    @Body() dto: CreateProductDto,
    @Req() request: AuthenticatedRequest,
  ) {
    const product = await this.productService.createProduct(
      dto,
      request.userId,
    );

    return {
      success: true,
      message: 'Product created successfully.',
      data: {
        product,
      },
    };
  }
}