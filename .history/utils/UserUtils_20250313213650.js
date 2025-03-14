import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthService from '../services/AuthService';

const USERS_KEY = 'users'; // This should match the key used in your AuthService

const UserUtils = {
  getAllUsers: async () => {
    try {
      const usersData = await AsyncStorage.getItem(USERS_KEY);
      if (!usersData) {
        return [];
      }
      return JSON.parse(usersData);
    } catch (error) {
      console.error('Error retrieving users:', error);
      return [];
    }
  },
  
  printAllUsers: async () => {
    try {
      const users = await UserUtils.getAllUsers();
      console.log('=== All Registered Users ===');
      if (users.length === 0) {
        console.log('No users found');
      } else {
        users.forEach((user, index) => {
          console.log(`User ${index + 1}:`);
          console.log(`  ID: ${user.id}`);
          console.log(`  Name: ${user.name}`);
          console.log(`  Email: ${user.email}`);
          console.log(`  Created: ${new Date(user.createdAt).toLocaleString()}`);
          console.log('-------------------');
        });
        console.log(`Total users: ${users.length}`);
      }
      return users;
    } catch (error) {
      console.error('Error printing users:', error);
      return [];
    }
  },
  
  createDefaultAccount: async () => {
    try {
      // Check if default account already exists
      const users = await UserUtils.getAllUsers();
      const defaultEmail = 'admin@example.com';
      
      const defaultAccountExists = users.some(user => user.email === defaultEmail);
      
      if (!defaultAccountExists) {
        // Create default account directly in AsyncStorage
        const defaultUser = {
          id: 'user1',
          email: defaultEmail,
          password: 'password123', // In a real app, this should be hashed
          name: 'AdminUser',
          createdAt: new Date().toISOString(),
          profilePicture: null,
          clubs: [],
          rsvps: []
        };
        
        // Add the user to the users array
        users.push(defaultUser);
        
        // Save the updated users array
        await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
        
        console.log('Default account created successfully');
        return { success: true, message: 'Default account created', credentials: {
          email: defaultEmail,
          password: 'password123'
        }};
      } else {
        console.log('Default account already exists');
        return { 
          success: true, 
          message: 'Default account already exists',
          credentials: {
            email: defaultEmail,
            password: 'password123'
          }
        };
      }
    } catch (error) {
      console.error('Error creating default account:', error);
      return { success: false, error };
    }
  }
};

export default UserUtils;