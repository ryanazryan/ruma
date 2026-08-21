import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { VerificationToken, VerificationTokenType } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { createHash, randomBytes } from 'crypto';
import { authConfig } from '../config/auth.config';
import { PrismaService } from '../prisma/prisma.service';

const TOKEN_HASH_ROUNDS = 12;

@Injectable()
export class VerificationTokensService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(authConfig.KEY)
    private readonly config: ConfigType<typeof authConfig>,
  ) {}

  async createForUser(userId: string): Promise<{ rawToken: string }> {
    const rawToken = randomBytes(32).toString('base64url');

    // Deterministic lookup key.
    // This is NOT used as the security verification mechanism.
    const tokenLookup = createHash('sha256').update(rawToken).digest('hex');

    // bcrypt remains the authoritative token hash.
    const tokenHash = await bcrypt.hash(rawToken, TOKEN_HASH_ROUNDS);

    const expiresAt = new Date(
      Date.now() + this.config.verificationTokenTtlHours * 60 * 60 * 1000,
    );

    await this.prisma.verificationToken.create({
      data: {
        userId,
        tokenLookup,
        tokenHash,
        type: VerificationTokenType.EMAIL_VERIFICATION,
        expiresAt,
      },
    });

    return { rawToken };
  }

  async rotateForUser(userId: string): Promise<{ rawToken: string }> {
    const now = new Date();

    await this.prisma.verificationToken.updateMany({
      where: {
        userId,
        type: VerificationTokenType.EMAIL_VERIFICATION,
        usedAt: null,
      },
      data: {
        usedAt: now,
      },
    });

    return this.createForUser(userId);
  }

  async findMatchingToken(rawToken: string): Promise<VerificationToken | null> {
    const tokenLookup = createHash('sha256').update(rawToken).digest('hex');

    const token = await this.prisma.verificationToken.findUnique({
      where: {
        tokenLookup,
      },
    });

    if (!token) {
      return null;
    }

    const isValid = await bcrypt.compare(rawToken, token.tokenHash);

    if (!isValid) {
      return null;
    }

    return token;
  }
}
