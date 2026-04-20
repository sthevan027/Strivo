import AccountSwitcher, { Account } from '@/src/components/account-swittcher'
import { loadProfileData } from '@/src/utils/profileStorage'
import { Tabs } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { Clapperboard, Home, Search, User, Video } from 'lucide-react-native'
import { useEffect, useState } from 'react'
import { AppState, Image, TouchableOpacity } from 'react-native'

export default function TabsLayout() {
  const [showSwitcher, setShowSwitcher] = useState(false)

  const [currentAccount, setCurrentAccount] = useState<Account>({
    id: '1',
    username: 'flavio.zrx',
    avatar: 'https://avatars.githubusercontent.com/u/60237326?v=4',
    isActive: true,
  })

  const loadProfileAvatar = async () => {
    try {
      const profileData = await loadProfileData()

      if (profileData?.avatar) {
        setCurrentAccount((prev) => ({
          ...prev,
          avatar: profileData.avatar,
          username: profileData.username || prev.username,
        }))
      }
    } catch (err) {
      console.log('Erro avatar:', err)
    }
  }

  useEffect(() => {
    loadProfileAvatar()

    const interval = setInterval(() => {
      loadProfileAvatar()
    }, 2000)

    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        loadProfileAvatar()
      }
    })

    return () => {
      clearInterval(interval)
      subscription.remove()
    }
  }, [])

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
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#00FF40',
          tabBarStyle: {
            backgroundColor: '#000',
          },
        }}
      >
        {/* HOME (OBRIGATÓRIO TER ESSE ARQUIVO) */}
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

        {/* TELAS OCULTAS */}
        <Tabs.Screen name="screens/story-screen" options={{ href: null }} />
        <Tabs.Screen name="screens/profile/metrics" options={{ href: null }} />
        <Tabs.Screen name="screens/profile/other-user-profile" options={{ href: null }} />
        <Tabs.Screen name="screens/create/create-post" options={{ href: null }} />
        <Tabs.Screen name="screens/notifications" options={{ href: null }} />
        <Tabs.Screen name="screens/configuration" options={{ href: null }} />
        <Tabs.Screen name="screens/chat/chat-screen" options={{ href: null }} />
        <Tabs.Screen name="screens/chat/message-screen" options={{ href: null }} />
        <Tabs.Screen name="screens/edit-profile" options={{ href: null }} />
      </Tabs>

      <AccountSwitcher
        visible={showSwitcher}
        onClose={() => setShowSwitcher(false)}
        currentAccount={currentAccount}
        accounts={accounts}
        onSwitchAccount={(accountId) => {
          const account = accounts.find((a) => a.id === accountId)
          if (account) setCurrentAccount(account)
        }}
        onAddAccount={() => {
          console.log('Adicionar conta')
        }}
      />
    </>
  )
}