import {
  Controller,
  Get,
  Param,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getProducts() {
    const products = await this.productService.getProducts();

    return {
      success: true,
      message: 'Products retrieved successfully.',
      data: {
        products,
      },
    };
  }

  @Get('categories')
  async getCategories() {
    const categories = await this.productService.getCategories();

    return {
      success: true,
      message: 'Product categories retrieved successfully.',
      data: {
        categories,
      },
    };
  }

  @Get('search')
  async searchProducts(@Query('q') query: string) {
    const products = await this.productService.searchProducts(query);

    return {
      success: true,
      message: 'Products search completed successfully.',
      data: {
        products,
      },
    };
  }

  @Get('filter')
  async filterProducts(
    @Query('brandId') brandId?: string,
    @Query('supplierId') supplierId?: string,
    @Query('categoryId') categoryId?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
  ) {
    const parsedMinPrice =
      minPrice !== undefined ? Number(minPrice) : undefined;

    const parsedMaxPrice =
      maxPrice !== undefined ? Number(maxPrice) : undefined;

    const products = await this.productService.filterProducts({
      brandId,
      supplierId,
      categoryId,
      minPrice: parsedMinPrice,
      maxPrice: parsedMaxPrice,
    });

    return {
      success: true,
      message: 'Products filtered successfully.',
      data: {
        products,
      },
    };
  }

  @Get('sort')
  async sortProducts(
    @Query('sortBy') sortBy = 'newest',
    @Query('sortOrder') sortOrder = 'desc',
  ) {
    const allowedSortBy = ['price', 'newest'];
    const allowedSortOrder = ['asc', 'desc'];

    if (!allowedSortBy.includes(sortBy)) {
      throw new BadRequestException('Unsupported sorting option.');
    }

    if (!allowedSortOrder.includes(sortOrder)) {
      throw new BadRequestException('Unsupported sorting order.');
    }

    const products = await this.productService.sortProducts(
      sortBy as 'price' | 'newest',
      sortOrder as 'asc' | 'desc',
    );

    return {
      success: true,
      message: 'Products sorted successfully.',
      data: {
        products,
      },
    };
  }

  @Get(':productId')
  async getProductById(@Param('productId') productId: string) {
    const product = await this.productService.getProductById(productId);

    return {
      success: true,
      message: 'Product retrieved successfully.',
      data: {
        product,
      },
    };
  }
}
