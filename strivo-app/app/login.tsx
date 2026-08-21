import { useAuth } from "@/src/contexts/AuthContext";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Eye, EyeOff, LockKeyhole, Mail, Sparkles } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const GREEN = "#9FE870";
const MUTED = "#8B9489";

function authErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : "";
  if (/invalid login credentials/i.test(message)) return "Email ou senha incorretos.";
  if (/email not confirmed/i.test(message)) return "Confirme seu email antes de entrar.";
  return message || "Não foi possível entrar agora. Tente novamente.";
}

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleLogin() {
    Keyboard.dismiss();
    setErrorMsg("");
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !password) {
      setErrorMsg("Preencha seu email e sua senha para continuar.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      setErrorMsg("Digite um email válido.");
      return;
    }

    setLoading(true);
    try {
      await login(normalizedEmail, password);
      router.replace("/(tabs)/home");
    } catch (error) {
      setErrorMsg(authErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <LinearGradient colors={["#0B100D", "#111A13", "#0A0D0B"]} style={styles.screen}>
      <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.brandRow}>
            <View style={styles.logo}><Text style={styles.logoText}>S</Text></View>
            <Text style={styles.brand}>strivo</Text>
          </View>

          <View style={styles.intro}>
            <View style={styles.eyebrow}><Sparkles size={14} color={GREEN} /><Text style={styles.eyebrowText}>BEM-VINDO DE VOLTA</Text></View>
            <Text style={styles.subtitle}>Entre para continuar compartilhando o que te move.</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>EMAIL</Text>
            <View style={[styles.inputWrap, errorMsg && !email.trim() ? styles.inputError : null]}>
              <Mail size={19} color={MUTED} />
              <TextInput
                style={styles.input}
                placeholder="voce@exemplo.com"
                placeholderTextColor="#5D665E"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                keyboardType="email-address"
                returnKeyType="next"
                value={email}
                onChangeText={(value) => { setEmail(value); setErrorMsg(""); }}
              />
            </View>

            <Text style={[styles.label, styles.passwordLabel]}>SENHA</Text>
            <View style={styles.inputWrap}>
              <LockKeyhole size={19} color={MUTED} />
              <TextInput
                style={styles.input}
                placeholder="Digite sua senha"
                placeholderTextColor="#5D665E"
                autoCapitalize="none"
                autoComplete="password"
                secureTextEntry={!showPassword}
                returnKeyType="go"
                onSubmitEditing={handleLogin}
                value={password}
                onChangeText={(value) => { setPassword(value); setErrorMsg(""); }}
              />
              <Pressable onPress={() => setShowPassword((visible) => !visible)} hitSlop={10} accessibilityLabel={showPassword ? "Ocultar senha" : "Mostrar senha"}>
                {showPassword ? <EyeOff size={19} color={MUTED} /> : <Eye size={19} color={MUTED} />}
              </Pressable>
            </View>

            {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}

            <Pressable style={({ pressed }) => [styles.button, pressed && styles.buttonPressed, loading && styles.buttonLoading]} onPress={handleLogin} disabled={loading}>
              {loading ? <ActivityIndicator color="#10200F" /> : <Text style={styles.buttonText}>Entrar na conta</Text>}
            </Pressable>
          </View>

          <Text style={styles.footer}>Ainda não faz parte? <Text style={styles.link} onPress={() => router.push("/register")}>Criar uma conta</Text></Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { flexGrow: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 28, paddingVertical: 40, maxWidth: 520, width: "100%", alignSelf: "center" },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 64 },
  logo: { width: 38, height: 38, borderRadius: 13, backgroundColor: GREEN, alignItems: "center", justifyContent: "center", transform: [{ rotate: "-8deg" }] },
  logoText: { color: "#10200F", fontSize: 25, fontWeight: "900", transform: [{ rotate: "8deg" }] },
  brand: { color: "#F4F8F2", fontSize: 23, fontWeight: "800", letterSpacing: -0.7 },
  intro: { alignItems: "center", marginBottom: 38 },
  eyebrow: { flexDirection: "row", alignItems: "center", gap: 7, marginBottom: 15 },
  eyebrowText: { color: GREEN, fontSize: 11, fontWeight: "800", letterSpacing: 1.5 },
  title: { color: "#F5F8F3", fontSize: 39, lineHeight: 43, fontWeight: "800", letterSpacing: -1.5, textAlign: "center" },
  subtitle: { color: MUTED, fontSize: 15, lineHeight: 22, marginTop: 16, maxWidth: 330, textAlign: "center" },
  form: { width: "100%" },
  label: { alignSelf: "flex-start", color: "#AEB8AC", fontSize: 10, fontWeight: "800", letterSpacing: 1.4, marginBottom: 9 },
  passwordLabel: { marginTop: 21 },
  inputWrap: { minHeight: 58, borderRadius: 15, borderWidth: 1, borderColor: "#29352B", backgroundColor: "rgba(24, 34, 26, 0.82)", flexDirection: "row", alignItems: "center", paddingHorizontal: 17, gap: 12 },
  inputError: { borderColor: "#D96C6C" },
  input: { flex: 1, color: "#F5F8F3", fontSize: 15, paddingVertical: 16 },
  error: { color: "#F28D8D", fontSize: 13, lineHeight: 18, marginTop: 13, textAlign: "center" },
  button: { minHeight: 58, borderRadius: 15, backgroundColor: GREEN, alignItems: "center", justifyContent: "center", marginTop: 25, shadowColor: GREEN, shadowOpacity: 0.18, shadowRadius: 15, shadowOffset: { width: 0, height: 7 }, elevation: 4 },
  buttonPressed: { opacity: 0.86, transform: [{ scale: 0.99 }] },
  buttonLoading: { opacity: 0.7 },
  buttonText: { color: "#10200F", fontSize: 15, fontWeight: "800" },
  footer: { color: MUTED, textAlign: "center", fontSize: 14, marginTop: 36 },
  link: { color: GREEN, fontWeight: "800" },
});
