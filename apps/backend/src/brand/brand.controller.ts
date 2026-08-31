import {
  Body,
  Post,
  UseGuards,
  Controller,
  Get,
  Param,
  Patch,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { SessionAuthGuard } from '../auth/guards/session-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateBrandDto } from './dto/create-brand.dto';
import { BrandService } from './brand.service';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { UpdateBrandStatusDto } from './dto/update-brand-status.dto';

@Controller('brands')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Get()
  async getBrands() {
    const brands = await this.brandService.getBrands();

    return {
      success: true,
      message: 'Brands retrieved successfully.',
      data: {
        brands,
      },
    };
  }

  @Get(':brandId')
  async getBrandById(@Param('brandId') brandId: string) {
    const brand = await this.brandService.getBrandById(brandId);

    return {
      success: true,
      message: 'Brand retrieved successfully.',
      data: {
        brand,
      },
    };
  }

  @Post()
  @UseGuards(SessionAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async createBrand(@Body() dto: CreateBrandDto) {
    const brand = await this.brandService.createBrand(dto.name, dto.slug);

    return {
      success: true,
      message: 'Brand created successfully.',
      data: {
        brand,
      },
    };
  }

  @Patch(':brandId')
  @UseGuards(SessionAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateBrand(
    @Param('brandId') brandId: string,
    @Body() dto: UpdateBrandDto,
  ) {
    const brand = await this.brandService.updateBrand(brandId, dto);

    return {
      success: true,
      message: 'Brand updated successfully.',
      data: {
        brand,
      },
    };
  }

  @Patch(':brandId/status')
  @UseGuards(SessionAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateBrandStatus(
    @Param('brandId') brandId: string,
    @Body() dto: UpdateBrandStatusDto,
  ) {
    const brand = await this.brandService.updateBrandStatus(
      brandId,
      dto.status,
    );

    return {
      success: true,
      message: 'Brand status updated successfully.',
      data: {
        brand,
      },
    };
  }
}
