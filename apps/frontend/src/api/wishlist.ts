export interface WishlistProductMedia {
  id: string;
  productId: string;
  url: string;
  publicId: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface WishlistProduct {
  id: string;
  sku: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  brandId: string;
  supplierId: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  brand: {
    id: string;
    name: string;
    slug: string;
    status: string;
  };
  supplier: {
    id: string;
    name: string;
    slug: string;
    status: string;
  };
  category: {
    id: string;
    name: string;
    slug: string;
    parentId: string | null;
  };
  media: WishlistProductMedia[];
}

export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  createdAt: string;
  product: WishlistProduct;
}

interface WishlistResponse {
  success: boolean;
  message: string;
  data: {
    items: WishlistItem[];
  };
}

interface WishlistItemResponse {
  success: boolean;
  message: string;
  data: {
    item: WishlistItem;
  };
}

function getApiBaseUrl() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiBaseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured.");
  }

  return apiBaseUrl;
}

export async function getWishlist(): Promise<WishlistItem[]> {
  const response = await fetch(`${getApiBaseUrl()}/customer/wishlist`, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to retrieve wishlist.");
  }

  const result: WishlistResponse = await response.json();

  if (!result.success) {
    throw new Error(result.message);
  }

  return result.data.items;
}

export async function addToWishlist(productId: string): Promise<WishlistItem> {
  const response = await fetch(
    `${getApiBaseUrl()}/customer/wishlist/${productId}`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(result?.message ?? "Failed to add product to wishlist.");
  }

  if (!result?.success) {
    throw new Error(result?.message ?? "Failed to add product to wishlist.");
  }

  return result.data.item;
}

export async function removeFromWishlist(productId: string): Promise<void> {
  const response = await fetch(
    `${getApiBaseUrl()}/customer/wishlist/${productId}`,
    {
      method: "DELETE",
      credentials: "include",
    },
  );

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      result?.message ?? "Failed to remove product from wishlist.",
    );
  }

  if (!result?.success) {
    throw new Error(
      result?.message ?? "Failed to remove product from wishlist.",
    );
  }
}
