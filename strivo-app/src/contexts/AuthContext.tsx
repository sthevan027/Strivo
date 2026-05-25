import * as SecureStore from "expo-secure-store";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { api } from "../lib/api";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  username?: string | null;
  avatar?: string | null;
  bio?: string | null;
  phone?: string | null;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  username?: string;
  phone?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login(email: string, password: string): Promise<void>;
  register(data: RegisterData): Promise<void>;
  logout(): Promise<void>;
  refreshUser(): Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = "strivo_jwt";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const me = await api.get<AuthUser>("/users/me");
      setUser(me);
    } catch {
      setUser(null);
      await SecureStore.deleteItemAsync(TOKEN_KEY).catch(() => {});
    }
  }, []);

  useEffect(() => {
    const restore = async () => {
      try {
        const token = await SecureStore.getItemAsync(TOKEN_KEY);
        if (token) {
          await refreshUser();
        }
      } catch {
        // token inválido ou expirado — ignora
      } finally {
        setIsLoading(false);
      }
    };
    restore();
  }, [refreshUser]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.post<{ access_token: string; user: AuthUser }>(
      "/auth/login",
      { email, password },
    );
    await SecureStore.setItemAsync(TOKEN_KEY, res.access_token);
    setUser(res.user);
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    const res = await api.post<{ access_token: string; user: AuthUser }>(
      "/auth/register",
      data,
    );
    await SecureStore.setItemAsync(TOKEN_KEY, res.access_token);
    setUser(res.user);
  }, []);

  const logout = useCallback(async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY).catch(() => {});
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, register, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
  return ctx;
}
