import {
  BadGatewayException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  ShippingOption,
  ShippingProvider,
  ShippingRateRequest,
} from './shipping-provider.interface';

interface BiteshipPricingItem {
  courier_code?: string;
  courier_name?: string;
  courier_service_code?: string;
  courier_service_name?: string;
  service_code?: string;
  service_name?: string;
  price?: number;
  duration?: string;
}

interface BiteshipRateResponse {
  pricing?: BiteshipPricingItem[];
}

@Injectable()
export class BiteshipProvider implements ShippingProvider {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly couriers: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>(
      'shipping.biteshipApiKey',
    );

    const baseUrl = this.configService.get<string>(
      'shipping.biteshipBaseUrl',
      'https://api.biteship.com',
    );

    const couriers = this.configService.get<string>(
      'shipping.biteshipCouriers',
      'jne,jnt,sicepat,anteraja',
    );

    if (!apiKey) {
      throw new InternalServerErrorException(
        'BITESHIP_API_KEY is not configured.',
      );
    }

    this.apiKey = apiKey;
    this.baseUrl = baseUrl.replace(/\/+$/, '');
    this.couriers = couriers;
  }

  async calculateRates(
    request: ShippingRateRequest,
  ): Promise<ShippingOption[]> {
    if (request.items.length === 0) {
      throw new BadGatewayException(
        'Shipping calculation requires at least one item.',
      );
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/v1/rates/couriers`,
        {
          method: 'POST',
          headers: {
            Authorization: this.apiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            origin_postal_code: Number(request.originPostalCode),
            destination_postal_code: Number(
              request.destinationPostalCode,
            ),
            couriers: this.couriers,
            items: request.items.map((item) => ({
              name: item.name,
              description: item.description,
              value: item.value,
              length: item.lengthCm,
              width: item.widthCm,
              height: item.heightCm,
              weight: item.weightGram,
              quantity: item.quantity,
            })),
          }),
        },
      );

      if (!response.ok) {
        const errorBody = await response.text();

        throw new BadGatewayException(
          `Biteship Rates API returned ${response.status}: ${errorBody}`,
        );
      }

      const data = (await response.json()) as BiteshipRateResponse;

      return (data.pricing ?? [])
        .filter(
          (item) =>
            item.courier_code &&
            item.courier_name &&
            (item.courier_service_code ?? item.service_code) &&
            (item.courier_service_name ?? item.service_name) &&
            typeof item.price === 'number',
        )
        .map((item) => ({
          courierCode: item.courier_code!,
          courierName: item.courier_name!,
          serviceCode:
            item.courier_service_code ?? item.service_code!,
          serviceName:
            item.courier_service_name ?? item.service_name!,
          price: item.price!,
          estimatedDelivery: item.duration ?? null,
        }));
    } catch (error) {
      if (error instanceof BadGatewayException) {
        throw error;
      }

      throw new BadGatewayException(
        'Failed to communicate with Biteship Rates API.',
      );
    }
  }
}