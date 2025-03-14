import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import AuthService from './services/AuthService';
import DataService from './services/DataService';

// Import screens
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import CommunityScreen from './screens/CommunityScreen';
import EventsScreen from './screens/EventsScreen';
import MessagingScreen from './screens/MessagingScreen';
import ProfileScreen from './screens/ProfileScreen';

// Create navigators
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Auth navigator for login/register screens
const AuthNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

// Main app tab navigator
const MainNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Home') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Community') {
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
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Community" component={CommunityScreen} />
    <Tab.Screen name="Events" component={EventsScreen} />
    <Tab.Screen name="Messages" component={MessagingScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

export default function App() {
  // Add this import at the top with your other imports
  import UserUtils from './utils/UserUtils';
  
  // In your useEffect where you initialize the app:
  useEffect(() => {
    // Initialize data services
    const initializeApp = async () => {
      await AuthService.initialize();
      await DataService.initialize();
      
      // Create default account
      const defaultAccount = await UserUtils.createDefaultAccount();
      console.log('Default account credentials:', defaultAccount.credentials);
    };
    
    initializeApp();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Auth" component={AuthNavigator} />
        <Stack.Screen name="Main" component={MainNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}