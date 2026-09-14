import { Injectable } from '@nestjs/common';

import { PaymentService } from '../../payment/payment.service';

@Injectable()
export class AdminPaymentVerificationService {
  constructor(
    private readonly paymentService: PaymentService,
  ) {}

  async getPaymentSubmissions() {
    return this.paymentService.getAdminPaymentSubmissions();
  }

  async getPaymentSubmission(submissionId: string) {
    return this.paymentService.getAdminPaymentSubmission(submissionId);
  }

  async approvePaymentSubmission(
    adminUserId: string,
    submissionId: string,
  ) {
    return this.paymentService.approveManualPaymentSubmission(
      adminUserId,
      submissionId,
    );
  }

  async rejectPaymentSubmission(
    adminUserId: string,
    submissionId: string,
    rejectionReason: string,
  ) {
    return this.paymentService.rejectManualPaymentSubmission(
      adminUserId,
      submissionId,
      rejectionReason,
    );
  }
}