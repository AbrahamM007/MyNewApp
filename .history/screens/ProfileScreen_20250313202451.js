import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  TouchableOpacity, 
  ScrollView,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}></View>
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>John Doe</Text>
            <Text style={styles.userRole}>Community Member</Text>
          </View>
        </View>
        
        <Text style={styles.bio}>
          Hello! I love connecting with new people and sharing ideas.
        </Text>
        
        <TouchableOpacity style={styles.editProfileButton}>
          <Text style={styles.editProfileText}>Edit Profile</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.messageButton}>
          <Text style={styles.messageText}>Message</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.inviteButton}>
          <Text style={styles.inviteText}>Invite Friends</Text>
        </TouchableOpacity>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Friends</Text>
          
          <View style={styles.friendItem}>
            <View style={styles.friendAvatar}></View>
            <View style={styles.friendInfo}>
              <Text style={styles.friendName}>Alice</Text>
              <Text style={styles.friendRelation}>Best Friend</Text>
            </View>
          </View>
          
          <View style={styles.friendItem}>
            <View style={styles.friendAvatar}></View>
            <View style={styles.friendInfo}>
              <Text style={styles.friendName}>Michael</Text>
              <Text style={styles.friendRelation}>Collaborator</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Clubs</Text>
          
          <View style={styles.clubsContainer}>
            <View style={styles.clubItem}>
              <Ionicons name="book-outline" size={24} color="#8BC34A" />
              <Text style={styles.clubName}>Book Club</Text>
            </View>
            
            <View style={styles.clubItem}>
              <Ionicons name="information-circle-outline" size={24} color="#8BC34A" />
              <Text style={styles.clubName}>Science Enthusiasts</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#f1f2f6',
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userRole: {
    fontSize: 16,
    color: '#888',
  },
  bio: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  editProfileButton: {
    backgroundColor: '#8BC34A',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  editProfileText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  messageButton: {
    backgroundColor: '#f1f2f6',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  messageText: {
    fontSize: 16,
    color: '#8BC34A',
    fontWeight: 'bold',
  },
  inviteButton: {
    backgroundColor: '#f1f2f6',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  inviteText: {
    fontSize: 16,
    color: '#8BC34A',
    fontWeight: 'bold',
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  friendAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f1f2f6',
    marginRight: 15,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  friendRelation: {
    fontSize: 14,
    color: '#888',
  },
  clubsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  clubItem: {
    width: '48%',
    backgroundColor: '#f1f2f6',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
  },
  clubName: {
    marginTop: 10,
    color: '#8BC34A',
    fontWeight: '500',
  },
});

export default ProfileScreen;