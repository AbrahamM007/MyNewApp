import AsyncStorage from '@react-native-async-storage/async-storage';

const POSTS_KEY = 'posts';
const CLUBS_KEY = 'clubs';
const EVENTS_KEY = 'events';
const COMMENTS_KEY = 'comments';

const InitialDataLoader = {
  loadInitialData: async () => {
    try {
      // Sample clubs data
      const sampleClubs = [
        {
          id: 'club1',
          name: 'Robotics Club',
          description: 'Build and program robots for competitions and fun projects.',
          members: [],
          createdAt: new Date().toISOString(),
          meetingDay: 'Tuesday',
          meetingTime: '3:30 PM',
          location: 'Room 203'
        },
        {
          id: 'club2',
          name: 'Art Club',
          description: 'Express yourself through various art forms and techniques.',
          members: [],
          createdAt: new Date().toISOString(),
          meetingDay: 'Wednesday',
          meetingTime: '3:15 PM',
          location: 'Art Room'
        },
        {
          id: 'club3',
          name: 'Debate Team',
          description: 'Develop public speaking skills and compete in debate tournaments.',
          members: [],
          createdAt: new Date().toISOString(),
          meetingDay: 'Thursday',
          meetingTime: '3:30 PM',
          location: 'Room 105'
        }
      ];
      
      // Sample events data
      const now = new Date();
      const sampleEvents = [
        {
          id: 'event1',
          title: 'Homecoming Dance',
          description: 'Annual homecoming dance with music, food, and fun activities.',
          date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 10).toISOString(),
          time: '7:00 PM - 11:00 PM',
          location: 'School Gymnasium',
          attendees: []
        },
        {
          id: 'event2',
          title: 'Science Fair',
          description: 'Showcase your science projects and compete for prizes.',
          date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 15).toISOString(),
          time: '9:00 AM - 3:00 PM',
          location: 'School Cafeteria',
          attendees: []
        },
        {
          id: 'event3',
          title: 'Career Day',
          description: 'Meet professionals from various fields and learn about career opportunities.',
          date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 20).toISOString(),
          time: '10:00 AM - 2:00 PM',
          location: 'School Auditorium',
          attendees: []
        }
      ];
      
      // Sample posts data
      const samplePosts = [
        {
          id: 'post1',
          content: 'Welcome to the Schurr High School app! Connect with your peers, join clubs, and stay updated on school events.',
          authorId: 'admin',
          authorName: 'Admin',
          createdAt: new Date().toISOString(),
          likes: [],
          comments: []
        }
      ];
      
      // Sample comments data
      const sampleComments = [];
      
      // Store the sample data in AsyncStorage
      await AsyncStorage.setItem(CLUBS_KEY, JSON.stringify(sampleClubs));
      await AsyncStorage.setItem(EVENTS_KEY, JSON.stringify(sampleEvents));
      await AsyncStorage.setItem(POSTS_KEY, JSON.stringify(samplePosts));
      await AsyncStorage.setItem(COMMENTS_KEY, JSON.stringify(sampleComments));
      
      console.log('Initial data loaded successfully');
      return { success: true };
    } catch (error) {
      console.error('Error loading initial data:', error);
      return { success: false, error };
    }
  },
  
  // Helper methods to create new items
  createClub: async (clubData, userId) => {
    try {
      const clubs = JSON.parse(await AsyncStorage.getItem(CLUBS_KEY)) || [];
      const newClub = {
        id: 'club' + (clubs.length + 1),
        ...clubData,
        members: [userId],
        createdAt: new Date().toISOString()
      };
      
      clubs.push(newClub);
      await AsyncStorage.setItem(CLUBS_KEY, JSON.stringify(clubs));
      return { success: true, club: newClub };
    } catch (error) {
      console.error('Error creating club:', error);
      return { success: false, error };
    }
  },
  
  createEvent: async (eventData, userId) => {
    try {
      const events = JSON.parse(await AsyncStorage.getItem(EVENTS_KEY)) || [];
      const newEvent = {
        id: 'event' + (events.length + 1),
        ...eventData,
        attendees: [userId],
        createdAt: new Date().toISOString()
      };
      
      events.push(newEvent);
      await AsyncStorage.setItem(EVENTS_KEY, JSON.stringify(events));
      return { success: true, event: newEvent };
    } catch (error) {
      console.error('Error creating event:', error);
      return { success: false, error };
    }
  },
  
  createPost: async (content, userId, userName) => {
    try {
      const posts = JSON.parse(await AsyncStorage.getItem(POSTS_KEY)) || [];
      const newPost = {
        id: 'post' + (posts.length + 1),
        content,
        authorId: userId,
        authorName: userName,
        createdAt: new Date().toISOString(),
        likes: [],
        comments: []
      };
      
      posts.push(newPost);
      await AsyncStorage.setItem(POSTS_KEY, JSON.stringify(posts));
      return { success: true, post: newPost };
    } catch (error) {
      console.error('Error creating post:', error);
      return { success: false, error };
    }
  },
  
  addComment: async (postId, commentText, userId, userName) => {
    try {
      const posts = JSON.parse(await AsyncStorage.getItem(POSTS_KEY)) || [];
      const postIndex = posts.findIndex(post => post.id === postId);
      
      if (postIndex === -1) {
        return { success: false, error: 'Post not found' };
      }
      
      const newComment = {
        id: 'comment' + (posts[postIndex].comments.length + 1),
        content: commentText,
        authorId: userId,
        authorName: userName,
        createdAt: new Date().toISOString()
      };
      
      posts[postIndex].comments.push(newComment);
      await AsyncStorage.setItem(POSTS_KEY, JSON.stringify(posts));
      return { success: true, comment: newComment };
    } catch (error) {
      console.error('Error adding comment:', error);
      return { success: false, error };
    }
  }
};

export default InitialDataLoader;