import api from './axios';
import { Reservation, ReservationForm } from '../types';

export const reservationApi = {
  // 예약 생성
  create: async (data: ReservationForm): Promise<Reservation> => {
    const response = await api.post<Reservation>('/api/reservations', data);
    return response.data;
  },

  // 전체 예약 조회 (관리자)
  getAll: async (): Promise<Reservation[]> => {
    const response = await api.get<Reservation[]>('/api/reservations/admin');
    return response.data;
  },

  // 날짜별 예약 조회 (관리자)
  getByDate: async (date: string): Promise<Reservation[]> => {
    const response = await api.get<Reservation[]>(`/api/reservations/admin/${date}`);
    return response.data;
  },

  // 예약 삭제 (관리자)
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/reservations/admin/${id}`);
  },
};
