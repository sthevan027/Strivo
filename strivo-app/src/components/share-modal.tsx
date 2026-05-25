import { Copy, MessageCircle, Plus } from 'lucide-react-native';
import React from 'react';
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Contact {
  id: string;
  name: string;
  avatar: string;
  online: boolean;
}

interface ShareModalProps {
  visible: boolean;
  onClose: () => void;
  recentContacts?: Contact[];
}

const ShareModal = ({ visible, onClose, recentContacts = [] }: ShareModalProps) => {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
      hardwareAccelerated={true}
      statusBarTranslucent={true}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <SafeAreaView edges={['bottom']} style={styles.safeArea}>
          <TouchableOpacity
            style={styles.backdrop}
            activeOpacity={1}
            onPress={onClose}
          />
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.handle} />
              <Text style={styles.headerTitle}>Enviar para</Text>
            </View>

            {/* Recent Contacts */}
            <View style={styles.contactsContainer}>
              <FlatList
                data={recentContacts}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.contactsList}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.contactItem}>
                    <View style={styles.avatarContainer}>
                      <Image
                        source={{ uri: item.avatar }}
                        style={styles.avatar}
                      />
                      {item.online && (
                        <View style={styles.onlineIndicator} />
                      )}
                    </View>
                    <Text
                      style={styles.contactName}
                      numberOfLines={1}
                    >
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>

            {/* Share Options */}
            <View style={styles.shareOptions}>
              {/* WhatsApp */}
              <TouchableOpacity style={styles.shareButton}>
                <View style={styles.shareIconContainer}>
                  <MessageCircle size={28} color="#fff" />
                </View>
                <Text style={styles.shareLabel}>WhatsApp</Text>
              </TouchableOpacity>

              {/* Copiar Link */}
              <TouchableOpacity style={styles.shareButton}>
                <View style={styles.shareIconContainer}>
                  <Copy size={28} color="#fff" />
                </View>
                <Text style={styles.shareLabel}>Copiar Link</Text>
              </TouchableOpacity>

              {/* Status/Story */}
              <TouchableOpacity style={styles.shareButton}>
                <View style={styles.shareIconContainer}>
                  <Plus size={28} color="#fff" />
                </View>
                <Text style={styles.shareLabel}>Story</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  backdrop: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  handle: {
    width: 48,
    height: 6,
    backgroundColor: '#4B5563',
    borderRadius: 3,
    marginBottom: 12,
  },
  headerTitle: {
    color: 'white',
    fontWeight: '600',
    fontSize: 18,
  },
  contactsContainer: {
    paddingVertical: 20,
  },
  contactsList: {
    paddingHorizontal: 16,
  },
  contactItem: {
    alignItems: 'center',
    marginRight: 20,
    width: 70,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#374151',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#00FF40',
    borderWidth: 2,
    borderColor: '#1a1a1a',
  },
  contactName: {
    color: 'white',
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
  shareOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  shareButton: {
    alignItems: 'center',
    flex: 1,
  },
  shareIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#4B5563',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  shareLabel: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
  },
});

export default ShareModal;