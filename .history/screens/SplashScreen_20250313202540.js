import React, { useEffect } from 'react';
import { StyleSheet, View, Image } from 'react-native';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    // Navigate to the main app after 2 seconds
    const timer = setTimeout(() => {
      navigation.replace('MainApp');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/schurr-logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
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
    width: '70%',
    height: '70%',
  },
});

export default SplashScreen;