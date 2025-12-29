import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthState } from '../types';

interface AuthContextType extends AuthState {
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    token: null,
    isAuthenticated: false,
    isAdmin: false,
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthState({
        token,
        isAuthenticated: true,
        isAdmin: true, // JWT 디코딩하여 role 확인 가능하지만 단순화
      });
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem('token', token);
    setAuthState({
      token,
      isAuthenticated: true,
      isAdmin: true,
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthState({
      token: null,
      isAuthenticated: false,
      isAdmin: false,
    });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
