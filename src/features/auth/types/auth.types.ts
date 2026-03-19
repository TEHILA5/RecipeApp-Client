export interface User {
  name: string;
  email: string;
  phone: string;
  createdAt?: string;
  isAdmin?: boolean;
}

export interface UserAdmin extends User {
  id: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  phone: string;
  email: string;
  password: string;
}

export interface UpdateUserData {
  name?: string;
  phone?: string;
  email?: string;
  password?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
}