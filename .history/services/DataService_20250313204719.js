import * as FileSystem from 'expo-file-system';
import AuthService from './AuthService';

const POSTS_FILE = FileSystem.documentDirectory + 'posts.json';
const CLUBS_FILE = FileSystem.documentDirectory + 'clubs.json';
const EVENTS_FILE = FileSystem.documentDirectory + 'events.json';
const CHATS_FILE = FileSystem.documentDirectory + 'chats.json';

const DataService = {
  // Initialize all data files
  initialize: async () => {
    try {
      const files = [
        { path: POSTS_FILE, defaultData: [] },
        { path: CLUBS_FILE, defaultData: [] },
        { path: EVENTS_FILE, defaultData: [] },
        { path: CHATS_FILE, defaultData: [] }
      ];
      
      for (const file of files) {
        const fileInfo = await FileSystem.getInfoAsync(file.path);
        if (!fileInfo.exists) {
          await FileSystem.writeAsStringAsync(file.path, JSON.stringify(file.defaultData));
        }
      }
    } catch (error) {
      console.error('Error initializing data files:', error);
    }
  },
  
  // Posts methods
  getPosts: async () => {
    try {
      const content = await FileSystem.readAsStringAsync(POSTS_FILE);
      return JSON.parse(content);
    } catch (error) {
      console.error('Error reading posts:', error);
      return [];
    }
  },
  
  addPost: async (content, title = null) => {
    try {
      const currentUser = await AuthService.getCurrentUser();
      if (!currentUser) {
        return { success: false, message: 'You must be logged in to post' };
      }
      
      const posts = await DataService.getPosts();
      
      const newPost = {
        id: `post_${Date.now()}`,
        title: title || `${currentUser.name}'s Post`,
        content,
        authorId: currentUser.id,
        author: currentUser.name,
        timestamp: new Date().toISOString(),
        likes: 0,
        likedBy: [],
        comments: []
      };
      
      posts.unshift(newPost);
      await FileSystem.writeAsStringAsync(POSTS_FILE, JSON.stringify(posts));
      
      return { success: true, post: newPost };
    } catch (error) {
      console.error('Error adding post:', error);
      return { success: false, message: 'Failed to add post' };
    }
  },
  
  likePost: async (postId) => {
    try {
      const currentUser = await AuthService.getCurrentUser();
      if (!currentUser) {
        return { success: false, message: 'You must be logged in to like posts' };
      }
      
      const posts = await DataService.getPosts();
      const postIndex = posts.findIndex(p => p.id === postId);
      
      if (postIndex === -1) {
        return { success: false, message: 'Post not found' };
      }
      
      const post = posts[postIndex];
      
      // Check if user already liked the post
      if (post.likedBy.includes(currentUser.id)) {
        // Unlike
        post.likes--;
        post.likedBy = post.likedBy.filter(id => id !== currentUser.id);
      } else {
        // Like
        post.likes++;
        post.likedBy.push(currentUser.id);
      }
      
      posts[postIndex] = post;
      await FileSystem.writeAsStringAsync(POSTS_FILE, JSON.stringify(posts));
      
      return { success: true, post };
    } catch (error) {
      console.error('Error liking post:', error);
      return { success: false, message: 'Failed to like post' };
    }
  },
  
  addComment: async (postId, content) => {
    try {
      const currentUser = await AuthService.getCurrentUser();
      if (!currentUser) {
        return { success: false, message: 'You must be logged in to comment' };
      }
      
      const posts = await DataService.getPosts();
      const postIndex = posts.findIndex(p => p.id === postId);
      
      if (postIndex === -1) {
        return { success: false, message: 'Post not found' };
      }
      
      const newComment = {
        id: `comment_${Date.now()}`,
        content,
        authorId: currentUser.id,
        author: currentUser.name,
        timestamp: new Date().toISOString()
      };
      
      posts[postIndex].comments.push(newComment);
      await FileSystem.writeAsStringAsync(POSTS_FILE, JSON.stringify(posts));
      
      return { success: true, comment: newComment };
    } catch (error) {
      console.error('Error adding comment:', error);
      return { success: false, message: 'Failed to add comment' };
    }
  },
  
  // Add more methods for clubs, events, etc.
  // ...
};

export default DataService;