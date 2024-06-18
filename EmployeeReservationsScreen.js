import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { supabase } from '../database/supabaseClient';
import { clearCompletedReservations, fetchNotifications } from '../Actions/storeActions';

const EmployeeReservationsScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userId = useSelector(state => state.store.userInfo?.id); // Get the user ID from the store
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchReservations = async () => {
      if (!userId) return; // Add check to ensure userId is defined

      try {
        const { data, error } = await supabase
          .from('reservations')
          .select(`
            *,
            clients!reservations_user_id_fkey ( full_name ),
            surprise_bags ( image_url, bag_number, validation )
          `);

        if (error) throw error;

        setReservations(data);
      } catch (error) {
        console.error('Error fetching reservations:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isFocused) {
      fetchReservations();
      dispatch(fetchNotifications(userId, 'employee')); // Fetch notifications when the screen is focused
    }
  }, [isFocused, userId, dispatch]); // Add userId and dispatch to dependency array

  const handleClearCompletedReservations = () => {
    if (!userId) {
      Alert.alert('Error', 'User ID is not available.');
      return;
    }

    Alert.alert(
      'Clear Reservations',
      'Are you sure you want to clear canceled and picked-up reservations?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes',
          onPress: async () => {
            await dispatch(clearCompletedReservations(userId));
            setReservations((prevReservations) =>
              prevReservations.filter(
                (reservation) =>
                  reservation.status !== 'Cancelled by store' &&
                  reservation.status !== 'Picked up' &&
                  reservation.status !== 'Cancelled by client'
              )
            );
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderReservation = ({ item }) => (
    <TouchableOpacity
      style={styles.reservationContainer}
      onPress={() => {
        navigation.navigate('SurpriseBagDetailsScreen', {
          reservationId: item.id, // Ensure the correct reservation ID is passed
        });
      }}
    >
      <Image
        source={{ uri: item.surprise_bags.image_url }}
        style={styles.image}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.bagName}>{item.surprise_bags.name}</Text>
        <Text style={styles.bagNumber}>Bag no: #{item.surprise_bags.bag_number}</Text>
        <Text style={styles.validation}>Validation: {item.surprise_bags.validation}</Text>
        <Text style={styles.status}>Status: {item.status}</Text>
        <Text style={styles.fullName}>Reserved by: {item.clients.full_name || 'N/A'}</Text>
      </View>
      <Icon name="chevron-right" size={24} color="#6b6e56" />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reservations</Text>
      <Text style={styles.totalReservations}>
        Total Reservations <Text style={styles.totalCount}>({reservations.length})</Text>
      </Text>
      <TouchableOpacity
        style={styles.clearButton}
        onPress={handleClearCompletedReservations}
      >
        <Text style={styles.clearButtonText}>Clear Completed Reservations</Text>
      </TouchableOpacity>
      {reservations.length === 0 ? (
        <View style={styles.noReservationsContainer}>
          <Icon name="format-list-checks" size={50} color="#6b6e56" style={styles.icon} />
          <Text style={styles.noReservationsText}>You have no reservations</Text>
        </View>
      ) : (
        <FlatList
          data={reservations}
          renderItem={renderReservation}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Changed to white
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#5c5f4c',
  },
  totalReservations: {
    fontSize: 18,
    color: '#5c5f4c',
    paddingBottom: 10,
  },
  totalCount: {
    color: '#7B8A47',
  },
  clearButton: {
    backgroundColor: '#7B8A47',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  clearButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noReservationsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    marginVertical: 20,
  },
  noReservationsText: {
    fontSize: 18,
    color: '#82866b',
    textAlign: 'center',
  },
  reservationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0e8',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
  },
  bagName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5c5f4c',
  },
  bagNumber: {
    fontSize: 14,
    color: '#5c5f4c',
  },
  validation: {
    fontSize: 14,
    color: '#5c5f4c',
  },
  status: {
    fontSize: 14,
    color: '#5c5f4c',
  },
  fullName: {
    fontSize: 14,
    color: '#5c5f4c',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#82866b',
  },
});

export default EmployeeReservationsScreen;
