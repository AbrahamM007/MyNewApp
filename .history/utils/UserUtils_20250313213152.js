import AsyncStorage from '@react-native-async-storage/async-storage';

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
  }
};

export default UserUtils;