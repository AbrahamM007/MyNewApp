import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MessagingScreen = () => {
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { id: 1, text: 'Hi there!', sender: 'me' },
    { id: 2, text: 'Hello! How are you?', sender: 'me' },
  ]);

  const sendMessage = () => {
    if (message.trim() === '') return;
    
    setChatMessages([...chatMessages, { 
      id: chatMessages.length + 1, 
      text: message, 
      sender: 'me' 
    }]);
    setMessage('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={require('../assets/schurr-logo.png')} 
          style={styles.logo} 
          resizeMode="contain"
        />
        <Text style={styles.headerText}>Schurr Community</Text>
      </View>

      <ScrollView style={styles.chatList}>
        <View style={styles.chatPreview}>
          <View style={styles.avatar}></View>
          <View style={styles.previewContent}>
            <Text style={styles.chatTitle}>Chat Title</Text>
            <Text style={styles.lastMessage}>Last message preview</Text>
          </View>
        </View>
        
        <View style={styles.divider}></View>
        
        <View style={styles.chatPreview}>
          <View style={styles.avatar}></View>
          <View style={styles.previewContent}>
            <Text style={styles.chatTitle}>Another Chat Title</Text>
            <Text style={styles.lastMessage}>Last message preview</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.activeChat}>
        <ScrollView style={styles.messagesContainer}>
          {chatMessages.map((chat) => (
            <View 
              key={chat.id} 
              style={[
                styles.messageBubble, 
                chat.sender === 'me' ? styles.myMessage : styles.theirMessage
              ]}
            >
              <Text style={styles.messageText}>{chat.text}</Text>
              <View style={styles.messageTimeContainer}>
                <View style={styles.messageTime}></View>
                <View style={styles.messageStatus}></View>
              </View>
            </View>
          ))}
        </ScrollView>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.inputContainer}
        >
          <TextInput
            style={styles.input}
            placeholder="Type your message..."
            value={message}
            onChangeText={setMessage}
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    </View>
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
  chatList: {
    maxHeight: 180,
  },
  chatPreview: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f1f1f1',
    marginRight: 15,
  },
  previewContent: {
    flex: 1,
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  lastMessage: {
    fontSize: 14,
    color: '#888',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f1f1',
    marginHorizontal: 15,
  },
  activeChat: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: '#f1f1f1',
  },
  messagesContainer: {
    flex: 1,
    padding: 15,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 20,
    marginBottom: 10,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#f1f2f6',
    borderBottomRightRadius: 5,
  },
  theirMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f1f2f6',
    borderBottomLeftRadius: 5,
  },
  messageText: {
    fontSize: 16,
  },
  messageTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 5,
  },
  messageTime: {
    width: 20,
    height: 20,
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    marginRight: 5,
  },
  messageStatus: {
    width: 20,
    height: 20,
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
  },
  inputContainer: {
    flexDirection: 'column',
    padding: 10,
  },
  input: {
    backgroundColor: '#f1f2f6',
    borderRadius: 25,
    padding: 15,
    marginBottom: 10,
  },
  sendButton: {
    backgroundColor: '#8BC34A',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default MessagingScreen;