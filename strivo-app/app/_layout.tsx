import { AuthProvider, useAuth } from "@/src/contexts/AuthContext";
import { router, Stack, useSegments } from "expo-router";
import { useEffect } from "react";

function RouteGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const skipAuth = process.env.EXPO_PUBLIC_SKIP_AUTH === "true";

  useEffect(() => {
    if (skipAuth) return;
    if (isLoading) return;

    const inAuthGroup =
      segments[0] === "login" ||
      segments[0] === "register" ||
      segments[0] === "verify-email" ||
      segments[0] === "update-password" ||
      segments[0] === "auth"; // covers auth/callback OAuth flow
    // Acesso temporário para visualizar/testar a tela de transmissão sem login.
    const isLivePreview = segments[0] === "screens" && segments[1] === "live";
    const isPasswordRecovery = segments[0] === "update-password";

    if (!user && !inAuthGroup && !isLivePreview) {
      router.replace("/login");
    } else if (user && inAuthGroup && !isPasswordRecovery) {
      router.replace("/(tabs)/home");
    }
  }, [user, isLoading, segments, skipAuth]);

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
