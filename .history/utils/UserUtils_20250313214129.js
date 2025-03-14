import * as FileSystem from 'expo-file-system';
import AuthService from '../services/AuthService';

const USERS_FILE = FileSystem.documentDirectory + 'users.json';

const UserUtils = {
  getAllUsers: async () => {
    return await AuthService.getUsers();
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
          console.log(`  Username: ${user.username}`);
          console.log(`  Name: ${user.name}`);
          console.log(`  Email: ${user.email || 'N/A'}`);
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
      const defaultUsername = 'admin';
      
      const defaultAccountExists = users.some(user => 
        user && user.username && 
        user.username.toLowerCase() === defaultUsername.toLowerCase()
      );
      
      if (!defaultAccountExists) {
        // Create default account using AuthService
        const defaultUser = {
          username: defaultUsername,
          password: 'password123',
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin'
        };
        
        const result = await AuthService.register(defaultUser);
        
        if (result.success) {
          console.log('Default account created successfully');
          return { 
            success: true, 
            message: 'Default account created', 
            credentials: {
              username: defaultUsername,
              password: 'password123'
            }
          };
        } else {
          console.error('Failed to create default account:', result.message);
          return { success: false, message: result.message };
        }
      } else {
        console.log('Default account already exists');
        return { 
          success: true, 
          message: 'Default account already exists',
          credentials: {
            username: defaultUsername,
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