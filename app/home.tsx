import { useRouter } from 'expo-router';
import { MessageCircle } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { supabase } from '../src/lib/supabase';

export default function Feed() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);

  // 🔥 BUSCAR USUÁRIOS
  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, nome, avatar_url');

    if (error) {
      console.error('ERRO:', error);
    } else {
      setUsers(data || []);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <StatusBar barStyle="light-content" />

      {/* HEADER */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 10,
        }}
      >
        {/* ESQUERDA */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {/* BOTÃO + */}
          <TouchableOpacity
            onPress={() => router.push('/screens/create-post')}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: '#7FFF00',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 10,
            }}
          >
            <Text style={{ color: '#000', fontSize: 22, fontWeight: 'bold' }}>
              +
            </Text>
          </TouchableOpacity>

          {/* LOGO */}
          <Text style={{ color: '#7FFF00', fontSize: 26, fontWeight: 'bold' }}>
            Strivo
          </Text>
        </View>

        {/* CHAT */}
        <TouchableOpacity
          onPress={() => router.push('/screens/chat/message-screen')}
        >
          <MessageCircle color="#fff" size={26} />
        </TouchableOpacity>
      </View>

      {/* STORIES */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ paddingVertical: 10, paddingHorizontal: 10 }}
      >
        {users.length === 0 ? (
          <Text style={{ color: '#fff' }}>Nenhum usuário</Text>
        ) : (
          users.map((user) => (
            <TouchableOpacity
              key={user.id}
              onPress={() =>
                router.push(`/screens/profile?userId=${user.id}`)
              }
              style={{ alignItems: 'center', marginHorizontal: 8 }}
            >
              {/* CÍRCULO VERDE */}
              <View
                style={{
                  borderWidth: 2,
                  borderColor: '#00FF40',
                  borderRadius: 40,
                  padding: 2,
                }}
              >
                <Image
                  source={{
                    uri:
                      user.avatar_url ||
                      'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
                  }}
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                  }}
                />
              </View>

              {/* NOME */}
              <Text
                style={{
                  color: '#fff',
                  fontSize: 12,
                  marginTop: 4,
                  maxWidth: 70,
                  textAlign: 'center',
                }}
                numberOfLines={1}
              >
                {user.nome || 'Sem nome'}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}