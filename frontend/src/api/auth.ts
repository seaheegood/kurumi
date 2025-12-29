import api from './axios';
import { LoginRequest, LoginResponse } from '../types';

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<string>('/api/auth/login', data);
    return { token: response.data };
  },

  register: async (data: LoginRequest): Promise<void> => {
    await api.post('/api/auth/register', data);
  },
};
