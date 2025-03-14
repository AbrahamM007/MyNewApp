import AsyncStorage from '@react-native-async-storage/async-storage';

const StorageUtil = {
  // Save data to storage
  saveData: async (key, value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
      return true;
    } catch (e) {
      console.error('Error saving data', e);
      return false;
    }
  },

  // Load data from storage
  loadData: async (key) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.error('Error loading data', e);
      return null;
    }
  },

  // Initialize data if it doesn't exist
  initializeDataIfNeeded: async (key, initialData) => {
    const existingData = await StorageUtil.loadData(key);
    if (existingData === null) {
      await StorageUtil.saveData(key, initialData);
      return initialData;
    }
    return existingData;
  }
};

export default StorageUtil;