import { Module } from '@nestjs/common';

import { CartController } from './cart.controller';
import { CartService } from './cart.service';

import { PrismaModule } from '../prisma/prisma.module';
import { SessionsModule } from '../sessions/sessions.module';
import { UsersModule } from '../users/users.module';
import { PricingModule } from '../pricing/pricing.module';

@Module({
  imports: [
    PrismaModule,
    SessionsModule,
    UsersModule,
    PricingModule,
  ],
  controllers: [
    CartController,
  ],
  providers: [
    CartService,
  ],
  exports: [
    CartService,
  ],
})
export class CartModule {}