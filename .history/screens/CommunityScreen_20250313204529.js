import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  TouchableOpacity, 
  ScrollView,
  TextInput,
  SafeAreaView,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DataService from '../services/DataService';

const CommunityScreen = () => {
  const [posts, setPosts] = useState([]);
  const [newPostText, setNewPostText] = useState('');
  
  useEffect(() => {
    // Load posts when component mounts
    setPosts(DataService.getPosts());
  }, []);

  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
    return timestamp.toLocaleDateString();
  };

  const handleLike = (postId) => {
    const newLikes = DataService.likePost(postId);
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return { ...post, likes: newLikes };
      }
      return post;
    }));
  };

  const addNewPost = () => {
    if (newPostText.trim() === '') return;
    
    const newPost = DataService.addPost(newPostText);
    setPosts([newPost, ...posts]);
    setNewPostText('');
    
    Alert.alert('Success', 'Your post has been shared with the community!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={require('../assets/schurr-logo.png')} 
          style={styles.logo} 
          resizeMode="contain"
        />
        <Text style={styles.headerText}>Schurr Community</Text>
      </View>
      
      <ScrollView style={styles.scrollView}>
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
        
        {posts.map(post => (
          <View key={post.id} style={styles.postContainer}>
            <Text style={styles.postTitle}>{post.title}</Text>
            <Text style={styles.postAuthor}>{post.author}</Text>
            <Text style={styles.postContent}>{post.content}</Text>
            
            {post.image && (
              <View style={styles.imageContainer}>
                {/* Post image would go here */}
              </View>
            )}
            
            <Text style={styles.timestamp}>{formatTime(post.timestamp)}</Text>
            
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
                <Text style={styles.commentButtonText}>Comment ({post.comments})</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
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
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },
  logo: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: '500',
    color: '#8BC34A',
  },
  scrollView: {
    flex: 1,
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
  postContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },
  postTitle: {
    fontSize: 18,
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