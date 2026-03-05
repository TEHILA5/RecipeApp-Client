// ===============================================
// User API - Profile management
// ===============================================
import axiosInstance, { handleApiError } from './axiosConfig';

export interface UserDto {
  name: string;
  email: string;
  phone: string;
  createdAt?: string;
}

export interface UserUpdateDto {
  name?: string;
  email?: string;
  phone?: string;
}

// GET: api/User/me
export const getMe = async (): Promise<UserDto> => {
  try {
    const response = await axiosInstance.get<UserDto>('/user/me');
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// PATCH: api/User/me
export const updateMe = async (data: UserUpdateDto): Promise<UserDto> => {
  try {
    const response = await axiosInstance.patch<UserDto>('/user/me', data);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// DELETE: api/User/me
export const deleteMe = async (): Promise<void> => {
  try {
    await axiosInstance.delete('/user/me');
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};