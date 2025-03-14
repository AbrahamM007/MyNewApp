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
      
      // Validate existing file contains valid JSON array
      try {
        const content = await FileSystem.readAsStringAsync(USERS_FILE);
        const users = JSON.parse(content);
        if (!Array.isArray(users)) {
          // Reset file if not a valid array
          await FileSystem.writeAsStringAsync(USERS_FILE, JSON.stringify([]));
        }
      } catch (parseError) {
        // Reset file if JSON is invalid
        await FileSystem.writeAsStringAsync(USERS_FILE, JSON.stringify([]));
      }
    } catch (error) {
      console.error('Error initializing users file:', error);
      // Create the file anyway as a fallback
      await FileSystem.writeAsStringAsync(USERS_FILE, JSON.stringify([]));
    }
  },
  
  // Get all users
  getUsers: async () => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(USERS_FILE);
      if (!fileInfo.exists) {
        await AuthService.initialize();
        return [];
      }
      
      const content = await FileSystem.readAsStringAsync(USERS_FILE);
      const users = JSON.parse(content);
      return Array.isArray(users) ? users : [];
    } catch (error) {
      console.error('Error reading users:', error);
      return [];
    }
  },
  
  // Register a new user
  register: async (userData) => {
    if (!userData || !userData.username || !userData.password || !userData.name) {
      return { success: false, message: 'Missing required user information' };
    }
    
    try {
      // Initialize if needed
      await AuthService.initialize();
      
      // Get existing users
      let users = await AuthService.getUsers();
      
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
        username: userData.username,
        password: userData.password,
        name: userData.name,
        email: userData.email || '',
        bio: userData.bio || '',
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
      return { success: false, message: 'Registration failed: ' + error.message };
    }
  },
  
  // Login user
  login: async (username, password) => {
    if (!username || !password) {
      return { success: false, message: 'Username and password are required' };
    }
    
    try {
      // Initialize if needed
      await AuthService.initialize();
      
      const users = await AuthService.getUsers();
      
      // Find user with matching credentials
      const user = users.find(user => 
        user && user.username && user.password &&
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
      return { success: false, message: 'Login failed: ' + error.message };
    }
  },
  
  // Logout user
  logout: async () => {
    try {
      await AsyncStorage.removeItem(CURRENT_USER_KEY);
      return { success: true };
    } catch (error) {
      console.error('Error logging out:', error);
      return { success: false, message: 'Logout failed: ' + error.message };
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
    if (!userId) {
      return { success: false, message: 'User ID is required' };
    }
    
    try {
      // Initialize if needed
      await AuthService.initialize();
      
      const users = await AuthService.getUsers();
      const userIndex = users.findIndex(u => u && u.id === userId);
      
      if (userIndex === -1) {
        return { success: false, message: 'User not found' };
      }
      
      // Update user (excluding sensitive fields)
      const { password, ...safeUpdates } = updates;
      const updatedUser = { ...users[userIndex], ...safeUpdates };
      
      // Only update password if explicitly provided
      if (password) {
        updatedUser.password = password;
      }
      
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
      return { success: false, message: 'Failed to update profile: ' + error.message };
    }
  },
  
  // Delete user account
  deleteAccount: async (userId) => {
    if (!userId) {
      return { success: false, message: 'User ID is required' };
    }
    
    try {
      // Initialize if needed
      await AuthService.initialize();
      
      const users = await AuthService.getUsers();
      const updatedUsers = users.filter(u => u && u.id !== userId);
      
      // Save updated users array
      await FileSystem.writeAsStringAsync(USERS_FILE, JSON.stringify(updatedUsers));
      
      // Remove from current user if it's the same user
      const currentUser = await AuthService.getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        await AsyncStorage.removeItem(CURRENT_USER_KEY);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting account:', error);
      return { success: false, message: 'Failed to delete account: ' + error.message };
    }
  }
};

export default AuthService;