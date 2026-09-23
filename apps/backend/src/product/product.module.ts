import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { UsersModule } from '../users/users.module';
import { SessionsModule } from '../sessions/sessions.module';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { AdminProductController } from './admin/admin-product.controller';

@Module({
  imports: [
    PrismaModule,
    CloudinaryModule,
    UsersModule,
    SessionsModule,
  ],
  controllers: [
    ProductController,
    AdminProductController,
  ],
  providers: [ProductService],
})
export class ProductModule {}