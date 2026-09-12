import {
  Controller,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';

import { UserRole } from '@prisma/client';

import { MembershipService } from './membership.service';
import { SessionAuthGuard } from '../auth/guards/session-auth.guard';
import type { AuthenticatedRequest } from '../auth/guards/session-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('customer/membership')
export class MembershipController {
  constructor(
    private readonly membershipService: MembershipService,
  ) {}

  @Get()
  @UseGuards(SessionAuthGuard, RolesGuard)
  @Roles(UserRole.CUSTOMER)
  async getMyMembership(
    @Req() request: AuthenticatedRequest,
  ) {
    const membership =
      await this.membershipService.evaluateCustomerMembership(
        request.userId,
      );

    return {
      success: true,
      message: 'Customer membership retrieved successfully.',
      data: {
        membership,
      },
    };
  }
}