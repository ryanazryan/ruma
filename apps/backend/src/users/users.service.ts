import { Injectable } from '@nestjs/common';
import { AccountStatus, Prisma, User, UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  create(
    data: Pick<Prisma.UserCreateInput, 'fullName' | 'email' | 'passwordHash'>,
  ): Promise<User> {
    return this.prisma.user.create({
      data: {
        ...data,
        role: UserRole.CUSTOMER,
        accountStatus: AccountStatus.PENDING_VERIFICATION,
      },
    });
  }
}
