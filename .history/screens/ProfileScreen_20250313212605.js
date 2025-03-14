import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import DataService from '../services/DataService';
import AuthService from '../services/AuthService';

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [userClubs, setUserClubs] = useState([]);
  const [userEvents, setUserEvents] = useState([]);

  useEffect(() => {
    loadUserData();
    
    // Request permission for image picker
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to change your profile picture!');
      }
    })();
  }, []);

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      const userData = await AuthService.getCurrentUser();
      setUser(userData);
      
      // Load user's clubs
      if (userData.clubs && userData.clubs.length > 0) {
        const clubs = await DataService.getClubs();
        const userClubsData = clubs.filter(club => userData.clubs.includes(club.id));
        setUserClubs(userClubsData);
      }
      
      // Load user's events
      if (userData.rsvps && userData.rsvps.length > 0) {
        const events = await DataService.getEvents();
        const userEventsData = events.filter(event => userData.rsvps.includes(event.id));
        setUserEvents(userEventsData);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      Alert.alert('Error', 'Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeProfilePicture = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setIsUpdating(true);
        const imageUri = result.assets[0].uri;
        
        const updateResult = await DataService.updateProfilePicture(imageUri);
        
        if (updateResult.success) {
          // Reload user data to get updated profile picture
          await loadUserData();
          Alert.alert('Success', 'Profile picture updated successfully');
        } else {
          Alert.alert('Error', updateResult.message || 'Failed to update profile picture');
        }
      }
    } catch (error) {
      console.error('Error updating profile picture:', error);
      Alert.alert('Error', 'Failed to update profile picture');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8BC34A" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.profileHeader}>
          <TouchableOpacity 
            style={styles.profileImageContainer}
            onPress={handleChangeProfilePicture}
            disabled={isUpdating}
          >
            {isUpdating ? (
              <ActivityIndicator size="small" color="#8BC34A" />
            ) : user.profilePicture ? (
              <Image 
                source={{ uri: user.profilePicture }} 
                style={styles.profileImage} 
              />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Text style={styles.profileImagePlaceholderText}>
                  {user.name.charAt(0).toUpperCase()}
                </Text>
                <Ionicons 
                  name="camera" 
                  size={20} 
                  color="#fff" 
                  style={styles.cameraIcon} 
                />
              </View>
            )}
          </TouchableOpacity>
          
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Clubs</Text>
          {userClubs.length > 0 ? (
            userClubs.map(club => (
              <View key={club.id} style={styles.itemCard}>
                <Text style={styles.itemTitle}>{club.name}</Text>
                <Text style={styles.itemDescription}>{club.description}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>You haven't joined any clubs yet</Text>
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Events</Text>
          {userEvents.length > 0 ? (
            userEvents.map(event => (
              <View key={event.id} style={styles.itemCard}>
                <Text style={styles.itemTitle}>{event.title}</Text>
                <Text style={styles.itemDescription}>{event.description}</Text>
                <View style={styles.itemDetails}>
                  <Ionicons name="calendar-outline" size={16} color="#666" />
                  <Text style={styles.itemDetailText}>
                    {event.date} at {event.time}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>You haven't RSVP'd to any events yet</Text>
          )}
        </View>
        
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={async () => {
            await AuthService.logout();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          }}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#8BC34A',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profileImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#8BC34A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImagePlaceholderText: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#fff',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 12,
    padding: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  itemCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  itemDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemDetailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 20,
  },
  logoutButton: {
    backgroundColor: '#f44336',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ProfileScreen;