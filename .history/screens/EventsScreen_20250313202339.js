import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  TouchableOpacity, 
  ScrollView,
  SafeAreaView
} from 'react-native';

const EventsScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={require('../assets/schurr-logo.png')} 
          style={styles.logo} 
          resizeMode="contain"
        />
        <Text style={styles.headerText}>Schurr Community</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.eventContainer}>
          <Text style={styles.eventTitle}>Event Title</Text>
          <Text style={styles.eventDateTime}>Date/Time</Text>
          
          <TouchableOpacity style={styles.rsvpButton}>
            <Text style={styles.rsvpButtonText}>RSVP</Text>
          </TouchableOpacity>
          
          <Text style={styles.sectionTitle}>Event Details</Text>
          
          <Text style={styles.eventDescription}>
            Full event description covering all essential information, including date, time, and location.
          </Text>
          
          <TouchableOpacity style={styles.rsvpNowButton}>
            <Text style={styles.rsvpButtonText}>RSVP Now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
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
  scrollView: {
    flex: 1,
  },
  eventContainer: {
    padding: 20,
  },
  eventTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  eventDateTime: {
    fontSize: 16,
    color: '#888',
    marginBottom: 20,
  },
  rsvpButton: {
    backgroundColor: '#8BC34A',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 30,
  },
  rsvpButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  eventDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 30,
  },
  rsvpNowButton: {
    backgroundColor: '#8BC34A',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 30,
  },
});

export default EventsScreen;