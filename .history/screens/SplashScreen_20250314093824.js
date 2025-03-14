import React, { useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Image, 
  Animated, 
  Dimensions 
} from 'react-native';
import AuthService from '../services/AuthService';
import UserUtils from '../utils/UserUtils';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ navigation }) => {
  const logoOpacity = new Animated.Value(0);
  const logoScale = new Animated.Value(0.3);
  const titleOpacity = new Animated.Value(0);
  const subtitleOpacity = new Animated.Value(0);

  useEffect(() => {
    // Start animations
    Animated.sequence([
      // Fade in and scale up logo
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 7,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
      // Fade in title
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      // Fade in subtitle
      Animated.timing(subtitleOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Initialize app and navigate
    const initializeApp = async () => {
      try {
        // Wait for animations (2.5 seconds)
        await new Promise(resolve => setTimeout(resolve, 2500));
        
        // Initialize auth service
        await AuthService.initialize();
        
        // Create default account if needed
        await UserUtils.createDefaultAccount();
        
        // Check if user is already logged in
        const currentUser = await AuthService.getCurrentUser();
        
        if (currentUser) {
          // User is logged in, navigate to main app
          navigation.replace('Main');
        } else {
          // User is not logged in, navigate to auth flow
          navigation.replace('Auth');
        }
      } catch (error) {
        console.error('Error initializing app:', error);
        // Navigate to auth flow on error
        navigation.replace('Auth');
      }
    };

    initializeApp();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Animated.Image
          source={require('../assets/schurr-logo.png')}
          style={[
            styles.logo,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
          resizeMode="contain"
        />
        
        <Animated.Text style={[styles.title, { opacity: titleOpacity }]}>
          Schurr High School
        </Animated.Text>
        
        <Animated.Text style={[styles.subtitle, { opacity: subtitleOpacity }]}>
          Student Community App
        </Animated.Text>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2023 Schurr High School</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: width * 0.4,
    height: width * 0.4,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#8BC34A',
    textAlign: 'center',
  },
  footer: {
    marginBottom: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
  },
});

export default SplashScreen;