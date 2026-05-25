import * as Clipboard from 'expo-clipboard';
import { Link, Share2 } from 'lucide-react-native';
import React, { useEffect, useRef } from 'react';
import { Alert, Animated, Dimensions, Modal, PanResponder, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ShareProfileProps {
  visible: boolean;
  onClose: () => void;
  profileUrl?: string; // URL do perfil para compartilhar
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const ShareProfile = ({ visible, onClose, profileUrl = 'https://strivo.app/perfil/usuario' }: ShareProfileProps) => {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const onCloseRef = useRef(onClose);
  
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }).start();
    }
  }, [visible]);

  const closeModal = () => {
    Animated.timing(translateY, {
      toValue: SCREEN_HEIGHT,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      if (onCloseRef.current) {
        onCloseRef.current();
      }
    });
  };

  const handleCopyLink = async () => {
    try {
      await Clipboard.setStringAsync(profileUrl);
      Alert.alert('Sucesso', 'Link copiado para a área de transferência!');
      closeModal();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível copiar o link');
    }
  };

  const handleShareProfile = async () => {
    try {
      const result = await Share.share({
        message: `Confira meu perfil na Strivo: ${profileUrl}`,
        url: profileUrl,
      });
      
      if (result.action === Share.sharedAction) {
        closeModal();
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível compartilhar o perfil');
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100) {
          closeModal();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            tension: 50,
            friction: 8,
          }).start();
        }
      },
    })
  ).current;

  const mockItems = [
    { id: 1, icon: Link, label: 'Copiar Link', onPress: handleCopyLink },
    { id: 2, icon: Share2, label: 'Compartilhar Perfil', onPress: handleShareProfile },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={closeModal}
    >
      <View style={styles.container}>
        {/* Backdrop */}
        <TouchableOpacity
          activeOpacity={1}
          onPress={closeModal}
          style={styles.backdrop}
        />

        {/* Modal Content */}
        <Animated.View
          style={[
            styles.modalContent,
            {
              transform: [{ translateY }],
            },
          ]}
          {...panResponder.panHandlers}
        >
          {/* Handle bar */}
          <View style={styles.handleContainer}>
            <View style={styles.handle} />
          </View>

          {/* Title */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Compartilhar Perfil</Text>
          </View>

          {/* Options */}
          <View style={styles.optionsContainer}>
            {mockItems.map((item) => {
              const Icon = item.icon;
              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={item.onPress}
                  style={styles.optionButton}
                >
                  <View style={styles.iconContainer}>
                    <Icon color="white" size={24} />
                  </View>
                  <Text style={styles.optionText}>{item.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#171d25',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  handleContainer: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 16,
  },
  handle: {
    width: 48,
    height: 4,
    backgroundColor: '#4B5563',
    borderRadius: 2,
  },
  titleContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  optionsContainer: {
    paddingHorizontal: 0,
    paddingBottom: 32,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 0,
    borderRadius: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 0,
  },
  optionText: {
    color: 'white',
    fontSize: 18,
  },
});

export default ShareProfile;