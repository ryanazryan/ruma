import { Module } from '@nestjs/common';

import { PricingController } from './pricing.controller';
import { PricingService } from './pricing.service';

import { PrismaModule } from '../prisma/prisma.module';
import { SessionsModule } from '../sessions/sessions.module';

@Module({
  imports: [
    PrismaModule,
    SessionsModule,
  ],
  controllers: [
    PricingController,
  ],
  providers: [
    PricingService,
  ],
  exports: [
    PricingService,
  ],
})
export class PricingModule {}