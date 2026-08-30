import {
  InternalServerErrorException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class CustomerService {
  constructor(
    private readonly users: UsersService,
    private readonly cloudinary: CloudinaryService,
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
      await this.cloudinary.deleteImage(
        user.profilePhotoPublicId,
      );
    }

    return {
      profilePhotoUrl: updatedUser.profilePhotoUrl!,
      profilePhotoPublicId:
        updatedUser.profilePhotoPublicId!,
    };
  } catch (error) {
    await this.cloudinary.deleteImage(
      uploadedImage.public_id,
    );

    if (error instanceof Error) {
      throw error;
    }

    throw new InternalServerErrorException(
      'Unable to update profile photo.',
    );
  }
}
}
