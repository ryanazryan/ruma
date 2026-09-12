import {
  Inject,
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import type {
  ShippingProvider,
  ShippingRateRequest,
} from './providers/shipping-provider.interface';
import { SHIPPING_PROVIDER } from './providers/shipping-provider.token';

@Injectable()
export class ShippingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,

    @Inject(SHIPPING_PROVIDER)
    private readonly shippingProvider: ShippingProvider,
  ) {}

  async calculateShipping(userId: string, addressId: string) {
    const address = await this.prisma.customerAddress.findFirst({
      where: {
        id: addressId,
        userId,
      },
      select: {
        id: true,
        postalCode: true,
      },
    });

    if (!address) {
      throw new NotFoundException('Customer address not found.');
    }

    if (!address.postalCode.trim()) {
      throw new BadRequestException(
        'Customer address postal code is required for shipping estimation.',
      );
    }

    const cart = await this.prisma.cart.findUnique({
      where: {
        userId,
      },
      select: {
        id: true,
      },
    });

    if (!cart) {
      throw new BadRequestException('Shopping cart is empty.');
    }

    const selectedItems = await this.prisma.cartItem.findMany({
      where: {
        cartId: cart.id,
        isSelected: true,
      },
      select: {
        quantity: true,
        product: {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            weightGram: true,
            lengthCm: true,
            widthCm: true,
            heightCm: true,
          },
        },
      },
    });

    if (selectedItems.length === 0) {
      throw new BadRequestException(
        'At least one cart item must be selected for shipping estimation.',
      );
    }

    const invalidItem = selectedItems.find(
      (item) =>
        item.quantity <= 0 ||
        item.product.weightGram === null ||
        item.product.lengthCm === null ||
        item.product.widthCm === null ||
        item.product.heightCm === null ||
        item.product.weightGram <= 0 ||
        item.product.lengthCm <= 0 ||
        item.product.widthCm <= 0 ||
        item.product.heightCm <= 0,
    );

    if (invalidItem) {
      throw new BadRequestException(
        'Selected cart items have incomplete shipping information.',
      );
    }

    const originPostalCode = this.configService.get<string>(
      'shipping.originPostalCode',
    );

    if (!originPostalCode?.trim()) {
      throw new BadRequestException(
        'Shipping origin postal code is not configured.',
      );
    }

    const request: ShippingRateRequest = {
      originPostalCode,
      destinationPostalCode: address.postalCode.trim(),
      items: selectedItems.map((item) => ({
        name: item.product.name,
        description: item.product.description?.trim() || item.product.name,
        value: item.product.price,
        weightGram: item.product.weightGram!,
        lengthCm: item.product.lengthCm!,
        widthCm: item.product.widthCm!,
        heightCm: item.product.heightCm!,
        quantity: item.quantity,
      })),
    };

    const options = await this.shippingProvider.calculateRates(request);

    return {
      addressId: address.id,
      destinationPostalCode: address.postalCode,
      options,
    };
  }
}
