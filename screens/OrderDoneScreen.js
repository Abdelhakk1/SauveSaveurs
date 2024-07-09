import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentOrders, fetchHistoryOrders } from '../Actions/storeActions';

const OrderDoneScreen = ({ route }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const orderId = route.params?.orderId;
  const [loading, setLoading] = useState(true);
  const [reservation, setReservation] = useState(null);
  const userId = useSelector(state => state.store.userInfo.id);
  const currentOrders = useSelector(state => state.store.currentOrders);

  useEffect(() => {
    const fetchOrders = async () => {
      await dispatch(fetchCurrentOrders(userId));
      await dispatch(fetchHistoryOrders(userId));
      setLoading(false);
    };

    fetchOrders();
  }, [dispatch, userId]);

  useEffect(() => {
    const foundReservation = currentOrders.find(order => order.order_id === orderId);
    if (foundReservation) {
      setReservation(foundReservation);
    }
  }, [currentOrders, orderId]);

  const goToOrderPage = () => {
    if (reservation) {
      navigation.navigate('OrderPageScreen', { order: reservation });
    } else {
      console.log('No reservation found');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6b6e56" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/Ai 4.png')} style={styles.image} />
      <Text style={styles.title}>Great job!</Text>
      <Text style={styles.subtitle}>You just saved food from being wasted!</Text>
      <TouchableOpacity style={styles.button} onPress={goToOrderPage}>
        <Text style={styles.buttonText}>Go to order page</Text>
      </TouchableOpacity>
    </View>
  );
};

OrderDoneScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      orderId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6b6e56',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b6e56',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#6b6e56',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default OrderDoneScreen;
