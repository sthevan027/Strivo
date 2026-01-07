import CreateModal from '@/src/components/create-post'
import FeedOptions from '@/src/components/feed-options'
import ShareModal from '@/src/components/share-modal'
import { recentContacts } from '@/src/utils/contact-mock'
import { loadProfileData } from '@/src/utils/profileStorage'
import { LinearGradient } from 'expo-linear-gradient'
import { useFocusEffect, useRouter } from 'expo-router'
import {
  Bell,
  MessageSquareMore,
  Plus,
} from 'lucide-react-native'
import React, { useCallback, useState } from 'react'
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

interface Story {
  id: number
  username: string
  avatar: string
  isUser?: boolean
}

export default function Feed() {
  const router = useRouter()

  const [modalVisible, setModalVisible] = useState(false)
  const [modalCreateVisible, setModalCreateVisible] = useState(false)
  const [showShare, setShowShare] = useState(false)

  const defaultAvatar =
    'https://api.dicebear.com/7.x/avataaars/png?seed=User'

  const [stories, setStories] = useState<Story[]>([])

  /* =======================
     LOAD STORIES
  ======================= */
  const loadStories = useCallback(async () => {
    const profile = await loadProfileData()

    const userStory: Story = {
      id: 1,
      username: profile?.username ?? 'Seu story',
      avatar: profile?.avatar_url ?? defaultAvatar,
      isUser: true,
    }

    const otherStories: Story[] = [
      {
        id: 2,
        username: 'joaogamer',
        avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Joao',
      },
      {
        id: 3,
        username: 'maristreams',
        avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Mari',
      },
      {
        id: 4,
        username: 'pedrolive',
        avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Pedro',
      },
    ]

    setStories([userStory, ...otherStories])
  }, [])

  useFocusEffect(
    useCallback(() => {
      loadStories()
    }, [loadStories])
  )

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />

      {/* HEADER */}
      <View className="flex-row justify-between items-center px-4 py-3">
        <Text className="text-[#00FF40] text-3xl font-bold">Strivo</Text>

        <View className="flex-row items-center gap-4">
          <TouchableOpacity onPress={() => setModalCreateVisible(true)}>
            <Plus size={28} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/screens/notifications')}
          >
            <Bell size={28} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/screens/chat/message-screen')}
          >
            <MessageSquareMore size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* STORIES */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="px-2 py-3"
      >
        {stories.map((story) => (
          <TouchableOpacity
            key={story.id}
            className="items-center mx-2"
            onPress={() =>
              story.isUser && router.push('/screens/profile')
            }
          >
            {story.isUser ? (
              <LinearGradient
                colors={['#16a34a', '#4ade80', '#d9f99d']}
                style={{ padding: 3, borderRadius: 999 }}
              >
                <Image
                  source={{ uri: story.avatar }}
                  className="w-20 h-20 rounded-full"
                />
              </LinearGradient>
            ) : (
              <Image
                source={{ uri: story.avatar }}
                className="w-20 h-20 rounded-full border border-gray-700"
              />
            )}

            <Text className="text-white text-xs mt-1">
              {story.isUser ? 'Seu story' : story.username}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FeedOptions
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />

      <CreateModal
        visible={modalCreateVisible}
        onClose={() => setModalCreateVisible(false)}
      />

      <ShareModal
        visible={showShare}
        onClose={() => setShowShare(false)}
        recentContacts={recentContacts}
      />
    </SafeAreaView>
  )
}
