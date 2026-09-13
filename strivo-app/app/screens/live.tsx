import { CameraView, useCameraPermissions } from "expo-camera";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Camera,
  FlipHorizontal,
  Gift,
  Heart,
  Mic,
  MicOff,
  MessageCircle,
  MoreHorizontal,
  Radio,
  Send,
  Share2,
  Video,
  VideoOff,
  X,
} from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ChatMessage = { id: string; username: string; text: string };

const INITIAL_MESSAGES: ChatMessage[] = [
  { id: "1", username: "Strivo", text: "Bem-vindo à transmissão!" },
  { id: "2", username: "Ana", text: "Estamos ao vivo 🚀" },
];

export default function LiveScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ title?: string; category?: string; chat?: string }>();
  const [permission, requestPermission] = useCameraPermissions();
  const [isLive, setIsLive] = useState(params.chat !== undefined);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [facing, setFacing] = useState<"front" | "back">("front");
  const [viewers, setViewers] = useState(0);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);

  const title = useMemo(
    () => typeof params.title === "string" && params.title.trim() ? params.title : "Minha transmissão",
    [params.title],
  );
  const category = typeof params.category === "string" ? params.category : "Apenas Conversando";
  const chatEnabled = params.chat !== "0";

  useEffect(() => {
    if (permission && !permission.granted) requestPermission();
  }, [permission, requestPermission]);

  useEffect(() => {
    if (!isLive) {
      setViewers(0);
      return;
    }
    setViewers(1);
    const timer = setInterval(() => {
      setViewers((current) => Math.min(current + (current % 3 === 0 ? 1 : 0), 999));
    }, 8000);
    return () => clearInterval(timer);
  }, [isLive]);

  function addMessage(text: string, username = "Você") {
    setMessages((current) => [...current, { id: String(Date.now()), username, text }]);
  }

  function sendMessage() {
    const text = message.trim();
    if (!text) return;
    addMessage(text);
    setMessage("");
  }

  function finishLive() {
    Alert.alert("Encerrar transmissão?", "A live será encerrada para todos os espectadores.", [
      { text: "Continuar ao vivo", style: "cancel" },
      { text: "Encerrar", style: "destructive", onPress: () => { setIsLive(false); router.back(); } },
    ]);
  }

  function renderCamera() {
    if (!cameraEnabled) {
      return (
        <View style={styles.cameraOff}>
          <VideoOff color="#A1A1AA" size={34} />
          <Text style={styles.cameraOffTitle}>Câmera desativada</Text>
          <Text style={styles.cameraOffSubtitle}>Seu áudio continua disponível</Text>
        </View>
      );
    }
    if (!permission?.granted) {
      return (
        <View style={styles.cameraOff}>
          <Camera color="#A1A1AA" size={34} />
          <Text style={styles.cameraOffTitle}>Permita o acesso à câmera</Text>
          <Pressable style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Permitir câmera</Text>
          </Pressable>
        </View>
      );
    }
    return <CameraView style={StyleSheet.absoluteFill} facing={facing} />;
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={styles.preview}>
          {renderCamera()}
          <View style={styles.previewShade} pointerEvents="none" />
          <LinearGradient
            pointerEvents="none"
            colors={["rgba(0,0,0,0.55)", "transparent", "rgba(0,0,0,0.94)"]}
            locations={[0, 0.42, 1]}
            style={styles.gradient}
          />

          <View style={styles.topBar}>
            <View style={styles.creatorChip}>
              <View style={styles.creatorAvatar}><Text style={styles.creatorAvatarText}>S</Text></View>
              <View>
                <Text style={styles.creatorName}>strivo</Text>
                <Text style={styles.creatorViewers}>{viewers} assistindo</Text>
              </View>
              <View style={styles.followPill}><Text style={styles.followText}>+</Text></View>
            </View>
            <View style={styles.topActions}>
              <View style={styles.liveBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.liveBadgeText}>{isLive ? "LIVE" : "PRÉVIA"}</Text>
              </View>
              <Pressable style={styles.closeButton} onPress={isLive ? finishLive : () => router.back()}>
                <X color="#FFF" size={20} />
              </Pressable>
            </View>
          </View>

          <View style={styles.titleOverlay}>
            <Text style={styles.category}>{category.toUpperCase()}</Text>
            <Text style={styles.title} numberOfLines={2}>{title}</Text>
          </View>

          {isLive && (
            <View style={styles.sideActions}>
              <Pressable style={styles.sideAction} onPress={() => setFacing((current) => current === "front" ? "back" : "front")}>
                <FlipHorizontal color="#FFF" size={24} /><Text style={styles.sideLabel}>Virar</Text>
              </Pressable>
              <Pressable style={styles.sideAction} onPress={() => setMicEnabled((current) => !current)}>
                {micEnabled ? <Mic color="#FFF" size={24} /> : <MicOff color="#FB7185" size={24} />}
                <Text style={styles.sideLabel}>{micEnabled ? "Mudo" : "Ativar"}</Text>
              </Pressable>
              <Pressable style={styles.sideAction} onPress={() => setCameraEnabled((current) => !current)}>
                {cameraEnabled ? <Video color="#FFF" size={24} /> : <VideoOff color="#FB7185" size={24} />}
                <Text style={styles.sideLabel}>Câmera</Text>
              </Pressable>
              <Pressable style={styles.sideAction} onPress={() => addMessage("❤️", "Strivo")}>
                <Heart color="#FFF" size={25} fill="#F43F5E" /><Text style={styles.sideLabel}>Amor</Text>
              </Pressable>
              <Pressable style={styles.sideAction} onPress={() => {}}>
                <Share2 color="#FFF" size={24} /><Text style={styles.sideLabel}>Enviar</Text>
              </Pressable>
              <Pressable style={styles.sideAction} onPress={() => {}}>
                <MoreHorizontal color="#FFF" size={25} />
              </Pressable>
            </View>
          )}

          {isLive && chatEnabled && (
            <View style={styles.chatContainer}>
              <FlatList
                data={messages.slice(-7)}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <View style={styles.chatMessage}>
                    <Text style={styles.chatUsername}>{item.username}</Text>
                    <Text style={styles.chatText}>{item.text}</Text>
                  </View>
                )}
              />
            </View>
          )}

          {!isLive && (
            <View style={styles.readyOverlay}>
              <Radio color="#39FF14" size={22} />
              <Text style={styles.readyTitle}>Sua live está pronta</Text>
              <Text style={styles.readySubtitle}>Confira a câmera e comece a transmitir.</Text>
              <Pressable style={styles.startButton} onPress={() => setIsLive(true)}>
                <Radio color="#000" size={19} fill="#000" />
                <Text style={styles.startButtonText}>Entrar ao vivo</Text>
              </Pressable>
            </View>
          )}

          {isLive && chatEnabled && (
            <View style={styles.chatInputRow}>
              <MessageCircle color="#A1A1AA" size={19} />
              <TextInput
                value={message}
                onChangeText={setMessage}
                onSubmitEditing={sendMessage}
                placeholder="Diga algo..."
                placeholderTextColor="#A1A1AA"
                returnKeyType="send"
                style={styles.chatInput}
              />
              <Pressable onPress={sendMessage} hitSlop={8}><Send color="#39FF14" size={20} /></Pressable>
              <Pressable style={styles.giftButton} onPress={() => {}}><Gift color="#FFF" size={19} /></Pressable>
            </View>
          )}

          {isLive && <Pressable style={styles.endButton} onPress={finishLive}><Text style={styles.endButtonText}>Encerrar LIVE</Text></Pressable>}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#000" },
  container: { flex: 1, backgroundColor: "#000" },
  preview: { flex: 1, overflow: "hidden", backgroundColor: "#18181B" },
  previewShade: { position: "absolute", top: 0, right: 0, bottom: 0, left: 0, backgroundColor: "rgba(0,0,0,0.12)" },
  gradient: { position: "absolute", top: 0, right: 0, bottom: 0, left: 0 },
  topBar: { position: "absolute", top: 14, left: 14, right: 14, zIndex: 3, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  creatorChip: { flexDirection: "row", alignItems: "center", paddingRight: 10, paddingVertical: 5, borderRadius: 25, backgroundColor: "rgba(20,20,20,0.78)" },
  creatorAvatar: { width: 38, height: 38, marginRight: 8, borderRadius: 19, backgroundColor: "#39FF14", alignItems: "center", justifyContent: "center" },
  creatorAvatarText: { color: "#000", fontSize: 19, fontWeight: "900" },
  creatorName: { color: "#FFF", fontSize: 13, fontWeight: "800" },
  creatorViewers: { color: "#D4D4D8", fontSize: 10, marginTop: 2 },
  followPill: { width: 23, height: 23, marginLeft: 8, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: "#FFF" },
  followText: { color: "#000", fontSize: 17, lineHeight: 19, fontWeight: "700" },
  topActions: { flexDirection: "row", alignItems: "center", gap: 8 },
  liveBadge: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 18, backgroundColor: "#E11D48" },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: "#FFF" },
  liveBadgeText: { color: "#FFF", fontSize: 10, fontWeight: "900", letterSpacing: 0.7 },
  closeButton: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.62)" },
  titleOverlay: { position: "absolute", left: 18, right: 76, bottom: 190, zIndex: 3 },
  category: { color: "#39FF14", fontSize: 10, fontWeight: "900", letterSpacing: 1.1, marginBottom: 5 },
  title: { color: "#FFF", fontSize: 20, fontWeight: "800", lineHeight: 26 },
  sideActions: { position: "absolute", right: 12, bottom: 158, zIndex: 3, alignItems: "center", gap: 17 },
  sideAction: { alignItems: "center", justifyContent: "center", minWidth: 46 },
  sideLabel: { color: "#FFF", fontSize: 10, fontWeight: "700", marginTop: 4, textShadowColor: "#000", textShadowRadius: 4 },
  cameraOff: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 30 },
  cameraOffTitle: { color: "#FFF", fontSize: 16, fontWeight: "700", marginTop: 14 },
  cameraOffSubtitle: { color: "#A1A1AA", fontSize: 13, marginTop: 6 },
  permissionButton: { marginTop: 18, backgroundColor: "#39FF14", borderRadius: 12, paddingHorizontal: 18, paddingVertical: 11 },
  permissionButtonText: { color: "#000", fontWeight: "800" },
  chatContainer: { position: "absolute", left: 14, right: 72, bottom: 74, maxHeight: 180, zIndex: 3 },
  chatMessage: { alignSelf: "flex-start", flexDirection: "row", gap: 6, maxWidth: "100%", marginBottom: 7, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, backgroundColor: "rgba(0,0,0,0.52)" },
  chatUsername: { color: "#39FF14", fontSize: 12, fontWeight: "800" },
  chatText: { color: "#FFF", fontSize: 12, flexShrink: 1 },
  chatInputRow: { position: "absolute", left: 14, right: 14, bottom: 16, zIndex: 4, height: 44, flexDirection: "row", alignItems: "center", gap: 9, paddingLeft: 13, paddingRight: 6, borderRadius: 23, backgroundColor: "rgba(20,20,20,0.92)" },
  chatInput: { flex: 1, height: 42, color: "#FFF", fontSize: 13 },
  giftButton: { width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center", backgroundColor: "#3F3F46" },
  readyOverlay: { position: "absolute", left: 18, right: 18, bottom: 40, zIndex: 3, padding: 18, borderRadius: 18, alignItems: "center", backgroundColor: "rgba(12,12,12,0.88)" },
  readyTitle: { color: "#FFF", fontSize: 16, fontWeight: "800", marginTop: 8 },
  readySubtitle: { color: "#D4D4D8", fontSize: 12, marginTop: 5, marginBottom: 14 },
  startButton: { width: "100%", height: 48, borderRadius: 13, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8, backgroundColor: "#39FF14" },
  startButtonText: { color: "#000", fontSize: 14, fontWeight: "900" },
  endButton: { position: "absolute", left: 18, bottom: 19, zIndex: 4, paddingHorizontal: 13, paddingVertical: 7, borderRadius: 13, backgroundColor: "rgba(225,29,72,0.9)" },
  endButtonText: { color: "#FFF", fontSize: 10, fontWeight: "900" },
});
