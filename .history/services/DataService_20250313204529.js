// Data service for Schurr High School app
const DataService = {
  // User data
  currentUser: {
    id: 'user1',
    name: 'John Doe',
    role: 'Student',
    bio: 'Hello! I love connecting with new people and sharing ideas.',
    avatar: null,
    friends: [
      { id: 'user2', name: 'Alice', relation: 'Best Friend', avatar: null },
      { id: 'user3', name: 'Michael', relation: 'Collaborator', avatar: null }
    ],
    clubs: ['club1', 'club2']
  },
  
  // Community posts
  posts: [
    {
      id: 'post1',
      title: 'School Spirit Week',
      content: 'Next week is Spirit Week! Don\'t forget to dress up according to the themes: Monday - Pajama Day, Tuesday - Twin Day, Wednesday - Decades Day, Thursday - Class Colors, Friday - Blue and Gold Day!',
      author: 'Student Council',
      timestamp: new Date(Date.now() - 15 * 60000), // 15 minutes ago
      likes: 24,
      comments: 5,
      image: null
    },
    {
      id: 'post2',
      title: 'Basketball Game Results',
      content: 'Congratulations to our Spartans basketball team for winning against Roosevelt High 72-65! Great job team!',
      author: 'Sports Department',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      likes: 42,
      comments: 8,
      image: null
    }
  ],
  
  // Clubs data
  clubs: [
    { id: 'club1', name: 'Book Club', members: 28, icon: 'book', description: 'We meet every Tuesday at lunch in Room 203 to discuss our current book.' },
    { id: 'club2', name: 'Science Enthusiasts', members: 35, icon: 'flask', description: 'Exploring scientific concepts through experiments and discussions.' },
    { id: 'club3', name: 'Debate Team', members: 20, icon: 'chatbubbles', description: 'Preparing for regional and state debate competitions.' },
    { id: 'club4', name: 'Art Club', members: 32, icon: 'brush', description: 'Express yourself through various art mediums and techniques.' }
  ],
  
  // Events data
  events: [
    {
      id: 'event1',
      title: 'College Fair',
      date: '2023-11-15',
      time: '3:00 PM - 5:00 PM',
      location: 'Main Gymnasium',
      description: 'Representatives from over 50 colleges will be present to answer questions and provide information about their institutions.',
      attendees: 120
    },
    {
      id: 'event2',
      title: 'Senior Graduation Meeting',
      date: '2023-11-20',
      time: '2:30 PM - 3:30 PM',
      location: 'Auditorium',
      description: 'Important information about graduation ceremony, cap and gown measurements, and senior activities.',
      attendees: 85
    }
  ],
  
  // Chat messages
  chats: [
    {
      id: 'chat1',
      title: 'Math Study Group',
      participants: ['user1', 'user2', 'user4'],
      lastMessage: 'Can someone help with problem #5?',
      timestamp: new Date(Date.now() - 30 * 60000), // 30 minutes ago
      messages: [
        { id: 'msg1', sender: 'user2', text: 'Hi there!', timestamp: new Date(Date.now() - 60 * 60000) },
        { id: 'msg2', sender: 'user1', text: 'Hello! How are you?', timestamp: new Date(Date.now() - 55 * 60000) }
      ]
    },
    {
      id: 'chat2',
      title: 'Science Project',
      participants: ['user1', 'user3'],
      lastMessage: 'I finished my part of the presentation',
      timestamp: new Date(Date.now() - 2 * 3600000), // 2 hours ago
      messages: []
    }
  ],
  
  // Methods to interact with data
  getPosts: function() {
    return this.posts;
  },
  
  getClubs: function() {
    return this.clubs;
  },
  
  getEvents: function() {
    return this.events;
  },
  
  getChats: function() {
    return this.chats;
  },
  
  getChatById: function(chatId) {
    return this.chats.find(chat => chat.id === chatId);
  },
  
  addMessage: function(chatId, message) {
    const chat = this.getChatById(chatId);
    if (chat) {
      const newMessage = {
        id: `msg${Date.now()}`,
        sender: this.currentUser.id,
        text: message,
        timestamp: new Date()
      };
      chat.messages.push(newMessage);
      chat.lastMessage = message;
      chat.timestamp = new Date();
      return newMessage;
    }
    return null;
  },
  
  joinClub: function(clubId) {
    if (!this.currentUser.clubs.includes(clubId)) {
      this.currentUser.clubs.push(clubId);
      return true;
    }
    return false;
  },
  
  rsvpEvent: function(eventId) {
    const event = this.events.find(e => e.id === eventId);
    if (event) {
      event.attendees += 1;
      return true;
    }
    return false;
  },
  
  addPost: function(content) {
    const newPost = {
      id: `post${Date.now()}`,
      title: `${this.currentUser.name}'s Post`,
      content: content,
      author: this.currentUser.name,
      timestamp: new Date(),
      likes: 0,
      comments: 0,
      image: null
    };
    
    this.posts.unshift(newPost);
    return newPost;
  },
  
  likePost: function(postId) {
    const post = this.posts.find(p => p.id === postId);
    if (post) {
      post.likes += 1;
      return post.likes;
    }
    return 0;
  }
};

export default DataService;