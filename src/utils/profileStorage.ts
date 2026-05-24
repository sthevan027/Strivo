/**
 * profileStorage.ts
 * Shim de compatibilidade — delega para o backend NestJS.
 * Mantemos a mesma interface para não quebrar chamadas existentes.
 */
import { api } from "@/src/lib/api";

export interface ProfileData {
  id?: number;
  username?: string;
  name?: string;
  bio?: string;
  email?: string;
  avatar?: string;
  phone?: string;
  youtube?: string;
  twitch?: string;
  instagram?: string;
  twitter?: string;
}

export async function loadProfileData(): Promise<ProfileData | null> {
  try {
    return await api.get<ProfileData>("/users/me");
  } catch {
    return null;
  }
}

export async function saveProfileData(data: ProfileData): Promise<void> {
  await api.patch("/users/me", {
    name: data.name,
    username: data.username,
    bio: data.bio,
    avatar: data.avatar,
    phone: data.phone,
  });
}
