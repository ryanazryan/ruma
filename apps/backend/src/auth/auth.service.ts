import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { AccountStatus, Prisma } from '@prisma/client';
import * as argon2 from 'argon2';
import { VerificationMailService } from '../mail/verification-mail.service';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { ApiSuccessResponse } from './auth.types';
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
      where: { id: token.userId },
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
        where: { id: token.id, usedAt: null },
        data: { usedAt: now },
      });

      if (tokenUpdate.count !== 1) {
        throw new BadRequestException(
          'Verification token has already been used.',
        );
      }

      return transaction.user.update({
        where: { id: user.id },
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
}
