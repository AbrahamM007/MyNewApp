import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import CommunityScreen from './screens/CommunityScreen';
import MessagingScreen from './screens/MessagingScreen';

const Tab = createBottomTabNavigator();

// Placeholder components for other tabs
const HomeScreen = () => <SafeAreaView style={styles.container}><CommunityScreen /></SafeAreaView>;
const ClubsScreen = () => <SafeAreaView style={styles.container}></SafeAreaView>;
const EventsScreen = () => <SafeAreaView style={styles.container}></SafeAreaView>;
const ProfileScreen = () => <SafeAreaView style={styles.container}></SafeAreaView>;

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Messaging') {
              iconName = focused ? 'chatbubble' : 'chatbubble-outline';
            } else if (route.name === 'Clubs') {
              iconName = focused ? 'people' : 'people-outline';
            } else if (route.name === 'Events') {
              iconName = focused ? 'calendar' : 'calendar-outline';
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
        <Tab.Screen name="Messaging" component={MessagingScreen} />
        <Tab.Screen name="Clubs" component={ClubsScreen} />
        <Tab.Screen name="Events" component={EventsScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
