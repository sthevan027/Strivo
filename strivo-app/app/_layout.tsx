import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Clapperboard, Home, User, Video } from 'lucide-react-native';
import { Image } from 'react-native';

export default function RootLayout() {
  const     avatar = 'https://avatars.githubusercontent.com/u/60237326?v=4'

  return (
    <>
      <StatusBar style="light" />
      <Tabs
       initialRouteName="index"
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#fff',
          tabBarStyle: {
            backgroundColor: '#000',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{ title: '' , tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
          }}
          
        />
        <Tabs.Screen
          name="screens/streams"
          options={{ title: '' , tabBarIcon: ({ color, size }) => <Video color={color} size={size} />,
          }}
          
        />
        <Tabs.Screen
          name="screens/reels"
          options={{ title: '' , tabBarIcon: ({ color, size }) => <Clapperboard color={color} size={size} />,
          }}
          
        />
        <Tabs.Screen
          name="screens/profile"
          options={{ title: '' ,  tabBarIcon: ({ color, size, focused }) =>
      !avatar ? (
        <User color={color} size={size} />
      ) : (
        <Image
          source={{ uri: avatar }}
          style={{
            width: size,
            height: size,
            borderRadius: size / 2, // deixa circular
            borderWidth: focused ? 2 : 0,
            borderColor: focused ? '#fff' : 'transparent', // realce quando ativo
          }}
        />
      ),
  }}
          
        />
        <Tabs.Screen
          name="screens/configuration"
          options={{ href: null}}
        />
        <Tabs.Screen
          name="screens/account-privacy"
          options={{ href: null }}
          
        />
        <Tabs.Screen
          name="screens/chat/chat-screen"
          options={{ href: null }}
        />
        <Tabs.Screen
          name="screens/chat/message-screen"
          options={{ href: null }}
        />
        <Tabs.Screen
          name="screens/chat/new-chat-screen"
          options={{ href: null }}
        />
      </Tabs>
    </>
  );
}
