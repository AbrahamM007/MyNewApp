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
  
  // Clubs methods
  getClubs: async () => {
    try {
      const content = await FileSystem.readAsStringAsync(CLUBS_FILE);
      return JSON.parse(content);
    } catch (error) {
      console.error('Error reading clubs:', error);
      return [];
    }
  },
  
  joinClub: async (clubId) => {
    try {
      const currentUser = await AuthService.getCurrentUser();
      if (!currentUser) {
        return { success: false, message: 'You must be logged in to join clubs' };
      }
      
      // Get clubs
      const clubs = await DataService.getClubs();
      const clubIndex = clubs.findIndex(c => c.id === clubId);
      
      if (clubIndex === -1) {
        return { success: false, message: 'Club not found' };
      }
      
      // Update club members count
      clubs[clubIndex].members++;
      await FileSystem.writeAsStringAsync(CLUBS_FILE, JSON.stringify(clubs));
      
      // Update user's clubs
      const users = await AuthService.getUsers();
      const userIndex = users.findIndex(u => u.id === currentUser.id);
      
      if (!users[userIndex].clubs) {
        users[userIndex].clubs = [];
      }
      
      if (!users[userIndex].clubs.includes(clubId)) {
        users[userIndex].clubs.push(clubId);
      }
      
      // Update user in storage
      await AuthService.updateProfile(currentUser.id, { clubs: users[userIndex].clubs });
      
      return { success: true };
    } catch (error) {
      console.error('Error joining club:', error);
      return { success: false, message: 'Failed to join club' };
    }
  },
  
  // Events methods
  getEvents: async () => {
    try {
      const content = await FileSystem.readAsStringAsync(EVENTS_FILE);
      return JSON.parse(content);
    } catch (error) {
      console.error('Error reading events:', error);
      return [];
    }
  },
  
  rsvpEvent: async (eventId) => {
    try {
      const currentUser = await AuthService.getCurrentUser();
      if (!currentUser) {
        return { success: false, message: 'You must be logged in to RSVP to events' };
      }
      
      // Get events
      const events = await DataService.getEvents();
      const eventIndex = events.findIndex(e => e.id === eventId);
      
      if (eventIndex === -1) {
        return { success: false, message: 'Event not found' };
      }
      
      // Update event attendees count
      events[eventIndex].attendees++;
      await FileSystem.writeAsStringAsync(EVENTS_FILE, JSON.stringify(events));
      
      // Update user's RSVPs
      const users = await AuthService.getUsers();
      const userIndex = users.findIndex(u => u.id === currentUser.id);
      
      if (!users[userIndex].rsvps) {
        users[userIndex].rsvps = [];
      }
      
      if (!users[userIndex].rsvps.includes(eventId)) {
        users[userIndex].rsvps.push(eventId);
      }
      
      // Update user in storage
      await AuthService.updateProfile(currentUser.id, { rsvps: users[userIndex].rsvps });
      
      return { success: true };
    } catch (error) {
      console.error('Error RSVP to event:', error);
      return { success: false, message: 'Failed to RSVP to event' };
    }
  },
  
  // Chats methods
  getChats: async () => {
    try {
      const content = await FileSystem.readAsStringAsync(CHATS_FILE);
      return JSON.parse(content);
    } catch (error) {
      console.error('Error reading chats:', error);
      return [];
    }
  },
  
  createChat: async (recipientId) => {
    try {
      const currentUser = await AuthService.getCurrentUser();
      if (!currentUser) {
        return { success: false, message: 'You must be logged in to create chats' };
      }
      
      // Get recipient user
      const users = await AuthService.getUsers();
      const recipient = users.find(u => u.id === recipientId);
      
      if (!recipient) {
        return { success: false, message: 'Recipient not found' };
      }
      
      // Check if chat already exists
      const chats = await DataService.getChats();
      const existingChat = chats.find(chat => 
        chat.participants.includes(currentUser.id) && 
        chat.participants.includes(recipientId) &&
        chat.participants.length === 2
      );
      
      if (existingChat) {
        return { success: true, chat: existingChat };
      }
      
      // Create new chat
      const newChat = {
        id: `chat_${Date.now()}`,
        participants: [currentUser.id, recipientId],
        participantDetails: [
          {
            id: currentUser.id,
            name: currentUser.name
          },
          {
            id: recipient.id,
            name: recipient.name
          }
        ],
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      chats.push(newChat);
      await FileSystem.writeAsStringAsync(CHATS_FILE, JSON.stringify(chats));
      
      return { success: true, chat: newChat };
    } catch (error) {
      console.error('Error creating chat:', error);
      return { success: false, message: 'Failed to create chat' };
    }
  },
  
  sendMessage: async (chatId, content) => {
    try {
      const currentUser = await AuthService.getCurrentUser();
      if (!currentUser) {
        return { success: false, message: 'You must be logged in to send messages' };
      }
      
      // Get chats
      const chats = await DataService.getChats();
      const chatIndex = chats.findIndex(c => c.id === chatId);
      
      if (chatIndex === -1) {
        return { success: false, message: 'Chat not found' };
      }
      
      // Check if user is a participant
      if (!chats[chatIndex].participants.includes(currentUser.id)) {
        return { success: false, message: 'You are not a participant in this chat' };
      }
      
      // Add message
      const newMessage = {
        id: `msg_${Date.now()}`,
        content,
        senderId: currentUser.id,
        timestamp: new Date().toISOString()
      };
      
      chats[chatIndex].messages.push(newMessage);
      chats[chatIndex].updatedAt = new Date().toISOString();
      
      await FileSystem.writeAsStringAsync(CHATS_FILE, JSON.stringify(chats));
      
      return { success: true, chat: chats[chatIndex] };
    } catch (error) {
      console.error('Error sending message:', error);
      return { success: false, message: 'Failed to send message' };
    }
  }
};

export default DataService;