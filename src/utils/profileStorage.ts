// Usando uma abordagem simples com estado global ou podemos usar AsyncStorage depois
// Por enquanto, vamos usar um módulo simples para compartilhar estado

const PROFILE_STORAGE_KEY = '@strivo_profile_data';

// Armazenamento em memória (será substituído por AsyncStorage quando instalado)
let profileCache: ProfileData | null = null;

export interface ProfileData {
  username: string;
  name: string;
  bio: string;
  email: string;
  avatar: string;
  website?: string;
  youtube?: string;
  twitch?: string;
  instagram?: string;
  twitter?: string;
}

const defaultProfile: ProfileData = {
  username: 'rafafiguei',
  name: 'Rafa Figueiredo',
  bio: 'Criador de Conteúdo na Strivo',
  email: 'contato@strivo.com',
  avatar: 'https://avatars.githubusercontent.com/u/60237326?v=4',
  website: 'www.strivo.com',
  youtube: '',
  twitch: '',
  instagram: '',
  twitter: '',
};

export const saveProfileData = async (data: ProfileData): Promise<void> => {
  try {
    // Salvar em cache primeiro
    profileCache = { ...data };
    console.log('Salvando perfil no cache:', profileCache);
    
    // Tentar salvar no AsyncStorage se disponível
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const jsonData = JSON.stringify(data);
      await AsyncStorage.setItem(PROFILE_STORAGE_KEY, jsonData);
      console.log('Perfil salvo no AsyncStorage com sucesso');
      
      // Verificar se foi salvo corretamente
      const verify = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
      if (verify) {
        const verified = JSON.parse(verify);
        console.log('Perfil verificado após salvar:', verified);
      }
    } catch (e) {
      // AsyncStorage não disponível, usar apenas cache
      console.log('AsyncStorage não disponível, usando cache em memória:', e);
    }
  } catch (error) {
    console.error('Erro ao salvar perfil:', error);
    throw error;
  }
};

export const loadProfileData = async (): Promise<ProfileData> => {
  try {
    // Tentar carregar do AsyncStorage primeiro
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const data = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        profileCache = parsed;
        console.log('Perfil carregado do AsyncStorage:', parsed);
        return parsed;
      }
    } catch (e) {
      console.log('AsyncStorage não disponível, tentando cache:', e);
      // AsyncStorage não disponível, usar cache
      if (profileCache) {
        console.log('Perfil carregado do cache:', profileCache);
        return profileCache;
      }
    }
    
    // Se não houver dados salvos, retornar padrão
    console.log('Nenhum perfil salvo encontrado, retornando padrão');
    return defaultProfile;
  } catch (error) {
    console.error('Erro ao carregar perfil:', error);
    return profileCache || defaultProfile;
  }
};

export const clearProfileData = async (): Promise<void> => {
  try {
    profileCache = null;
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      await AsyncStorage.removeItem(PROFILE_STORAGE_KEY);
    } catch (e) {
      // AsyncStorage não disponível
    }
  } catch (error) {
    console.error('Erro ao limpar perfil:', error);
  }
};

