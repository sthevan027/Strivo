// components/AccountSwitcher.tsx
import { Check, Plus } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Animated,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export interface Account {
  id: string;
  username: string;
  avatar: string;
  isActive: boolean;
}

export interface AccountSwitcherProps {
  visible: boolean;
  onClose: () => void;
  currentAccount: Account;
  accounts: Account[];
  onSwitchAccount: (accountId: string) => void;
  onAddAccount: () => void;
}

export default function AccountSwitcher({
  visible,
  onClose,
  currentAccount,
  accounts,
  onSwitchAccount,
  onAddAccount,
}: AccountSwitcherProps) {
  const [scaleAnim] = useState(new Animated.Value(0));

  React.useEffect(() => {
    if (visible) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();
    } else {
      scaleAnim.setValue(0);
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Animated.View
          style={[
            styles.container,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Alternar conta</Text>
          </View>

          {/* Conta Atual */}
          <View style={styles.currentAccountSection}>
            <View style={styles.accountItem}>
              <View style={styles.accountInfo}>
                <View style={styles.avatarContainer}>
                  <Image
                    source={{ uri: currentAccount.avatar }}
                    style={styles.avatar}
                  />
                  <View style={styles.activeIndicator}>
                    <Check color="#000" size={12} strokeWidth={3} />
                  </View>
                </View>
                <View style={styles.accountDetails}>
                  <Text style={styles.username}>{currentAccount.username}</Text>
                  <Text style={styles.activeLabel}>Conta ativa</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Divisória */}
          <View style={styles.divider} />

          {/* Outras Contas */}
          <View style={styles.accountsSection}>
            <Text style={styles.sectionTitle}>Suas contas</Text>
            {accounts
              .filter((acc) => acc.id !== currentAccount.id)
              .map((account, index) => (
                <React.Fragment key={account.id}>
                  <TouchableOpacity
                    style={styles.accountItem}
                    onPress={() => {
                      onSwitchAccount(account.id);
                      onClose();
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={styles.accountInfo}>
                      <Image
                        source={{ uri: account.avatar }}
                        style={styles.avatar}
                      />
                      <Text style={styles.username}>{account.username}</Text>
                    </View>
                  </TouchableOpacity>
                  
                  {/* Divisória entre contas */}
                  {index < accounts.filter(a => a.id !== currentAccount.id).length - 1 && (
                    <View style={styles.accountDivider} />
                  )}
                </React.Fragment>
              ))}
          </View>

          {/* Divisória antes de adicionar */}
          <View style={styles.divider} />

          {/* Adicionar Conta */}
          <TouchableOpacity
            style={styles.addAccountButton}
            onPress={() => {
              onAddAccount();
              onClose();
            }}
            activeOpacity={0.7}
          >
            <View style={styles.addIconContainer}>
              <Plus color="#00FF40" size={24} strokeWidth={2.5} />
            </View>
            <Text style={styles.addAccountText}>Adicionar conta</Text>
          </TouchableOpacity>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'flex-end',
    paddingBottom: 80, // Espaço para a tab bar
  },
  container: {
    backgroundColor: '#1a1a1a',
    marginHorizontal: 12,
    marginBottom: 8,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#00FF40',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#0a0a0a',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  currentAccountSection: {
    paddingVertical: 12,
    backgroundColor: '#0f0f0f',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  accountsSection: {
    paddingVertical: 12,
  },
  accountItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  accountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#00FF40',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#00FF40',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1a1a1a',
  },
  accountDetails: {
    marginLeft: 14,
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 14,
  },
  activeLabel: {
    fontSize: 13,
    color: '#00FF40',
    marginTop: 2,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#2a2a2a',
    marginHorizontal: 20,
  },
  accountDivider: {
    height: 1,
    backgroundColor: '#252525',
    marginLeft: 82, // Alinha com o texto (após avatar + margin)
    marginRight: 20,
  },
  addAccountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#0a0a0a',
  },
  addIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#00FF40',
    borderStyle: 'dashed',
  },
  addAccountText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00FF40',
    marginLeft: 14,
  },
});

// Exemplo de uso no componente principal
export function ExampleUsage() {
  const [showSwitcher, setShowSwitcher] = useState(false);
  const [currentAccount, setCurrentAccount] = useState<Account>({
    id: '1',
    username: 'flavio.zrx',
    avatar: 'https://avatars.githubusercontent.com/u/60237326?v=4',
    isActive: true,
  });

  const accounts: Account[] = [
    currentAccount,
    {
      id: '2',
      username: 'strivobrasil',
      avatar: 'https://i.pravatar.cc/150?img=2',
      isActive: false,
    },
    {
      id: '3',
      username: 'nexo.aii',
      avatar: 'https://i.pravatar.cc/150?img=3',
      isActive: false,
    },
    {
      id: '4',
      username: 'fluxo.aii',
      avatar: 'https://i.pravatar.cc/150?img=4',
      isActive: false,
    },
  ];

  return (
    <View style={{ flex: 1 }}>
      <AccountSwitcher
        visible={showSwitcher}
        onClose={() => setShowSwitcher(false)}
        currentAccount={currentAccount}
        accounts={accounts}
        onSwitchAccount={(accountId) => {
          const account = accounts.find((a) => a.id === accountId);
          if (account) {
            setCurrentAccount(account);
            console.log('Trocou para:', account.username);
          }
        }}
        onAddAccount={() => {
          console.log('Adicionar nova conta');
        }}
      />
    </View>
  );
}