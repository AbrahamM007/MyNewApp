import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DataService from '../services/DataService';
import AuthService from '../services/AuthService';

const MessagingScreen = () => {
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const user = await AuthService.getCurrentUser();
      setCurrentUser(user);
      
      const chatsData = await DataService.getChats();
      // Filter chats that involve the current user
      const userChats = chatsData.filter(chat => 
        chat.participants.includes(user.id)
      );
      setChats(userChats);
    } catch (error) {
      console.error('Error loading chats data:', error);
      Alert.alert('Error', 'Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d`;
    return date.toLocaleDateString();
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;
    
    try {
      const result = await DataService.sendMessage(selectedChat.id, newMessage);
      if (result.success) {
        // Update the selected chat with the new message
        const updatedChat = result.chat;
        setChats(chats.map(chat => 
          chat.id === updatedChat.id ? updatedChat : chat
        ));
        setSelectedChat(updatedChat);
        setNewMessage('');
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message');
    }
  };

  const renderChatItem = ({ item }) => {
    // Find the other participant (not the current user)
    const otherParticipantId = item.participants.find(id => id !== currentUser.id);
    const otherParticipant = item.participantDetails.find(p => p.id === otherParticipantId);
    
    // Get the last message
    const lastMessage = item.messages[item.messages.length - 1];
    
    return (
      <TouchableOpacity 
        style={[
          styles.chatItem, 
          selectedChat && selectedChat.id === item.id && styles.selectedChatItem
        ]}
        onPress={() => setSelectedChat(item)}
      >
        <View style={styles.chatAvatar}>
          <Text style={styles.avatarText}>{otherParticipant.name.charAt(0)}</Text>
        </View>
        
        <View style={styles.chatInfo}>
          <View style={styles.chatHeader}>
            <Text style={styles.chatName}>{otherParticipant.name}</Text>
            <Text style={styles.chatTime}>{formatTime(lastMessage.timestamp)}</Text>
          </View>
          
          <Text style={styles.lastMessage} numberOfLines={1}>
            {lastMessage.senderId === currentUser.id ? 'You: ' : ''}
            {lastMessage.content}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderMessageItem = ({ item }) => {
    const isCurrentUser = item.senderId === currentUser.id;
    
    return (
      <View style={[
        styles.messageContainer,
        isCurrentUser ? styles.sentMessage : styles.receivedMessage
      ]}>
        <View style={[
          styles.messageBubble,
          isCurrentUser ? styles.sentBubble : styles.receivedBubble
        ]}>
          <Text style={styles.messageText}>{item.content}</Text>
          <Text style={styles.messageTime}>{formatTime(item.timestamp)}</Text>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8BC34A" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../assets/schurr-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.headerText}>Messages</Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.chatsList}>
          {chats.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No messages yet.</Text>
            </View>
          ) : (
            <FlatList
              data={chats}
              renderItem={renderChatItem}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.chatsListContent}
            />
          )}
        </View>
        
        {selectedChat ? (
          <View style={styles.chatView}>
            <View style={styles.chatHeader}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => setSelectedChat(null)}
              >
                <Ionicons name="arrow-back" size={24} color="#8BC34A" />
              </TouchableOpacity>
              
              <Text style={styles.chatTitle}>
                {selectedChat.participantDetails.find(
                  p => p.id !== currentUser.id
                ).name}
              </Text>
            </View>
            
            <FlatList
              data={selectedChat.messages}
              renderItem={renderMessageItem}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.messagesContainer}
              inverted
            />
            
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.messageInput}
                placeholder="Type a message..."
                value={newMessage}
                onChangeText={setNewMessage}
                multiline
              />
              <TouchableOpacity 
                style={[
                  styles.sendButton, 
                  !newMessage.trim() && styles.disabledButton
                ]}
                onPress={handleSendMessage}
                disabled={!newMessage.trim()}
              >
                <Ionicons name="send" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.noSelectedChat}>
            <Ionicons name="chatbubble-ellipses-outline" size={60} color="#ddd" />
            <Text style={styles.noSelectedChatText}>Select a conversation to start messaging</Text>
          </View>
        )}
      </View>
    </View>
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
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
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
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  chatsList: {
    width: '30%',
    borderRightWidth: 1,
    borderRightColor: '#f1f1f1',
  },
  chatsListContent: {
    padding: 10,
  },
  chatItem: {
    flexDirection: 'row',
    padding: 10,
    borderRadius: 10,
    marginBottom: 5,
  },
  selectedChatItem: {
    backgroundColor: '#f1f8e9',
  },
  chatAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#8BC34A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  chatInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  chatName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  chatTime: {
    fontSize: 12,
    color: '#666',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
  },
  chatView: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
    backgroundColor: '#fff',
  },
  backButton: {
    marginRight: 10,
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  messagesContainer: {
    padding: 15,
    flexGrow: 1,
  },
  messageContainer: {
    marginBottom: 10,
    flexDirection: 'row',
  },
  sentMessage: {
    justifyContent: 'flex-end',
  },
  receivedMessage: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 15,
  },
  sentBubble: {
    backgroundColor: '#8BC34A',
    borderBottomRightRadius: 5,
  },
  receivedBubble: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 5,
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  messageTime: {
    fontSize: 12,
    color: '#666',
    alignSelf: 'flex-end',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f1f1f1',
  },
  messageInput: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    padding: 10,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#8BC34A',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  disabledButton: {
    backgroundColor: '#ddd',
  },
  noSelectedChat: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  noSelectedChatText: {
    fontSize: 16,
    color: '#888',
    marginTop: 10,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
});

export default MessagingScreen;