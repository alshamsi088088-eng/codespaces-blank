
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import axios from 'axios';
import type { UserProfile } from '../types';

interface AuthState {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthState>({
  user: null,
  loading: false,
  login: async () => {},
  logout: async () => {},
  register: async () => {}
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/api/auth/profile', { withCredentials: true });
      setUser(response.data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await axios.post('/api/auth/login', { email, password }, { withCredentials: true });
    setUser(response.data.user);
  };

  const logout = async () => {
    await axios.post('/api/auth/logout', {}, { withCredentials: true });
    setUser(null);
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await axios.post('/api/auth/register', { name, email, password }, { withCredentials: true });
    setUser(response.data.user);
  };

  return <AuthContext.Provider value={{ user, loading, login, logout, register }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
