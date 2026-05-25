import React from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import GroupNavigation from './navigation';

interface NewGroupModalProps {
  visible: boolean;
  onClose: () => void;
}

const NewGroupModal: React.FC<NewGroupModalProps> = ({ visible, onClose }) => {
  return (
    <Modal
      visible={visible}
      transparent={false} // Usamos false para que a tela ocupe todo o espaço
      animationType="slide" // Animação de deslize para a nova tela
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <GroupNavigation onClose={onClose} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black', // Garante que o fundo seja preto
  },
});

export default NewGroupModal;
