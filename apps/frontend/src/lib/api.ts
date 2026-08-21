const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001/api/v1';

export interface ApiResponse {
  success: boolean;
  message: string;
  data: null;
  errors?: string[];
}

async function request(path: string, options?: RequestInit): Promise<ApiResponse> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  const body = (await response.json()) as ApiResponse;
  if (!response.ok) {
    throw new Error(body.message || 'Unable to complete the request.');
  }
  return body;
}

export function registerUser(payload: {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}): Promise<ApiResponse> {
  return request('/auth/register', { method: 'POST', body: JSON.stringify(payload) });
}

export function verifyEmail(token: string): Promise<ApiResponse> {
  return request(`/auth/verify-email?token=${encodeURIComponent(token)}`);
}

export function resendVerification(email: string): Promise<ApiResponse> {
  return request('/auth/verify-email/resend', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}
