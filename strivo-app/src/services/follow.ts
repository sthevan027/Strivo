import { supabase } from "../lib/supabase";

export async function followUser(myId: string, userId: string) {
  return supabase.from("follows").insert({
    follower_id: myId,
    following_id: userId,
  });
}

export async function unfollowUser(myId: string, userId: string) {
  return supabase
    .from("follows")
    .delete()
    .eq("follower_id", myId)
    .eq("following_id", userId);
}

export async function checkIfFollowing(myId: string, userId: string) {
  const { data } = await supabase
    .from("follows")
    .select("follower_id")
    .eq("follower_id", myId)
    .eq("following_id", userId)
    .maybeSingle();
  return !!data;
}
