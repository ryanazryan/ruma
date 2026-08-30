import {
  BadRequestException,
  Body,
  Controller,
  Get,
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
}
