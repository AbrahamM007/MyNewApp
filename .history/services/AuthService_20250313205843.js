import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS_FILE = FileSystem.documentDirectory + 'users.json';
const CURRENT_USER_KEY = 'currentUser';

const AuthService = {
  // Initialize users file
  initialize: async () => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(USERS_FILE);
      if (!fileInfo.exists) {
        // Create empty users array if file doesn't exist
        await FileSystem.writeAsStringAsync(USERS_FILE, JSON.stringify([]));
      }
    } catch (error) {
      console.error('Error initializing users file:', error);
    }
  },
  
  // Get all users
  getUsers: async () => {
    try {
      const content = await FileSystem.readAsStringAsync(USERS_FILE);
      return JSON.parse(content) || [];
    } catch (error) {
      console.error('Error reading users:', error);
      return [];
    }
  },
  
  // Register a new user
  register: async (userData) => {
    try {
      // Get existing users
      let users = await AuthService.getUsers();
      
      // Ensure users is an array
      if (!Array.isArray(users)) {
        users = [];
      }
      
      // Check if username already exists
      const usernameExists = users.some(user => 
        user && user.username && 
        user.username.toLowerCase() === userData.username.toLowerCase()
      );
      
      if (usernameExists) {
        return { success: false, message: 'Username already exists' };
      }
      
      // Create new user
      const newUser = {
        id: `user_${Date.now()}`,
        ...userData,
        role: userData.role || 'student',
        createdAt: new Date().toISOString(),
        clubs: [],
        rsvps: [],
        friends: []
      };
      
      // Add user to array
      users.push(newUser);
      
      // Save updated users array
      await FileSystem.writeAsStringAsync(USERS_FILE, JSON.stringify(users));
      
      // Set as current user
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
      
      return { success: true, user: newUser };
    } catch (error) {
      console.error('Error registering user:', error);
      return { success: false, message: error.toString() };
    }
  },
  
  // Login user
  login: async (username, password) => {
    try {
      const users = await AuthService.getUsers();
      
      // Find user with matching credentials
      const user = users.find(user => 
        user && user.username && 
        user.username.toLowerCase() === username.toLowerCase() && 
        user.password === password
      );
      
      if (!user) {
        return { success: false, message: 'Invalid username or password' };
      }
      
      // Set as current user
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      
      return { success: true, user };
    } catch (error) {
      console.error('Error logging in:', error);
      return { success: false, message: 'Login failed' };
    }
  },
  
  // Logout user
  logout: async () => {
    try {
      await AsyncStorage.removeItem(CURRENT_USER_KEY);
      return { success: true };
    } catch (error) {
      console.error('Error logging out:', error);
      return { success: false, message: 'Logout failed' };
    }
  },
  
  // Get current user
  getCurrentUser: async () => {
    try {
      const userJson = await AsyncStorage.getItem(CURRENT_USER_KEY);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },
  
  // Update user profile
  updateProfile: async (userId, updates) => {
    try {
      const users = await AuthService.getUsers();
      const userIndex = users.findIndex(u => u.id === userId);
      
      if (userIndex === -1) {
        return { success: false, message: 'User not found' };
      }
      
      // Update user
      const updatedUser = { ...users[userIndex], ...updates };
      users[userIndex] = updatedUser;
      
      // Save updated users array
      await FileSystem.writeAsStringAsync(USERS_FILE, JSON.stringify(users));
      
      // Update current user if it's the same user
      const currentUser = await AuthService.getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
      }
      
      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { success: false, message: 'Failed to update profile' };
    }
  }
};

export default AuthService;