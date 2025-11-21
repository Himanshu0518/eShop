export interface User {
  id: number;
  email: string;
  name?: string;
  img?: string;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    name: string;
    email: string;
    img?: string;
    isAdmin: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

export interface ApiError {
  status: number;
  data: {
    success: boolean;
    message: string;
    errors?: Record<string, string>;
  };
}
