import axiosInstance, { handleApiError } from './axiosConfig';

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

export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  try {
    const res = await axiosInstance.post<LoginResponse>('/user/login', payload);
    return res.data;
  } catch (err) {
    throw new Error(handleApiError(err));
  }
};

export const register = async (payload: RegisterPayload): Promise<LoginResponse> => {
  try {
    const res = await axiosInstance.post<LoginResponse>('/user/register', payload);
    return res.data;
  } catch (err) {
    throw new Error(handleApiError(err));
  }
};

export const getMe = async () => {
  try {
    const res = await axiosInstance.get('/user/me');
    return res.data;
  } catch (err) {
    throw new Error(handleApiError(err));
  }
};

export const authApi = {
  login,
  register,
  me: getMe,
};

export default authApi;