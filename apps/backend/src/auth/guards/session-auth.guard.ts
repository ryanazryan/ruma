import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';

import { SessionsService } from '../../sessions/sessions.service';

interface RequestWithCookies extends Request {
  cookies: Record<string, unknown>;
}

export interface AuthenticatedRequest extends RequestWithCookies {
  userId: string;
  sessionId: string;
}

@Injectable()
export class SessionAuthGuard implements CanActivate {
  constructor(private readonly sessions: SessionsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    const sessionToken = request.cookies.session;

    if (typeof sessionToken !== 'string' || sessionToken.length === 0) {
      throw new UnauthorizedException('Authentication required.');
    }

    const session = await this.sessions.findByToken(sessionToken);

    if (!session) {
      throw new UnauthorizedException('Invalid or expired session.');
    }

    request.userId = session.userId;
    request.sessionId = session.id;

    return true;
  }
}
