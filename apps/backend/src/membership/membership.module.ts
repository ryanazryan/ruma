import { Module } from '@nestjs/common';

import { MembershipController } from './membership.controller';
import { MembershipService } from './membership.service';

import { PrismaModule } from '../prisma/prisma.module';
import { SessionsModule } from '../sessions/sessions.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    PrismaModule,
    SessionsModule,
    UsersModule,
  ],
  controllers: [MembershipController],
  providers: [MembershipService],
  exports: [MembershipService],
})
export class MembershipModule {}