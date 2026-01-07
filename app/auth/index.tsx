// strivo-app/app/(auth)/register/index.tsx

import React, { useState } from 'react';
import { 
    StyleSheet, 
    Text, 
    View, 
    TextInput, 
    TouchableOpacity, 
    Alert,
    ActivityIndicator // Para mostrar o estado de carregamento
} from 'react-native';

// Importação do Supabase (Ajuste o caminho se necessário)
import { supabase } from '../../src/lib/supabase';
import { useNavigation } from 'expo-router';
// Tipagem de navegação necessária para o TypeScript
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

// --- DEFINIÇÃO DE TIPOS (Para o TypeScript) ---
type AuthStackParamList = {
    Login: undefined;
    Register: undefined;
    // Adicione outras rotas de autenticação aqui
};

type RegisterScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Register'>;


// --- COMPONENTE PRINCIPAL ---
export default function RegisterScreen() {
    const navigation = useNavigation<RegisterScreenNavigationProp>();
    
    // Estados do Formulário
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // --- FUNÇÃO DE CADASTRO ---
    async function handleSignUp() {
        if (!fullName || !email || !password) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos.');
            return;
        }

        setLoading(true);

        // 1. PRIMEIRA ETAPA: CRIAÇÃO DA CONTA (AUTH)
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: email,
            password: password,
        });

        if (authError) {
            setLoading(false);
            Alert.alert('Erro no Cadastro', authError.message);
            return;
        }

        // 2. SEGUNDA ETAPA: INSERÇÃO DO PERFIL (DATABASE 'profiles')
        if (authData.user) {
            const { error: profileError } = await supabase
                .from('profiles')
                .insert([{ 
                    id: authData.user.id, 
                    full_name: fullName 
                }]);
            
            if (profileError) {
                console.error("Erro ao salvar perfil:", profileError);
                Alert.alert('Aviso', 'Conta criada, mas houve um erro ao salvar seu nome completo.');
            }
        }
        
        setLoading(false);

        // Feedback e Redirecionamento
        Alert.alert(
            'Sucesso!', 
            'Cadastro realizado! Verifique seu e-mail para confirmar a conta.'
        );
        
        // Navega para a tela de Login
        navigation.navigate('Login'); 
    }
    
    return (
        <View style={styles.container}>
            <Text style={styles.logo}>S</Text>
            <Text style={styles.title}>Criar sua conta</Text>
            <Text style={styles.stepInfo}>Etapa 1 de 3: Informações Básicas</Text>

            <TextInput
                style={styles.input}
                placeholder="Nome Completo"
                placeholderTextColor="#888"
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
            />
            
            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#888"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="Senha"
                placeholderTextColor="#888"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
                autoCapitalize="none"
            />

            {/* Botão Continuar/Cadastrar */}
            <TouchableOpacity 
                style={[styles.button, loading && styles.buttonDisabled]} 
                onPress={handleSignUp}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#1a1a1a" />
                ) : (
                    <Text style={styles.buttonText}>Continuar</Text>
                )}
            </TouchableOpacity>

            {/* Link Já tem conta */}
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginText}>
                    Já tem conta? <Text style={styles.loginLink}>Entrar</Text>
                </Text>
            </TouchableOpacity>
        </View>
    );
}

// --- ESTILOS ---
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a1a', 
        padding: 30,
        alignItems: 'center',
    },
    logo: {
        fontSize: 60,
        fontWeight: 'bold',
        color: '#38c172', 
        marginTop: 50,
        marginBottom: 5,
    },
    title: {
        fontSize: 24,
        color: '#ffffff',
        marginBottom: 5,
        fontWeight: 'bold',
    },
    stepInfo: {
        color: '#aaaaaa',
        marginBottom: 30,
        fontSize: 16,
    },
    input: {
        width: '100%',
        padding: 15,
        backgroundColor: '#303030', 
        borderRadius: 5,
        color: '#ffffff',
        fontSize: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#444444',
    },
    button: {
        width: '100%',
        padding: 15,
        backgroundColor: '#38c172', 
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 25,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: '#1a1a1a', 
        fontSize: 18,
        fontWeight: 'bold',
    },
    loginText: {
        color: '#aaaaaa',
        fontSize: 14,
    },
    loginLink: {
        color: '#38c172',
        fontWeight: 'bold',
    }
});