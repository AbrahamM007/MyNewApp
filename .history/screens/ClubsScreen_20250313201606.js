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
import { Ionicons } from '@expo/vector-icons';

const ClubsScreen = () => {
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
        <View style={styles.clubsGrid}>
          <View style={styles.row}>
            <TouchableOpacity style={styles.clubCard}>
              <Ionicons name="person" size={24} color="#8BC34A" />
              <Text style={styles.clubName}>Club 1</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.clubCard}>
              <Ionicons name="person" size={24} color="#8BC34A" />
              <Text style={styles.clubName}>Club 2</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.row}>
            <TouchableOpacity style={styles.clubCard}>
              <Ionicons name="person" size={24} color="#8BC34A" />
              <Text style={styles.clubName}>Club 3</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.clubCard}>
              <Ionicons name="person" size={24} color="#8BC34A" />
              <Text style={styles.clubName}>Club 4</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.featuredClub}>
          <View style={styles.clubLogo}></View>
          <View style={styles.clubInfo}>
            <Text style={styles.featuredClubName}>Club Name</Text>
            <Text style={styles.joinText}>Join</Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.joinButton}>
          <Text style={styles.joinButtonText}>Join</Text>
        </TouchableOpacity>
        
        <View style={styles.forumSection}>
          <Text style={styles.forumTitle}>Club Chat/Forum</Text>
          
          <View style={styles.forumMessages}>
            <View style={styles.message}>
              <Text style={styles.messageText}>Welcome to the Club!</Text>
            </View>
            
            <View style={styles.message}>
              <Text style={styles.messageText}>Let's start discussing!</Text>
            </View>
            
            <View style={styles.messageUser}>
              <View style={styles.userAvatar}></View>
              <View style={styles.userStatus}></View>
            </View>
          </View>
          
          <View style={styles.divider}></View>
          
          <TouchableOpacity style={styles.joinClubButton}>
            <Text style={styles.joinClubButtonText}>Join Club</Text>
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
  clubsGrid: {
    padding: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  clubCard: {
    width: '48%',
    backgroundColor: '#f1f2f6',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clubName: {
    marginTop: 10,
    color: '#8BC34A',
    fontWeight: '500',
  },
  featuredClub: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginBottom: 15,
  },
  clubLogo: {
    width: 70,
    height: 70,
    backgroundColor: '#f1f2f6',
    borderRadius: 10,
    marginRight: 15,
  },
  clubInfo: {
    flex: 1,
  },
  featuredClubName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  joinText: {
    color: '#888',
  },
  joinButton: {
    backgroundColor: '#8BC34A',
    borderRadius: 10,
    padding: 15,
    margin: 15,
    alignItems: 'center',
  },
  joinButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  forumSection: {
    padding: 15,
  },
  forumTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  forumMessages: {
    marginBottom: 15,
  },
  message: {
    backgroundColor: '#f1f2f6',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    maxWidth: '80%',
    alignSelf: 'flex-end',
  },
  messageText: {
    fontSize: 16,
  },
  messageUser: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  userAvatar: {
    width: 40,
    height: 40,
    backgroundColor: '#f1f2f6',
    borderRadius: 20,
    marginRight: 10,
  },
  userStatus: {
    width: 40,
    height: 40,
    backgroundColor: '#f1f2f6',
    borderRadius: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f1f1',
    marginVertical: 15,
  },
  joinClubButton: {
    backgroundColor: '#8BC34A',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  joinClubButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ClubsScreen;