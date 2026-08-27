import { supabase } from "@/src/lib/supabase";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { LockKeyhole } from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

const GREEN = "#9FE870";
const MUTED = "#8B9489";

export default function UpdatePasswordScreen() {
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleUpdatePassword() {
    setError("");
    setMessage("");
    if (password.length < 6) {
      setError("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }
    if (password !== confirmation) {
      setError("As senhas não coincidem.");
      return;
    }
    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setMessage("Senha atualizada com sucesso. Você já pode entrar.");
    setTimeout(() => router.replace("/login"), 1200);
  }

  return (
    <LinearGradient colors={["#0B100D", "#111A13", "#0A0D0B"]} style={styles.screen}>
      <View style={styles.content}>
        <View style={styles.logo}><Text style={styles.logoText}>S</Text></View>
        <Text style={styles.brand}>strivo</Text>
        <Text style={styles.title}>Criar nova senha</Text>
        <Text style={styles.subtitle}>Digite uma nova senha para acessar sua conta.</Text>
        <View style={styles.inputWrap}>
          <LockKeyhole size={19} color={MUTED} />
          <TextInput style={styles.input} placeholder="Nova senha" placeholderTextColor="#5D665E" secureTextEntry value={password} onChangeText={setPassword} />
        </View>
        <View style={styles.inputWrap}>
          <LockKeyhole size={19} color={MUTED} />
          <TextInput style={styles.input} placeholder="Confirme a nova senha" placeholderTextColor="#5D665E" secureTextEntry value={confirmation} onChangeText={setConfirmation} />
        </View>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {message ? <Text style={styles.success}>{message}</Text> : null}
        <Pressable style={styles.button} onPress={handleUpdatePassword} disabled={loading}>
          {loading ? <ActivityIndicator color="#10200F" /> : <Text style={styles.buttonText}>Salvar nova senha</Text>}
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { flex: 1, justifyContent: "center", alignItems: "center", padding: 28, maxWidth: 520, width: "100%", alignSelf: "center" },
  logo: { width: 48, height: 48, borderRadius: 15, backgroundColor: GREEN, alignItems: "center", justifyContent: "center", transform: [{ rotate: "-8deg" }] },
  logoText: { color: "#10200F", fontSize: 30, fontWeight: "900", transform: [{ rotate: "8deg" }] },
  brand: { color: "#F4F8F2", fontSize: 23, fontWeight: "800", marginTop: 10 },
  title: { color: "#F5F8F3", fontSize: 26, fontWeight: "800", marginTop: 52 },
  subtitle: { color: MUTED, fontSize: 15, textAlign: "center", marginTop: 12, marginBottom: 28 },
  inputWrap: { minHeight: 58, width: "100%", borderRadius: 15, borderWidth: 1, borderColor: "#29352B", backgroundColor: "rgba(24, 34, 26, 0.82)", flexDirection: "row", alignItems: "center", paddingHorizontal: 17, gap: 12, marginBottom: 15 },
  input: { flex: 1, color: "#F5F8F3", fontSize: 15, paddingVertical: 16 },
  error: { color: "#F28D8D", textAlign: "center", marginTop: 3 },
  success: { color: GREEN, textAlign: "center", marginTop: 3 },
  button: { minHeight: 58, width: "100%", borderRadius: 15, backgroundColor: GREEN, alignItems: "center", justifyContent: "center", marginTop: 25 },
  buttonText: { color: "#10200F", fontSize: 15, fontWeight: "800" },
});
