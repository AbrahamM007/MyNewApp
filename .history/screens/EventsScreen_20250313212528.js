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
import DateTimePicker from '@react-native-community/datetimepicker';
import DataService from '../services/DataService';
import AuthService from '../services/AuthService';

const EventsScreen = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  // New event form state
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventDate, setEventDate] = useState(new Date());
  const [eventTime, setEventTime] = useState(new Date());
  const [eventLocation, setEventLocation] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadEvents();
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

  const loadEvents = async () => {
    try {
      setIsLoading(true);
      const eventsData = await DataService.getEvents();
      setEvents(eventsData);
    } catch (error) {
      console.error('Error loading events:', error);
      Alert.alert('Error', 'Failed to load events');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadEvents();
  };

  const handleRSVP = async (eventId) => {
    try {
      const result = await DataService.rsvpEvent(eventId);
      
      if (result.success) {
        // Reload events to update the UI
        loadEvents();
      } else {
        Alert.alert('Error', result.message || 'Failed to RSVP to event');
      }
    } catch (error) {
      console.error('Error RSVP to event:', error);
      Alert.alert('Error', 'Failed to RSVP to event');
    }
  };

  const handleCreateEvent = async () => {
    // Validate form
    if (!eventTitle.trim()) {
      Alert.alert('Error', 'Event title is required');
      return;
    }
    
    if (!eventDescription.trim()) {
      Alert.alert('Error', 'Event description is required');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Format date and time
      const formattedDate = eventDate.toISOString().split('T')[0];
      const hours = eventTime.getHours();
      const minutes = eventTime.getMinutes();
      const formattedTime = `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
      
      // Create new event object
      const newEvent = {
        title: eventTitle,
        description: eventDescription,
        date: formattedDate,
        time: formattedTime,
        location: eventLocation
      };
      
      // Call API to create event
      const result = await DataService.createEvent(newEvent);
      
      if (result && result.success) {
        // Reset form
        setEventTitle('');
        setEventDescription('');
        setEventDate(new Date());
        setEventTime(new Date());
        setEventLocation('');
        
        // Close modal and reload events
        setModalVisible(false);
        loadEvents();
      } else {
        Alert.alert('Error', result?.message || 'Failed to create event');
      }
    } catch (error) {
      console.error('Error creating event:', error);
      Alert.alert('Error', 'Failed to create event');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const renderEvent = ({ item }) => {
    return (
      <View style={styles.eventCard}>
        <View style={styles.eventHeader}>
          <Text style={styles.eventTitle}>{item.title}</Text>
          <TouchableOpacity 
            style={styles.rsvpButton}
            onPress={() => handleRSVP(item.id)}
          >
            <Text style={styles.rsvpButtonText}>RSVP</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.eventDescription}>{item.description}</Text>
        
        <View style={styles.eventDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="calendar-outline" size={16} color="#666" />
            <Text style={styles.detailText}>{formatDate(item.date)}</Text>
          </View>
          
          {item.time && (
            <View style={styles.detailItem}>
              <Ionicons name="time-outline" size={16} color="#666" />
              <Text style={styles.detailText}>{item.time}</Text>
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
              {item.attendees || 0} {item.attendees === 1 ? 'attendee' : 'attendees'}
            </Text>
          </View>
          
          <View style={styles.detailItem}>
            <Ionicons name="person-outline" size={16} color="#666" />
            <Text style={styles.detailText}>Organized by {item.organizer}</Text>
          </View>
        </View>
      </View>
    );
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setEventDate(selectedDate);
    }
  };

  const onTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setEventTime(selectedTime);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Events</Text>
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
          data={events}
          renderItem={renderEvent}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.eventsList}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#8BC34A']}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={60} color="#ccc" />
              <Text style={styles.emptyText}>No events available</Text>
              <Text style={styles.emptySubtext}>Create a new event to get started!</Text>
            </View>
          }
        />
      )}
      
      {/* Create Event Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New Event</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.formContainer}>
              <Text style={styles.inputLabel}>Event Title *</Text>
              <TextInput
                style={styles.input}
                value={eventTitle}
                onChangeText={setEventTitle}
                placeholder="Enter event title"
              />
              
              <Text style={styles.inputLabel}>Description *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={eventDescription}
                onChangeText={setEventDescription}
                placeholder="What is this event about?"
                multiline
                numberOfLines={4}
              />
              
              <Text style={styles.inputLabel}>Date *</Text>
              <TouchableOpacity 
                style={styles.datePickerButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Text>{eventDate.toDateString()}</Text>
                <Ionicons name="calendar" size={20} color="#666" />
              </TouchableOpacity>
              
              {showDatePicker && (
                <DateTimePicker
                  value={eventDate}
                  mode="date"
                  display="default"
                  onChange={onDateChange}
                />
              )}
              
              <Text style={styles.inputLabel}>Time *</Text>
              <TouchableOpacity 
                style={styles.datePickerButton}
                onPress={() => setShowTimePicker(true)}
              >
                <Text>
                  {eventTime.getHours()}:{eventTime.getMinutes() < 10 ? '0' + eventTime.getMinutes() : eventTime.getMinutes()}
                </Text>
                <Ionicons name="time" size={20} color="#666" />
              </TouchableOpacity>
              
              {showTimePicker && (
                <DateTimePicker
                  value={eventTime}
                  mode="time"
                  display="default"
                  onChange={onTimeChange}
                />
              )}
              
              <Text style={styles.inputLabel}>Location</Text>
              <TextInput
                style={styles.input}
                value={eventLocation}
                onChangeText={setEventLocation}
                placeholder="Where will this event take place?"
              />
              
              <TouchableOpacity 
                style={[
                  styles.createEventButton,
                  (isSubmitting || !eventTitle.trim() || !eventDescription.trim()) && 
                  styles.createEventButtonDisabled
                ]}
                onPress={handleCreateEvent}
                disabled={isSubmitting || !eventTitle.trim() || !eventDescription.trim()}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.createEventButtonText}>Create Event</Text>
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
  eventsList: {
    padding: 10,
  },
  eventCard: {
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
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  rsvpButton: {
    backgroundColor: '#8BC34A',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
  },
  rsvpButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  eventDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    lineHeight: 20,
  },
  eventDetails: {
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