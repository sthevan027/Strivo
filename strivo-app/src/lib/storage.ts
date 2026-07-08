import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const isWeb = Platform.OS === "web";
const hasLocalStorage = () => typeof localStorage !== "undefined";

export const storage = {
  getItem: (key: string): Promise<string | null> => {
    if (isWeb) {
      return Promise.resolve(hasLocalStorage() ? localStorage.getItem(key) : null);
    }
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string): Promise<void> => {
    if (isWeb) {
      if (hasLocalStorage()) localStorage.setItem(key, value);
      return Promise.resolve();
    }
    return SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string): Promise<void> => {
    if (isWeb) {
      if (hasLocalStorage()) localStorage.removeItem(key);
      return Promise.resolve();
    }
    return SecureStore.deleteItemAsync(key);
  },
};
