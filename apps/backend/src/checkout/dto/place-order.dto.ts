import { IsEnum, IsNotEmpty, IsUUID, Matches } from 'class-validator';
import { PaymentMethod } from '@prisma/client';

export class PlaceOrderDto {
  @IsUUID()
  addressId!: string;

  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9_-]+$/)
  courierCode!: string;

  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9_-]+$/)
  serviceCode!: string;

  @IsEnum(PaymentMethod)
  paymentMethod!: PaymentMethod;
}