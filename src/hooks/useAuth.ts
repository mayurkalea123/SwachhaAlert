import { useState, useCallback } from 'react';
import { User } from '@/types';
import { getStoredUser, setStoredUser, loginUser, registerUser } from '@/lib/store';

export function useAuth() {
  const [user, setUser] = useState<User | null>(getStoredUser);

  const login = useCallback((email: string, password: string): boolean => {
    const u = loginUser(email, password);
    if (u) { setUser(u); return true; }
    return false;
  }, []);

  const register = useCallback((name: string, email: string, password: string, phone: string, ward: string): User => {
    const u = registerUser(name, email, password, phone, ward);
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(() => {
    setStoredUser(null);
    setUser(null);
  }, []);

  const updateUser = useCallback((updates: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setStoredUser(updated);
    setUser(updated);
  }, [user]);

  return { user, login, register, logout, updateUser, isAdmin: user?.role === 'admin' };
}
