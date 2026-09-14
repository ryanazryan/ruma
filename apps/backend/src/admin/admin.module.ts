import { Module } from '@nestjs/common';

import { AdminPaymentVerificationController } from './payment-verification/admin-payment-verification.controller';
import { AdminPaymentVerificationService } from './payment-verification/admin-payment-verification.service';

import { PaymentModule } from '../payment/payment.module';
import { SessionsModule } from '../sessions/sessions.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    SessionsModule,
    UsersModule,
    PaymentModule,
  ],
  controllers: [
    AdminPaymentVerificationController,
  ],
  providers: [
    AdminPaymentVerificationService,
  ],
})
export class AdminModule {}