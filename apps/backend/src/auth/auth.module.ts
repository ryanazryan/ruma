import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from '../mail/mail.module';
import { UsersModule } from '../users/users.module';
import { authConfig } from '../config/auth.config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { VerificationTokensService } from './verification-tokens.service';

@Module({
  imports: [ConfigModule.forFeature(authConfig), UsersModule, MailModule],
  controllers: [AuthController],
  providers: [AuthService, VerificationTokensService],
})
export class AuthModule {}
