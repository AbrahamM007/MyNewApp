import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  TouchableOpacity, 
  ScrollView 
} from 'react-native';
import DataService from '../services/DataService';

const CommunityScreen = () => {
  const [posts, setPosts] = useState([]);
  
  useEffect(() => {
    // Load posts when component mounts
    const loadPosts = async () => {
      try {
        const fetchedPosts = await DataService.getPosts();
        setPosts(fetchedPosts || []); // Ensure posts is always an array
      } catch (error) {
        console.error('Error loading posts:', error);
        setPosts([]); // Set to empty array on error
      }
    };
    
    loadPosts();
  }, []);

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
      
      {posts && posts.length > 0 ? (
        posts.map(post => (
          <View key={post.id} style={styles.postContainer}>
            <Text style={styles.postTitle}>{post.title}</Text>
            <Text style={styles.postContent}>
              {post.content}
            </Text>
            
            {post.image && (
              <View style={styles.imageContainer}>
                {/* Placeholder for post image */}
              </View>
            )}
            
            <Text style={styles.imageDescription}>{post.author}</Text>
            <Text style={styles.timestamp}>Posted</Text>
            <Text style={styles.timeAgo}>
              {new Date(post.timestamp).toLocaleDateString()}
            </Text>
            
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.likeButton}>
                <Text style={styles.likeButtonText}>Like ({post.likes || 0})</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.commentButton}>
                <Text style={styles.commentButtonText}>Comment</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No posts available</Text>
        </View>
      )}
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
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
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
  emptyContainer: {
    padding: 30,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#888',
  }
});

export default CommunityScreen;