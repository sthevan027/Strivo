import { useAuth } from '@/src/contexts/AuthContext';
import { colors, displayFont, radii } from '@/src/theme/strivo';
import { useRouter } from 'expo-router';
import { Archive, ArrowLeft, Ban, Briefcase, CheckCircle, ChevronRight, Database, Download, Expand, Eye, FileQuestion, Image as ImageIcon, MessageCircle, MessageSquare, Monitor, Palette, Share2, Zap } from 'lucide-react-native';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface MenuItemProps {
  icon: React.ReactNode;
  title: string;
  badge?: string;
  danger?: boolean;
  last?: boolean;
  onPress?: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, title, badge, danger, last, onPress }) => (
  <View>
    <TouchableOpacity onPress={onPress} style={styles.menuRow} activeOpacity={0.7}>
      <View style={styles.menuIcon}>{icon}</View>
      <Text style={[styles.menuTitle, danger && { color: colors.danger }]}>{title}</Text>
      {badge ? <Text style={styles.menuBadge}>{badge}</Text> : null}
      <ChevronRight size={15} color={colors.textDim} />
    </TouchableOpacity>
    {!last && <View style={styles.menuDivider} />}
  </View>
);

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <View style={{ marginTop: 22 }}>
    <Text style={styles.sectionLabel}>{title}</Text>
    <View style={styles.sectionBox}>{children}</View>
  </View>
);

export default function Configuration() {
  const router = useRouter();
  const { user, logout } = useAuth();

  async function handleLogout() {
    try {
      await logout();
      router.replace('/login');
    } catch (err) {
      console.log('Erro ao sair:', err);
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.push('/screens/profile')}>
          <ArrowLeft size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Configurações</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        <TouchableOpacity style={styles.profileCard} onPress={() => router.push('/screens/profile')} activeOpacity={0.8}>
          <Image
            source={{ uri: user?.avatar ?? 'https://i.pravatar.cc/150' }}
            style={styles.profileAvatar}
          />
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={styles.profileName} numberOfLines={1}>{user?.name ?? 'Seu perfil'}</Text>
            <Text style={styles.profileHandle}>@{user?.username ?? 'usuario'}</Text>
          </View>
          <Text style={styles.profileLink}>Ver perfil</Text>
        </TouchableOpacity>

        <Section title="Conta">
          <MenuItem
            icon={<ImageIcon size={18} color={colors.prose} strokeWidth={1.7} />}
            title="Editar perfil"
            onPress={() => router.push('/screens/edit-profile')}
          />
          <MenuItem
            icon={<Eye size={18} color={colors.prose} strokeWidth={1.7} />}
            title="Privacidade e segurança"
            last
            onPress={() => router.push('/screens/configs/account-privacy')}
          />
        </Section>

        <Section title="Preferências">
          <MenuItem
            icon={<Monitor size={18} color={colors.prose} strokeWidth={1.7} />}
            title="Gerenciar visualizações"
            onPress={() => router.push('/screens/configs/views-manage')}
          />
          <MenuItem
            icon={<Ban size={18} color={colors.prose} strokeWidth={1.7} />}
            title="Lista de bloqueio"
          />
          <MenuItem
            icon={<Palette size={18} color={colors.prose} strokeWidth={1.7} />}
            title="Tema"
            badge="Escuro"
            last
          />
        </Section>

        <Section title="Quem pode interagir com você">
          <MenuItem
            icon={<MessageCircle size={18} color={colors.prose} strokeWidth={1.7} />}
            title="Respostas ao story"
          />
          <MenuItem
            icon={<MessageSquare size={18} color={colors.prose} strokeWidth={1.7} />}
            title="Comentários"
            onPress={() => router.push('/screens/configs/comments')}
          />
          <MenuItem
            icon={<Share2 size={18} color={colors.prose} strokeWidth={1.7} />}
            title="Compartilhamento"
            last
            onPress={() => router.push('/screens/configs/comp-screen')}
          />
        </Section>

        <Section title="Dados e conteúdo">
          <MenuItem
            icon={<Archive size={18} color={colors.prose} strokeWidth={1.7} />}
            title="Itens arquivados"
            onPress={() => router.push('/screens/configs/items-archived')}
          />
          <MenuItem
            icon={<Download size={18} color={colors.prose} strokeWidth={1.7} />}
            title="Guardar e baixar"
          />
          <MenuItem
            icon={<Database size={18} color={colors.prose} strokeWidth={1.7} />}
            title="Ajustes de dados e mídia"
          />
          <MenuItem
            icon={<Zap size={18} color={colors.prose} strokeWidth={1.7} />}
            title="Experiências antecipadas"
            last
          />
        </Section>

        <Section title="Métricas e ferramentas">
          <MenuItem
            icon={<CheckCircle size={18} color={colors.prose} strokeWidth={1.7} />}
            title="Exibir selo de verificação"
          />
          <MenuItem
            icon={<Briefcase size={18} color={colors.prose} strokeWidth={1.7} />}
            title="Categoria e opções da conta"
            last
          />
        </Section>

        <Section title="Suporte">
          <MenuItem
            icon={<FileQuestion size={18} color={colors.prose} strokeWidth={1.7} />}
            title="Enviar sugestão"
          />
          <MenuItem
            icon={<Expand size={18} color={colors.prose} strokeWidth={1.7} />}
            title="Relatar problema"
            last
          />
        </Section>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sair da conta</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 18, paddingTop: 14, paddingBottom: 4 },
  title: { fontSize: 19, color: colors.textStrong, ...displayFont },

  profileCard: { flexDirection: "row", alignItems: "center", gap: 12, marginHorizontal: 18, marginTop: 14, marginBottom: 6, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radii.lg, padding: 14 },
  profileAvatar: { width: 48, height: 48, borderRadius: 24 },
  profileName: { fontSize: 14, fontWeight: "700", color: colors.textStrong },
  profileHandle: { fontSize: 12, color: colors.textMuted, marginTop: 1 },
  profileLink: { fontSize: 12.5, fontWeight: "700", color: colors.accent },

  sectionLabel: { fontSize: 12, fontWeight: "700", letterSpacing: 0.5, color: colors.textMuted, textTransform: "uppercase", paddingHorizontal: 18, marginBottom: 8 },
  sectionBox: { marginHorizontal: 18, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radii.lg, overflow: "hidden" },
  menuRow: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14 },
  menuIcon: { width: 18, alignItems: "center" },
  menuTitle: { flex: 1, fontSize: 13.5, fontWeight: "600", color: colors.text },
  menuBadge: { fontSize: 12.5, color: colors.textMuted },
  menuDivider: { height: 1, backgroundColor: colors.divider, marginHorizontal: 14 },

  logoutButton: { marginHorizontal: 18, marginTop: 26, borderWidth: 1, borderColor: colors.border, borderRadius: radii.lg, paddingVertical: 14, alignItems: "center" },
  logoutText: { fontSize: 13.5, fontWeight: "700", color: colors.danger },
});
