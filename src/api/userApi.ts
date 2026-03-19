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

export const getMe = async (): Promise<UserDto> => {
  try {
    const res = await axiosInstance.get<UserDto>('/user/me');
    return res.data;
  } catch (err) {
    throw new Error(handleApiError(err));
  }
};

export const updateMe = async (data: UserUpdateDto): Promise<UserDto> => {
  try {
    const res = await axiosInstance.patch<UserDto>('/user/me', data);
    return res.data;
  } catch (err) {
    throw new Error(handleApiError(err));
  }
};

export const deleteMe = async (): Promise<void> => {
  try {
    await axiosInstance.delete('/user/me');
  } catch (err) {
    throw new Error(handleApiError(err));
  }
};