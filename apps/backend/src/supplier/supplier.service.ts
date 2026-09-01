import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SupplierStatus } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SupplierService {
  constructor(private readonly prisma: PrismaService) {}

  async getSuppliers() {
    return this.prisma.supplier.findMany({
      where: {
        status: SupplierStatus.ACTIVE,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async getSupplierById(supplierId: string) {
    const supplier = await this.prisma.supplier.findFirst({
      where: {
        id: supplierId,
        status: SupplierStatus.ACTIVE,
      },
    });

    if (!supplier) {
      throw new NotFoundException('Supplier not found.');
    }

    return supplier;
  }

  async createSupplier(name: string, slug: string) {
    const normalizedName = name.trim();
    const normalizedSlug = slug.trim().toLowerCase();

    const existingSupplier = await this.prisma.supplier.findFirst({
      where: {
        OR: [
          {
            name: {
              equals: normalizedName,
              mode: 'insensitive',
            },
          },
          {
            slug: normalizedSlug,
          },
        ],
      },
    });

    if (existingSupplier) {
      throw new ConflictException('Supplier name or slug already exists.');
    }

    return this.prisma.supplier.create({
      data: {
        name: normalizedName,
        slug: normalizedSlug,
        status: SupplierStatus.ACTIVE,
      },
    });
  }

  async updateSupplier(
    supplierId: string,
    data: {
      name?: string;
      slug?: string;
    },
  ) {
    const supplier = await this.prisma.supplier.findUnique({
      where: {
        id: supplierId,
      },
    });

    if (!supplier) {
      throw new NotFoundException('Supplier not found.');
    }

    const normalizedName =
      data.name !== undefined ? data.name.trim() : undefined;

    const normalizedSlug =
      data.slug !== undefined ? data.slug.trim().toLowerCase() : undefined;

    if (normalizedName !== undefined || normalizedSlug !== undefined) {
      const existingSupplier = await this.prisma.supplier.findFirst({
        where: {
          id: {
            not: supplierId,
          },
          OR: [
            ...(normalizedName !== undefined
              ? [
                  {
                    name: {
                      equals: normalizedName,
                      mode: 'insensitive' as const,
                    },
                  },
                ]
              : []),
            ...(normalizedSlug !== undefined
              ? [
                  {
                    slug: normalizedSlug,
                  },
                ]
              : []),
          ],
        },
      });

      if (existingSupplier) {
        throw new ConflictException('Supplier name or slug already exists.');
      }
    }

    return this.prisma.supplier.update({
      where: {
        id: supplierId,
      },
      data: {
        ...(normalizedName !== undefined ? { name: normalizedName } : {}),
        ...(normalizedSlug !== undefined ? { slug: normalizedSlug } : {}),
      },
    });
  }

  async updateSupplierStatus(supplierId: string, status: SupplierStatus) {
    const supplier = await this.prisma.supplier.findUnique({
      where: {
        id: supplierId,
      },
    });

    if (!supplier) {
      throw new NotFoundException('Supplier not found.');
    }

    if (supplier.status === status) {
      return supplier;
    }

    return this.prisma.supplier.update({
      where: {
        id: supplierId,
      },
      data: {
        status,
      },
    });
  }
}
