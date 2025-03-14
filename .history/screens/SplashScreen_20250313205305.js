import React, { useEffect } from 'react';
import { StyleSheet, View, Image, Text, ActivityIndicator } from 'react-native';
import AuthService from '../services/AuthService';
import DataService from '../services/DataService';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize services
        await AuthService.initialize();
        await DataService.initialize();
        
        // Check if user is already logged in
        const user = await AuthService.getCurrentUser();
        
        // Navigate to appropriate screen after a short delay
        setTimeout(() => {
          if (user) {
            navigation.replace('MainApp');
          } else {
            navigation.replace('Auth');
          }
        }, 2000);
      } catch (error) {
        console.error('Error initializing app:', error);
        // Navigate to Auth screen on error
        navigation.replace('Auth');
      }
    };

    initializeApp();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/schurr-logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Schurr High School</Text>
      <Text style={styles.subtitle}>Student Community App</Text>
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
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#8BC34A',
    marginBottom: 30,
  },
  loader: {
    marginTop: 20,
  },
});

export default SplashScreen;