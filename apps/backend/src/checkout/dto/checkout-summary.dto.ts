import { IsUUID } from 'class-validator';

export class CheckoutSummaryDto {
  @IsUUID()
  addressId!: string;
}