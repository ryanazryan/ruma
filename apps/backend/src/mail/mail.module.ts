import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { authConfig } from '../config/auth.config';
import { VerificationMailService } from './verification-mail.service';

@Module({
  imports: [ConfigModule.forFeature(authConfig)],
  providers: [VerificationMailService],
  exports: [VerificationMailService],
})
export class MailModule {}
