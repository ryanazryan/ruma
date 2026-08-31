import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { SessionsModule } from '../sessions/sessions.module';

import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    SessionsModule,
  ],
  controllers: [BrandController],
  providers: [BrandService],
  exports: [BrandService],
})
export class BrandModule {}