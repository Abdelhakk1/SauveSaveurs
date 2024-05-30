import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

const OrderDoneScreen = ({ route }) => {
  const navigation = useNavigation();
  const orderId = route.params?.orderId; // Get the orderId from the route params
  const reservation = useSelector(state => state.store.currentOrders.find(order => order.order_id === orderId)); // Get the latest reservation

  const goToOrderPage = () => {
    if (reservation) {
      navigation.navigate('OrderPageScreen', { orderId: reservation.order_id });
    } else {
      console.log('No reservation found');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/Ai 4.png')} // Replace with your success image
        style={styles.image}
      />
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
