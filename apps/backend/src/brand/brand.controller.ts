import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { UserRole } from '@prisma/client'

import { SessionAuthGuard } from '../auth/guards/session-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'

import { CreateBrandDto } from './dto/create-brand.dto'
import { UpdateBrandDto } from './dto/update-brand.dto'
import { UpdateBrandStatusDto } from './dto/update-brand-status.dto'
import { BrandService } from './brand.service'

@Controller('brands')
export class BrandController {
  constructor(
    private readonly brandService: BrandService,
  ) {}

  /**
   * Public brand listing
   */
  @Get()
  async getBrands() {
    const brands =
      await this.brandService.getBrands()

    return {
      success: true,
      message: 'Brands retrieved successfully.',
      data: {
        brands,
      },
    }
  }

  /**
   * Public brand detail by slug
   *
   * Example:
   * GET /brands/moorlife
   */
  @Get(':brandSlug')
  async getBrandBySlug(
    @Param('brandSlug') brandSlug: string,
  ) {
    const brand =
      await this.brandService.getBrandBySlug(
        brandSlug,
      )

    return {
      success: true,
      message: 'Brand retrieved successfully.',
      data: {
        brand,
        products: brand.products,
      },
    }
  }

  /**
   * Admin create brand
   */
  @Post()
  @UseGuards(SessionAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async createBrand(
    @Body() dto: CreateBrandDto,
  ) {
    const brand =
      await this.brandService.createBrand(
        dto.name,
        dto.slug,
        {
          tagline: dto.tagline,
          description: dto.description,
          origin: dto.origin,
          featured: dto.featured,
        },
      )

    return {
      success: true,
      message: 'Brand created successfully.',
      data: {
        brand,
      },
    }
  }

  /**
   * Admin upload brand logo
   */
  @Post(':brandId/logo')
  @UseGuards(SessionAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  async uploadBrandLogo(
    @Param('brandId') brandId: string,
    @UploadedFile()
    file: {
      buffer: Buffer
      mimetype: string
    },
  ) {
    if (!file) {
      throw new BadRequestException(
        'Brand logo is required.',
      )
    }

    const brand =
      await this.brandService.uploadBrandLogo(
        brandId,
        file.buffer,
        file.mimetype,
      )

    return {
      success: true,
      message:
        'Brand logo uploaded successfully.',
      data: {
        brand,
      },
    }
  }

  /**
   * Admin upload brand cover image
   */
  @Post(':brandId/cover')
  @UseGuards(SessionAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  async uploadBrandCover(
    @Param('brandId') brandId: string,
    @UploadedFile()
    file: {
      buffer: Buffer
      mimetype: string
    },
  ) {
    if (!file) {
      throw new BadRequestException(
        'Brand cover image is required.',
      )
    }

    const brand =
      await this.brandService.uploadBrandCover(
        brandId,
        file.buffer,
        file.mimetype,
      )

    return {
      success: true,
      message:
        'Brand cover image uploaded successfully.',
      data: {
        brand,
      },
    }
  }

  /**
   * Admin update brand profile
   */
  @Patch(':brandId')
  @UseGuards(SessionAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateBrand(
    @Param('brandId') brandId: string,
    @Body() dto: UpdateBrandDto,
  ) {
    const brand =
      await this.brandService.updateBrand(
        brandId,
        dto,
      )

    return {
      success: true,
      message: 'Brand updated successfully.',
      data: {
        brand,
      },
    }
  }

  /**
   * Admin update brand status
   */
  @Patch(':brandId/status')
  @UseGuards(SessionAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateBrandStatus(
    @Param('brandId') brandId: string,
    @Body() dto: UpdateBrandStatusDto,
  ) {
    const brand =
      await this.brandService.updateBrandStatus(
        brandId,
        dto.status,
      )

    return {
      success: true,
      message: 'Brand status updated successfully.',
      data: {
        brand,
      },
    }
  }
}