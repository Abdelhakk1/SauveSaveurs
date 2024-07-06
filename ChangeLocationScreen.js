import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert
} from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';
import { supabase } from '../database/supabaseClient';

const ChangeLocationScreen = ({ route }) => {
  const navigation = useNavigation();
  const { userId } = route.params || {};

  const [location, setLocation] = useState(null);
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421
  });
  const [address, setAddress] = useState('');
  const [shops, setShops] = useState([]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      let { coords } = await Location.getCurrentPositionAsync({});
      if (coords) {
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
      }
    })();

    const fetchShops = async () => {
      try {
        const { data: shopsData, error } = await supabase
          .from('shops')
          .select('id, shop_name, shop_opening_hour, shop_weekend, latitude, longitude');

        if (error) {
          throw error;
        }

        setShops(shopsData);
      } catch (error) {
        console.error('Error fetching shops:', error);
        Alert.alert('Error', 'Failed to fetch shops.');
      }
    };

    fetchShops();
  }, []);

  const handleUseCurrentLocation = async () => {
    try {
      let { coords } = await Location.getCurrentPositionAsync({});
      if (coords) {
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
      } else {
        Alert.alert('Error', 'Failed to fetch current location.');
      }
    } catch (error) {
      console.error('Error fetching current location:', error);
      Alert.alert('Error', 'Failed to fetch current location.');
    }
  };

  const handleApplyLocation = async () => {
    if (!location) {
      Alert.alert('Error', 'No location selected');
      return;
    }

    try {
      const { error } = await supabase
        .from('clients')
        .update({
          latitude: location.latitude,
          longitude: location.longitude,
          address: address
        })
        .eq('id', userId);

      if (error) throw error;

      Alert.alert('Success', 'Location updated successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating location:', error);
      Alert.alert('Error', 'Failed to update location');
    }
  };

  const formatTime = (timeString) => {
    const date = new Date(timeString);
    if (isNaN(date)) return 'Invalid Date';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!userId) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>User ID is missing. Please try again.</Text>
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
          {location && (
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title="Selected Location"
              pinColor="red"
            />
          )}
          {shops.map((shop) => (
            <Marker
              key={shop.id}
              coordinate={{
                latitude: shop.latitude,
                longitude: shop.longitude,
              }}
              pinColor="blue"
            >
              <Callout>
                <View style={styles.callout}>
                  <Text style={styles.calloutTitle}>{shop.shop_name}</Text>
                  <Text>Opening Hours: {formatTime(shop.shop_opening_hour)}</Text>
                  <Text>Weekend Hours: {formatTime(shop.shop_weekend)}</Text>
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>
      </View>

      <TouchableOpacity style={styles.locationButton} onPress={handleUseCurrentLocation}>
        <Text style={styles.buttonText}>Use my current location</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.applyButton} onPress={handleApplyLocation}>
        <Text style={styles.buttonText}>Apply</Text>
      </TouchableOpacity>
    </View>
  );
};

ChangeLocationScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      userId: PropTypes.string.isRequired,
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
  callout: {
    width: 200,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  calloutTitle: {
    fontWeight: 'bold',
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
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ChangeLocationScreen;
