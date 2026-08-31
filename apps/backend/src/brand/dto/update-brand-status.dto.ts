import { IsEnum } from 'class-validator';

import { BrandStatus } from '@prisma/client';

export class UpdateBrandStatusDto {
  @IsEnum(BrandStatus)
  status!: BrandStatus;
}