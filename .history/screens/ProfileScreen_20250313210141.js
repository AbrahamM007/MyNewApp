import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AuthService from '../services/AuthService';
import DataService from '../services/DataService';

const ProfileScreen = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      const currentUser = await AuthService.getCurrentUser();
      
      if (currentUser) {
        setUser(currentUser);
        setEditedProfile({
          name: currentUser.name || '',
          email: currentUser.email || '',
          bio: currentUser.bio || ''
        });
        
        // Load user's posts
        const posts = await DataService.getPosts();
        const filteredPosts = posts.filter(post => post.authorId === currentUser.id);
        setUserPosts(filteredPosts);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      Alert.alert('Error', 'Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      if (!user) return;
      
      setIsLoading(true);
      const result = await AuthService.updateProfile(user.id, editedProfile);
      
      if (result.success) {
        setUser(result.user);
        setIsEditing(false);
        Alert.alert('Success', 'Profile updated successfully');
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const result = await AuthService.logout();
      if (result.success) {
        // Navigation will be handled by the app's authentication flow
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Error', 'Failed to log out');
    }
  };

  // Get user initials safely
  const getUserInitials = () => {
    if (!user || !user.name) return '?';
    
    const nameParts = user.name.split(' ');
    if (nameParts.length > 1) {
      return `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`;
    }
    return user.name.charAt(0);
  };

  if (isLoading && !user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8BC34A" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Unable to load profile. Please log in again.</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../assets/schurr-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.headerText}>My Profile</Text>
      </View>
      
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getUserInitials()}</Text>
          </View>
          
          {!isEditing && (
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => setIsEditing(true)}
            >
              <Ionicons name="pencil" size={18} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
        
        {isEditing ? (
          <View style={styles.editForm}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={styles.input}
                value={editedProfile.name}
                onChangeText={(text) => setEditedProfile({...editedProfile, name: text})}
                placeholder="Your name"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                value={editedProfile.email}
                onChangeText={(text) => setEditedProfile({...editedProfile, email: text})}
                placeholder="Your email"
                keyboardType="email-address"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Bio</Text>
              <TextInput
                style={[styles.input, styles.bioInput]}
                value={editedProfile.bio}
                onChangeText={(text) => setEditedProfile({...editedProfile, bio: text})}
                placeholder="Tell us about yourself"
                multiline
              />
            </View>
            
            <View style={styles.buttonGroup}>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setIsEditing(false);
                  setEditedProfile({
                    name: user.name || '',
                    email: user.email || '',
                    bio: user.bio || ''
                  });
                }}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.button, styles.saveButton]}
                onPress={handleSaveProfile}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userUsername}>@{user.username}</Text>
            
            {user.email && (
              <View style={styles.infoRow}>
                <Ionicons name="mail-outline" size={16} color="#666" />
                <Text style={styles.infoText}>{user.email}</Text>
              </View>
            )}
            
            <View style={styles.infoRow}>
              <Ionicons name="school-outline" size={16} color="#666" />
              <Text style={styles.infoText}>Schurr High School</Text>
            </View>
            
            {user.bio ? (
              <Text style={styles.userBio}>{user.bio}</Text>
            ) : (
              <Text style={styles.emptyBio}>No bio yet. Tap edit to add one!</Text>
            )}
          </View>
        )}
      </View>
      
      <View style={styles.statsSection}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{userPosts.length}</Text>
          <Text style={styles.statLabel}>Posts</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{user.clubs ? user.clubs.length : 0}</Text>
          <Text style={styles.statLabel}>Clubs</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{user.rsvps ? user.rsvps.length : 0}</Text>
          <Text style={styles.statLabel}>Events</Text>
        </View>
      </View>
      
      <View style={styles.postsSection}>
        <Text style={styles.sectionTitle}>My Posts</Text>
        
        {userPosts.length === 0 ? (
          <View style={styles.emptyPosts}>
            <Ionicons name="document-text-outline" size={48} color="#ddd" />
            <Text style={styles.emptyPostsText}>You haven't posted anything yet.</Text>
          </View>
        ) : (
          userPosts.map(post => (
            <View key={post.id} style={styles.postItem}>
              <View style={styles.postHeader}>
                <View style={styles.postAuthor}>
                  <View style={styles.smallAvatar}>
                    <Text style={styles.smallAvatarText}>{getUserInitials()}</Text>
                  </View>
                  <View>
                    <Text style={styles.postAuthorName}>{user.name}</Text>
                    <Text style={styles.postTime}>
                      {new Date(post.timestamp).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              </View>
              
              <Text style={styles.postContent}>{post.content}</Text>
              
              <View style={styles.postFooter}>
                <View style={styles.postStat}>
                  <Ionicons name="heart-outline" size
                    fontSize: 14,
                    color: '#666',
                  },
                  logoutButton: {
                    backgroundColor: '#f44336',
                    padding: 15,
                    borderRadius: 5,
                    margin: 20,
                    alignItems: 'center',
                  },
                  logoutButtonText: {
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: 16,
                  }
                });
                
                export default ProfileScreen;