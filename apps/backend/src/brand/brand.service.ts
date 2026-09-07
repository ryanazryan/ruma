import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { BrandStatus } from '@prisma/client';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BrandService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
  ) {}

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

  async updateBrandStatus(brandId: string, status: BrandStatus) {
    const brand = await this.prisma.brand.findUnique({
      where: {
        id: brandId,
      },
    });

    if (!brand) {
      throw new NotFoundException('Brand not found.');
    }

    if (brand.status === status) {
      return brand;
    }

    return this.prisma.brand.update({
      where: {
        id: brandId,
      },
      data: {
        status,
      },
    });
  }

  async uploadBrandLogo(brandId: string, file: Buffer, mimeType: string) {
    const brand = await this.prisma.brand.findUnique({
      where: {
        id: brandId,
      },
    });

    if (!brand) {
      throw new NotFoundException('Brand not found.');
    }

    if (!mimeType.startsWith('image/')) {
      throw new BadRequestException('Only image files are supported.');
    }

    const uploadedImage = await this.cloudinary.uploadImage(
      file,
      `ruma/brands/${brandId}`,
    );

    try {
      const updatedBrand = await this.prisma.brand.update({
        where: {
          id: brandId,
        },
        data: {
          logoUrl: uploadedImage.secure_url,
          logoPublicId: uploadedImage.public_id,
        },
      });

      if (brand.logoPublicId) {
        await this.cloudinary.deleteImage(brand.logoPublicId);
      }

      return updatedBrand;
    } catch (error) {
      await this.cloudinary.deleteImage(uploadedImage.public_id);

      if (error instanceof Error) {
        throw error;
      }

      throw new InternalServerErrorException('Unable to save brand logo.');
    }
  }
}
