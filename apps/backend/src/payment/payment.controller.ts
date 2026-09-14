import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';

import { PaymentService } from './payment.service';
import { SubmitManualTransferDto } from './dto/submit-manual-transfer.dto';

import { SessionAuthGuard } from '../auth/guards/session-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import type { AuthenticatedRequest } from '../auth/guards/session-auth.guard';

@Controller('customer/payments')
@UseGuards(SessionAuthGuard, RolesGuard)
@Roles(UserRole.CUSTOMER)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get(':paymentId')
  async getPayment(
    @Req() request: AuthenticatedRequest,
    @Param('paymentId') paymentId: string,
  ) {
    const payment = await this.paymentService.getPayment(
      request.userId,
      paymentId,
    );

    return {
      success: true,
      message: 'Payment retrieved successfully.',
      data: payment,
    };
  }

  @Get(':paymentId/status')
  async getPaymentStatus(
    @Req() request: AuthenticatedRequest,
    @Param('paymentId') paymentId: string,
  ) {
    const status = await this.paymentService.getPaymentStatus(
      request.userId,
      paymentId,
    );

    return {
      success: true,
      message: 'Payment status retrieved successfully.',
      data: status,
    };
  }

  @Get(':paymentId/manual-transfer')
  async getManualTransferInstructions(
    @Req() request: AuthenticatedRequest,
    @Param('paymentId') paymentId: string,
  ) {
    const instructions =
      await this.paymentService.getManualTransferInstructions(
        request.userId,
        paymentId,
      );

    return {
      success: true,
      message: 'Manual transfer instructions retrieved successfully.',
      data: instructions,
    };
  }

  @Post(':paymentId/submissions')
  @UseInterceptors(FileInterceptor('proof'))
  async submitManualTransferPayment(
    @Req() request: AuthenticatedRequest,
    @Param('paymentId') paymentId: string,
    @Body() dto: SubmitManualTransferDto,
    @UploadedFile() proofFile: Express.Multer.File,
  ) {
    const submission = await this.paymentService.submitManualTransferPayment(
      request.userId,
      paymentId,
      dto,
      proofFile,
    );

    return {
      success: true,
      message: 'Manual transfer payment submitted successfully.',
      data: {
        submission,
      },
    };
  }

  @Get(':paymentId/submissions')
  async getPaymentSubmissions(
    @Req() request: AuthenticatedRequest,
    @Param('paymentId') paymentId: string,
  ) {
    const result = await this.paymentService.getPaymentSubmissions(
      request.userId,
      paymentId,
    );

    return {
      success: true,
      message: 'Payment submissions retrieved successfully.',
      data: result,
    };
  }
}
