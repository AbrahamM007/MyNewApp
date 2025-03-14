import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Image, Animated, Text } from 'react-native';

const SplashScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const textFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Sequence of animations
    Animated.sequence([
      // First fade in and scale up the logo
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
      
      // Then fade in the text
      Animated.timing(textFadeAnim, {
        toValue: 1,
        duration: 600,
        delay: 200,
        useNativeDriver: true,
      }),
      
      // Wait a bit before navigating
      Animated.delay(1000)
    ]).start(() => {
      navigation.replace('MainApp');
    });

    return () => {};
  }, [navigation, fadeAnim, scaleAnim, textFadeAnim]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }]
        }}
      >
        <Image
          source={require('../assets/schurr-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>
      
      <Animated.Text style={[styles.schoolName, { opacity: textFadeAnim }]}>
        Schurr High School
      </Animated.Text>
      
      <Animated.Text style={[styles.tagline, { opacity: textFadeAnim }]}>
        Connect • Learn • Grow
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  schoolName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
  },
  tagline: {
    fontSize: 18,
    color: '#8BC34A',
    marginTop: 10,
  }
});

export default SplashScreen;