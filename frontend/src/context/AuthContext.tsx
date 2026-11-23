import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (fullName: string, email: string, password: string, team?: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const refreshUser = async () => {
    try {
      const res = await fetch('/api/me', { credentials: 'include' });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setUser(json.data);
          return;
        }
      }
      setUser(null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUser(data.data);
        setIsAuthModalOpen(false);
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Invalid email or password' };
      }
    } catch (err: unknown) {
      return { success: false, message: err instanceof Error ? err.message : 'Network error during login' };
    }
  };

  const register = async (fullName: string, email: string, password: string, team?: string) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ fullName, email, password, team }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUser(data.data);
        setIsAuthModalOpen(false);
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Registration failed' };
      }
    } catch (err: unknown) {
      return { success: false, message: err instanceof Error ? err.message : 'Network error during registration' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // ignore
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthModalOpen,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
