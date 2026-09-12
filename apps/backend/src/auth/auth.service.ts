import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { AccountStatus, Prisma } from '@prisma/client';
import * as argon2 from 'argon2';

import { authConfig } from '../config/auth.config';
import { VerificationMailService } from '../mail/verification-mail.service';
import { PrismaService } from '../prisma/prisma.service';
import { SessionsService } from '../sessions/sessions.service';
import { UsersService } from '../users/users.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

import {
  ApiSuccessResponse,
  LoginResponseData,
  LoginResult,
} from './auth.types';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { VerificationTokensService } from './verification-tokens.service';

const REGISTRATION_SUCCESS_MESSAGE =
  'Registration successful. Please verify your email.';

const RESEND_SUCCESS_MESSAGE =
  'If the account exists and requires verification, a verification email has been sent.';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly users: UsersService,
    private readonly verificationTokens: VerificationTokensService,
    private readonly verificationMail: VerificationMailService,
    private readonly sessions: SessionsService,
    @Inject(authConfig.KEY)
    private readonly config: ConfigType<typeof authConfig>,
  ) {}

  async register(dto: RegisterDto): Promise<ApiSuccessResponse> {
    if (dto.password !== dto.confirmPassword) {
      throw new UnprocessableEntityException(
        'Password confirmation does not match.',
      );
    }

    const email = dto.email.trim().toLowerCase();

    const existingUser = await this.users.findByEmail(email);

    if (existingUser) {
      throw new ConflictException('Email is already registered.');
    }

    const passwordHash = await argon2.hash(dto.password, {
      type: argon2.argon2id,
    });

    try {
      const user = await this.users.create({
        fullName: dto.fullName.trim(),
        email,
        passwordHash,
      });

      const { rawToken } = await this.verificationTokens.createForUser(user.id);

      const emailSent = await this.verificationMail.sendVerificationEmail(
        user.email,
        rawToken,
      );

      if (!emailSent) {
        return {
          success: true,
          message:
            'Registration successful. Please request a verification email resend.',
          data: null,
        };
      }
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Email is already registered.');
      }

      throw error;
    }

    return {
      success: true,
      message: REGISTRATION_SUCCESS_MESSAGE,
      data: null,
    };
  }

  async verifyEmail(rawToken: string | undefined): Promise<ApiSuccessResponse> {
    if (!rawToken) {
      throw new BadRequestException('Verification token is required.');
    }

    const token = await this.verificationTokens.findMatchingToken(rawToken);

    if (!token) {
      throw new BadRequestException('Verification token is invalid.');
    }

    if (token.usedAt) {
      throw new BadRequestException(
        'Verification token has already been used.',
      );
    }

    if (token.expiresAt <= new Date()) {
      throw new BadRequestException('Verification token has expired.');
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: token.userId,
      },
    });

    if (!user) {
      throw new BadRequestException('Verification token is invalid.');
    }

    if (user.accountStatus !== AccountStatus.PENDING_VERIFICATION) {
      return {
        success: true,
        message: 'Email has already been verified.',
        data: null,
      };
    }

    const now = new Date();

    const result = await this.prisma.$transaction(async (transaction) => {
      const tokenUpdate = await transaction.verificationToken.updateMany({
        where: {
          id: token.id,
          usedAt: null,
        },
        data: {
          usedAt: now,
        },
      });

      if (tokenUpdate.count !== 1) {
        throw new BadRequestException(
          'Verification token has already been used.',
        );
      }

      return transaction.user.update({
        where: {
          id: user.id,
        },
        data: {
          accountStatus: AccountStatus.ACTIVE,
          emailVerifiedAt: now,
        },
      });
    });

    if (result.accountStatus !== AccountStatus.ACTIVE) {
      throw new BadRequestException('Unable to verify email.');
    }

    return {
      success: true,
      message: 'Email verified successfully.',
      data: null,
    };
  }

  async resendVerification(emailInput: string): Promise<ApiSuccessResponse> {
    const email = emailInput.trim().toLowerCase();

    const user = await this.users.findByEmail(email);

    if (user?.accountStatus === AccountStatus.PENDING_VERIFICATION) {
      const { rawToken } = await this.verificationTokens.rotateForUser(user.id);

      await this.verificationMail.sendVerificationEmail(user.email, rawToken);
    }

    return {
      success: true,
      message: RESEND_SUCCESS_MESSAGE,
      data: null,
    };
  }

  async login(dto: LoginDto): Promise<LoginResult> {
    const email = dto.email.trim().toLowerCase();

    const user = await this.users.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const passwordValid = await argon2.verify(user.passwordHash, dto.password);

    if (!passwordValid) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    if (user.accountStatus !== AccountStatus.ACTIVE) {
      throw new ForbiddenException(
        'Please verify your email before logging in.',
      );
    }

    const { rawToken } = await this.sessions.create(
      user.id,
      this.config.sessionTtlHours,
    );

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        lastLoginAt: new Date(),
      },
    });

    return {
      sessionToken: rawToken,
      response: {
        success: true,
        message: 'Login successful.',
        data: {
          user: {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
          },
        },
      },
    };
  }

  async refreshSession(
    sessionId: string,
    userId: string,
  ): Promise<{ sessionToken: string }> {
    const result = await this.sessions.rotate(
      sessionId,
      userId,
      this.config.sessionTtlHours,
    );

    if (!result) {
      throw new UnauthorizedException('Invalid or expired session.');
    }

    return {
      sessionToken: result.rawToken,
    };
  }

  async getCurrentUser(
    userId: string,
  ): Promise<ApiSuccessResponse<LoginResponseData>> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found.');
    }

    return {
      success: true,
      message: 'Authenticated user.',
      data: {
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
      },
    };
  }

  async logout(sessionId: string): Promise<ApiSuccessResponse> {
    await this.sessions.revoke(sessionId);

    return {
      success: true,
      message: 'Logout successful.',
      data: null,
    };
  }

  async changePassword(
    userId: string,
    dto: ChangePasswordDto,
  ): Promise<ApiSuccessResponse> {
    if (dto.newPassword !== dto.confirmPassword) {
      throw new UnprocessableEntityException(
        'Password confirmation does not match.',
      );
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found.');
    }

    const currentPasswordValid = await argon2.verify(
      user.passwordHash,
      dto.currentPassword,
    );

    if (!currentPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect.');
    }

    const passwordHash = await argon2.hash(dto.newPassword, {
      type: argon2.argon2id,
    });

    await this.prisma.$transaction(async (transaction) => {
      await transaction.user.update({
        where: {
          id: userId,
        },
        data: {
          passwordHash,
        },
      });

      await transaction.session.updateMany({
        where: {
          userId,
          revokedAt: null,
        },
        data: {
          revokedAt: new Date(),
        },
      });
    });

    return {
      success: true,
      message: 'Password changed successfully.',
      data: null,
    };
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<ApiSuccessResponse> {
    const email = dto.email.trim().toLowerCase();

    const user = await this.users.findByEmail(email);

    if (user) {
      const { rawToken } =
        await this.verificationTokens.rotatePasswordResetToken(user.id);

      await this.verificationMail.sendPasswordResetEmail(user.email, rawToken);
    }

    return {
      success: true,
      message: 'If the account exists, a password reset email has been sent.',
      data: null,
    };
  }

  async resetPassword(dto: ResetPasswordDto): Promise<ApiSuccessResponse> {
    if (dto.newPassword !== dto.confirmPassword) {
      throw new UnprocessableEntityException(
        'Password confirmation does not match.',
      );
    }

    const token = await this.verificationTokens.findMatchingPasswordResetToken(
      dto.token,
    );

    if (!token) {
      throw new BadRequestException(
        'Password reset token is invalid or expired.',
      );
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: token.userId,
      },
    });

    if (!user) {
      throw new BadRequestException(
        'Password reset token is invalid or expired.',
      );
    }

    const passwordHash = await argon2.hash(dto.newPassword, {
      type: argon2.argon2id,
    });

    const now = new Date();

    await this.prisma.$transaction(async (transaction) => {
      await transaction.user.update({
        where: {
          id: user.id,
        },
        data: {
          passwordHash,
        },
      });

      await transaction.verificationToken.updateMany({
        where: {
          id: token.id,
          usedAt: null,
        },
        data: {
          usedAt: now,
        },
      });

      await transaction.session.updateMany({
        where: {
          userId: user.id,
          revokedAt: null,
        },
        data: {
          revokedAt: now,
        },
      });
    });

    return {
      success: true,
      message: 'Password reset successful.',
      data: null,
    };
  }
}
