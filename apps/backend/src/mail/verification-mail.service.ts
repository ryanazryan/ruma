import { Inject, Injectable, Logger } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { Resend } from 'resend';
import { authConfig } from '../config/auth.config';

@Injectable()
export class VerificationMailService {
  private readonly logger = new Logger(VerificationMailService.name);
  private readonly resend: Resend | undefined;

  constructor(
    @Inject(authConfig.KEY)
    private readonly config: ConfigType<typeof authConfig>,
  ) {
    this.resend = config.resendApiKey
      ? new Resend(config.resendApiKey)
      : undefined;
  }

  async sendVerificationEmail(email: string, token: string): Promise<boolean> {
    if (!this.resend || !this.config.resendFromEmail) {
      this.logger.error('Verification email service is not configured.');
      return false;
    }

    const verificationUrl = `${this.config.frontendPublicUrl}/verify-email?token=${encodeURIComponent(token)}`;

    try {
      const result = await this.resend.emails.send({
        from: this.config.resendFromEmail,
        to: email,
        subject: 'Verify your Moorlife Marketplace email',
        html: `<p>Welcome to Moorlife Marketplace.</p><p><a href="${verificationUrl}">Verify your email</a></p>`,
      });

      if (result.error) {
        this.logger.error('Verification email delivery was rejected.');
        return false;
      }

      return true;
    } catch {
      this.logger.error('Verification email delivery failed.');
      return false;
    }
  }
}
