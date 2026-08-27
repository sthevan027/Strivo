import { useAuth } from "@/src/contexts/AuthContext";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Eye, EyeOff, LockKeyhole, Mail, Phone, Sparkles, UserRound } from "lucide-react-native";
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

function registerErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : "";
  if (/rate limit|over_email_send_rate_limit/i.test(message)) return "Limite de envio de email atingido. Tente novamente em alguns minutos.";
  if (/already registered|already exists/i.test(message)) return "Este email já está cadastrado.";
  if (/password/i.test(message) && /characters|length|weak/i.test(message)) return "Use uma senha com pelo menos 6 caracteres.";
  return message || "Não foi possível criar sua conta agora.";
}

export default function RegisterScreen() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleRegister() {
    Keyboard.dismiss();
    setErrorMsg("");
    const normalizedEmail = email.trim().toLowerCase();
    if (!name.trim() || !normalizedEmail || !password) {
      setErrorMsg("Preencha nome, email e senha para continuar.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      setErrorMsg("Digite um email válido.");
      return;
    }
    if (password.length < 6) {
      setErrorMsg("Sua senha precisa ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);
    try {
      await register({
        name: name.trim(),
        email: normalizedEmail,
        password,
        phone: phone.trim() || undefined,
      });
      router.replace("/(tabs)/home");
    } catch (error) {
      setErrorMsg(registerErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  function clearError(setter: (value: string) => void, value: string) {
    setter(value);
    setErrorMsg("");
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
            <View style={styles.eyebrow}><Sparkles size={14} color={GREEN} /><Text style={styles.eyebrowText}>JUNTE-SE AO STRIVO</Text></View>
            <Text style={styles.subtitle}>Crie sua conta e comece a compartilhar o que te move.</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>NOME COMPLETO</Text>
            <View style={styles.inputWrap}>
              <UserRound size={19} color={MUTED} />
              <TextInput
                style={styles.input}
                placeholder="Como podemos te chamar?"
                placeholderTextColor="#5D665E"
                autoCapitalize="words"
                autoComplete="name"
                returnKeyType="next"
                value={name}
                onChangeText={(value) => clearError(setName, value)}
              />
            </View>

            <Text style={[styles.label, styles.spacedLabel]}>TELEFONE <Text style={styles.optional}>(OPCIONAL)</Text></Text>
            <View style={styles.inputWrap}>
              <Phone size={19} color={MUTED} />
              <TextInput
                style={styles.input}
                placeholder="(00) 00000-0000"
                placeholderTextColor="#5D665E"
                keyboardType="phone-pad"
                autoComplete="tel"
                value={phone}
                onChangeText={(value) => clearError(setPhone, value)}
              />
            </View>

            <Text style={[styles.label, styles.spacedLabel]}>EMAIL</Text>
            <View style={styles.inputWrap}>
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
                onChangeText={(value) => clearError(setEmail, value)}
              />
            </View>

            <Text style={[styles.label, styles.spacedLabel]}>SENHA</Text>
            <View style={styles.inputWrap}>
              <LockKeyhole size={19} color={MUTED} />
              <TextInput
                style={styles.input}
                placeholder="Mínimo de 6 caracteres"
                placeholderTextColor="#5D665E"
                autoCapitalize="none"
                autoComplete="new-password"
                secureTextEntry={!showPassword}
                returnKeyType="go"
                onSubmitEditing={handleRegister}
                value={password}
                onChangeText={(value) => clearError(setPassword, value)}
              />
              <Pressable onPress={() => setShowPassword((visible) => !visible)} hitSlop={10} accessibilityLabel={showPassword ? "Ocultar senha" : "Mostrar senha"}>
                {showPassword ? <EyeOff size={19} color={MUTED} /> : <Eye size={19} color={MUTED} />}
              </Pressable>
            </View>

            {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}

            <Pressable style={({ pressed }) => [styles.button, pressed && styles.buttonPressed, loading && styles.buttonLoading]} onPress={handleRegister} disabled={loading}>
              {loading ? <ActivityIndicator color="#10200F" /> : <Text style={styles.buttonText}>Criar minha conta</Text>}
            </Pressable>
          </View>

          <Text style={styles.footer}>Já tem uma conta? <Text style={styles.link} onPress={() => router.replace("/login")}>Entrar</Text></Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { flexGrow: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 28, paddingVertical: 40, maxWidth: 520, width: "100%", alignSelf: "center" },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 52 },
  logo: { width: 38, height: 38, borderRadius: 13, backgroundColor: GREEN, alignItems: "center", justifyContent: "center", transform: [{ rotate: "-8deg" }] },
  logoText: { color: "#10200F", fontSize: 25, fontWeight: "900", transform: [{ rotate: "8deg" }] },
  brand: { color: "#F4F8F2", fontSize: 23, fontWeight: "800", letterSpacing: -0.7 },
  intro: { alignItems: "center", marginBottom: 30 },
  eyebrow: { flexDirection: "row", alignItems: "center", gap: 7, marginBottom: 15 },
  eyebrowText: { color: GREEN, fontSize: 11, fontWeight: "800", letterSpacing: 1.5 },
  subtitle: { color: MUTED, fontSize: 15, lineHeight: 22, maxWidth: 330, textAlign: "center" },
  form: { width: "100%" },
  label: { alignSelf: "flex-start", color: "#AEB8AC", fontSize: 10, fontWeight: "800", letterSpacing: 1.4, marginBottom: 9 },
  spacedLabel: { marginTop: 17 },
  optional: { color: "#687269", fontWeight: "600", letterSpacing: 0.7 },
  inputWrap: { minHeight: 56, borderRadius: 15, borderWidth: 1, borderColor: "#29352B", backgroundColor: "rgba(24, 34, 26, 0.82)", flexDirection: "row", alignItems: "center", paddingHorizontal: 17, gap: 12 },
  input: { flex: 1, color: "#F5F8F3", fontSize: 15, paddingVertical: 15 },
  error: { color: "#F28D8D", fontSize: 13, lineHeight: 18, marginTop: 13, textAlign: "center" },
  button: { minHeight: 58, borderRadius: 15, backgroundColor: GREEN, alignItems: "center", justifyContent: "center", marginTop: 25, shadowColor: GREEN, shadowOpacity: 0.18, shadowRadius: 15, shadowOffset: { width: 0, height: 7 }, elevation: 4 },
  buttonPressed: { opacity: 0.86, transform: [{ scale: 0.99 }] },
  buttonLoading: { opacity: 0.7 },
  buttonText: { color: "#10200F", fontSize: 15, fontWeight: "800" },
  footer: { color: MUTED, textAlign: "center", fontSize: 14, marginTop: 32 },
  link: { color: GREEN, fontWeight: "800" },
});
