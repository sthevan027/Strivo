import { useRouter } from 'expo-router';
import { Archive, ArrowLeft, Ban, Briefcase, CheckCircle, ChevronRight, Database, Download, Expand, Eye, FileQuestion, Image, MessageCircle, MessageSquare, Monitor, Palette, Share2, Zap } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface MenuItemProps {
  icon: React.ReactNode;
  title: string;
  badge?: string;
  onPress?: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, title, badge, onPress }) => (
  <TouchableOpacity 
    onPress={onPress}
    className="flex-row items-center justify-between px-4 py-3.5 active:bg-zinc-900"
  >
    <View className="flex-row items-center flex-1">
      <View className="mr-3">
        {icon}
      </View>
      <Text className="text-white text-base flex-1">{title}</Text>
    </View>
    <View className="flex-row items-center">
      {badge && (
        <Text className="text-zinc-400 text-sm mr-2">{badge}</Text>
      )}
      <ChevronRight size={20} color="#71717a" />
    </View>
  </TouchableOpacity>
);

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, children }) => (
  <View className="mt-6">
    <Text className="text-zinc-400 text-sm font-semibold px-4 mb-2">{title}</Text>
    <View className="bg-zinc-950">
      {children}
    </View>
  </View>
);

export default function Configuration() {
    const router = useRouter();
   
  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 bg-black border-b border-zinc-900">
        <TouchableOpacity className="mr-4" onPress={() => router.push('/screens/profile')}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-semibold">Configurações e atividade</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Suas Atividades */}
        <Section title="Suas Atividades">
          <MenuItem 
            icon={<Image size={24} color="#fff" />}
            title="Conteúdo Curtido"
            onPress={() => router.push('/screens/configs/liked-content')}
          />
          <MenuItem 
            icon={<Archive size={24} color="#fff" />}
            title="Itens Arquivados"
            onPress={() => router.push('/screens/configs/items-archived')}
          />
        </Section>

        {/* Seu conteúdo */}
        <Section title="Seu conteúdo">
          <MenuItem 
            icon={<Eye size={24} color="#fff" />}
            title="Privacidade da conta"
            onPress={() => router.push('/screens/configs/account-privacy')}
          />
          <MenuItem 
            icon={<Ban size={24} color="#fff" />}
            title="Lista de Bloqueio"
          />
          <MenuItem 
            icon={<Monitor size={24} color="#fff" />}
            title="Gerenciar Visualizações"
            onPress={() => router.push('/screens/configs/views-manage')}
          />
        </Section>

        {/* Quem pode interagir com você */}
        <Section title="Quem pode interagir com você">
          <MenuItem 
            icon={<MessageCircle size={24} color="#fff" />}
            title="Respostas ao Story"
          />
          <MenuItem 
            icon={<MessageSquare size={24} color="#fff" />}
            title="Comentários"
            onPress={() => router.push('/screens/configs/comments')}
          />
          <MenuItem 
            icon={<Share2 size={24} color="#fff" />}
            title="Compartilhamento"
            onPress={() => router.push('/screens/configs/comp-screen')}
          />
        </Section>

        {/* Como você navega */}
        <Section title="Como você navega">
          <MenuItem 
            icon={<Download size={24} color="#fff" />}
            title="Guardar e Baixar"
          />
          <MenuItem 
            icon={<Palette size={24} color="#fff" />}
            title="Tema e Introduções"
          />
          <MenuItem 
            icon={<Database size={24} color="#fff" />}
            title="Ajustes de dados e mídia"
          />
          <MenuItem 
            icon={<Zap size={24} color="#fff" />}
            title="Experiências Antecipadas"
          />
        </Section>


        {/* Suas métricas e ferramentas */}
        <Section title="Suas métricas e ferramentas">
          <MenuItem 
            icon={<CheckCircle size={24} color="#fff" />}
            title="Exibir selo de verificação no Perfil"
          />
          <MenuItem 
            icon={<Briefcase size={24} color="#fff" />}
            title="Categoria e opções da Conta"
          />
        </Section>

        <Section title="Aprimore a Strivo">
          <MenuItem 
            icon={<FileQuestion size={24} color="#fff" />}
            title="Enviar Sugestão"
          />
          <MenuItem 
            icon={<Expand size={24} color="#fff" />}
            title="Relatar Problema"
          />
        </Section>

        <Section title="Atualizações da Strivo">
          <MenuItem 
            icon={<Expand size={24} color="#fff" />}
            title="Experiência antecipada da Strivo"
          />
        </Section>

        <View className="h-8" />
        {/* Central de Conta */}
          <View className="mt-10 px-4">
            <Text className="text-white font-semibold text-base mb-3">
              Central de Conta
            </Text>

            {/* Criar Conta */}
            <TouchableOpacity
              className="py-3 rounded-xl items-center justify-center mb-3"
              onPress={() => {}}
            >
              <Text className="text-[#00ff9d] text-base font-semibold">
                Criar Conta
              </Text>
            </TouchableOpacity>

            {/* Sair da sua conta */}
            <TouchableOpacity
              className="py-3 rounded-xl items-center justify-center"
              onPress={() => console.log('logout')}
            >
              <Text className="text-red-500 text-base font-semibold">
                Sair da sua Conta
              </Text>
            </TouchableOpacity>
          </View>

      </ScrollView>
    </SafeAreaView>
  );
}