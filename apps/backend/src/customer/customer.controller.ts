import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';

import { CustomerService } from './customer.service';
import { UpdateCustomerProfileDto } from './dto/update-customer-profile.dto';
import { SessionAuthGuard } from '../auth/guards/session-auth.guard';
import type { AuthenticatedRequest } from '../auth/guards/session-auth.guard';
import { CreateCustomerAddressDto } from './dto/create-customer-address.dto';
import { UpdateCustomerAddressDto } from './dto/update-customer-address.dto';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get('profile')
  @UseGuards(SessionAuthGuard)
  async getProfile(@Req() request: AuthenticatedRequest) {
    const profile = await this.customerService.getProfile(request.userId);

    return {
      success: true,
      message: 'Customer profile retrieved successfully.',
      data: {
        user: profile,
      },
    };
  }

  @Patch('profile')
  @UseGuards(SessionAuthGuard)
  async updateProfile(
    @Req() request: AuthenticatedRequest,
    @Body() dto: UpdateCustomerProfileDto,
  ) {
    const profile = await this.customerService.updateProfile(
      request.userId,
      dto.fullName,
    );

    return {
      success: true,
      message: 'Customer profile updated successfully.',
      data: {
        user: profile,
      },
    };
  }

  @Post('profile/photo')
  @UseGuards(SessionAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async updateProfilePhoto(
    @Req() request: AuthenticatedRequest,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Profile photo is required.');
    }

    const profilePhoto = await this.customerService.updateProfilePhoto(
      request.userId,
      file.buffer,
    );

    return {
      success: true,
      message: 'Profile photo updated successfully.',
      data: {
        profilePhoto,
      },
    };
  }

  @Get('addresses')
  @UseGuards(SessionAuthGuard)
  async getAddresses(@Req() request: AuthenticatedRequest) {
    const addresses = await this.customerService.getAddresses(request.userId);

    return {
      success: true,
      message: 'Customer addresses retrieved successfully.',
      data: {
        addresses,
      },
    };
  }

  @Post('addresses')
  @UseGuards(SessionAuthGuard)
  async createAddress(
    @Req() request: AuthenticatedRequest,
    @Body() dto: CreateCustomerAddressDto,
  ) {
    const address = await this.customerService.createAddress(
      request.userId,
      dto,
    );

    return {
      success: true,
      message: 'Customer address created successfully.',
      data: {
        address,
      },
    };
  }

  @Patch('addresses/:addressId/default')
  @UseGuards(SessionAuthGuard)
  async setDefaultAddress(
    @Req() request: AuthenticatedRequest,
    @Param('addressId') addressId: string,
  ) {
    const address = await this.customerService.setDefaultAddress(
      request.userId,
      addressId,
    );

    return {
      success: true,
      message: 'Default customer address updated successfully.',
      data: {
        address,
      },
    };
  }

  @Patch('addresses/:addressId')
  @UseGuards(SessionAuthGuard)
  async updateAddress(
    @Req() request: AuthenticatedRequest,
    @Param('addressId') addressId: string,
    @Body() dto: UpdateCustomerAddressDto,
  ) {
    const address = await this.customerService.updateAddress(
      request.userId,
      addressId,
      dto,
    );

    return {
      success: true,
      message: 'Customer address updated successfully.',
      data: {
        address,
      },
    };
  }

  @Get('notifications')
  @UseGuards(SessionAuthGuard)
  async getNotifications(@Req() request: AuthenticatedRequest) {
    const notifications = await this.customerService.getNotifications(
      request.userId,
    );

    return {
      success: true,
      message: 'Customer notifications retrieved successfully.',
      data: {
        notifications,
      },
    };
  }

  @Get('notifications/:notificationId')
  @UseGuards(SessionAuthGuard)
  async getNotificationById(
    @Req() request: AuthenticatedRequest,
    @Param('notificationId') notificationId: string,
  ) {
    const notification = await this.customerService.getNotificationById(
      request.userId,
      notificationId,
    );

    return {
      success: true,
      message: 'Customer notification retrieved successfully.',
      data: {
        notification,
      },
    };
  }
}
