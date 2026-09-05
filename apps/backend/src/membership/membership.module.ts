import { Module } from '@nestjs/common';

import { MembershipController } from './membership.controller';
import { MembershipService } from './membership.service';

import { PrismaModule } from '../prisma/prisma.module';
import { SessionsModule } from '../sessions/sessions.module';

@Module({
  imports: [
    PrismaModule,
    SessionsModule,
  ],
  controllers: [MembershipController],
  providers: [MembershipService],
  exports: [MembershipService],
})
export class MembershipModule {}