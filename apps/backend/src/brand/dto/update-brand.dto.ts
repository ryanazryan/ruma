import {
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator'

export class UpdateBrandDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string

  @IsOptional()
  @IsString()
  @MaxLength(120)
  slug?: string

  @IsOptional()
  @IsString()
  @MaxLength(200)
  tagline?: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsString()
  @MaxLength(150)
  origin?: string

  @IsOptional()
  @IsBoolean()
  featured?: boolean
}