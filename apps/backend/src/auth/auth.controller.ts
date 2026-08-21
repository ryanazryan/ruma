import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import {
  RATE_LIMIT_WINDOW_MS,
  REGISTRATION_RATE_LIMIT,
  RESEND_VERIFICATION_RATE_LIMIT,
} from '../config/rate-limit.config';
import { AuthService } from './auth.service';
import { ApiSuccessResponse } from './auth.types';
import { RegisterDto } from './dto/register.dto';
import { ResendVerificationDto } from './dto/resend-verification.dto';

interface RequestLike {
  headers?: Record<string, string | string[] | undefined>;
  ip?: string;
  socket?: {
    remoteAddress?: string;
  };
  body?: {
    email?: unknown;
  };
}

function clientIp(request: RequestLike): string {
  const headers = request.headers ?? {};
  const forwardedFor = headers['x-forwarded-for'];

  if (typeof forwardedFor === 'string') {
    return forwardedFor.split(',')[0].trim();
  }

  if (Array.isArray(forwardedFor)) {
    return forwardedFor[0]?.trim() ?? 'unknown';
  }

  return request.ip ?? request.socket?.remoteAddress ?? 'unknown';
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Throttle({
    default: {
      limit: REGISTRATION_RATE_LIMIT,
      ttl: RATE_LIMIT_WINDOW_MS,
      getTracker: (request) => clientIp(request as RequestLike),
    },
  })
  register(@Body() dto: RegisterDto): Promise<ApiSuccessResponse> {
    return this.authService.register(dto);
  }

  @Get('verify-email')
  verifyEmail(
    @Query('token') token: string | undefined,
  ): Promise<ApiSuccessResponse> {
    return this.authService.verifyEmail(token);
  }

  @Post('verify-email/resend')
  @Throttle({
    default: {
      limit: RESEND_VERIFICATION_RATE_LIMIT,
      ttl: RATE_LIMIT_WINDOW_MS,
      getTracker: (request) => {
        const typedRequest = request as RequestLike;
        const email =
          typeof typedRequest.body?.email === 'string'
            ? typedRequest.body.email.trim().toLowerCase()
            : 'unknown';

        return `${clientIp(typedRequest)}:${email}`;
      },
    },
  })
  resendVerification(
    @Body() dto: ResendVerificationDto,
  ): Promise<ApiSuccessResponse> {
    return this.authService.resendVerification(dto.email);
  }
}
