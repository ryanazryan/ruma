import { Controller, Get, Req, UseGuards } from '@nestjs/common';

import { MembershipService } from './membership.service';
import { SessionAuthGuard } from '../auth/guards/session-auth.guard';
import type { AuthenticatedRequest } from '../auth/guards/session-auth.guard';

@Controller('customer/membership')
export class MembershipController {
  constructor(
    private readonly membershipService: MembershipService,
  ) {}

  @Get()
  @UseGuards(SessionAuthGuard)
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