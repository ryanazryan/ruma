const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001/api/v1";

export interface ApiResponse<T = null> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[];
}

async function request<T = null>(
  path: string,
  options?: RequestInit,
): Promise<ApiResponse<T>> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    cache: "no-store",
  });

  const body = (await response.json()) as ApiResponse<T>;

  if (!response.ok) {
    throw new Error(body.message || "Unable to complete the request.");
  }

  return body;
}

export interface CurrentUser {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

export function registerUser(payload: {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}): Promise<ApiResponse> {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function verifyEmail(token: string): Promise<ApiResponse> {
  return request(`/auth/verify-email?token=${encodeURIComponent(token)}`);
}

export function resendVerification(email: string): Promise<ApiResponse> {
  return request("/auth/verify-email/resend", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export function loginUser(payload: {
  email: string;
  password: string;
}): Promise<ApiResponse<{ user: CurrentUser }>> {
  return request<{ user: CurrentUser }>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function logoutUser(): Promise<ApiResponse> {
  return request("/auth/logout", {
    method: "POST",
  });
}

export function getCurrentUser(): Promise<ApiResponse<{ user: CurrentUser }>> {
  return request<{ user: CurrentUser }>("/auth/me");
}

export async function getCurrentUserWithCookie(
  cookieHeader: string,
): Promise<ApiResponse<{ user: CurrentUser }>> {
  return request<{ user: CurrentUser }>("/auth/me", {
    headers: {
      Cookie: cookieHeader,
    },
  });
}

export function forgotPassword(email: string): Promise<ApiResponse> {
  return request('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export function resetPassword(payload: {
  token: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<ApiResponse> {
  return request('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function changePassword(payload: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<ApiResponse> {
  return request('/auth/change-password', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}