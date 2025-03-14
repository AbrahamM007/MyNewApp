import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DataService from '../services/DataService';
import AuthService from '../services/AuthService';

const EventsScreen = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [userRsvps, setUserRsvps] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const user = await AuthService.getCurrentUser();
      setCurrentUser(user);
      
      const eventsData = await DataService.getEvents();
      setEvents(eventsData);
      
      // Get user's RSVPs
      if (user && user.rsvps) {
        setUserRsvps(user.rsvps);
      }
    } catch (error) {
      console.error('Error loading events data:', error);
      Alert.alert('Error', 'Failed to load events');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRsvp = async (eventId) => {
    try {
      const result = await DataService.rsvpEvent(eventId);
      if (result.success) {
        // Update events list
        setEvents(events.map(event => 
          event.id === eventId 
            ? { ...event, attendees: event.attendees + 1 } 
            : event
        ));
        
        // Update user's RSVPs
        setUserRsvps([...userRsvps, eventId]);
        
        Alert.alert('Success', 'You have RSVP\'d to the event!');
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      console.error('Error RSVP\'ing to event:', error);
      Alert.alert('Error', 'Failed to RSVP to event');
    }
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const renderEventItem = ({ item }) => {
    const hasRsvpd = userRsvps.includes(item.id);
    
    return (
      <View style={styles.eventItem}>
        <View style={styles.eventHeader}>
          <View style={styles.dateContainer}>
            <Text style={styles.dateDay}>
              {new Date(item.date).getDate()}
            </Text>
            <Text style={styles.dateMonth}>
              {new Date(item.date).toLocaleString('default', { month: 'short' })}
            </Text>
          </View>
          
          <View style={styles.eventInfo}>
            <Text style={styles.eventTitle}>{item.title}</Text>
            <Text style={styles.eventTime}>{item.time}</Text>
            <Text style={styles.eventLocation}>
              <Ionicons name="location-outline" size={14} color="#666" /> {item.location}
            </Text>
          </View>
        </View>
        
        <Text style={styles.eventDescription}>{item.description}</Text>
        
        <View style={styles.eventFooter}>
          <Text style={styles.attendees}>
            <Ionicons name="people-outline" size={16} color="#666" /> {item.attendees} attending
          </Text>
          
          <TouchableOpacity
            style={[styles.rsvpButton, hasRsvpd && styles.rsvpdButton]}
            onPress={() => !hasRsvpd && handleRsvp(item.id)}
            disabled={hasRsvpd}
          >
            <Text style={styles.rsvpButtonText}>
              {hasRsvpd ? 'Going' : 'RSVP'}
            </Text>
          </TouchableOpacity>
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
        <Text style={styles.headerText}>Schurr Events</Text>
      </View>
      
      {events.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No upcoming events at the moment.</Text>
        </View>
      ) : (
        <FlatList
          data={events}
          renderItem={renderEventItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.eventsList}
        />
      )}
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  eventsList: {
    padding: 15,
  },
  eventItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  eventHeader: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  dateContainer: {
    width: 50,
    height: 50,
    backgroundColor: '#8BC34A',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  dateDay: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  dateMonth: {
    color: '#fff',
    fontSize: 12,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  eventTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  eventLocation: {
    fontSize: 14,
    color: '#666',
  },
  eventDescription: {
    fontSize: 14,
    color: '#333',
    marginBottom: 15,
    lineHeight: 20,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  attendees: {
    fontSize: 14,
    color: '#666',
  },
  rsvpButton: {
    backgroundColor: '#8BC34A',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  rsvpdButton: {
    backgroundColor: '#ddd',
  },
  rsvpButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default EventsScreen;