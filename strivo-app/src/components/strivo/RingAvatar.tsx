import { LinearGradient } from "expo-linear-gradient";
import { Image, View } from "react-native";
import { colors } from "@/src/theme/strivo";

export function RingAvatar({
  uri,
  size = 48,
  ring = "active",
}: {
  uri?: string | null;
  size?: number;
  /** "active" = anel verde (story novo), "seen" = cinza (já visto), "none" = sem anel */
  ring?: "active" | "seen" | "none";
}) {
  if (ring === "none") {
    return (
      <Image
        source={{ uri: uri ?? "https://i.pravatar.cc/150" }}
        style={{ width: size, height: size, borderRadius: size / 2 }}
      />
    );
  }

  const padding = 2.5;
  const inner = size - padding * 2 - 4;

  return (
    <LinearGradient
      colors={ring === "active" ? [colors.accent, colors.accentSoft, colors.accent] : ["#262626", "#262626"]}
      style={{ width: size, height: size, borderRadius: size / 2, padding, alignItems: "center", justifyContent: "center" }}
    >
      <View style={{ width: size - padding * 2, height: size - padding * 2, borderRadius: (size - padding * 2) / 2, backgroundColor: colors.bg, padding: 2, alignItems: "center", justifyContent: "center" }}>
        <Image
          source={{ uri: uri ?? "https://i.pravatar.cc/150" }}
          style={{ width: inner, height: inner, borderRadius: inner / 2 }}
        />
      </View>
    </LinearGradient>
  );
}
