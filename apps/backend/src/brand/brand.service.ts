import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BrandStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BrandService {
  constructor(private readonly prisma: PrismaService) {}

  async getBrands() {
    return this.prisma.brand.findMany({
      where: {
        status: BrandStatus.ACTIVE,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async getBrandById(brandId: string) {
    const brand = await this.prisma.brand.findFirst({
      where: {
        id: brandId,
        status: BrandStatus.ACTIVE,
      },
    });

    if (!brand) {
      throw new NotFoundException('Brand not found.');
    }

    return brand;
  }

  async createBrand(name: string, slug: string) {
    const normalizedName = name.trim();
    const normalizedSlug = slug.trim().toLowerCase();

    const existingBrand = await this.prisma.brand.findFirst({
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

    if (existingBrand) {
      throw new ConflictException('Brand name or slug already exists.');
    }

    return this.prisma.brand.create({
      data: {
        name: normalizedName,
        slug: normalizedSlug,
        status: BrandStatus.ACTIVE,
      },
    });
  }

  async updateBrand(
    brandId: string,
    data: {
      name?: string;
      slug?: string;
    },
  ) {
    const brand = await this.prisma.brand.findUnique({
      where: {
        id: brandId,
      },
    });

    if (!brand) {
      throw new NotFoundException('Brand not found.');
    }

    const normalizedName =
      data.name !== undefined ? data.name.trim() : undefined;

    const normalizedSlug =
      data.slug !== undefined ? data.slug.trim().toLowerCase() : undefined;

    if (normalizedName !== undefined || normalizedSlug !== undefined) {
      const existingBrand = await this.prisma.brand.findFirst({
        where: {
          id: {
            not: brandId,
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

      if (existingBrand) {
        throw new ConflictException('Brand name or slug already exists.');
      }
    }

    return this.prisma.brand.update({
      where: {
        id: brandId,
      },
      data: {
        ...(normalizedName !== undefined ? { name: normalizedName } : {}),
        ...(normalizedSlug !== undefined ? { slug: normalizedSlug } : {}),
      },
    });
  }
}
