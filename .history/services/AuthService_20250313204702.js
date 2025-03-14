import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

const USERS_FILE = FileSystem.documentDirectory + 'users.json';
const CURRENT_USER_KEY = 'currentUser';

const AuthService = {
  // Initialize the users file if it doesn't exist
  initialize: async () => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(USERS_FILE);
      if (!fileInfo.exists) {
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
      return JSON.parse(content);
    } catch (error) {
      console.error('Error reading users:', error);
      return [];
    }
  },

  // Register a new user
  register: async (username, password, name, email) => {
    try {
      const users = await AuthService.getUsers();
      
      // Check if username already exists
      if (users.some(user => user.username === username)) {
        return { success: false, message: 'Username already exists' };
      }
      
      // Create new user
      const newUser = {
        id: Date.now().toString(),
        username,
        password, // In a real app, you should hash this password
        name,
        email,
        role: 'Student',
        bio: '',
        avatar: null,
        friends: [],
        clubs: [],
        createdAt: new Date().toISOString()
      };
      
      // Add user to users array
      users.push(newUser);
      
      // Save updated users array
      await FileSystem.writeAsStringAsync(USERS_FILE, JSON.stringify(users));
      
      // Return success
      return { success: true, user: { ...newUser, password: undefined } };
    } catch (error) {
      console.error('Error registering user:', error);
      return { success: false, message: 'Registration failed' };
    }
  },

  // Login user
  login: async (username, password) => {
    try {
      const users = await AuthService.getUsers();
      
      // Find user with matching username and password
      const user = users.find(u => u.username === username && u.password === password);
      
      if (!user) {
        return { success: false, message: 'Invalid username or password' };
      }
      
      // Store current user in AsyncStorage
      const userToStore = { ...user, password: undefined };
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userToStore));
      
      return { success: true, user: userToStore };
    } catch (error) {
      console.error('Error logging in:', error);
      return { success: false, message: 'Login failed' };
    }
  },

  // Get current logged in user
  getCurrentUser: async () => {
    try {
      const userJson = await AsyncStorage.getItem(CURRENT_USER_KEY);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
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

  // Update user profile
  updateProfile: async (userId, updates) => {
    try {
      const users = await AuthService.getUsers();
      const userIndex = users.findIndex(u => u.id === userId);
      
      if (userIndex === -1) {
        return { success: false, message: 'User not found' };
      }
      
      // Update user
      users[userIndex] = { ...users[userIndex], ...updates };
      
      // Save updated users array
      await FileSystem.writeAsStringAsync(USERS_FILE, JSON.stringify(users));
      
      // Update current user in AsyncStorage if it's the same user
      const currentUser = await AuthService.getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        const updatedUser = { ...users[userIndex], password: undefined };
        await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
      }
      
      return { success: true, user: { ...users[userIndex], password: undefined } };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { success: false, message: 'Profile update failed' };
    }
  }
};

export default AuthService;