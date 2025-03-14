import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';

const CommunityScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={require('../assets/schurr-logo.png')} 
          style={styles.logo} 
          resizeMode="contain"
        />
        <Text style={styles.headerText}>Schurr Community</Text>
      </View>
      
      <View style={styles.postContainer}>
        <Text style={styles.postTitle}>Post Title/Username</Text>
        <Text style={styles.postContent}>
          Post content goes here. This is a brief overview of the post.
        </Text>
        
        <View style={styles.imageContainer}>
          {/* Placeholder for post image */}
        </View>
        
        <Text style={styles.imageDescription}>Beautiful image description</Text>
        <Text style={styles.timestamp}>Timestamp</Text>
        <Text style={styles.timeAgo}>15 min ago</Text>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.likeButton}>
            <Text style={styles.likeButtonText}>Like</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.commentButton}>
            <Text style={styles.commentButtonText}>Comment</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  postContainer: {
    padding: 15,
  },
  postTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  postContent: {
    fontSize: 16,
    color: '#888',
    marginBottom: 15,
  },
  imageContainer: {
    height: 300,
    backgroundColor: '#f1f2f6',
    borderRadius: 10,
    marginBottom: 10,
  },
  imageDescription: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  timestamp: {
    fontSize: 14,
    color: '#888',
  },
  timeAgo: {
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  likeButton: {
    flex: 1,
    backgroundColor: '#b9e769',
    padding: 15,
    borderRadius: 10,
    marginRight: 5,
    alignItems: 'center',
  },
  commentButton: {
    flex: 1,
    backgroundColor: '#f1f2f6',
    padding: 15,
    borderRadius: 10,
    marginLeft: 5,
    alignItems: 'center',
  },
  likeButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  commentButtonText: {
    color: '#8BC34A',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CommunityScreen;