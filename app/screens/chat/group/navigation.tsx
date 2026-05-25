import React, { useState } from 'react';
import AddMembersScreen from './add-members';
import NewGroupScreen from './new-group';

// Tipos de tela para simular a navegação interna
type GroupScreen = 'NEW_GROUP' | 'ADD_MEMBERS';

interface GroupNavigationProps {
  onClose: () => void; // Função para fechar o modal ou voltar para a tela de mensagens
}

const GroupNavigation: React.FC<GroupNavigationProps> = ({ onClose }) => {
  const [currentScreen, setCurrentScreen] = useState<GroupScreen>('NEW_GROUP');
  const [selectedMembers, setSelectedMembers] = useState<any[]>([]);

  const handleAdvanceFromMembers = (members: any[]) => {
    setSelectedMembers(members);
    // Aqui você faria a lógica para criar o grupo ou ir para a próxima etapa (ex: nome do grupo)
    console.log('Membros selecionados:', members);
    setCurrentScreen('NEW_GROUP'); // Volta para a tela de Novo Grupo após a seleção
    // Se a próxima etapa for a criação final, você chamaria onClose()
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'NEW_GROUP':
        return (
          <NewGroupScreen
            onBack={onClose} // Volta para a tela de mensagens
            onAddMembers={() => setCurrentScreen('ADD_MEMBERS')}
          />
        );
      case 'ADD_MEMBERS':
        return (
          <AddMembersScreen
            onCancel={() => setCurrentScreen('NEW_GROUP')} // Volta para a tela de Novo Grupo
            onAdvance={handleAdvanceFromMembers}
          />
        );
      default:
        return null;
    }
  };

  return renderScreen();
};

export default GroupNavigation;
