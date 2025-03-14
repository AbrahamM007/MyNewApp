import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Text, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InitialDataLoader from '../utils/InitialDataLoader';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        // Check if user is already logged in
        const userJson = await AsyncStorage.getItem('currentUser');
        
        // Initialize app data if needed
        const isFirstLaunch = await AsyncStorage.getItem('isFirstLaunch');
        if (!isFirstLaunch) {
          await InitialDataLoader.loadInitialData();
          await AsyncStorage.setItem('isFirstLaunch', 'false');
        }
        
        // Wait for 2 seconds to show splash screen
        setTimeout(() => {
          if (userJson) {
            // User is logged in, navigate to main app
            navigation?.replace('MainApp');
          } else {
            // User is not logged in, navigate to auth
            navigation?.replace('Auth');
          }
        }, 2000);
      } catch (error) {
        console.error('Error checking user session:', error);
        // Navigate to Auth screen on error
        navigation?.replace('Auth');
      }
    };

    // Only run the check if navigation is available
    if (navigation) {
      checkUserSession();
    }
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/schurr-logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Schurr High School</Text>
      <Text style={styles.subtitle}>Connect with your school community</Text>
      <ActivityIndicator size="large" color="#8BC34A" style={styles.loader} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8BC34A',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  loader: {
    marginTop: 20,
  },
});

export default SplashScreen;