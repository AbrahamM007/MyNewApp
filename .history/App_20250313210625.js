import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import screens
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import CommunityScreen from './screens/CommunityScreen';  // Changed from HomeScreen
import ClubsScreen from './screens/ClubsScreen';
import EventsScreen from './screens/EventsScreen';
import MessagingScreen from './screens/MessagingScreen';
import ProfileScreen from './screens/ProfileScreen';

// Create navigators
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Main app tab navigator
const MainAppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Clubs') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Events') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Messages') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#8BC34A',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      {/* Home screen using CommunityScreen component */}
      <Tab.Screen name="Home" component={CommunityScreen} />
      <Tab.Screen name="Clubs" component={ClubsScreen} />
      <Tab.Screen name="Events" component={EventsScreen} />
      <Tab.Screen name="Messages" component={MessagingScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

// Auth navigator
const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

// Main app component
const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  // Add a listener for authentication state changes
  useEffect(() => {
    const authListener = AsyncStorage.addEventListener('auth_change', bootstrapAsync);
    
    // Initial check
    bootstrapAsync();
    
    return () => {
      if (authListener?.remove) {
        authListener.remove();
      }
    };
  }, []);
  
  // Extract the bootstrap logic to its own function
  const bootstrapAsync = async () => {
    try {
      const userJson = await AsyncStorage.getItem('currentUser');
      setUserToken(userJson ? JSON.parse(userJson) : null);
    } catch (e) {
      console.error('Failed to load user token', e);
      setUserToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {userToken == null ? (
          <Stack.Screen 
            name="Auth" 
            component={AuthNavigator} 
            options={{ animationEnabled: false }}
          />
        ) : (
          <Stack.Screen 
            name="MainApp" 
            component={MainAppNavigator} 
            options={{ animationEnabled: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
