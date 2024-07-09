import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { cancelReservationByClient, fetchCurrentOrders, fetchHistoryOrders } from '../Actions/storeActions';

const OrderPageScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const userId = useSelector(state => state.store.userInfo?.id);
  const reservation = route.params?.order;

  useEffect(() => {
    if (userId) {
      dispatch(fetchCurrentOrders(userId));
      dispatch(fetchHistoryOrders(userId));
    }
  }, [userId, dispatch]);

  const handleCancelReservation = () => {
    if (reservation && reservation.order_id && typeof reservation.order_id === 'string' && userId) {
      Alert.alert(
        'Cancel Reservation',
        'Are you sure you want to cancel this reservation?',
        [
          {
            text: 'No',
            style: 'cancel',
          },
          {
            text: 'Yes',
            onPress: async () => {
              console.log('Cancelling reservation with:', { reservation, userId });
              await dispatch(cancelReservationByClient(reservation.order_id, userId));
              await dispatch(fetchCurrentOrders(userId));  // Ensure fetching updated data
              await dispatch(fetchHistoryOrders(userId)); // Ensure fetching updated data
              navigation.navigate('Home');
            },
          },
        ],
        { cancelable: false }
      );
    } else {
      console.error('Invalid reservation ID or user ID', { reservation, userId });
      Alert.alert('Error', 'Invalid reservation ID or user ID.');
    }
  };

  if (!reservation) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Order not found</Text>
        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.homeButtonText}>Go to Home Screen</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Status</Text>
      <View style={styles.orderInfoContainer}>
        <Text style={styles.orderInfoTitle}>Your Order Information</Text>
        <Text style={styles.orderInfo}>
          Status: {reservation.status || 'Pending'}
        </Text>
        <Text style={styles.orderInfo}>Order ID: {reservation.order_id}</Text>
        <Text style={styles.orderInfo}>
          Total Amount: {reservation.amount ? `${reservation.amount} DZD` : '0.00 DZD'}
        </Text>
        <Text style={styles.orderInfo}>
          Store Location: {reservation.location || 'Alger, Algeria'}
        </Text>
        <Text style={styles.orderInfo}>
          Pick up Hour: {reservation.pickup_hour || '12:30pm - 4:30 pm'}
        </Text>
        <Text style={styles.orderInfo}>
          Surprise Bag Name: {reservation.bag_name || 'N/A'}
        </Text>
        <Text style={styles.orderInfo}>
          Store Name: {reservation.shop_name || 'N/A'}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={handleCancelReservation}
      >
        <Text style={styles.cancelButtonText}>Cancel Reservation</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.homeButtonText}>Go to Home Screen</Text>
      </TouchableOpacity>
      <Text style={styles.cancelNote}>
        You can cancel your order up to 2 hours before the start of the pick up time.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  orderInfoContainer: {
    marginBottom: 20,
  },
  orderInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  orderInfo: {
    fontSize: 16,
    marginBottom: 5,
  },
  cancelButton: {
    backgroundColor: '#6b6e56',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  homeButton: {
    backgroundColor: '#6b6e56',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  homeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelNote: {
    textAlign: 'center',
    color: '#82866b',
    fontSize: 14,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default OrderPageScreen;