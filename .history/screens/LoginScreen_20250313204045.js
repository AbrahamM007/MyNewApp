import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import AuthService from '../services/AuthService';

const LoginScreen = ({ navigation }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleAuth = async () => {
    if (isLogin) {
      // Login
      const result = await AuthService.login(username, password, isAdmin);
      if (result.success) {
        navigation.replace('MainApp');
      } else {
        Alert.alert('Login Failed', result.message);
      }
    } else {
      // Register
      if (!username || !password || !name) {
        Alert.alert('Registration Failed', 'Please fill in all fields');
        return;
      }
      
      const result = await AuthService.register(username, password, name);
      if (result.success) {
        navigation.replace('MainApp');
      } else {
        Alert.alert('Registration Failed', result.message);
      }
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image 
          source={require('../assets/schurr-logo.png')} 
          style={styles.logo} 
          resizeMode="contain"
        />
        
        <Text style={styles.title}>Schurr High School</Text>
        <Text style={styles.subtitle}>Community App</Text>
        
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>{isLogin ? 'Login' : 'Create Account'}</Text>
          
          {!isLogin && (
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
            />
          )}
          
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          
          {isLogin && (
            <View