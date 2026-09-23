import { apiRequest } from './client'

export interface CustomerProfile {
  id: string
  fullName: string
  email: string
  role: string
  createdAt: string
  profilePhotoUrl?: string | null
}

interface CustomerProfileResponse {
  success: boolean
  message: string
  data: {
    user: CustomerProfile
  }
}

export interface CustomerAddress {
  id: string
  userId: string
  label: string
  recipientName: string
  phone: string
  addressLine: string
  district: string
  city: string
  province: string
  postalCode: string
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

interface CustomerAddressesResponse {
  success: boolean
  message: string
  data: {
    addresses: CustomerAddress[]
  }
}

interface CustomerAddressResponse {
  success: boolean
  message: string
  data: {
    address: CustomerAddress
  }
}

export async function getCustomerProfile(): Promise<CustomerProfile> {
  const response =
    await apiRequest<CustomerProfileResponse>(
      '/customer/profile',
    )

  return response.data.user
}

export async function updateCustomerProfile(
  fullName: string,
): Promise<CustomerProfile> {
  const response =
    await apiRequest<CustomerProfileResponse>(
      '/customer/profile',
      {
        method: 'PATCH',
        body: JSON.stringify({
          fullName,
        }),
      },
    )

  return response.data.user
}

export async function getCustomerAddresses(): Promise<
  CustomerAddress[]
> {
  const response =
    await apiRequest<CustomerAddressesResponse>(
      '/customer/addresses',
    )

  return response.data.addresses
}

export async function createCustomerAddress(
  payload: {
    label: string
    recipientName: string
    phone: string
    addressLine: string
    district: string
    city: string
    province: string
    postalCode: string
    isDefault?: boolean
  },
): Promise<CustomerAddress> {
  const response =
    await apiRequest<CustomerAddressResponse>(
      '/customer/addresses',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
    )

  return response.data.address
}

export async function updateCustomerAddress(
  addressId: string,
  payload: {
    label?: string
    recipientName?: string
    phone?: string
    addressLine?: string
    district?: string
    city?: string
    province?: string
    postalCode?: string
    isDefault?: boolean
  },
): Promise<CustomerAddress> {
  const response =
    await apiRequest<CustomerAddressResponse>(
      `/customer/addresses/${addressId}`,
      {
        method: 'PATCH',
        body: JSON.stringify(payload),
      },
    )

  return response.data.address
}

export async function setDefaultCustomerAddress(
  addressId: string,
): Promise<CustomerAddress> {
  const response =
    await apiRequest<CustomerAddressResponse>(
      `/customer/addresses/${addressId}/default`,
      {
        method: 'PATCH',
      },
    )

  return response.data.address
}