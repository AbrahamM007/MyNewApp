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
                  <Ionicons name="heart-outline" size={16} color="#666" />
                  <Text style={styles.postStatText}>{post.likes}</Text>
                </View>
                
                <View style={styles.postStat}>
                  <Ionicons name="chatbubble-outline" size={16} color="#666" />
                  <Text style={styles.postStatText}>{post.comments.length}</Text>
                </View>
              </View>
            </View>
          ))
        )}
      </View>
      
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#f44336',
    textAlign: 'center',
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    paddingTop: 40,
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  headerText: {
    fontSize: 22,
    fontWeight: '500',
    color: '#8BC34A',
  },
  profileSection: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#8BC34A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#8BC34A',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  profileInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userUsername: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  userBio: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 20,
  },
  emptyBio: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
  editForm: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f1f1f1',
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: '#8BC34A',
  },
  buttonText: {
    fontWeight: 'bold',
    color: '#fff',
  },
  statsSection: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8BC34A',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  postsSection: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  emptyPosts: {
    alignItems: 'center',
    padding: 30,
  },
  emptyPostsText: {
    fontSize: 16,
    color: '#999',
    marginTop: 10,
    textAlign: 'center',
  },
  postItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  postAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8BC34A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  smallAvatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  postAuthorName: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  postTime: {
    fontSize: 12,
    color: '#666',
  },
  postContent: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 10,
  },
  postFooter: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  postStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  postStatText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
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