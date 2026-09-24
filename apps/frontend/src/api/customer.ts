import { apiRequest } from "./client";

export interface CustomerProfile {
  id: string;
  fullName: string;
  email: string;
  role: string;
  createdAt: string;
  profilePhotoUrl?: string | null;
}

interface CustomerProfileResponse {
  success: boolean;
  message: string;
  data: {
    user: CustomerProfile;
  };
}

export interface CustomerAddress {
  id: string;
  userId: string;
  label: string;
  recipientName: string;
  phone: string;
  addressLine: string;
  district: string;
  city: string;
  province: string;
  postalCode: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CustomerAddressesResponse {
  success: boolean;
  message: string;
  data: {
    addresses: CustomerAddress[];
  };
}

interface CustomerAddressResponse {
  success: boolean;
  message: string;
  data: {
    address: CustomerAddress;
  };
}

export async function getCustomerProfile(): Promise<CustomerProfile> {
  const response =
    await apiRequest<CustomerProfileResponse>("/customer/profile");

  return response.data.user;
}

export async function updateCustomerProfile(
  fullName: string,
): Promise<CustomerProfile> {
  const response = await apiRequest<CustomerProfileResponse>(
    "/customer/profile",
    {
      method: "PATCH",
      body: JSON.stringify({
        fullName,
      }),
    },
  );

  return response.data.user;
}

export async function getCustomerAddresses(
  cookieHeader?: string,
): Promise<CustomerAddress[]> {
  const response = await apiRequest<CustomerAddressesResponse>(
    "/customer/addresses",
    cookieHeader
      ? {
          headers: {
            Cookie: cookieHeader,
          },
        }
      : undefined,
  );

  return response.data.addresses;
}

export async function createCustomerAddress(payload: {
  label: string;
  recipientName: string;
  phone: string;
  addressLine: string;
  district: string;
  city: string;
  province: string;
  postalCode: string;
  isDefault?: boolean;
}): Promise<CustomerAddress> {
  const response = await apiRequest<CustomerAddressResponse>(
    "/customer/addresses",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );

  return response.data.address;
}

export async function updateCustomerAddress(
  addressId: string,
  payload: {
    label?: string;
    recipientName?: string;
    phone?: string;
    addressLine?: string;
    district?: string;
    city?: string;
    province?: string;
    postalCode?: string;
    isDefault?: boolean;
  },
): Promise<CustomerAddress> {
  const response = await apiRequest<CustomerAddressResponse>(
    `/customer/addresses/${addressId}`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );

  return response.data.address;
}

export async function setDefaultCustomerAddress(
  addressId: string,
): Promise<CustomerAddress> {
  const response = await apiRequest<CustomerAddressResponse>(
    `/customer/addresses/${addressId}/default`,
    {
      method: "PATCH",
    },
  );

  return response.data.address;
}

export interface CustomerMembership {
  membershipStatus: 'NON_MEMBER' | 'MEMBER'
  membershipActivatedAt: string | null
  qualifyingPurchaseValue: number
  threshold: number
}

interface CustomerMembershipResponse {
  success: boolean
  message: string
  data: {
    membership: CustomerMembership
  }
}

export async function getCustomerMembership(
  cookieHeader?: string,
): Promise<CustomerMembership> {
  const response = await apiRequest<CustomerMembershipResponse>(
    '/customer/membership',
    cookieHeader
      ? {
          headers: {
            Cookie: cookieHeader,
          },
        }
      : undefined,
  )

  return response.data.membership
}