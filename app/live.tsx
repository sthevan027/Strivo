import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useRef, useState } from 'react'
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native'

export default function LiveScreen() {
  const router = useRouter()
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([
    { user: 'joao', text: 'Boraaa 🔥' },
    { user: 'ana', text: 'Muito bom 👏' },
  ])

  const scrollRef = useRef<ScrollView>(null)

  function sendMessage() {
    if (!message.trim()) return

    setMessages([...messages, { user: 'você', text: message }])
    setMessage('')

    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true })
    }, 100)
  }

  return (
    <View style={styles.container}>

      {/* 🎥 VIDEO */}
      <View style={styles.video}>
        <Text style={{ color: '#555' }}>LIVE STREAM</Text>

        <View style={styles.overlayTop}>
          <View style={styles.liveBadge}>
            <Text style={styles.liveText}>LIVE</Text>
          </View>

          <View style={styles.viewers}>
            <Ionicons name="eye" size={14} color="#fff" />
            <Text style={styles.viewersText}>128</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.close} onPress={() => router.back()}>
          <Ionicons name="close" size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* 💬 CHAT */}
      <ScrollView
        ref={scrollRef}
        style={styles.chat}
        contentContainerStyle={{ paddingBottom: 10 }}
      >
        <Text style={styles.chatTitle}>Chat ao vivo</Text>

        {messages.map((msg, index) => (
          <View key={index} style={styles.msg}>
            <Text style={styles.user}>{msg.user}:</Text>
            <Text style={styles.text}> {msg.text}</Text>
          </View>
        ))}
      </ScrollView>

      {/* ✍️ INPUT */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Digite uma mensagem..."
          placeholderTextColor="#888"
          value={message}
          onChangeText={setMessage}
          style={styles.input}
        />

        <TouchableOpacity style={styles.send} onPress={sendMessage}>
          <Ionicons name="send" size={18} color="#000" />
        </TouchableOpacity>
      </View>

      {/* 🎛 CONTROLES */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="mic" size={22} color="#38c172" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="camera-reverse" size={22} color="#38c172" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.startBtn}>
          <Text style={styles.startText}>Iniciar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.endBtn}>
          <Text style={styles.endText}>Encerrar</Text>
        </TouchableOpacity>
      </View>

    </View>
  )
}

// 🎨 STYLES
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0B0B',
  },

  video: {
    height: 260,
    backgroundColor: '#1C1C1C',
    justifyContent: 'center',
    alignItems: 'center',
  },

  overlayTop: {
    position: 'absolute',
    top: 15,
    left: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },

  liveBadge: {
    backgroundColor: '#ff2e2e',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginRight: 10,
  },

  liveText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },

  viewers: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  viewersText: {
    color: '#fff',
    marginLeft: 5,
    fontSize: 12,
  },

  close: {
    position: 'absolute',
    top: 15,
    right: 15,
  },

  chat: {
    flex: 1,
    padding: 16,
  },

  chatTitle: {
    color: '#38c172',
    fontWeight: 'bold',
    marginBottom: 10,
  },

  msg: {
    flexDirection: 'row',
    marginBottom: 6,
  },

  user: {
    color: '#38c172',
    fontWeight: 'bold',
  },

  text: {
    color: '#fff',
  },

  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#222',
    backgroundColor: '#0B0B0B',
  },

  input: {
    flex: 1,
    backgroundColor: '#1C1C1C',
    borderRadius: 10,
    padding: 10,
    color: '#fff',
  },

  send: {
    marginLeft: 10,
    backgroundColor: '#38c172',
    padding: 10,
    borderRadius: 10,
  },

  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 14,
    backgroundColor: '#111',
  },

  iconBtn: {
    backgroundColor: '#1C1C1C',
    padding: 12,
    borderRadius: 50,
  },

  startBtn: {
    backgroundColor: '#38c172',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },

  startText: {
    color: '#000',
    fontWeight: 'bold',
  },

  endBtn: {
    backgroundColor: '#ff4d4d',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },

  endText: {
    color: '#fff',
    fontWeight: 'bold',
  },
})