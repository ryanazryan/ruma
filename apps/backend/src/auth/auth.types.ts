export interface AuthUserResponse {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

export interface LoginResponseData {
  user: AuthUserResponse;
}

export interface ApiSuccessResponse<T = null> {
  success: boolean;
  message: string;
  data: T;
}

export interface LoginResult {
  response: ApiSuccessResponse<LoginResponseData>;
  sessionToken: string;
}
