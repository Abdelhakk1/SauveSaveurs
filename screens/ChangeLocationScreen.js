import React from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  Platform,
} from 'react-native';
import MapView from 'react-native-maps'; // Make sure you have installed react-native-maps
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Ensure you've installed react-native-vector-icons
import { useNavigation } from '@react-navigation/native';

const ChangeLocationScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Change Location</Text>
        <View style={{ width: 24 }} /> 
      </View>

      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
         
        />
      </View>
      
      <TextInput
        style={styles.searchInput}
        placeholder="Search city"
        // Add other TextInput props as needed
      />
      
      <TouchableOpacity style={styles.locationButton}>
        <Text style={styles.buttonText}>Use my current location</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.applyButton}>
        <Text style={styles.buttonText}>Apply</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 30, 
    paddingHorizontal: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  mapContainer: {
    width: '90%', // Adjusted width to 90% of the screen
    height: '60%', // Adjust height as needed
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 20,
    alignSelf: 'center', // This ensures the mapContainer is centered
    elevation: Platform.OS === 'android' ? 5 : 0,
    // Add shadows for iOS
    shadowColor: Platform.OS === 'ios' ? '#000' : undefined,
    shadowOffset: Platform.OS === 'ios' ? { width: 0, height: 2 } : undefined,
    shadowOpacity: Platform.OS === 'ios' ? 0.1 : undefined,
    shadowRadius: Platform.OS === 'ios' ? 2 : undefined,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  searchInput: {
    height: 50,
    marginVertical: 20,
    padding: 10,
    backgroundColor: '#FFF',
    borderRadius: 25,
    width: '90%',
    borderWidth: 1,
    borderColor: '#abae9c',
    alignSelf: 'center', 
  },
  locationButton: {
    backgroundColor: '#abae9c', 
    padding: 15,
    borderRadius: 25,
    marginBottom: 10,
    alignSelf: 'center', 
    width: '60%',
  },
  applyButton: {
    backgroundColor: '#abae9c', 
    padding: 15,
    borderRadius: 25,
    alignSelf: 'center', 
    width: '60%',
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

});

export default ChangeLocationScreen;
