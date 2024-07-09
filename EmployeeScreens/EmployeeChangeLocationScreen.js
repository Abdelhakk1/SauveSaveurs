import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';
import { supabase } from '../database/supabaseClient';

const EmployeeChangeLocationScreen = ({ route }) => {
  const navigation = useNavigation();
  const { shopId } = route.params || {};

  const [location, setLocation] = useState(null);
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421
  });
  const [address, setAddress] = useState('');

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      let { coords } = await Location.getCurrentPositionAsync({});
      setLocation(coords);
      setRegion({
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      });

      const addressResponse = await Location.reverseGeocodeAsync(coords);
      const currentAddress = addressResponse[0];
      setAddress(`${currentAddress.street}, ${currentAddress.city}`);
    })();
  }, []);

  const handleUseCurrentLocation = async () => {
    try {
      let { coords } = await Location.getCurrentPositionAsync({});
      setLocation(coords);
      setRegion({
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      });

      const addressResponse = await Location.reverseGeocodeAsync(coords);
      const currentAddress = addressResponse[0];
      setAddress(`${currentAddress.street}, ${currentAddress.city}`);

      Alert.alert('Success', 'Current location fetched successfully.');
    } catch (error) {
      console.error('Error fetching current location:', error);
      Alert.alert('Error', 'Failed to fetch current location.');
    }
  };

  const handleUseSelectedLocation = () => {
    if (region) {
      setLocation({
        latitude: region.latitude,
        longitude: region.longitude
      });

      const addressResponse = Location.reverseGeocodeAsync({
        latitude: region.latitude,
        longitude: region.longitude
      });
      addressResponse.then((result) => {
        const selectedAddress = result[0];
        setAddress(`${selectedAddress.street}, ${selectedAddress.city}`);
      });
    }
  };

  const handleApplyLocation = async () => {
    if (!location) {
      Alert.alert('Error', 'No location selected');
      return;
    }

    try {
      const { error } = await supabase
        .from('shops')
        .update({
          latitude: location.latitude,
          longitude: location.longitude,
          shop_address: address // Correct column name
        })
        .eq('id', shopId);

      if (error) throw error;

      Alert.alert('Success', 'Location updated successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating location:', error);
      Alert.alert('Error', 'Failed to update location');
    }
  };

  if (!shopId) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Shop ID is missing. Please try again.</Text>
      </View>
    );
  }

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
          region={region}
          onRegionChangeComplete={(reg) => setRegion(reg)}
        >
          <Marker
            coordinate={{
              latitude: region.latitude,
              longitude: region.longitude,
            }}
            title="Selected Location"
            pinColor="red"
          />
        </MapView>
      </View>

      <TouchableOpacity style={styles.locationButton} onPress={handleUseCurrentLocation}>
        <Text style={styles.buttonText}>Use my current location</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.locationButton} onPress={handleUseSelectedLocation}>
        <Text style={styles.buttonText}>Use this location</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.applyButton} onPress={handleApplyLocation}>
        <Text style={styles.buttonText}>Apply</Text>
      </TouchableOpacity>
    </View>
  );
};

EmployeeChangeLocationScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      shopId: PropTypes.string.isRequired,
    }),
  }).isRequired,
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
    width: '90%',
    height: '60%',
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 20,
    alignSelf: 'center',
    elevation: Platform.OS === 'android' ? 5 : 0,
    shadowColor: Platform.OS === 'ios' ? '#000' : undefined,
    shadowOffset: Platform.OS === 'ios' ? { width: 0, height: 2 } : undefined,
    shadowOpacity: Platform.OS === 'ios' ? 0.1 : undefined,
    shadowRadius: Platform.OS === 'ios' ? 2 : undefined,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  locationButton: {
    backgroundColor: '#abae9c', 
    padding: 15,
    borderRadius: 25,
    marginBottom: 10,
    alignSelf: 'center', 
    width: '60%',
    top: 10,
  },
  applyButton: {
    backgroundColor: '#abae9c', 
    padding: 15,
    borderRadius: 25,
    alignSelf: 'center', 
    width: '60%',
    top: 10,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default EmployeeChangeLocationScreen;
