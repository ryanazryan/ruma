import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { Throttle } from '@nestjs/throttler';
import type { ConfigType } from '@nestjs/config';

import { authConfig } from '../config/auth.config';
import {
  RATE_LIMIT_WINDOW_MS,
  REGISTRATION_RATE_LIMIT,
  RESEND_VERIFICATION_RATE_LIMIT,
} from '../config/rate-limit.config';

import { AuthService } from './auth.service';
import { ApiSuccessResponse, LoginResponseData } from './auth.types';

import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResendVerificationDto } from './dto/resend-verification.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

import { SessionAuthGuard } from './guards/session-auth.guard';
import type { AuthenticatedRequest } from './guards/session-auth.guard';
import { ResetPasswordDto } from './dto/reset-password.dto';

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
  constructor(
    private readonly authService: AuthService,
    @Inject(authConfig.KEY)
    private readonly config: ConfigType<typeof authConfig>,
  ) {}

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

  @Post('login')
  @Throttle({
    default: {
      limit: 5,
      ttl: 60_000,
      getTracker: (request) => clientIp(request as RequestLike),
    },
  })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<ApiSuccessResponse<LoginResponseData>> {
    const result = await this.authService.login(dto);

    response.cookie('session', result.sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: this.config.sessionTtlHours * 60 * 60 * 1000,
      path: '/',
    });

    return result.response;
  }

  @Post('refresh')
  @UseGuards(SessionAuthGuard)
  async refresh(
    @Req() request: AuthenticatedRequest,
    @Res({ passthrough: true }) response: Response,
  ): Promise<ApiSuccessResponse> {
    const result = await this.authService.refreshSession(
      request.sessionId,
      request.userId,
    );

    response.cookie('session', result.sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: this.config.sessionTtlHours * 60 * 60 * 1000,
      path: '/',
    });

    return {
      success: true,
      message: 'Session refreshed successfully.',
      data: null,
    };
  }

  @Get('me')
  @UseGuards(SessionAuthGuard)
  me(
    @Req() request: AuthenticatedRequest,
  ): Promise<ApiSuccessResponse<LoginResponseData>> {
    return this.authService.getCurrentUser(request.userId);
  }

  @Post('logout')
  @UseGuards(SessionAuthGuard)
  async logout(
    @Req() request: AuthenticatedRequest,
    @Res({ passthrough: true }) response: Response,
  ): Promise<ApiSuccessResponse> {
    await this.authService.logout(request.sessionId);

    response.clearCookie('session', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return {
      success: true,
      message: 'Logout successful.',
      data: null,
    };
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

  @Post('forgot-password')
  @Throttle({
    default: {
      limit: 5,
      ttl: 60_000,
      getTracker: (request) => clientIp(request as RequestLike),
    },
  })
  forgotPassword(@Body() dto: ForgotPasswordDto): Promise<ApiSuccessResponse> {
    return this.authService.forgotPassword(dto);
  }

  @Post('reset-password')
  @Throttle({
    default: {
      limit: 5,
      ttl: 60_000,
      getTracker: (request) => clientIp(request as RequestLike),
    },
  })
  resetPassword(@Body() dto: ResetPasswordDto): Promise<ApiSuccessResponse> {
    return this.authService.resetPassword(dto);
  }
}
