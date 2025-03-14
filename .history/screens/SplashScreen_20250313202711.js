import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Image, Animated, Easing } from 'react-native';

const SplashScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Create a sequence of animations
    setTimeout(() => {
      Animated.parallel([
        // Fade out
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
        // Scale up
        Animated.timing(scaleAnim, {
          toValue: 1.5,
          duration: 800,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          useNativeDriver: true,
        }),
        // Rotate slightly
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.bezier(0.175, 0.885, 0.32, 1.275),
          useNativeDriver: true,
        })
      ]).start(() => {
        // Navigate to main app after animation completes
        navigation.replace('MainApp');
      });
    }, 1500);

    return () => {};
  }, [navigation, fadeAnim, scaleAnim, rotateAnim]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '20deg']
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [
            { scale: scaleAnim },
            { rotate: spin }
          ]
        }}
      >
        <Image
          source={require('../assets/schurr-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>
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
    width: '50%',
    height: '50%',
  },
});

export default SplashScreen;