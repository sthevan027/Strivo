import AccountSwitcher, { Account } from "@/src/components/account-swittcher";
import { useAuth } from "@/src/contexts/AuthContext";
import { colors } from "@/src/theme/strivo";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Clapperboard, Home, Search, User, Video } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Image, TouchableOpacity } from "react-native";

export default function TabsLayout() {
  const { user } = useAuth();
  const [showSwitcher, setShowSwitcher] = useState(false);

  const [currentAccount, setCurrentAccount] = useState<Account>({
    id: "1",
    username: "usuario",
    avatar: "https://i.pravatar.cc/150",
    isActive: true,
  });

  useEffect(() => {
    if (user) {
      setCurrentAccount((prev) => ({
        ...prev,
        avatar: user.avatar ?? prev.avatar,
        username: user.username ?? user.name ?? prev.username,
      }));
    }
  }, [user]);

  const accounts: Account[] = [
    currentAccount,
    {
      id: "2",
      username: "strivobrasil",
      avatar: "https://i.pravatar.cc/150?img=2",
      isActive: false,
    },
    {
      id: "3",
      username: "nexo.aii",
      avatar: "https://i.pravatar.cc/150?img=3",
      isActive: false,
    },
    {
      id: "4",
      username: "fluxo.aii",
      avatar: "https://i.pravatar.cc/150?img=4",
      isActive: false,
    },
  ];

  return (
    <>
      <StatusBar style="light" />

      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.accent,
          tabBarInactiveTintColor: colors.textDim,
          tabBarShowLabel: false,
          tabBarStyle: {
            position: "absolute",
            left: 20,
            right: 20,
            bottom: 18,
            height: 62,
            borderRadius: 31,
            backgroundColor: "rgba(30,34,29,0.92)",
            borderTopWidth: 0,
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.10)",
            elevation: 0,
            shadowColor: "#000",
            shadowOpacity: 0.35,
            shadowRadius: 20,
            shadowOffset: { width: 0, height: 10 },
          },
          tabBarItemStyle: { paddingTop: 4 },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "",
            tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
          }}
        />

        <Tabs.Screen
          name="screens/searchScreen"
          options={{
            title: "",
            tabBarIcon: ({ color, size }) => (
              <Search color={color} size={size} />
            ),
          }}
        />

        <Tabs.Screen
          name="screens/streams"
          options={{
            title: "",
            tabBarIcon: ({ color, size }) => (
              <Video color={color} size={size} />
            ),
          }}
        />

        <Tabs.Screen
          name="screens/reels"
          options={{
            title: "",
            tabBarIcon: ({ color, size }) => (
              <Clapperboard color={color} size={size} />
            ),
          }}
        />

        <Tabs.Screen
          name="screens/profile"
          options={{
            title: "",
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
                      borderColor: focused ? colors.accent : "transparent",
                    }}
                  />
                )}
              </TouchableOpacity>
            ),
          }}
        />

        {/* TELAS OCULTAS */}
        <Tabs.Screen name="screens/ranking" options={{ href: null }} />
        <Tabs.Screen name="screens/story-screen" options={{ href: null }} />
        <Tabs.Screen name="screens/profile/metrics" options={{ href: null }} />
        <Tabs.Screen
          name="screens/profile/other-user-profile"
          options={{ href: null }}
        />
        <Tabs.Screen
          name="screens/create/create-post"
          options={{ href: null }}
        />
        <Tabs.Screen name="screens/notifications" options={{ href: null }} />
        <Tabs.Screen name="screens/configuration" options={{ href: null }} />
        <Tabs.Screen name="screens/chat/chat-screen" options={{ href: null }} />
        <Tabs.Screen
          name="screens/chat/message-screen"
          options={{ href: null }}
        />
        <Tabs.Screen name="screens/edit-profile" options={{ href: null }} />
        <Tabs.Screen name="screens/stores/store-profile" options={{ href: null }} />
        <Tabs.Screen name="screens/stores/add-store" options={{ href: null }} />
      </Tabs>

      <AccountSwitcher
        visible={showSwitcher}
        onClose={() => setShowSwitcher(false)}
        currentAccount={currentAccount}
        accounts={accounts}
        onSwitchAccount={(accountId) => {
          const account = accounts.find((a) => a.id === accountId);
          if (account) setCurrentAccount(account);
        }}
        onAddAccount={() => {
          console.log("Adicionar conta");
        }}
      />
    </>
  );
}
