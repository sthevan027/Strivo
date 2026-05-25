import { useRouter } from 'expo-router';
import { ArrowLeft, Eye, Heart, MessageCircle, Share2, TrendingUp, X } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface ContentMetric {
  id: string;
  type: 'post' | 'klip';
  thumbnail: string;
  caption: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  postedAt: string;
  viewsGrowth: number; // Porcentagem de crescimento
  engagement: number; // Taxa de engajamento
}

const MetricsScreen = () => {
  const [selectedContent, setSelectedContent] = useState<ContentMetric | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useRouter()
  // Dados mockados de conteúdo recente
  const recentContent: ContentMetric[] = [
    {
      id: '1',
      type: 'klip',
      thumbnail: 'https://picsum.photos/400/600?random=1',
      caption: 'Novo treino de hoje! 💪🔥',
      views: 145230,
      likes: 12450,
      comments: 432,
      shares: 234,
      postedAt: 'Há 2 horas',
      viewsGrowth: 89,
      engagement: 8.9
    },
    {
      id: '2',
      type: 'post',
      thumbnail: 'https://picsum.photos/400/400?random=2',
      caption: 'Momento especial ✨',
      views: 89450,
      likes: 8234,
      comments: 187,
      shares: 93,
      postedAt: 'Há 5 horas',
      viewsGrowth: 45,
      engagement: 9.5
    },
    {
      id: '3',
      type: 'klip',
      thumbnail: 'https://picsum.photos/400/600?random=3',
      caption: 'Tutorial completo 📚',
      views: 234120,
      likes: 18920,
      comments: 876,
      shares: 445,
      postedAt: 'Há 1 dia',
      viewsGrowth: 120,
      engagement: 8.6
    },
    {
      id: '4',
      type: 'post',
      thumbnail: 'https://picsum.photos/400/400?random=4',
      caption: 'Behind the scenes 🎬',
      views: 67890,
      likes: 5432,
      comments: 234,
      shares: 123,
      postedAt: 'Há 1 dia',
      viewsGrowth: 34,
      engagement: 8.4
    },
    {
      id: '5',
      type: 'klip',
      thumbnail: 'https://picsum.photos/400/600?random=5',
      caption: 'Dica rápida! ⚡',
      views: 312450,
      likes: 24560,
      comments: 1234,
      shares: 678,
      postedAt: 'Há 2 dias',
      viewsGrowth: 156,
      engagement: 8.3
    },
    {
      id: '6',
      type: 'post',
      thumbnail: 'https://picsum.photos/400/400?random=6',
      caption: 'Gratidão 🙏',
      views: 54320,
      likes: 4567,
      comments: 145,
      shares: 67,
      postedAt: 'Há 2 dias',
      viewsGrowth: 28,
      engagement: 8.8
    }
  ];

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const handleContentClick = (content: ContentMetric) => {
    setSelectedContent(content);
    setModalVisible(true);
  };

  // Calcular totais dos últimos 7 dias
  const totalViews = recentContent.reduce((acc, item) => acc + item.views, 0);
  const totalLikes = recentContent.reduce((acc, item) => acc + item.likes, 0);
  const totalComments = recentContent.reduce((acc, item) => acc + item.comments, 0);
  const avgEngagement = (recentContent.reduce((acc, item) => acc + item.engagement, 0) / recentContent.length).toFixed(1);

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-black">
      <View className="flex-1 bg-black">
        {/* Header */}
        <View className="px-6 py-4 border-b border-gray-800">
          <View className="flex-row items-center justify-between mb-6">
            <TouchableOpacity onPress={() => navigation.push('/screens/profile')}>
              <ArrowLeft size={28} color="#fff" />
            </TouchableOpacity>
            <Text className="text-white text-2xl font-bold">Métricas</Text>
            <View style={{ width: 28 }} />
          </View>

          {/* Cards de Resumo */}
          <View className="flex-row justify-between mb-4">
            <View className="flex-1 bg-[#1a1a1a] rounded-xl p-4 mr-2">
              <Eye size={20} color="#00FF40" className="mb-2" />
              <Text className="text-white text-xl font-bold">{formatNumber(totalViews)}</Text>
              <Text className="text-gray-400 text-xs">Visualizações</Text>
            </View>
            <View className="flex-1 bg-[#1a1a1a] rounded-xl p-4 ml-2">
              <TrendingUp size={20} color="#00FF40" className="mb-2" />
              <Text className="text-white text-xl font-bold">{avgEngagement}%</Text>
              <Text className="text-gray-400 text-xs">Engajamento</Text>
            </View>
          </View>

          <View className="flex-row justify-between">
            <View className="flex-1 bg-[#1a1a1a] rounded-xl p-4 mr-2">
              <Heart size={20} color="#00FF40" className="mb-2" />
              <Text className="text-white text-xl font-bold">{formatNumber(totalLikes)}</Text>
              <Text className="text-gray-400 text-xs">Curtidas</Text>
            </View>
            <View className="flex-1 bg-[#1a1a1a] rounded-xl p-4 ml-2">
              <MessageCircle size={20} color="#00FF40" className="mb-2" />
              <Text className="text-white text-xl font-bold">{formatNumber(totalComments)}</Text>
              <Text className="text-gray-400 text-xs">Comentários</Text>
            </View>
          </View>
        </View>

        {/* Conteúdo Recente */}
        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
          <View className="px-6 py-4">
            <Text className="text-white text-xl font-bold mb-4">Conteúdo Recente</Text>
            
            {recentContent.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => handleContentClick(item)}
                className="bg-[#1a1a1a] rounded-xl mb-3 overflow-hidden"
                activeOpacity={0.7}
              >
                <View className="flex-row">
                  {/* Thumbnail */}
                  <View className="relative">
                    <Image
                      source={{ uri: item.thumbnail }}
                      style={{ width: 120, height: 120 }}
                      resizeMode="cover"
                    />
                    {item.type === 'klip' && (
                      <View className="absolute top-2 left-2 bg-black/60 rounded-full px-2 py-1">
                        <Text className="text-white text-xs font-bold">KLIP</Text>
                      </View>
                    )}
                  </View>

                  {/* Info */}
                  <View className="flex-1 p-4 justify-between">
                    <View>
                      <Text className="text-white font-semibold mb-1" numberOfLines={2}>
                        {item.caption}
                      </Text>
                      <Text className="text-gray-400 text-xs mb-3">{item.postedAt}</Text>
                    </View>

                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center">
                        <Eye size={16} color="#00FF40" />
                        <Text className="text-white font-bold ml-1">{formatNumber(item.views)}</Text>
                      </View>
                      <View className="flex-row items-center">
                        <Heart size={16} color="#999" />
                        <Text className="text-gray-400 ml-1">{formatNumber(item.likes)}</Text>
                      </View>
                      <View className="flex-row items-center">
                        <MessageCircle size={16} color="#999" />
                        <Text className="text-gray-400 ml-1">{formatNumber(item.comments)}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Growth Badge */}
                  <View className="absolute top-2 right-2 bg-green-500/20 rounded-full px-2 py-1">
                    <Text className="text-green-500 text-xs font-bold">+{item.viewsGrowth}%</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Modal de Detalhes */}
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={false}
          onRequestClose={() => setModalVisible(false)}
        >
          
          <SafeAreaView edges={['top']} className="flex-1 bg-black">
            <View className="flex-1">
              {/* Header do Modal */}
              <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-800">
                <Text className="text-white text-xl font-bold">Detalhes</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <X size={28} color="#fff" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                {selectedContent && (
                  <View>
                    {/* Imagem */}
                    <Image
                      source={{ uri: selectedContent.thumbnail }}
                      style={{ width, height: selectedContent.type === 'klip' ? width * 1.5 : width }}
                      resizeMode="cover"
                    />

                    {/* Info */}
                    <View className="p-6">
                      <Text className="text-white text-lg font-semibold mb-2">
                        {selectedContent.caption}
                      </Text>
                      <Text className="text-gray-400 mb-6">{selectedContent.postedAt}</Text>

                      {/* Métricas Principais */}
                      <View className="bg-[#1a1a1a] rounded-xl p-4 mb-4">
                        <Text className="text-white font-bold text-lg mb-4">Desempenho</Text>
                        
                        <View className="flex-row justify-between items-center mb-4 pb-4 border-b border-gray-800">
                          <View className="flex-row items-center">
                            <Eye size={24} color="#00FF40" />
                            <Text className="text-gray-400 ml-3">Visualizações</Text>
                          </View>
                          <View className="items-end">
                            <Text className="text-white font-bold text-xl">{formatNumber(selectedContent.views)}</Text>
                            <Text className="text-green-500 text-xs">+{selectedContent.viewsGrowth}%</Text>
                          </View>
                        </View>

                        <View className="flex-row justify-between items-center mb-4 pb-4 border-b border-gray-800">
                          <View className="flex-row items-center">
                            <Heart size={24} color="#ff4444" />
                            <Text className="text-gray-400 ml-3">Curtidas</Text>
                          </View>
                          <Text className="text-white font-bold text-xl">{formatNumber(selectedContent.likes)}</Text>
                        </View>

                        <View className="flex-row justify-between items-center mb-4 pb-4 border-b border-gray-800">
                          <View className="flex-row items-center">
                            <MessageCircle size={24} color="#4488ff" />
                            <Text className="text-gray-400 ml-3">Comentários</Text>
                          </View>
                          <Text className="text-white font-bold text-xl">{formatNumber(selectedContent.comments)}</Text>
                        </View>

                        <View className="flex-row justify-between items-center">
                          <View className="flex-row items-center">
                            <Share2 size={24} color="#00FF40" />
                            <Text className="text-gray-400 ml-3">Compartilhamentos</Text>
                          </View>
                          <Text className="text-white font-bold text-xl">{formatNumber(selectedContent.shares)}</Text>
                        </View>
                      </View>

                      {/* Engajamento */}
                      <View className="bg-[#1a1a1a] rounded-xl p-4">
                        <Text className="text-white font-bold text-lg mb-3">Taxa de Engajamento</Text>
                        <View className="items-center">
                          <Text className="text-[#00FF40] font-bold text-4xl mb-2">{selectedContent.engagement}%</Text>
                          <Text className="text-gray-400 text-sm">Acima da média da sua conta</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                )}
              </ScrollView>
            </View>
          </SafeAreaView>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default MetricsScreen;