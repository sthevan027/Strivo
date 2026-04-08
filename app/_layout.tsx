import { Redirect, Tabs } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import {
  Clapperboard,
  Home,
  Search,
  User,
  Video,
} from 'lucide-react-native'
import { useEffect, useState } from 'react'
import {
  AppState,
  Image,
  TouchableOpacity,
} from 'react-native'

import AccountSwitcher, {
  Account,
} from '@/src/components/account-swittcher'
import { supabase } from '@/src/lib/supabase'
import { loadProfileData } from '@/src/utils/profileStorage'

export default function RootLayout() {
  const [showSwitcher, setShowSwitcher] = useState(false)

  const [user, setUser] = useState<any>(null)
  const [loadingUser, setLoadingUser] = useState(true)

  const [currentAccount, setCurrentAccount] = useState<Account>({
    id: '1',
    username: 'flavio.zrx',
    avatar: 'https://avatars.githubusercontent.com/u/60237326?v=4',
    isActive: true,
  })

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
      setLoadingUser(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadProfileAvatar = async () => {
    try {
      const profileData = await loadProfileData()

      if (profileData.avatar) {
        setCurrentAccount((prev) => ({
          ...prev,
          avatar: profileData.avatar,
          username: profileData.username || prev.username,
        }))
      }
    } catch (error) {
      console.log('Erro ao carregar avatar:', error)
    }
  }

  useEffect(() => {
    loadProfileAvatar()

    const interval = setInterval(() => {
      loadProfileAvatar()
    }, 2000)

    const subscription = AppState.addEventListener(
      'change',
      (nextAppState) => {
        if (nextAppState === 'active') {
          loadProfileAvatar()
        }
      }
    )

    return () => {
      clearInterval(interval)
      subscription.remove()
    }
  }, [])

  if (loadingUser) return null

  if (!user) {
    return <Redirect href="../pages/login" />
  }

  const accounts: Account[] = [
    currentAccount,
    {
      id: '2',
      username: 'strivobrasil',
      avatar: 'https://i.pravatar.cc/150?img=2',
      isActive: false,
    },
    {
      id: '3',
      username: 'nexo.aii',
      avatar: 'https://i.pravatar.cc/150?img=3',
      isActive: false,
    },
    {
      id: '4',
      username: 'fluxo.aii',
      avatar: 'https://i.pravatar.cc/150?img=4',
      isActive: false,
    },
  ]

  return (
    <>
      <StatusBar style="light" />

      <Tabs
        initialRouteName="index"
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#00FF40',
          tabBarStyle: {
            backgroundColor: '#000',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: '',
            tabBarIcon: ({ color, size }) => (
              <Home color={color} size={size} />
            ),
          }}
        />

        <Tabs.Screen
          name="screens/searchScreen"
          options={{
            title: '',
            tabBarIcon: ({ color, size }) => (
              <Search color={color} size={size} />
            ),
          }}
        />

        <Tabs.Screen
          name="screens/streams"
          options={{
            title: '',
            tabBarIcon: ({ color, size }) => (
              <Video color={color} size={size} />
            ),
          }}
        />

        <Tabs.Screen
          name="screens/reels"
          options={{
            title: '',
            tabBarIcon: ({ color, size }) => (
              <Clapperboard color={color} size={size} />
            ),
          }}
        />

        <Tabs.Screen
          name="screens/profile"
          options={{
            title: '',
            tabBarIcon: ({ color, size, focused }) => (
              <TouchableOpacity
                onLongPress={() => setShowSwitcher(true)}
                delayLongPress={400}
                activeOpacity={1}
              >
                {!currentAccount.avatar ? (
                  <User color={color} size={size} />
                ) : (
                  <Image
                    source={{ uri: currentAccount.avatar }}
                    style={{
                      width: size,
                      height: size,
                      borderRadius: size / 2,
                      borderWidth: focused ? 2 : 0,
                      borderColor: focused ? '#00FF40' : 'transparent',
                    }}
                  />
                )}
              </TouchableOpacity>
            ),
          }}
        />

        <Tabs.Screen
          name="login"
          options={{
            href: null,
          }}
        />

        <Tabs.Screen
          name="screens/story-screen"
          options={{
            href: null,
            tabBarStyle: { display: 'none' },
          }}
        />

        <Tabs.Screen
          name="screens/profile/metrics"
          options={{
            href: null,
            tabBarStyle: { display: 'none' },
          }}
        />

        <Tabs.Screen
          name="screens/profile/other-user-profile"
          options={{
            href: null,
            tabBarStyle: { display: 'none' },
          }}
        />

        <Tabs.Screen
          name="screens/create/create-post"
          options={{
            href: null,
            tabBarStyle: { display: 'none' },
          }}
        />

        <Tabs.Screen
          name="screens/notifications"
          options={{
            href: null,
            tabBarStyle: { display: 'none' },
          }}
        />

        <Tabs.Screen
          name="screens/configuration"
          options={{
            href: null,
          }}
        />

        <Tabs.Screen
          name="screens/configs/account-privacy"
          options={{
            href: null,
            tabBarStyle: { display: 'none' },
          }}
        />

        <Tabs.Screen
          name="screens/chat/group/new-modal"
          options={{
            href: null,
            tabBarStyle: { display: 'none' },
          }}
        />

        <Tabs.Screen
          name="screens/chat/group/new-group"
          options={{
            href: null,
            tabBarStyle: { display: 'none' },
          }}
        />

        <Tabs.Screen
          name="screens/chat/group/add-members"
          options={{
            href: null,
            tabBarStyle: { display: 'none' },
          }}
        />

        <Tabs.Screen
          name="screens/chat/group/navigation"
          options={{
            href: null,
            tabBarStyle: { display: 'none' },
          }}
        />

        <Tabs.Screen
          name="screens/chat/group/user-list"
          options={{
            href: null,
            tabBarStyle: { display: 'none' },
          }}
        />

        <Tabs.Screen
          name="screens/configs/comp-screen"
          options={{
            href: null,
            tabBarStyle: { display: 'none' },
          }}
        />

        <Tabs.Screen
          name="screens/configs/comments"
          options={{
            href: null,
            tabBarStyle: { display: 'none' },
          }}
        />

        <Tabs.Screen
          name="screens/configs/views-manage"
          options={{
            href: null,
            tabBarStyle: { display: 'none' },
          }}
        />

        <Tabs.Screen
          name="screens/configs/liked-content"
          options={{
            href: null,
            tabBarStyle: { display: 'none' },
          }}
        />

        <Tabs.Screen
          name="screens/configs/items-archived"
          options={{
            href: null,
            tabBarStyle: { display: 'none' },
          }}
        />

        <Tabs.Screen
          name="screens/chat/chat-screen"
          options={{
            href: null,
            tabBarStyle: { display: 'none' },
          }}
        />

        <Tabs.Screen
          name="screens/chat/message-screen"
          options={{
            href: null,
            tabBarStyle: { display: 'none' },
          }}
        />

        <Tabs.Screen
          name="screens/chat/messa-actions-menu"
          options={{
            href: null,
            tabBarStyle: { display: 'none' },
          }}
        />

        <Tabs.Screen
          name="screens/create-post"
          options={{
            href: null,
          }}
        />

        <Tabs.Screen
          name="screens/chat/new-chat-screen"
          options={{
            href: null,
            tabBarStyle: { display: 'none' },
          }}
        />

        <Tabs.Screen
          name="screens/chat-live"
          options={{
            href: null,
          }}
        />

        <Tabs.Screen
          name="screens/suport-creator"
          options={{
            href: null,
          }}
        />

        <Tabs.Screen
          name="screens/edit-profile"
          options={{
            href: null,
            tabBarStyle: { display: 'none' },
          }}
        />
      </Tabs>

      <AccountSwitcher
        visible={showSwitcher}
        onClose={() => setShowSwitcher(false)}
        currentAccount={currentAccount}
        accounts={accounts}
        onSwitchAccount={(accountId) => {
          const account = accounts.find((a) => a.id === accountId)

          if (account) {
            setCurrentAccount(account)
          }
        }}
        onAddAccount={() => {
          console.log('Adicionar nova conta')
        }}
             />
    </>
  )
}