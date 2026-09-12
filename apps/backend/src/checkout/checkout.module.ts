import { Module } from '@nestjs/common';

import { CheckoutController } from './checkout.controller';
import { CheckoutService } from './checkout.service';
import { PrismaModule } from '../prisma/prisma.module';
import { PricingModule } from '../pricing/pricing.module';
import { SessionsModule } from '../sessions/sessions.module';
import { UsersModule } from '../users/users.module';
import { ShippingModule } from '../shipping/shipping.module';

@Module({
  imports: [
    PrismaModule,
    PricingModule,
    SessionsModule,
    UsersModule,
    ShippingModule
  ],
  controllers: [CheckoutController],
  providers: [CheckoutService],
  exports: [CheckoutService],
})
export class CheckoutModule {}