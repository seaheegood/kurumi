import api from './axios';
import { Menu, DailyMenu } from '../types';

export const uploadApi = {
  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post<{ imageUrl: string }>('/api/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.imageUrl;
  },
};

export const menuApi = {
  // 전체 메뉴 조회
  getAll: async (): Promise<Menu[]> => {
    const response = await api.get<Menu[]>('/api/menus');
    return response.data;
  },

  // 메뉴 상세 조회
  getById: async (id: number): Promise<Menu> => {
    const response = await api.get<Menu>(`/api/menus/${id}`);
    return response.data;
  },

  // 메뉴 생성 (관리자)
  create: async (menu: Omit<Menu, 'menuId' | 'createdAt' | 'updatedAt'>): Promise<Menu> => {
    const response = await api.post<Menu>('/api/menus/admin', menu);
    return response.data;
  },

  // 메뉴 수정 (관리자)
  update: async (id: number, menu: Partial<Menu>): Promise<Menu> => {
    const response = await api.put<Menu>(`/api/menus/admin/${id}`, menu);
    return response.data;
  },

  // 메뉴 삭제 (관리자)
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/menus/admin/${id}`);
  },
};

export const dailyMenuApi = {
  // 오늘의 메뉴 전체 조회
  getToday: async (): Promise<DailyMenu[]> => {
    try {
      const response = await api.get<DailyMenu[]>('/api/daily-menu');
      return response.data;
    } catch {
      return [];
    }
  },

  // 특정 날짜 메뉴 전체 조회 (관리자)
  getByDate: async (date: string): Promise<DailyMenu[]> => {
    try {
      const response = await api.get<DailyMenu[]>(`/api/daily-menu/admin/${date}`);
      return response.data;
    } catch {
      return [];
    }
  },

  // 일일 메뉴 생성 (관리자)
  create: async (menu: Omit<DailyMenu, 'id'>): Promise<DailyMenu> => {
    const response = await api.post<DailyMenu>('/api/daily-menu/admin', menu);
    return response.data;
  },

  // 일일 메뉴 삭제 (관리자)
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/daily-menu/admin/${id}`);
  },
};
