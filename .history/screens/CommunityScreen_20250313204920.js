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
import DataService from '../services/DataService';
import AuthService from '../services/AuthService';

const CommunityScreen = () => {
  const [posts, setPosts] = useState([]);
  const [newPostText, setNewPostText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Load user and posts when component mounts
    const loadData = async () => {
      try {
        const user = await AuthService.getCurrentUser();
        setCurrentUser(user);
        
        const postsData = await DataService.getPosts();
        setPosts(postsData);
      } catch (error) {
        console.error('Error loading data:', error);
        Alert.alert('Error', 'Failed to load community posts');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
    return date.toLocaleDateString();
  };

  const handleLike = async (postId) => {
    try {
      const result = await DataService.likePost(postId);
      if (result.success) {
        // Update the posts state with the updated post
        setPosts(posts.map(post => 
          post.id === postId ? result.post : post
        ));
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      console.error('Error liking post:', error);
      Alert.alert('Error', 'Failed to like post');
    }
  };

  const addNewPost = async () => {
    if (!newPostText.trim()) return;
    
    try {
      const result = await DataService.addPost(newPostText);
      if (result.success) {
        setPosts([result.post, ...posts]);
        setNewPostText('');
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      console.error('Error adding post:', error);
      Alert.alert('Error', 'Failed to add post');
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
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={require('../assets/schurr-logo.png')} 
          style={styles.logo} 
          resizeMode="contain"
        />
        <Text style={styles.headerText}>Schurr Community</Text>
      </View>
      
      {currentUser && (
        <View style={styles.newPostContainer}>
          <TextInput
            style={styles.newPostInput}
            placeholder="Share something with your school community..."
            multiline
            value={newPostText}
            onChangeText={setNewPostText}
          />
          <TouchableOpacity 
            style={[styles.postButton, !newPostText.trim() && styles.disabledButton]} 
            onPress={addNewPost}
            disabled={!newPostText.trim()}
          >
            <Text style={styles.postButtonText}>Post</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {posts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No posts yet. Be the first to share!</Text>
        </View>
      ) : (
        posts.map(post => (
          <View key={post.id} style={styles.postContainer}>
            <Text style={styles.postTitle}>{post.title}</Text>
            <Text style={styles.postAuthor}>{post.author}</Text>
            <Text style={styles.postContent}>{post.content}</Text>
            
            <Text style={styles.timeAgo}>{formatTime(post.timestamp)}</Text>
            
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.likeButton} 
                onPress={() => handleLike(post.id)}
              >
                <Ionicons name="heart-outline" size={18} color="#333" />
                <Text style={styles.likeButtonText}>Like ({post.likes})</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.commentButton}>
                <Ionicons name="chatbubble-outline" size={18} color="#8BC34A" />
                <Text style={styles.commentButtonText}>Comment ({post.comments ? post.comments.length : 0})</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
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
  newPostContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },
  newPostInput: {
    height: 100,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    textAlignVertical: 'top',
  },
  postButton: {
    backgroundColor: '#8BC34A',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  postButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyContainer: {
    padding: 30,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
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
  postAuthor: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  postContent: {
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
  },
  timeAgo: {
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  likeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#b9e769',
    padding: 15,
    borderRadius: 10,
    marginRight: 5,
  },
  commentButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f2f6',
    padding: 15,
    borderRadius: 10,
    marginLeft: 5,
  },
  likeButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 5,
  },
  commentButtonText: {
    color: '#8BC34A',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 5,
  },
});

export default CommunityScreen;