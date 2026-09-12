import { registerAs } from '@nestjs/config';

export const shippingConfig = registerAs('shipping', () => ({
  provider: process.env.SHIPPING_PROVIDER ?? 'biteship',

  biteshipApiKey: process.env.BITESHIP_API_KEY,

  biteshipBaseUrl:
    process.env.BITESHIP_BASE_URL ?? 'https://api.biteship.com',

  originPostalCode:
    process.env.BITESHIP_ORIGIN_POSTAL_CODE ?? '70714',

  biteshipCouriers:
    process.env.BITESHIP_COURIERS ??
    'jne,jnt,sicepat,anteraja',
}));