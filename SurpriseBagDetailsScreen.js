import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, Modal, Alert, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { supabase } from '../database/supabaseClient';
import { updateOrderStatus, fetchCurrentOrders, fetchHistoryOrders, addNotification } from '../Actions/storeActions';

const SurpriseBagDetailsScreen = () => {
  const route = useRoute();
  const { reservationId } = route.params;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userId = useSelector(state => state.store.userInfo.id);
  const [reservation, setReservation] = useState(null);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        console.log('Fetching reservation with ID:', reservationId);
        const { data, error } = await supabase
          .from('reservations')
          .select(`
            *,
            clients!reservations_user_id_fkey ( full_name ),
            surprise_bags ( image_url, name, price, description, category, bag_number, validation )
          `)
          .eq('id', reservationId)
          .single();

        if (error) throw error;

        if (data) {
          console.log('Reservation data:', data);
          setReservation(data);
        } else {
          throw new Error('No reservation found');
        }
      } catch (error) {
        console.error('Error fetching reservation:', error);
        Alert.alert('Error', 'Failed to fetch reservation. Please try again later.');
        navigation.goBack();
      }
    };

    fetchReservation();
  }, [reservationId, navigation]);

  const handleCancelReservation = useCallback(async () => {
    try {
      if (!reservation) {
        console.error('Reservation is null');
        return;
      }
      console.log('Cancelling reservation with Order ID:', reservation.order_id);
      console.log('User ID:', userId);

      await dispatch(updateOrderStatus(reservation.order_id, userId, 'Cancelled by store', reservation.user_id));
      await dispatch(addNotification(reservation.user_id, 'Your reservation was cancelled by the store.', 'client'));
      setReservation(prev => ({ ...prev, status: 'Cancelled by store' }));
      Alert.alert('Success', 'Reservation canceled successfully.');
      dispatch(fetchCurrentOrders(userId));
      dispatch(fetchHistoryOrders(userId));
      navigation.goBack();
    } catch (error) {
      console.error('Error canceling reservation:', error);
      Alert.alert('Error', 'Failed to cancel reservation.');
    }
  }, [dispatch, reservation, userId, navigation]);

  const handleConfirmPickup = useCallback(async () => {
    try {
      if (!reservation) {
        console.error('Reservation is null');
        return;
      }
      console.log('Confirming pickup for reservation with Order ID:', reservation.order_id);
      console.log('User ID:', userId);

      await dispatch(updateOrderStatus(reservation.order_id, userId, 'Picked up', reservation.user_id));
      await dispatch(addNotification(reservation.user_id, 'Your reservation has been picked up.', 'client'));
      setReservation(prev => ({ ...prev, status: 'Picked up' }));
      Alert.alert('Success', 'Reservation status updated to Picked up.');
      dispatch(fetchCurrentOrders(userId));
      dispatch(fetchHistoryOrders(userId));
      navigation.goBack();
    } catch (error) {
      console.error('Error confirming pickup:', error);
      Alert.alert('Error', 'Failed to confirm pickup.');
    }
  }, [dispatch, reservation, userId, navigation]);

  if (!reservation) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={24} color="#6b6e56" />
      </TouchableOpacity>
      <Text style={styles.title}>Surprise Bag Details</Text>
      <TouchableOpacity style={styles.menuButton} onPress={() => setConfirmModalVisible(true)}>
        <Icon name="dots-vertical" size={24} color="#6b6e56" />
      </TouchableOpacity>
      <Image source={{ uri: reservation.surprise_bags.image_url }} style={styles.image} />
      <View style={styles.detailsContainer}>
        <View style={styles.header}>
          <Text style={styles.bagName}>{reservation.surprise_bags.name}</Text>
          <Text style={styles.price}>{`${reservation.amount} DZD`}</Text>
        </View>
        <Text style={styles.bagNumber}>Bag no: #{reservation.surprise_bags.bag_number}</Text>
        <Text style={styles.pickupTime}>Pick up: {reservation.pickup_hour}</Text>
        <Text style={styles.description}>{reservation.surprise_bags.description}</Text>
        <Text style={styles.category}>{reservation.surprise_bags.category}</Text>
        <Text style={styles.validation}>Validation: {reservation.surprise_bags.validation}</Text>
        <View style={styles.orderInfo}>
          <Text style={styles.infoTitle}>Order Information</Text>
          <Text style={styles.infoText}>User Name: {reservation.clients.full_name}</Text>
          <Text style={styles.infoText}>Order ID: {reservation.order_id}</Text>
          <Text style={styles.infoText}>Pick up Hour: {reservation.pickup_hour}</Text>
        </View>
        {reservation.status !== 'Picked up' && (
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmPickup}>
            <Text style={styles.confirmButtonText}>Confirm Pick Up</Text>
          </TouchableOpacity>
        )}
      </View>

      <Modal
        visible={confirmModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setConfirmModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cancel Reservation</Text>
            <Text style={styles.modalMessage}>Do you want to cancel your reservation?</Text>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalButton} onPress={() => setConfirmModalVisible(false)}>
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={handleCancelReservation}>
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
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
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 60,
    color: '#5c5f4c',
  },
  menuButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
    padding: 10,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  detailsContainer: {
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bagName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#5c5f4c',
  },
  price: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#5c5f4c',
  },
  bagNumber: {
    fontSize: 16,
    color: '#5c5f4c',
    marginTop: 5,
  },
  pickupTime: {
    fontSize: 16,
    color: '#5c5f4c',
    marginTop: 5,
  },
  description: {
    fontSize: 16,
    color: '#5c5f4c',
    marginTop: 10,
  },
  category: {
    fontSize: 16,
    color: '#5c5f4c',
    marginTop: 5,
  },
  validation: {
    fontSize: 16,
    color: '#5c5f4c',
    marginTop: 5,
  },
  orderInfo: {
    marginTop: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5c5f4c',
  },
  infoText: {
    fontSize: 16,
    color: '#5c5f4c',
    marginTop: 5,
  },
  confirmButton: {
    backgroundColor: '#7B8A47',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5c5f4c',
    marginBottom: 20,
  },
  modalMessage: {
    fontSize: 14,
    color: '#5c5f4c',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    backgroundColor: '#7B8A47',
    borderRadius: 10,
    padding: 10,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default SurpriseBagDetailsScreen;
