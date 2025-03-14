import * as FileSystem from 'expo-file-system';
import AuthService from './AuthService';

const POSTS_FILE = FileSystem.documentDirectory + 'posts.json';
const CLUBS_FILE = FileSystem.documentDirectory + 'clubs.json';
const EVENTS_FILE = FileSystem.documentDirectory + 'events.json';
const CHATS_FILE = FileSystem.documentDirectory + 'chats.json';

const DataService = {
  // Initialize all data files if they don't exist
  initialize: async () => {
    try {
      // Initialize posts
      const postsInfo = await FileSystem.getInfoAsync(POSTS_FILE);
      if (!postsInfo.exists) {
        const initialPosts = [
          {
            id: 'post1',
            title: 'Welcome to Schurr Community',
            content: 'This is the official community app for Schurr High School students and staff.',
            author: 'Admin',
            authorId: 'admin',
            timestamp: new Date().toISOString(),
            likes: 0,
            comments: [],
            image: null
          }
        ];
        await FileSystem.writeAsStringAsync(POSTS_FILE, JSON.stringify(initialPosts));
      }
      
      // Initialize clubs
      const clubsInfo = await FileSystem.getInfoAsync(CLUBS_FILE);
      if (!clubsInfo.exists) {
        const initialClubs = [
          { 
            id: 'club1', 
            name: 'Book Club', 
            members: [], 
            icon: 'book',
            description: 'We meet every Tuesday at lunch in Room 203 to discuss our current book.'
          },
          { 
            id: 'club2', 
            name: 'Science Enthusiasts', 
            members: [], 
            icon: 'flask',
            description: 'Exploring scientific concepts through experiments and discussions.'
          }
        ];
        await FileSystem.writeAsStringAsync(CLUBS_FILE, JSON.stringify(initialClubs));
      }
      
      // Initialize events
      const eventsInfo = await FileSystem.getInfoAsync(EVENTS_FILE);
      if (!eventsInfo.exists) {
        const initialEvents = [
          {
            id: 'event1',
            title: 'Welcome Back Assembly',
            date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
            time: '10:00 AM - 11:30 AM',
            location: 'Main Gymnasium',
            description: 'Welcome back assembly for all students.',
            attendees: []
          }
        ];
        await FileSystem.writeAsStringAsync(EVENTS_FILE, JSON.stringify(initialEvents));
      }
      
      // Initialize chats
      const chatsInfo = await FileSystem.getInfoAsync(CHATS_FILE);
      if (!chatsInfo.exists) {
        const initialChats = [];
        await FileSystem.writeAsStringAsync(CHATS_FILE, JSON.stringify(initialChats));
      }
    } catch (error) {
      console.error('Error initializing data service:', error);
    }
  },
  
  // Posts methods
  getPosts: async () => {
    try {
      const content = await FileSystem.readAsStringAsync(POSTS_FILE);
      return JSON.parse(content);
    } catch (error) {
      console.error('Error getting posts:', error);
      return [];
    }
  },
  
  addPost: async (content) => {
    try {
      const currentUser = await AuthService.getCurrentUser();
      if (!currentUser) return null;
      
      const posts = await DataService.getPosts();
      
      const newPost = {
        id: `post${Date.now()}`,
        title: `${currentUser.name}'s Post`,
        content: content,
        author: currentUser.name,
        authorId: currentUser.id,
        timestamp: new Date().toISOString(),
        likes: 0,
        comments: [],
        image: null
      };
      
      posts.unshift(newPost);
      await FileSystem.writeAsStringAsync(POSTS_FILE, JSON.stringify(posts));
      
      return newPost;
    } catch (error) {
      console.error('Error adding post:', error);
      return null;
    }
  },
  
  likePost: async (postId) => {
    try {
      const posts = await DataService.getPosts();
      const postIndex = posts.findIndex(p => p.id === postId);
      
      if (postIndex !== -1) {
        posts[postIndex].likes += 1;
        await FileSystem.writeAsStringAsync(POSTS_FILE, JSON.stringify(posts));
        return posts[postIndex].likes;
      }
      
      return 0;
    } catch (error) {
      console.error('Error liking post:', error);
      return 0;
    }
  },
  
  // Clubs methods
  getClubs: async () => {
    try {
      const content = await FileSystem.readAsStringAsync(CLUBS_FILE);
      return JSON.parse(content);
    } catch (error) {
      console.error('Error getting clubs:', error);
      return [];
    }
  },
  
  joinClub: async (clubId) => {
    try {
      const currentUser = await AuthService.getCurrentUser();
      if (!currentUser) return false;
      
      const clubs = await DataService.getClubs();
      const clubIndex = clubs.findIndex(c => c.id === clubId);
      
      if (clubIndex !== -1) {
        // Check if user is already a member
        if (!clubs[clubIndex].members.includes(currentUser.id)) {
          clubs[clubIndex].members.push(currentUser.id);
          await FileSystem.writeAsStringAsync(CLUBS_FILE, JSON.stringify(clubs));
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Error joining club:', error);
      return false;
    }
  },
  
  // Events methods
  getEvents: async () => {
    try {
      const content = await FileSystem.readAsStringAsync(EVENTS_FILE);
      return JSON.parse(content);
    } catch (error) {
      console.error('Error getting events:', error);
      return [];
    }
  },
  
  rsvpEvent: async (eventId) => {
    try {
      const currentUser = await AuthService.getCurrentUser();
      if (!currentUser) return false;
      
      const events = await DataService.getEvents();
      const eventIndex = events.findIndex(e => e.id === eventId);
      
      if (eventIndex !== -1) {
        // Check if user already RSVP'd
        if (!events[eventIndex].attendees.includes(currentUser.id)) {
          events[eventIndex].attendees.push(currentUser.id);
          await FileSystem.writeAsStringAsync(EVENTS_FILE, JSON.stringify(events));
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Error RSVP to event:', error);
      return false;
    }
  },
  
  // Admin methods
  addClub: async (name, description, icon) => {
    try {
      const currentUser = await AuthService.getCurrentUser();
      if (!currentUser || currentUser.role !== 'admin') return false;
      
      const clubs = await DataService.getClubs();
      
      const newClub = {
        id: `club${Date.now()}`,
        name,
        description,
        icon,
        members: []
      };
      
      clubs.push(newClub);
      await FileSystem.writeAsStringAsync(CLUBS_FILE, JSON.stringify(clubs));
      
      return true;
    } catch (error) {
      console.error('Error adding club:', error);
      return false;
    }
  },
  
  addEvent: async (title, date, time, location, description) => {
    try {
      const currentUser = await AuthService.getCurrentUser();
      if (!currentUser || currentUser.role !== 'admin') return false;
      
      const events = await DataService.getEvents();
      
      const newEvent = {
        id: `event${Date.now()}`,
        title,
        date,
        time,
        location,
        description,
        attendees: []
      };
      
      events.push(newEvent);
      await FileSystem.writeAsStringAsync(EVENTS_FILE, JSON.stringify(events));
      
      return true;
    } catch (error) {
      console.error('Error adding event:', error);
      return false;
    }
  }
};

export default DataService;