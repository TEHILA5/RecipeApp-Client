import axiosInstance, { handleApiError } from './axiosConfig';

// ===============================================
// Types
// ===============================================
export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  phone: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id?: number;
    name: string;
    email: string;
    phone: string;
    isAdmin?: boolean;
  };
  token: string;
}

// ===============================================
// Auth API Functions
// ===============================================

/**
 * התחברות למערכת
 */
export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  try {
    const response = await axiosInstance.post<LoginResponse>('/user/login', payload);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * הרשמה למערכת
 */
export const register = async (payload: RegisterPayload): Promise<LoginResponse> => {
  try {
    const response = await axiosInstance.post<LoginResponse>('/user/register', payload);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * קבלת פרטי המשתמש המחובר
 */
export const getMe = async () => {
  try {
    const response = await axiosInstance.get('/user/me');
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// ✅ Export כ-object גם (תאימות למה שכתבת)
export const authApi = {
  login,
  register,
  me: getMe,
};

export default authApi;
