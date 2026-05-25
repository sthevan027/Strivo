import { AlertCircle, AlertCircleIcon, HeartOff, Save, Settings2 } from 'lucide-react-native';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Modal, PanResponder, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface FeedOptionsProps {
  visible: boolean;
  onClose: () => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const FeedOptions = ({ visible, onClose }: FeedOptionsProps) => {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const [showInterestOptions, setShowInterestOptions] = React.useState(false);

  // Anima quando visible muda
  useEffect(() => {
    if (visible) {
      // Garante que começa de baixo e anima para cima
      translateY.setValue(SCREEN_HEIGHT);
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }).start();
    } else {
      // Quando fechar, reseta para baixo
      translateY.setValue(SCREEN_HEIGHT);
      setShowInterestOptions(false);
    }
  }, [visible, translateY]);

  const closeModal = () => {
    Animated.timing(translateY, {
      toValue: SCREEN_HEIGHT,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onClose();
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
    { id: 1, label: 'Salvar Conteúdo', icon: Save },
    { id: 2, label: 'Qualidade', icon: Settings2 },
    { id: 3, label: 'Não mostrar mais esse perfil', icon: AlertCircleIcon },
    { id: 4, label: 'Não tenho interesse ', icon: HeartOff },
    { id: 5, label: 'Denunciar Conteúdo', icon: AlertCircle },
  ];

  const interestReasons = [
    'O conteúdo é irrelevante',
    'Simplesmente não gostei',
    'Contém Ódio, Violência ou Bullying',
    'Conteúdo Adulto',
    'Outro Motivo',
  ];

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={closeModal}
      statusBarTranslucent
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
          </View>

          {/* Options */}
          <View style={styles.optionsContainer}>
            {!showInterestOptions ? (
              // Menu principal
              <>
                {mockItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <TouchableOpacity
                      key={item.id}
                      onPress={() => {
                        if (item.id === 4) {
                          // "Não tenho interesse" clicado
                          setShowInterestOptions(true);
                        } else {
                          console.log(`${item.label} clicado`);
                          closeModal();
                        }
                      }}
                      style={styles.optionButton}
                    >
                      <View style={styles.iconContainer}>
                        <Icon color="white" size={24} />
                      </View>
                      <Text style={styles.optionText}>{item.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </>
            ) : (
              // Submenu de motivos
              <>
                <Text style={styles.reasonTitle}>
                  <Text style={styles.reasonTitleBold}>Por que você não teve interesse neste conteúdo?</Text>
                </Text>
                {interestReasons.map((reason, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      console.log(`Motivo selecionado: ${reason}`);
                      closeModal();
                    }}
                    style={styles.reasonButton}
                  >
                    <Text style={styles.reasonText}>• {reason}</Text>
                  </TouchableOpacity>
                ))}
              </>
            )}
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
    paddingBottom: 20,
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
    paddingVertical: 16,
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
    backgroundColor: '#1F2937',
  },
  optionText: {
    color: 'white',
    fontSize: 18,
  },
  reasonTitle: {
    color: 'white',
    fontSize: 16,
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  reasonTitleBold: {
    fontWeight: 'bold',
  },
  reasonButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  reasonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default FeedOptions;