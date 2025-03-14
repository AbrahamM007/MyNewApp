import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import DataService from '../services/DataService';
import AuthService from '../services/AuthService';

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [userClubs, setUserClubs] = useState([]);
  const [userEvents, setUserEvents] = useState([]);

  useEffect(() => {
    loadUserData();
    
    // Request permission for image picker
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to change your profile picture!');
      }
    })();
  }, []);

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      const userData = await AuthService.getCurrentUser();
      setUser(userData);
      
      // Load user's clubs
      if (userData.clubs && userData.clubs.length > 0) {
        const clubs = await DataService.getClubs();
        const userClubsData = clubs.filter(club => userData.clubs.includes(club.id));
        setUserClubs(userClubsData);
      }
      
      // Load user's events
      if (userData.rsvps && userData.rsvps.length > 0) {
        const events = await DataService.getEvents();
        const userEventsData = events.filter