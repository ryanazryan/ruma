import {
  InternalServerErrorException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CustomerService {
  constructor(
    private readonly users: UsersService,
    private readonly cloudinary: CloudinaryService,
    private readonly prisma: PrismaService,
  ) {}

  async getProfile(userId: string) {
    const user = await this.users.findById(userId);

    if (!user) {
      throw new NotFoundException('Customer account not found.');
    }

    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      accountStatus: user.accountStatus,
      emailVerifiedAt: user.emailVerifiedAt,
      profilePhotoUrl: user.profilePhotoUrl,
    };
  }

  async updateProfile(userId: string, fullName: string) {
    const user = await this.users.findById(userId);

    if (!user) {
      throw new NotFoundException('Customer account not found.');
    }

    const updatedUser = await this.users.updateFullName(
      userId,
      fullName.trim(),
    );

    return {
      id: updatedUser.id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      role: updatedUser.role,
      accountStatus: updatedUser.accountStatus,
      emailVerifiedAt: updatedUser.emailVerifiedAt,
      profilePhotoUrl: updatedUser.profilePhotoUrl,
    };
  }

  async updateProfilePhoto(
    userId: string,
    file: Buffer,
  ): Promise<{
    profilePhotoUrl: string;
    profilePhotoPublicId: string;
  }> {
    const user = await this.users.findById(userId);

    if (!user) {
      throw new NotFoundException('Customer account not found.');
    }

    const uploadedImage = await this.cloudinary.uploadImage(
      file,
      `ruma/customers/${userId}`,
    );

    try {
      const updatedUser = await this.users.updateProfilePhoto(
        userId,
        uploadedImage.secure_url,
        uploadedImage.public_id,
      );

      if (
        user.profilePhotoPublicId &&
        user.profilePhotoPublicId !== uploadedImage.public_id
      ) {
        await this.cloudinary.deleteImage(user.profilePhotoPublicId);
      }

      return {
        profilePhotoUrl: updatedUser.profilePhotoUrl!,
        profilePhotoPublicId: updatedUser.profilePhotoPublicId!,
      };
    } catch (error) {
      await this.cloudinary.deleteImage(uploadedImage.public_id);

      if (error instanceof Error) {
        throw error;
      }

      throw new InternalServerErrorException('Unable to update profile photo.');
    }
  }

  async getAddresses(userId: string) {
    const user = await this.users.findById(userId);

    if (!user) {
      throw new NotFoundException('Customer account not found.');
    }

    const addresses = await this.prisma.customerAddress.findMany({
      where: {
        userId,
      },
      orderBy: [
        {
          isDefault: 'desc',
        },
        {
          createdAt: 'desc',
        },
      ],
    });

    return addresses;
  }

  async createAddress(
    userId: string,
    data: {
      label: string;
      recipientName: string;
      phone: string;
      addressLine: string;
      district: string;
      city: string;
      province: string;
      postalCode: string;
      isDefault?: boolean;
    },
  ) {
    const user = await this.users.findById(userId);

    if (!user) {
      throw new NotFoundException('Customer account not found.');
    }

    return this.prisma.$transaction(async (tx) => {
      const shouldBeDefault = data.isDefault === true;

      if (shouldBeDefault) {
        await tx.customerAddress.updateMany({
          where: {
            userId,
            isDefault: true,
          },
          data: {
            isDefault: false,
          },
        });
      }

      const existingAddressCount = await tx.customerAddress.count({
        where: {
          userId,
        },
      });

      const address = await tx.customerAddress.create({
        data: {
          userId,
          label: data.label.trim(),
          recipientName: data.recipientName.trim(),
          phone: data.phone.trim(),
          addressLine: data.addressLine.trim(),
          district: data.district.trim(),
          city: data.city.trim(),
          province: data.province.trim(),
          postalCode: data.postalCode.trim(),
          isDefault: shouldBeDefault || existingAddressCount === 0,
        },
      });

      return address;
    });
  }

  async updateAddress(
    userId: string,
    addressId: string,
    data: {
      label?: string;
      recipientName?: string;
      phone?: string;
      addressLine?: string;
      district?: string;
      city?: string;
      province?: string;
      postalCode?: string;
      isDefault?: boolean;
    },
  ) {
    const user = await this.users.findById(userId);

    if (!user) {
      throw new NotFoundException('Customer account not found.');
    }

    const address = await this.prisma.customerAddress.findFirst({
      where: {
        id: addressId,
        userId,
      },
    });

    if (!address) {
      throw new NotFoundException('Customer address not found.');
    }

    const updateData: {
      label?: string;
      recipientName?: string;
      phone?: string;
      addressLine?: string;
      district?: string;
      city?: string;
      province?: string;
      postalCode?: string;
      isDefault?: boolean;
    } = {};

    if (data.label !== undefined) {
      updateData.label = data.label.trim();
    }

    if (data.recipientName !== undefined) {
      updateData.recipientName = data.recipientName.trim();
    }

    if (data.phone !== undefined) {
      updateData.phone = data.phone.trim();
    }

    if (data.addressLine !== undefined) {
      updateData.addressLine = data.addressLine.trim();
    }

    if (data.district !== undefined) {
      updateData.district = data.district.trim();
    }

    if (data.city !== undefined) {
      updateData.city = data.city.trim();
    }

    if (data.province !== undefined) {
      updateData.province = data.province.trim();
    }

    if (data.postalCode !== undefined) {
      updateData.postalCode = data.postalCode.trim();
    }

    const shouldBeDefault =
      data.isDefault === true ||
      (data.isDefault === undefined && address.isDefault);

    return this.prisma.$transaction(async (tx) => {
      if (shouldBeDefault) {
        await tx.customerAddress.updateMany({
          where: {
            userId,
            isDefault: true,
            id: {
              not: addressId,
            },
          },
          data: {
            isDefault: false,
          },
        });

        updateData.isDefault = true;
      } else if (data.isDefault === false) {
        updateData.isDefault = false;
      }

      const updatedAddress = await tx.customerAddress.update({
        where: {
          id: addressId,
        },
        data: updateData,
      });

      return updatedAddress;
    });
  }

  async setDefaultAddress(userId: string, addressId: string) {
  const user = await this.users.findById(userId);

  if (!user) {
    throw new NotFoundException('Customer account not found.');
  }

  const address = await this.prisma.customerAddress.findFirst({
    where: {
      id: addressId,
      userId,
    },
  });

  if (!address) {
    throw new NotFoundException('Customer address not found.');
  }

  return this.prisma.$transaction(async (tx) => {
    await tx.customerAddress.updateMany({
      where: {
        userId,
        isDefault: true,
        id: {
          not: addressId,
        },
      },
      data: {
        isDefault: false,
      },
    });

    return tx.customerAddress.update({
      where: {
        id: addressId,
      },
      data: {
        isDefault: true,
      },
    });
  });
}
}
