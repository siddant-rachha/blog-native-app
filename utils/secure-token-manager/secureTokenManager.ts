import * as SecureStore from "expo-secure-store";

let token: string | null = null;

const secureTokenStorage = {
  set: async (newToken: string | null) => {
    token = newToken;
    if (newToken) {
      await SecureStore.setItemAsync("authToken", newToken);
    } else {
      await SecureStore.deleteItemAsync("authToken");
    }
  },
  get: () => token,
  loadFromStorageToMemory: async () => {
    token = await SecureStore.getItemAsync("authToken");
    return token;
  },
};

export const secureTokenManager = {
  setToken: secureTokenStorage.set,
  getTokenFromMemory: secureTokenStorage.get,
  loadFromStorageToMemory: secureTokenStorage.loadFromStorageToMemory,
};
