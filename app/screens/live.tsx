import {
  Heart,
  Mic,
  MicOff,
  Send,
  Video,
  VideoOff,
  X,
} from 'lucide-react-native'
import React, { useEffect, useRef, useState } from 'react'
import {
  Dimensions,
  FlatList,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { supabase } from '../../src/lib/supabase'

const APP_ID = 'SUA_APP_ID_AQUI'
const { height } = Dimensions.get('window')

export default function LiveScreen() {
  const engine = useRef<any>(null)

  const [isLive, setIsLive] = useState(false)
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')
  const [micOn, setMicOn] = useState(true)
  const [camOn, setCamOn] = useState(true)
  const [viewers, setViewers] = useState(0)

  const channelName = 'live_strivo'

  // 🎥 INICIAR LIVE
  const initAgora = async () => {
    // 🌐 WEB → SIMULAÇÃO
    if (Platform.OS === 'web') {
      setIsLive(true)
      setViewers(12)
      return
    }

    try {
      // ✅ IMPORT DINÂMICO (NÃO QUEBRA WEB)
      const AgoraModule = require('react-native-agora')
      const RtcEngine = AgoraModule.default

      engine.current = await RtcEngine.create(APP_ID)
      await engine.current.enableVideo()
      await engine.current.joinChannel(null, channelName, null, 0)

      setIsLive(true)
    } catch (err) {
      console.log('Erro Agora:', err)
    }
  }

  // ❌ SAIR DA LIVE
  const leaveLive = async () => {
    try {
      if (Platform.OS !== 'web' && engine.current) {
        await engine.current.leaveChannel()
      }
    } catch (err) {
      console.log(err)
    }

    setIsLive(false)
    setMessages([])
  }

  // 💬 CHAT REALTIME
  useEffect(() => {
    const channel = supabase
      .channel('live-chat')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const sendMessage = async () => {
    if (!input.trim()) return

    await supabase.from('messages').insert({
      text: input,
    })

    setInput('')
  }

  return (
    <SafeAreaView className="flex-1 bg-black">

      {/* VIDEO / PREVIEW */}
      <View className="flex-1 bg-zinc-900 items-center justify-center">
        <Text className="text-gray-500">
          {Platform.OS === 'web'
            ? '🔴 Preview da Live (Web)'
            : '🎥 Transmissão ao vivo'}
        </Text>
      </View>

      {/* HEADER */}
      {isLive && (
        <View
          style={{
            position: 'absolute',
            top: 20,
            left: 20,
            right: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <View className="bg-red-600 px-3 py-1 rounded-full">
            <Text className="text-white font-bold">
              🔴 AO VIVO • {viewers}
            </Text>
          </View>

          <TouchableOpacity onPress={leaveLive}>
            <X color="#fff" size={28} />
          </TouchableOpacity>
        </View>
      )}

      {/* CHAT */}
      {isLive && (
        <View
          style={{
            position: 'absolute',
            bottom: 120,
            left: 10,
            right: 10,
            maxHeight: height * 0.3,
          }}
        >
          <FlatList
            data={messages}
            keyExtractor={(item, i) =>
              item.id?.toString() || i.toString()
            }
            renderItem={({ item }) => (
              <Text style={{ color: '#fff', marginBottom: 4 }}>
                💬 {item.text}
              </Text>
            )}
          />
        </View>
      )}

      {/* INPUT CHAT */}
      {isLive && (
        <View
          style={{
            position: 'absolute',
            bottom: 70,
            left: 10,
            right: 10,
            flexDirection: 'row',
            gap: 10,
          }}
        >
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Comentar..."
            placeholderTextColor="#888"
            style={{
              flex: 1,
              backgroundColor: '#111',
              color: '#fff',
              borderRadius: 20,
              paddingHorizontal: 12,
              height: 40,
            }}
          />

          <TouchableOpacity onPress={sendMessage}>
            <Send color="#00FF40" size={24} />
          </TouchableOpacity>
        </View>
      )}

      {/* CONTROLES */}
      {isLive && (
        <View
          style={{
            position: 'absolute',
            bottom: 10,
            left: 0,
            right: 0,
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => setMicOn(!micOn)}
            className="bg-black/60 p-4 rounded-full"
          >
            {micOn ? (
              <Mic color="#fff" />
            ) : (
              <MicOff color="red" />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setCamOn(!camOn)}
            className="bg-black/60 p-4 rounded-full"
          >
            {camOn ? (
              <Video color="#fff" />
            ) : (
              <VideoOff color="red" />
            )}
          </TouchableOpacity>

          <TouchableOpacity className="bg-black/60 p-4 rounded-full">
            <Heart color="#ff4444" />
          </TouchableOpacity>
        </View>
      )}

      {/* BOTÃO INICIAR */}
      {!isLive && (
        <TouchableOpacity
          onPress={initAgora}
          style={{
            position: 'absolute',
            bottom: 40,
            left: 20,
            right: 20,
          }}
          className="bg-red-600 py-5 rounded-2xl items-center"
        >
          <Text className="text-white font-bold text-lg">
            🔴 Iniciar Live
          </Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  )
}