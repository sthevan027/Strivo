import { supabase } from '../lib/supabase'

export async function followUser(myId: string, userId: string) {
  return await supabase.from('followers').insert({
    follower_id: myId,
    following_id: userId,
  })
}

export async function unfollowUser(myId: string, userId: string) {
  return await supabase
    .from('followers')
    .delete()
    .eq('follower_id', myId)
    .eq('following_id', userId)
}

export async function checkIfFollowing(myId: string, userId: string) {
  const { data } = await supabase
    .from('followers')
    .select('*')
    .eq('follower_id', myId)
    .eq('following_id', userId)
    .single()

  return !!data
}