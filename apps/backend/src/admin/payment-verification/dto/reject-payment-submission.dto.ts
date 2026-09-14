import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class RejectPaymentSubmissionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  rejectionReason!: string;
}