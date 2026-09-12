import { IsUUID } from 'class-validator'

export class CalculateShippingDto {
  @IsUUID()
  addressId!: string
}