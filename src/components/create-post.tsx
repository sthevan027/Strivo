
import { useRouter } from 'expo-router';
import { Clapperboard, Grid3x3, PlusCircleIcon, Video } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Modal, PanResponder, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CreateKlipScreen from './create/create-klip';
import StartLiveScreen from './create/start-live';


interface CreateModalProps {
  visible: boolean;
  onClose: () => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const CreateModal = ({ visible, onClose }: CreateModalProps) => {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const onCloseRef = useRef(onClose);
  const navigation = useRouter();
  
  // Estados para os modals
  const [showKlipModal, setShowKlipModal] = useState(false);
  const [showLiveModal, setShowLiveModal] = useState(false);
  
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
    { id: 1, icon: Clapperboard, label: 'Klips' },
    { id: 2, icon: Grid3x3, label: 'Post' },
    { id: 3, icon: PlusCircleIcon, label: 'Story' },
    { id: 4, icon: Video, label: 'Live' },
  ];

  const handleOptionPress = (label: string) => {
    closeModal(); // Fecha o modal principal primeiro
    
    // Pequeno delay para suavizar a transição
    setTimeout(() => {
      if (label === 'Klips') {
        setShowKlipModal(true);
      } else if (label === 'Story') {
        navigation.push('/screens/story-screen');
      } else if (label === 'Post') {
        navigation.push('/screens/create/create-post');
      } else if (label === 'Live') {
        setShowLiveModal(true);
      }
    }, 300);
  };

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="none"
        onRequestClose={closeModal}
      >
        <View style={styles.container}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={closeModal}
            style={styles.backdrop}
          />

          <Animated.View
            style={[
              styles.modalContent,
              {
                transform: [{ translateY }],
              },
            ]}
            {...panResponder.panHandlers}
          >
            <View style={styles.handleContainer}>
              <View style={styles.handle} />
            </View>

            <View style={styles.titleContainer}>
              <Text style={styles.title}>Criar</Text>
            </View>

            <View style={styles.optionsContainer}>
              {mockItems.map((item) => {
                const Icon = item.icon;
                return (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => handleOptionPress(item.label)}
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

      {/* Modals dos componentes */}
      <CreateKlipScreen 
        visible={showKlipModal} 
        onClose={() => setShowKlipModal(false)} 
      />
      
      <StartLiveScreen 
        visible={showLiveModal} 
        onClose={() => setShowLiveModal(false)} 
      />
    </>
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
    paddingHorizontal: 36,
    paddingBottom: 16,
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  optionsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  optionText: {
    color: 'white',
    fontSize: 18,
  },
});

export default CreateModal;