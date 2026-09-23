import {
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MaxLength(100)
  sku!: string;

  @IsString()
  @MaxLength(150)
  name!: string;

  @IsString()
  @MaxLength(180)
  slug!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  @Min(0)
  price!: number;

  @IsOptional()
  @IsISO8601()
  newUntil?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  weightGram?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  lengthCm?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  widthCm?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  heightCm?: number;

  @IsUUID()
  brandId!: string;

  @IsUUID()
  supplierId!: string;

  @IsUUID()
  categoryId!: string;

  @IsInt()
  @Min(0)
  initialStock!: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  lowStockThreshold?: number;
}