export interface ShippingItem {
  name: string;
  description: string;
  value: number;
  weightGram: number;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  quantity: number;
}

export interface ShippingRateRequest {
  originPostalCode: string;
  destinationPostalCode: string;
  items: ShippingItem[];
}

export interface ShippingOption {
  courierCode: string;
  courierName: string;
  serviceCode: string;
  serviceName: string;
  price: number;
  estimatedDelivery: string | null;
}

export interface ShippingProvider {
  calculateRates(
    request: ShippingRateRequest,
  ): Promise<ShippingOption[]>;
}