import { useAuth } from "@/src/contexts/AuthContext";
import { supabase } from "@/src/lib/supabase";
import { colors, displayFont, radii } from "@/src/theme/strivo";
import { useRouter } from "expo-router";
import { Store, X } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CATEGORIES = ["Artesanato", "Alimentação", "Moda", "Serviços", "Beleza"];

export default function AddStoreScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [contact, setContact] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleCreate() {
    if (!user) return;
    if (!name.trim()) {
      setError("Dá um nome pra sua store.");
      return;
    }
    setError("");
    setSaving(true);
    const { data, error: insertError } = await supabase
      .from("stores")
      .insert({
        owner_id: user.id,
        name: name.trim(),
        category,
        description: description.trim() || null,
        contact: contact.trim() || null,
      })
      .select("id")
      .single();
    setSaving(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }
    router.replace(`/screens/stores/store-profile?id=${data.id}`);
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <X size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Nova store</Text>
        <TouchableOpacity onPress={handleCreate} disabled={saving}>
          {saving ? (
            <ActivityIndicator color={colors.accent} size="small" />
          ) : (
            <Text style={styles.createLink}>Criar</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.coverPlaceholder}>
        <Store size={20} color={colors.textDim} strokeWidth={1.8} />
        <Text style={styles.coverText}>Adicionar capa</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 18, paddingTop: 24, paddingBottom: 40 }}>
        <Text style={styles.label}>Nome da store</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="ex.: Ateliê da Mari"
          placeholderTextColor={colors.textDim}
          style={styles.input}
        />

        <Text style={styles.label}>Categoria</Text>
        <View style={styles.chipsRow}>
          {CATEGORIES.map((c) => (
            <Pressable
              key={c}
              onPress={() => setCategory(c)}
              style={[styles.chip, category === c && styles.chipActive]}
            >
              <Text style={[styles.chipText, category === c && styles.chipTextActive]}>{c}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Descrição</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Conte em poucas linhas o que sua store oferece"
          placeholderTextColor={colors.textDim}
          style={[styles.input, styles.textArea]}
          multiline
        />

        <Text style={styles.label}>WhatsApp / contato</Text>
        <TextInput
          value={contact}
          onChangeText={setContact}
          placeholder="(27) 9 0000-0000"
          placeholderTextColor={colors.textDim}
          style={styles.input}
          keyboardType="phone-pad"
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}
      </ScrollView>

      <TouchableOpacity style={styles.cta} onPress={handleCreate} disabled={saving}>
        {saving ? <ActivityIndicator color={colors.bg} /> : <Text style={styles.ctaText}>Criar store</Text>}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  topBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 18 },
  title: { fontSize: 16, color: colors.textStrong, ...displayFont },
  createLink: { fontSize: 13.5, fontWeight: "700", color: colors.accent },
  coverPlaceholder: { marginHorizontal: 18, height: 104, borderRadius: radii.lg, borderWidth: 1.5, borderColor: colors.border, borderStyle: "dashed", alignItems: "center", justifyContent: "center", gap: 6 },
  coverText: { fontSize: 12, color: colors.textDim, fontWeight: "600" },
  label: { fontSize: 12, fontWeight: "700", color: colors.textMuted, textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 8, marginTop: 4 },
  input: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, padding: 13, fontSize: 14, color: colors.text, marginBottom: 20 },
  textArea: { height: 80, textAlignVertical: "top" },
  chipsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 20 },
  chip: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 16, borderWidth: 1, borderColor: colors.border },
  chipActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  chipText: { fontSize: 12.5, fontWeight: "600", color: colors.prose },
  chipTextActive: { color: colors.bg, fontWeight: "700" },
  error: { color: colors.danger, fontSize: 12.5, marginTop: -8, marginBottom: 12 },
  cta: { position: "absolute", left: 18, right: 18, bottom: 18, height: 54, borderRadius: radii.lg, backgroundColor: colors.accent, alignItems: "center", justifyContent: "center" },
  ctaText: { fontSize: 14.5, fontWeight: "700", color: colors.bg },
});
