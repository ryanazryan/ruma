import { Injectable } from '@nestjs/common';
import { Session } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { createHash, randomBytes } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';

const SESSION_TOKEN_BYTES = 32;
const SESSION_TOKEN_HASH_ROUNDS = 12;

@Injectable()
export class SessionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: string,
    ttlHours: number,
  ): Promise<{ session: Session; rawToken: string }> {
    const rawToken = randomBytes(SESSION_TOKEN_BYTES).toString('base64url');

    const tokenLookup = createHash('sha256').update(rawToken).digest('hex');

    const tokenHash = await bcrypt.hash(rawToken, SESSION_TOKEN_HASH_ROUNDS);

    const expiresAt = new Date(Date.now() + ttlHours * 60 * 60 * 1000);

    const session = await this.prisma.session.create({
      data: {
        userId,
        tokenLookup,
        tokenHash,
        expiresAt,
      },
    });

    return {
      session,
      rawToken,
    };
  }

  async rotate(
    sessionId: string,
    userId: string,
    ttlHours: number,
  ): Promise<{ session: Session; rawToken: string } | null> {
    const rawToken = randomBytes(SESSION_TOKEN_BYTES).toString('base64url');

    const tokenLookup = createHash('sha256').update(rawToken).digest('hex');

    const tokenHash = await bcrypt.hash(rawToken, SESSION_TOKEN_HASH_ROUNDS);

    const now = new Date();
    const expiresAt = new Date(now.getTime() + ttlHours * 60 * 60 * 1000);

    return this.prisma.$transaction(async (transaction) => {
      const revoked = await transaction.session.updateMany({
        where: {
          id: sessionId,
          userId,
          revokedAt: null,
          expiresAt: {
            gt: now,
          },
        },
        data: {
          revokedAt: now,
        },
      });

      if (revoked.count !== 1) {
        return null;
      }

      const session = await transaction.session.create({
        data: {
          userId,
          tokenLookup,
          tokenHash,
          expiresAt,
        },
      });

      return {
        session,
        rawToken,
      };
    });
  }

  async findByToken(rawToken: string): Promise<Session | null> {
    const tokenLookup = createHash('sha256').update(rawToken).digest('hex');

    const session = await this.prisma.session.findUnique({
      where: {
        tokenLookup,
      },
    });

    if (!session) {
      return null;
    }

    if (session.revokedAt) {
      return null;
    }

    if (session.expiresAt <= new Date()) {
      return null;
    }

    const isValid = await bcrypt.compare(rawToken, session.tokenHash);

    if (!isValid) {
      return null;
    }

    return session;
  }

  async revoke(sessionId: string): Promise<void> {
    await this.prisma.session.update({
      where: {
        id: sessionId,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }

  async revokeAllForUser(userId: string): Promise<void> {
    await this.prisma.session.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }
}
