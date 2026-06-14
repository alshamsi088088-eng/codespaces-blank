
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import axios from 'axios';
import { auth } from '../firebaseConfig';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
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

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const token = await fbUser.getIdToken();
          const response = await axios.post(
            '/api/auth/firebase',
            { email: fbUser.email, name: fbUser.displayName, photo: fbUser.photoURL, token },
            { withCredentials: true }
          );
          setUser(response.data.user);
        } catch (error) {
          console.error('Failed to exchange firebase user with server', error);
          setUser(null);
        }
      } else {
        // try to read server session (if any)
        try {
          const resp = await axios.get('/api/auth/profile', { withCredentials: true });
          setUser(resp.data.user || null);
        } catch (e) {
          setUser(null);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await axios.post('/api/auth/login', { email, password }, { withCredentials: true });
    setUser(response.data.user);
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      console.warn('Firebase sign-out failed', e);
    }
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
