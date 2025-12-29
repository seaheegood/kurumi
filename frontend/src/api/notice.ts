import api from './axios';
import { Notice } from '../types';

export const noticeApi = {
  // 전체 공지 조회
  getAll: async (): Promise<Notice[]> => {
    const response = await api.get<Notice[]>('/api/notices');
    return response.data;
  },

  // 공지 상세 조회
  getById: async (id: number): Promise<Notice> => {
    const response = await api.get<Notice>(`/api/notices/${id}`);
    return response.data;
  },

  // 공지 작성 (관리자)
  create: async (notice: Omit<Notice, 'id' | 'createdAt'>): Promise<Notice> => {
    const response = await api.post<Notice>('/api/notices/admin', notice);
    return response.data;
  },

  // 공지 수정 (관리자)
  update: async (id: number, notice: Partial<Notice>): Promise<Notice> => {
    const response = await api.put<Notice>(`/api/notices/admin/${id}`, notice);
    return response.data;
  },

  // 공지 삭제 (관리자)
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/notices/admin/${id}`);
  },
};
