import { createContext, useContext, useState, ReactNode } from 'react';
import { login as apiLogin, saveSession, clearSession, isLoggedIn } from './api';

interface AuthCtx {
  loggedIn: boolean;
  login:    (u: string, p: string) => Promise<void>;
  logout:   () => void;
}

const Ctx = createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loggedIn, setLoggedIn] = useState<boolean>(isLoggedIn);

  const login = async (username: string, password: string): Promise<void> => {
    const token = await apiLogin(username, password);
    saveSession(token);
    setLoggedIn(true);
  };

  const logout = (): void => {
    clearSession();
    setLoggedIn(false);
  };

  return <Ctx.Provider value={{ loggedIn, login, logout }}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}