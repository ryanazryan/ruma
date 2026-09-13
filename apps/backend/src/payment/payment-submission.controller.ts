import {
  Controller,
  Get,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';

import { PaymentService } from './payment.service';

import { SessionAuthGuard } from '../auth/guards/session-auth.guard';
import type { AuthenticatedRequest } from '../auth/guards/session-auth.guard';

@Controller('customer/payment-submissions')
@UseGuards(SessionAuthGuard)
export class PaymentSubmissionController {
  constructor(
    private readonly paymentService: PaymentService,
  ) {}

  @Get(':submissionId')
  async getPaymentSubmission(
    @Req() request: AuthenticatedRequest,
    @Param('submissionId') submissionId: string,
  ) {
    const submission =
      await this.paymentService.getPaymentSubmission(
        request.userId,
        submissionId,
      );

    return {
      success: true,
      message:
        'Payment submission retrieved successfully.',
      data: {
        submission,
      },
    };
  }
}