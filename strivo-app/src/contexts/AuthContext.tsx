import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { supabase } from "../lib/supabase";

export interface AuthUser {
  id: string;
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

async function fetchProfile(userId: string): Promise<AuthUser | null> {
  const { data: { session } } = await supabase.auth.getSession();
  const authUser = session?.user;
  const email = authUser?.email ?? "";
  const { data, error } = await supabase
    .from("user_profile")
    .select("id, name, username, avatar, bio, phone")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw new Error("Não foi possível carregar o seu perfil.");
  if (!data) {
    const fallback = {
      id: userId,
      name: authUser?.user_metadata?.name ?? "Usuário",
      username: authUser?.user_metadata?.username ?? null,
    };
    const { data: created, error: createError } = await supabase
      .from("user_profile")
      .upsert(fallback, { onConflict: "id" })
      .select("id, name, username, avatar, bio, phone")
      .single();
    if (createError) throw new Error("Não foi possível preparar o seu perfil.");
    return { ...created, email };
  }
  return { ...data, email };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = useCallback(async (userId: string) => {
    const profile = await fetchProfile(userId);
    setUser(profile);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadUser(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          loadUser(session.user.id);
        } else {
          setUser(null);
          setIsLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [loadUser]);

  const login = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw new Error(error.message);
    if (data.user) await loadUser(data.user.id);
  }, [loadUser]);

  const register = useCallback(async (data: RegisterData) => {
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { name: data.name, username: data.username ?? null },
      },
    });
    if (error) throw new Error(error.message);
    if (authData.user) {
      if (data.phone) {
        await supabase
          .from("user_profile")
          .update({ phone: data.phone })
          .eq("id", authData.user.id);
      }
      await loadUser(authData.user.id);
    }
  }, [loadUser]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) await loadUser(session.user.id);
  }, [loadUser]);

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
