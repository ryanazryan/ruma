import {
  Body,
  Patch,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { UserRole } from '@prisma/client';
import { SessionAuthGuard } from '../auth/guards/session-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { UpdateSupplierStatusDto } from './dto/update-supplier-status.dto';

@Controller('suppliers')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Get()
  async getSuppliers() {
    const suppliers = await this.supplierService.getSuppliers();

    return {
      success: true,
      message: 'Suppliers retrieved successfully.',
      data: {
        suppliers,
      },
    };
  }

  @Get(':supplierId')
  async getSupplierById(@Param('supplierId') supplierId: string) {
    const supplier = await this.supplierService.getSupplierById(supplierId);

    return {
      success: true,
      message: 'Supplier retrieved successfully.',
      data: {
        supplier,
      },
    };
  }

  @Post()
  @UseGuards(SessionAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async createSupplier(@Body() dto: CreateSupplierDto) {
    const supplier = await this.supplierService.createSupplier(
      dto.name,
      dto.slug,
    );

    return {
      success: true,
      message: 'Supplier created successfully.',
      data: {
        supplier,
      },
    };
  }

  @Patch(':supplierId')
  @UseGuards(SessionAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateSupplier(
    @Param('supplierId') supplierId: string,
    @Body() dto: UpdateSupplierDto,
  ) {
    const supplier = await this.supplierService.updateSupplier(supplierId, dto);

    return {
      success: true,
      message: 'Supplier updated successfully.',
      data: {
        supplier,
      },
    };
  }

  @Patch(':supplierId/status')
  @UseGuards(SessionAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateSupplierStatus(
    @Param('supplierId') supplierId: string,
    @Body() dto: UpdateSupplierStatusDto,
  ) {
    const supplier = await this.supplierService.updateSupplierStatus(
      supplierId,
      dto.status,
    );

    return {
      success: true,
      message: 'Supplier status updated successfully.',
      data: {
        supplier,
      },
    };
  }
}
