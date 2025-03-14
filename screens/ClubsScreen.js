import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Modal,
  TextInput,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DataService from '../services/DataService';
import AuthService from '../services/AuthService';

const ClubsScreen = () => {
  const [clubs, setClubs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  // New club form state
  const [clubName, setClubName] = useState('');
  const [clubDescription, setClubDescription] = useState('');
  const [meetingDay, setMeetingDay] = useState('');
  const [meetingTime, setMeetingTime] = useState('');
  const [location, setLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadClubs();
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

  const loadClubs = async () => {
    try {
      setIsLoading(true);
      const clubsData = await DataService.getClubs();
      setClubs(clubsData);
    } catch (error) {
      console.error('Error loading clubs:', error);
      Alert.alert('Error', 'Failed to load clubs');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadClubs();
  };

  const handleJoinClub = async (clubId) => {
    try {
      const result = await DataService.joinClub(clubId);
      
      if (result.success) {
        // Reload clubs to update the UI
        loadClubs();
      } else {
        Alert.alert('Error', result.message || 'Failed to join club');
      }
    } catch (error) {
      console.error('Error joining club:', error);
      Alert.alert('Error', 'Failed to join club');
    }
  };

  const handleCreateClub = async () => {
    // Validate form
    if (!clubName.trim()) {
      Alert.alert('Error', 'Club name is required');
      return;
    }
    
    if (!clubDescription.trim()) {
      Alert.alert('Error', 'Club description is required');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Create new club object
      const newClub = {
        name: clubName,
        description: clubDescription,
        meetingDay,
        meetingTime,
        location,
        members: 1 // Start with the creator as a member
      };
      
      // Call API to create club
      const result = await DataService.createClub(newClub);
      
      if (result && result.success) {
        // Reset form
        setClubName('');
        setClubDescription('');
        setMeetingDay('');
        setMeetingTime('');
        setLocation('');
        
        // Close modal and reload clubs
        setModalVisible(false);
        loadClubs();
      } else {
        Alert.alert('Error', result?.message || 'Failed to create club');
      }
    } catch (error) {
      console.error('Error creating club:', error);
      Alert.alert('Error', 'Failed to create club');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderClub = ({ item }) => {
    return (
      <View style={styles.clubCard}>
        <View style={styles.clubHeader}>
          <Text style={styles.clubName}>{item.name}</Text>
          <TouchableOpacity 
            style={styles.joinButton}
            onPress={() => handleJoinClub(item.id)}
          >
            <Text style={styles.joinButtonText}>Join</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.clubDescription}>{item.description}</Text>
        
        <View style={styles.clubDetails}>
          {item.meetingDay && item.meetingTime && (
            <View style={styles.detailItem}>
              <Ionicons name="calendar-outline" size={16} color="#666" />
              <Text style={styles.detailText}>
                {item.meetingDay} at {item.meetingTime}
              </Text>
            </View>
          )}
          
          {item.location && (
            <View style={styles.detailItem}>
              <Ionicons name="location-outline" size={16} color="#666" />
              <Text style={styles.detailText}>{item.location}</Text>
            </View>
          )}
          
          <View style={styles.detailItem}>
            <Ionicons name="people-outline" size={16} color="#666" />
            <Text style={styles.detailText}>
              {item.members || 0} {item.members === 1 ? 'member' : 'members'}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Clubs</Text>
        <TouchableOpacity 
          style={styles.createButton}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      
      {isLoading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8BC34A" />
        </View>
      ) : (
        <FlatList
          data={clubs}
          renderItem={renderClub}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.clubsList}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#8BC34A']}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={60} color="#ccc" />
              <Text style={styles.emptyText}>No clubs available</Text>
              <Text style={styles.emptySubtext}>Create a new club to get started!</Text>
            </View>
          }
        />
      )}
      
      {/* Create Club Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New Club</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.formContainer}>
              <Text style={styles.inputLabel}>Club Name *</Text>
              <TextInput
                style={styles.input}
                value={clubName}
                onChangeText={setClubName}
                placeholder="Enter club name"
              />
              
              <Text style={styles.inputLabel}>Description *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={clubDescription}
                onChangeText={setClubDescription}
                placeholder="What is this club about?"
                multiline
                numberOfLines={4}
              />
              
              <Text style={styles.inputLabel}>Meeting Day</Text>
              <TextInput
                style={styles.input}
                value={meetingDay}
                onChangeText={setMeetingDay}
                placeholder="e.g. Monday, Tuesday, etc."
              />
              
              <Text style={styles.inputLabel}>Meeting Time</Text>
              <TextInput
                style={styles.input}
                value={meetingTime}
                onChangeText={setMeetingTime}
                placeholder="e.g. 3:30 PM"
              />
              
              <Text style={styles.inputLabel}>Location</Text>
              <TextInput
                style={styles.input}
                value={location}
                onChangeText={setLocation}
                placeholder="e.g. Room 101"
              />
              
              <TouchableOpacity 
                style={[
                  styles.createClubButton,
                  (isSubmitting || !clubName.trim() || !clubDescription.trim()) && 
                  styles.createClubButtonDisabled
                ]}
                onPress={handleCreateClub}
                disabled={isSubmitting || !clubName.trim() || !clubDescription.trim()}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.createClubButtonText}>Create Club</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  createButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clubsList: {
    padding: 10,
  },
  clubCard: {
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
  clubHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  clubName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  joinButton: {
    backgroundColor: '#8BC34A',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
  },
  joinButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  clubDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    lineHeight: 20,
  },
  clubDetails: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 10,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  formContainer: {
    padding: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#eee',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  createClubButton: {
    backgroundColor: '#8BC34A',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  createClubButtonDisabled: {
    backgroundColor: '#ccc',
  },
  createClubButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ClubsScreen;