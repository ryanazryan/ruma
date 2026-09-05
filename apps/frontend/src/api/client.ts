const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  'http://localhost:3001/api/v1'

export class ApiError extends Error {
  status: number
  errors: unknown[]

  constructor(
    message: string,
    status: number,
    errors: unknown[] = [],
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.errors = errors
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      ...(options.body
        ? { 'Content-Type': 'application/json' }
        : {}),
      ...options.headers,
    },
  })

  const contentType = response.headers.get('content-type')
  let payload: unknown

  if (contentType?.includes('application/json')) {
    payload = await response.json()
  } else {
    payload = await response.text()
  }

  if (!response.ok) {
    if (
      typeof payload === 'object' &&
      payload !== null &&
      'message' in payload
    ) {
      const errorPayload = payload as {
        message?: string
        errors?: unknown[]
      }

      throw new ApiError(
        errorPayload.message ?? 'Request failed.',
        response.status,
        Array.isArray(errorPayload.errors)
          ? errorPayload.errors
          : [],
      )
    }

    throw new ApiError('Request failed.', response.status)
  }

  return payload as T
}