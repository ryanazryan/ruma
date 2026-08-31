import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

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

  @Post(':productId/media')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  async uploadProductMedia(
    @Param('productId') productId: string,
    @UploadedFile()
    file: {
      buffer: Buffer;
      mimetype: string;
    },
  ) {
    if (!file) {
      throw new BadRequestException('Product image is required.');
    }

    const media = await this.productService.uploadProductMedia(
      productId,
      file.buffer,
      file.mimetype,
    );

    return {
      success: true,
      message: 'Product media uploaded successfully.',
      data: {
        media,
      },
    };
  }

  @Get(':productId/reviews')
  async getProductReviews(@Param('productId') productId: string) {
    const reviews = await this.productService.getProductReviews(productId);

    return {
      success: true,
      message: 'Product reviews retrieved successfully.',
      data: {
        reviews,
      },
    };
  }

  @Get(':productId/media')
  async getProductMedia(@Param('productId') productId: string) {
    const media = await this.productService.getProductMedia(productId);

    return {
      success: true,
      message: 'Product media retrieved successfully.',
      data: {
        media,
      },
    };
  }

  @Get(':productId/rating')
  async getProductRating(@Param('productId') productId: string) {
    const rating = await this.productService.getProductRating(productId);

    return {
      success: true,
      message: 'Product rating retrieved successfully.',
      data: {
        rating,
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
