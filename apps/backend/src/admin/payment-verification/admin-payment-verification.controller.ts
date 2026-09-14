import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { UserRole } from '@prisma/client';

import { AdminPaymentVerificationService } from './admin-payment-verification.service';
import { RejectPaymentSubmissionDto } from './dto/reject-payment-submission.dto';

import { SessionAuthGuard } from '../../auth/guards/session-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import type { AuthenticatedRequest } from '../../auth/guards/session-auth.guard';

@Controller('admin/payment-submissions')
@UseGuards(SessionAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminPaymentVerificationController {
  constructor(
    private readonly adminPaymentVerificationService: AdminPaymentVerificationService,
  ) {}

  @Get()
  async getPaymentSubmissions() {
    const result =
      await this.adminPaymentVerificationService.getPaymentSubmissions();

    return {
      success: true,
      message: 'Payment submissions retrieved successfully.',
      data: result,
    };
  }

  @Get(':submissionId')
  async getPaymentSubmission(
    @Param('submissionId') submissionId: string,
  ) {
    const result =
      await this.adminPaymentVerificationService.getPaymentSubmission(
        submissionId,
      );

    return {
      success: true,
      message: 'Payment submission retrieved successfully.',
      data: result,
    };
  }

  @Post(':submissionId/approve')
  async approvePaymentSubmission(
    @Req() request: AuthenticatedRequest,
    @Param('submissionId') submissionId: string,
  ) {
    const result =
      await this.adminPaymentVerificationService.approvePaymentSubmission(
        request.userId,
        submissionId,
      );

    return {
      success: true,
      message: 'Payment submission approved successfully.',
      data: result,
    };
  }

  @Post(':submissionId/reject')
  async rejectPaymentSubmission(
    @Req() request: AuthenticatedRequest,
    @Param('submissionId') submissionId: string,
    @Body() dto: RejectPaymentSubmissionDto,
  ) {
    const result =
      await this.adminPaymentVerificationService.rejectPaymentSubmission(
        request.userId,
        submissionId,
        dto.rejectionReason,
      );

    return {
      success: true,
      message: 'Payment submission rejected successfully.',
      data: result,
    };
  }
}