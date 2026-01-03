// 사용자
export interface User {
  id: number;
  username: string;
  role: string;
}

// 메뉴
export interface Menu {
  menuId: number;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  available: boolean;
  createdAt: string;
  updatedAt: string;
}

// 오늘의 메뉴
export interface DailyMenu {
  id: number;
  date: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
}

// 예약
export interface Reservation {
  id: number;
  name: string;
  phone: string;
  people: number;
  reservationTime: string;
  note: string;
}

export interface ReservationForm {
  name: string;
  phone: string;
  people: number;
  reservationTime: string;
  note?: string;
}

// 공지사항
export interface Notice {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

// 인증
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
}
