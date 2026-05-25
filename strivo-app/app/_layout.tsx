import { AuthProvider, useAuth } from "@/src/contexts/AuthContext";
import { router, Stack, useSegments } from "expo-router";
import { useEffect } from "react";

function RouteGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup =
      segments[0] === "login" ||
      segments[0] === "register" ||
      segments[0] === "verify-email" ||
      segments[0] === "auth"; // covers auth/callback OAuth flow

    if (!user && !inAuthGroup) {
      router.replace("/login");
    } else if (user && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [user, isLoading, segments]);

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RouteGuard>
        <Stack screenOptions={{ headerShown: false }} />
      </RouteGuard>
    </AuthProvider>
  );
}
