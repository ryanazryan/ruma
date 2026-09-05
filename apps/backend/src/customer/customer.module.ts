import { Module } from '@nestjs/common';

import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';

import { PrismaModule } from '../prisma/prisma.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { UsersModule } from '../users/users.module';
import { SessionsModule } from '../sessions/sessions.module';

@Module({
  imports: [
    PrismaModule,
    CloudinaryModule,
    UsersModule,
    SessionsModule,
  ],
  controllers: [CustomerController],
  providers: [CustomerService],
  exports: [CustomerService],
})
export class CustomerModule {}