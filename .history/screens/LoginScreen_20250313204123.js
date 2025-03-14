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
  ScrollView,
  Switch
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
            <View style={styles.adminContainer}>
              <Text style={styles.adminText}>Admin Login</Text>
              <Switch
                value={isAdmin}
                onValueChange={setIsAdmin}
                trackColor={{ false: '#767577', true: '#8BC34A' }}
                thumbColor={isAdmin ? '#fff' : '#f4f3f4'}
              />
            </View>
          )}
          
          <TouchableOpacity style={styles.authButton} onPress={handleAuth}>
            <Text style={styles.authButtonText}>
              {isLogin ? 'Login' : 'Register'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.switchModeButton}
            onPress={() => {
              setIsLogin(!isLogin);
              setIsAdmin(false);
            }}
          >
            <Text style={styles.switchModeText}>
              {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    color: '#8BC34A',
    marginBottom: 40,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  adminContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  adminText: {
    fontSize: 16,
    color: '#555',
  },
  authButton: {
    backgroundColor: '#8BC34A',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  authButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  switchModeButton: {
    alignItems: 'center',
  },
  switchModeText: {
    color: '#8BC34A',
    fontSize: 16,
  },
});

export default LoginScreen;