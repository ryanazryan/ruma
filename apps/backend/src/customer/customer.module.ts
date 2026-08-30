import { Module } from '@nestjs/common';

import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { SessionAuthGuard } from '../auth/guards/session-auth.guard';
import { SessionsModule } from '../sessions/sessions.module';
import { UsersModule } from '../users/users.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [UsersModule, SessionsModule, PrismaModule],
  controllers: [CustomerController],
  providers: [CustomerService, SessionAuthGuard],
})
export class CustomerModule {}
