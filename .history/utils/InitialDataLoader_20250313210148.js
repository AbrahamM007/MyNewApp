import * as FileSystem from 'expo-file-system';

const POSTS_FILE = FileSystem.documentDirectory + 'posts.json';
const CLUBS_FILE = FileSystem.documentDirectory + 'clubs.json';
const EVENTS_FILE = FileSystem.documentDirectory + 'events.json';

const InitialDataLoader = {
  loadInitialData: async () => {
    try {
      // Load initial clubs
      const initialClubs = [
        {
          id: 'club_1',
          name: 'Robotics Club',
          description: 'Build and program robots for competitions and fun projects.',
          icon: 'hardware-chip',
          members: 12,
          meetingDay: 'Tuesday',
          meetingTime: '3:30 PM',
          location: 'Room 203'
        },
        {
          id: 'club_2',
          name: 'Art Club',
          description: 'Express yourself through various art forms and techniques.',
          icon: 'color-palette',
          members: 18,
          meetingDay: 'Wednesday',
          meetingTime: '3:15 PM',
          location: 'Art Room'
        },
        {
          id: 'club_3',
          name: 'Debate Team',
          description: 'Develop public speaking skills and compete in debate tournaments.',
          icon: 'chatbubbles',
          members: 15,
          meetingDay: 'Thursday',
          meetingTime: '3:30 PM',
          location: 'Room 105'
        },
        {
          id: 'club_4',
          name: 'Environmental Club',
          description: 'Work on projects to make our school and community more sustainable.',
          icon: 'leaf',
          members: 10,
          meetingDay: 'Monday',
          meetingTime: '3:15 PM',
          location: 'Room 302'
        },
        {
          id: 'club_5',
          name: 'Chess Club',
          description: 'Learn strategies and compete in chess tournaments.',
          icon: 'grid',
          members: 8,
          meetingDay: 'Friday',
          meetingTime: '3:00 PM',
          location: 'Library'
        }
      ];
      
      await FileSystem.writeAsStringAsync(CLUBS_FILE, JSON.stringify(initialClubs));
      
      // Load initial events
      const now = new Date();
      const initialEvents = [
        {
          id: 'event_1',
          title: 'Homecoming Dance',
          description: 'Annual homecoming dance with music, food, and fun activities.',
          date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 10).toISOString(),
          time: '7:00 PM - 11:00 PM',
          location: 'School Gymnasium',
          attendees: 0
        },
        {
          id: 'event_2',
          title: 'Science Fair',
          description: 'Showcase your science projects and compete for prizes.',
          date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 15).toISOString(),
          time: '9:00 AM - 3:00 PM',
          location: 'School Cafeteria',
          attendees: 0
        },
        {
          id: 'event_3',
          title: 'Career Day',
          description: 'Meet professionals from various fields and learn about career opportunities.',
          date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 20).toISOString(),
          time: '10:00 AM - 2:00 PM',
          location: 'School Auditorium',
          attendees: 0
        },
        {
          id: 'event_4',
          title: 'Basketball Game vs. Rival High',
          description: 'Come support our basketball team in this important game!',
          date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5).toISOString(),
          time: '6:00 PM - 8:00 PM',
          location: 'School Gymnasium',
          attendees: 0
        },
        {
          id: 'event_5',
          title: 'Spring Concert',
          description: 'Enjoy performances by our school band, orchestra, and choir.',
          date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 25).toISOString(),
          time: '7:00 PM - 9:00 PM',
          location: 'School Auditorium',
          attendees: 0
        }
      ];
      
      await FileSystem.writeAsStringAsync(EVENTS_FILE, JSON.stringify(initialEvents));
      
      // Load initial posts
      const initialPosts = [
        {
          id: 'post_1',
          title: 'Welcome to Schurr High School App',
          content: 'This is the official app for Schurr High School students. Connect with your peers, join clubs, and stay updated on school events!',
          authorId: 'admin',
          author: 'Admin',
          timestamp: new Date().toISOString(),
          likes: 5,
          likedBy: [],
          comments: [
            {
              id: 'comment_1',
              content: 'This app is awesome!',
              authorId: 'user_1',
              author: 'John Doe',
              timestamp: new Date().toISOString()
            }
          ]
        }
      ];
      
      await FileSystem.writeAsStringAsync(POSTS_FILE, JSON.stringify(initialPosts));
      
      return { success: true };
    } catch (error) {
      console.error('Error loading initial data:', error);
      return { success: false, error };
    }
  }
};

export default InitialDataLoader;