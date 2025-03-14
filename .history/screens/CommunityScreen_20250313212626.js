import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DataService from '../services/DataService';
import AuthService from '../services/AuthService';

const CommunityScreen = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    loadPosts();
    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    try {
      const user = await AuthService.getCurrentUser();
      setCurrentUser(user);
    } catch (error) {
      console.error('Error loading current user:', error);
    }
  };

  const loadPosts = async () => {
    try {
      setIsLoading(true);
      const postsData = await DataService.getPosts();
      setPosts(postsData);
    } catch (error) {
      console.error('Error loading posts:', error);
      Alert.alert('Error', 'Failed to load community posts');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadPosts();
  };

  const handleSubmitPost = async () => {
    if (!newPostContent.trim()) {
      Alert.alert('Error', 'Post content cannot be empty');
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await DataService.addPost(newPostContent);
      
      if (result.success) {
        setNewPostContent('');
        loadPosts(); // Reload posts to show the new one
      } else {
        Alert.alert('Error', result.message || 'Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Error', 'Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikePost = async (postId) => {
    try {
      const result = await DataService.likePost(postId);
      
      if (result.success) {
        // Update the post in the local state
        setPosts(posts.map(post => 
          post.id === postId ? result.post : post
        ));
      } else {
        Alert.alert('Error', result.message || 'Failed to like post');
      }
    } catch (error) {
      console.error('Error liking post:', error);
      Alert.alert('Error', 'Failed to like post');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Add this to your post rendering component
  const renderCommentSection = (post) => {
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
  
    const handleAddComment = async () => {
      if (!comment.trim()) return;
      
      try {
        setIsSubmitting(true);
        const result = await DataService.addComment(post.id, comment);
        
        if (result.success) {
          setComment('');
          // Refresh posts to show the new comment
          loadPosts();
        } else {
          Alert.alert('Error', result.message || 'Failed to add comment');
        }
      } catch (error) {
        console.error('Error adding comment:', error);
        Alert.alert('Error', 'Failed to add comment');
      } finally {
        setIsSubmitting(false);
      }
    };
  
    return (
      <View style={styles.commentSection}>
        <View style={styles.commentInputContainer}>
          <TextInput
            style={styles.commentInput}
            value={comment}
            onChangeText={setComment}
            placeholder="Add a comment..."
            multiline
          />
          <TouchableOpacity
            style={[
              styles.commentButton,
              (!comment.trim() || isSubmitting) && styles.commentButtonDisabled
            ]}
            onPress={handleAddComment}
            disabled={!comment.trim() || isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="send" size={20} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
        
        {post.comments && post.comments.length > 0 && (
          <View style={styles.commentsList}>
            {post.comments.map(comment => (
              <View key={comment.id} style={styles.commentItem}>
                <Text style={styles.commentAuthor}>{comment.author}</Text>
                <Text style={styles.commentContent}>{comment.content}</Text>
                <Text style={styles.commentTime}>
                  {new Date(comment.timestamp).toLocaleString()}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderPost = ({ item }) => {
    const isLiked = currentUser && item.likedBy && item.likedBy.includes(currentUser.id);
    
    return (
      <View style={styles.postCard}>
        <View style={styles.postHeader}>
          <View style={styles.postAuthor}>
            <View style={styles.avatarSmall}>
              <Text style={styles.avatarText}>
                {item.author ? item.author.charAt(0).toUpperCase() : '?'}
              </Text>
            </View>
            <View>
              <Text style={styles.authorName}>{item.author || 'Anonymous'}</Text>
              <Text style={styles.postTime}>{formatDate(item.timestamp)}</Text>
            </View>
          </View>
        </View>
        
        {item.title && <Text style={styles.postTitle}>{item.title}</Text>}
        <Text style={styles.postContent}>{item.content}</Text>
        
        <View style={styles.postActions}>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => handleLikePost(item.id)}
          >
            <Ionicons 
              name={isLiked ? 'heart' : 'heart-outline'} 
              size={20} 
              color={isLiked ? '#e74c3c' : '#666'} 
            />
            <Text style={styles.actionText}>{item.likes || 0}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="chatbubble-outline" size={20} color="#666" />
            <Text style={styles.actionText}>{item.comments ? item.comments.length : 0}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Community Feed</Text>
      </View>
      
      <View style={styles.newPostContainer}>
        <TextInput
          style={styles.newPostInput}
          placeholder="What's on your mind?"
          placeholderTextColor="#999"
          multiline
          value={newPostContent}
          onChangeText={setNewPostContent}
        />
        <TouchableOpacity 
          style={[
            styles.postButton, 
            (!newPostContent.trim() || isSubmitting) && styles.postButtonDisabled
          ]}
          onPress={handleSubmitPost}
          disabled={!newPostContent.trim() || isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.postButtonText}>Post</Text>
          )}
        </TouchableOpacity>
      </View>
      
      {isLoading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8BC34A" />
        </View>
      ) : (
        <FlatList
          data={posts}
          renderItem={renderPost}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.postsList}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#8BC34A']}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="chatbubbles-outline" size={60} color="#ccc" />
              <Text style={styles.emptyText}>No posts yet</Text>
              <Text style={styles.emptySubtext}>Be the first to share something!</Text>
            </View>
          }
        />
      )}
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
  newPostContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
  },
  newPostInput: {
    flex: 1,
    minHeight: 40,
    backgroundColor: '#f9f9f9',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    fontSize: 16,
  },
  postButton: {
    backgroundColor: '#8BC34A',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postButtonDisabled: {
    backgroundColor: '#ccc',
  },
  postButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postsList: {
    padding: 10,
  },
  postCard: {
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
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  postAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8BC34A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  authorName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  postTime: {
    fontSize: 12,
    color: '#999',
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  postContent: {
    fontSize: 16,
    lineHeight: 22,
    color: '#333',
  },
  postActions: {
    flexDirection: 'row',
    marginTop: 15,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  actionText: {
    marginLeft: 5,
    color: '#666',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 50,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#999',
    marginTop: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
    textAlign: 'center',
  },
});

export default CommunityScreen;