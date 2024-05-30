import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { cancelReservation } from '../Actions/storeActions';

const OrderPageScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const orderId = route.params?.orderId; // Get the orderId from the route params
  const reservation = useSelector(state => state.store.currentOrders.find(order => order.order_id === orderId));
  const [timeRemaining, setTimeRemaining] = useState('');

  useEffect(() => {
    if (reservation && reservation.pickup_time) {
      const interval = setInterval(() => {
        updateTimer(reservation.pickup_time);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [reservation]);

  const updateTimer = (pickupTime) => {
    const now = new Date();
    const pickupDate = new Date(pickupTime);
    const timeDiff = pickupDate - now;

    if (timeDiff <= 0) {
      setTimeRemaining('Pick Up Time Reached');
      return;
    }

    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    setTimeRemaining(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
  };

  const handleCancelReservation = () => {
    Alert.alert(
      "Cancel Reservation",
      "Are you sure you want to cancel this reservation?",
      [
        {
          text: "No",
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: () => {
            dispatch(cancelReservation(reservation.id));
            navigation.navigate('Home');
          }
        }
      ],
      { cancelable: false }
    );
  };

  if (!reservation) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Order not found</Text>
        <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.homeButtonText}>Go to Home Screen</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Status</Text>
      <Text style={styles.pickupTime}>Pick Up Starts In {timeRemaining}</Text>
      <View style={styles.orderInfoContainer}>
        <Text style={styles.orderInfoTitle}>Your Order Information</Text>
        <Text style={styles.orderInfo}>Status: {reservation?.status || 'Pending'}</Text>
        <Text style={styles.orderInfo}>Order ID: {reservation?.order_id}</Text>
        <Text style={styles.orderInfo}>Total Amount: ${reservation?.amount || '0.00'}</Text>
        <Text style={styles.orderInfo}>Store Location: {reservation?.location || 'Alger, Algeria'}</Text>
        <Text style={styles.orderInfo}>Pick up Hour: {reservation?.pickup_hour || '12:30pm - 4:30 pm'}</Text>
        <Text style={styles.orderInfo}>Surprise Bag Name: {reservation?.bag_name || 'N/A'}</Text>
        <Text style={styles.orderInfo}>Store Name: {reservation?.shop_name || 'N/A'}</Text>
      </View>
      <TouchableOpacity style={styles.cancelButton} onPress={handleCancelReservation}>
        <Text style={styles.cancelButtonText}>Cancel Reservation</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate('Home')}>
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
  pickupTime: {
    backgroundColor: '#f0f0e8',
    padding: 15,
    textAlign: 'center',
    fontSize: 16,
    borderRadius: 10,
    marginBottom: 20,
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
    fontSize: 14,
    color: '#6b6e56',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#000',
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default OrderPageScreen;
