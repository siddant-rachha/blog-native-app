import AsyncStorage from "@react-native-async-storage/async-storage";

type StorageKeys = {
  authToken: string;
  userId: string;
  // add more keys as needed
};

class Storage {
  async setItem<K extends keyof StorageKeys>(key: K, value: StorageKeys[K]) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error saving ${key}:`, e);
    }
  }

  async getItem<K extends keyof StorageKeys>(
    key: K
  ): Promise<StorageKeys[K] | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? (JSON.parse(value) as StorageKeys[K]) : null;
    } catch (e) {
      console.error(`Error reading ${key}:`, e);
      return null;
    }
  }

  async removeItem<K extends keyof StorageKeys>(key: K) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.error(`Error removing ${key}:`, e);
    }
  }

  async clear() {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      console.error("Error clearing storage:", e);
    }
  }
}

export const storage = new Storage();

// Usage example:
// await storage.setItem("authToken", "your_token_here");
// const token = await storage.getItem("authToken");
// await storage.removeItem("authToken");
// await storage.clear();
