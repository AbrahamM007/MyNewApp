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
        // Create default admin account
        const initialUsers = {
          admin: {
            id: 'admin',
            username: 'admin',
            password: 'schurr2023', // You should use a more secure method in production
            role: 'admin',
            name: 'Admin',
            bio: 'School Administrator',
            avatar: null
          }
        };
        await FileSystem.writeAsStringAsync(USERS_FILE, JSON.stringify(initialUsers));
      }
    } catch (error) {
      console.error('Error initializing auth service:', error);
    }
  },

  // Get all users
  getUsers: async () => {
    try {
      const content = await FileSystem.readAsStringAsync(USERS_FILE);
      return JSON.parse(content);
    } catch (error) {
      console.error('Error getting users:', error);
      return {};
    }
  },

  // Register a new user
  register: async (username, password, name) => {
    try {
      const users = await AuthService.getUsers();
      
      // Check if username already exists
      if (users[username]) {
        return { success: false, message: 'Username already exists' };
      }
      
      // Create new user
      const newUser = {
        id: username,
        username,
        password, // In a real app, you should hash this password
        role: 'student',
        name,
        bio: '',
        avatar: null,
        friends: [],
        clubs: []
      };
      
      users[username] = newUser;
      await FileSystem.writeAsStringAsync(USERS_FILE, JSON.stringify(users));
      
      // Auto login after registration
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
      
      return { success: true, user: newUser };
    } catch (error) {
      console.error('Error registering user:', error);
      return { success: false, message: 'Registration failed' };
    }
  },

  // Login user
  login: async (username, password, isAdmin = false) => {
    try {
      const users = await AuthService.getUsers();
      const user = users[username];
      
      // Check if user exists and password matches
      if (!user || user.password !== password) {
        return { success: false, message: 'Invalid username or password' };
      }
      
      // Check if admin access is requested but user is not admin
      if (isAdmin && user.role !== 'admin') {
        return { success: false, message: 'You do not have admin privileges' };
      }
      
      // Store current user in AsyncStorage
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      
      return { success: true, user };
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
      return true;
    } catch (error) {
      console.error('Error logging out:', error);
      return false;
    }
  }
};

export default AuthService;