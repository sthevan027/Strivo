import { supabase } from "@/src/lib/supabase";
import type { Profile } from "@/src/types/profile";

// Colunas reais de user_profile; email vem da sessão (auth), não do banco.
export type ProfileData = Partial<
  Pick<Profile, "id" | "name" | "username" | "bio" | "avatar" | "phone">
> & {
  email?: string;
};

export async function loadProfileData(): Promise<ProfileData | null> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return null;
  const { data } = await supabase
    .from("user_profile")
    .select("id, name, username, bio, avatar, phone")
    .eq("id", session.user.id)
    .single();
  if (!data) return null;
  return { ...data, email: session.user.email };
}

export async function saveProfileData(data: ProfileData): Promise<void> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) throw new Error("Não autenticado");
  await supabase
    .from("user_profile")
    .update({
      name: data.name,
      username: data.username,
      bio: data.bio,
      avatar: data.avatar,
      phone: data.phone,
    })
    .eq("id", session.user.id);
}
