import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from '../prisma/prisma.module';
import { SessionsModule } from '../sessions/sessions.module';
import { UsersModule } from '../users/users.module';

import { ShippingController } from './shipping.controller';
import { ShippingService } from './shipping.service';

import { BiteshipProvider } from './providers/biteship.provider';
import { ShippingProvider } from './providers/shipping-provider.interface';
import { SHIPPING_PROVIDER } from './providers/shipping-provider.token';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    SessionsModule,
    UsersModule,
  ],
  controllers: [
    ShippingController,
  ],
  providers: [
    ShippingService,
    BiteshipProvider,
    {
      provide: SHIPPING_PROVIDER,
      useExisting: BiteshipProvider,
    },
  ],
  exports: [
    ShippingService,
  ],
})
export class ShippingModule {}