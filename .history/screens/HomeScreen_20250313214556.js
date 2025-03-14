import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AuthService from '../services/AuthService';
import DataService from '../services/DataService';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const HomeScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Get current user
      const currentUser = await AuthService.getCurrentUser();
      setUser(currentUser);
      
      // Load recent posts
      const postsData = await DataService.getPosts();
      setPosts(postsData);
    } catch (error) {
      console.error('Error loading home data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8BC34A" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Schurr High School</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Ionicons name="person-circle" size={30} color="#fff" />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>
            Welcome, {user ? user.name : 'Student'}!
          </Text>
          <Text style={styles.welcomeText}>
            Stay connected with your school community, join clubs, and participate in events.
          </Text>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Events</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Events')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.eventCard}
            onPress={() => navigation.navigate('Events')}
          >
            <View style={styles.eventDateBox}>
              <Text style={styles.eventMonth}>OCT</Text>
              <Text style={styles.eventDay}>15</Text>
            </View>
            <View style={styles.eventDetails}>
              <Text style={styles.eventTitle}>Homecoming Dance</Text>
              <Text style={styles.eventLocation}>
                <Ionicons name="location-outline" size={14} color="#666" /> School Gymnasium
              </Text>
              <Text style={styles.eventTime}>
                <Ionicons name="time-outline" size={14} color="#666" /> 7:00 PM - 11:00 PM
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Community Posts</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Community')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {posts.length > 0 ? (
            posts.slice(0, 2).map((post) => (
              <View key={post.id} style={styles.postCard}>
                <View style={styles.postHeader}>
                  <Text style={styles.postAuthor}>{post.authorName}</Text>
                  <Text style={styles.postTime}>
                    {new Date(post.createdAt).toLocaleDateString()}
                  </Text>
                </View>
                <Text style={styles.postContent}>{post.content}</Text>
                <View style={styles.postActions}>
                  <TouchableOpacity style={styles.postAction}>
                    <Ionicons name="heart-outline" size={18} color="#666" />
                    <Text style={styles.postActionText}>
                      {post.likes ? post.likes.length : 0} Likes
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.postAction}>
                    <Ionicons name="chatbubble-outline" size={18} color="#666" />
                    <Text style={styles.postActionText}>
                      {post.comments ? post.comments.length : 0} Comments
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No posts yet</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#8BC34A',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  welcomeCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  welcomeText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    fontSize: 14,
    color: '#8BC34A',
  },
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 10,
  },
  eventDateBox: {
    backgroundColor: '#8BC34A',
    borderRadius: 5,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  eventMonth: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  eventDay: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  eventDetails: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  eventLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  eventTime: {
    fontSize: 14,
    color: '#666',
  },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  postAuthor: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  postTime: {
    fontSize: 12,
    color: '#999',
  },
  postContent: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
    lineHeight: 20,
  },
  postActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 10,
  },
  postAction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  postActionText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 5,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
  },
});

export default HomeScreen;