import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { authConfig } from '../config/auth.config';
import { MailModule } from '../mail/mail.module';
import { SessionsModule } from '../sessions/sessions.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { VerificationTokensService } from './verification-tokens.service';

@Module({
  imports: [
    ConfigModule.forFeature(authConfig),
    UsersModule,
    MailModule,
    SessionsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, VerificationTokensService],
})
export class AuthModule {}
