import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateCustomerProfileDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  fullName!: string;
}