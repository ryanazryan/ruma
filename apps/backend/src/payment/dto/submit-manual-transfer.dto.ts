import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SubmitManualTransferDto {
  @IsString()
  @IsNotEmpty()
  senderBank!: string;

  @IsString()
  @IsNotEmpty()
  senderName!: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  transferAmount!: number;

  @IsDateString()
  transferredAt!: string;
}