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

const ClubsScreen = () => {
  const [clubs, setClubs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const user = await AuthService.getCurrentUser();
      setCurrentUser(user);
      
      const clubsData = await DataService.getClubs();
      setClubs(clubsData);
    } catch (error) {
      console.error('Error loading clubs data:', error);
      Alert.alert('Error', 'Failed to load clubs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinClub = async (clubId) => {
    try {
      const result = await DataService.joinClub(clubId);
      if (result.success) {
        // Update clubs list
        setClubs(clubs.map(club => 
          club.id === clubId 
            ? { ...club, members: club.members + 1, userJoined: true } 
            : club
        ));
        
        // Update current user
        const updatedUser = await AuthService.getCurrentUser();
        setCurrentUser(updatedUser);
        
        Alert.alert('Success', 'You have joined the club!');
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      console.error('Error joining club:', error);
      Alert.alert('Error', 'Failed to join club');
    }
  };

  const renderClubItem = ({ item }) => {
    const isJoined = currentUser && currentUser.clubs && currentUser.clubs.includes(item.id);
    
    return (
      <View style={styles.clubItem}>
        <View style={styles.clubIconContainer}>
          <Ionicons name={item.icon || "people"} size={32} color="#8BC34A" />
        </View>
        
        <View style={styles.clubInfo}>
          <Text style={styles.clubName}>{item.name}</Text>
          <Text style={styles.clubMembers}>{item.members} members</Text>
          <Text style={styles.clubDescription}>{item.description}</Text>
        </View>
        
        <TouchableOpacity
          style={[styles.joinButton, isJoined && styles.joinedButton]}
          onPress={() => !isJoined && handleJoinClub(item.id)}
          disabled={isJoined}
        >
          <Text style={styles.joinButtonText}>
            {isJoined ? 'Joined' : 'Join'}
          </Text>
        </TouchableOpacity>
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
        <Text style={styles.headerText}>Schurr Clubs</Text>
      </View>
      
      {clubs.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No clubs available at the moment.</Text>
        </View>
      ) : (
        <FlatList
          data={clubs}
          renderItem={renderClubItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.clubsList}
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
  clubsList: {
    padding: 15,
  },
  clubItem: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  clubIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f1f8e9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  clubInfo: {
    flex: 1,
  },
  clubName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  clubMembers: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  clubDescription: {
    fontSize: 14,
    color: '#333',
  },
  joinButton: {
    backgroundColor: '#8BC34A',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginLeft: 10,
  },
  joinedButton: {
    backgroundColor: '#ddd',
  },
  joinButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ClubsScreen;