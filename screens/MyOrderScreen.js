import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { clearOrderHistory } from '../Actions/storeActions';

const MyOrderScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('Current');
  const currentOrders = useSelector(state => state.store.currentOrders);
  const historyOrders = useSelector(state => state.store.historyOrders);

  const renderOrderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.orderItem}
      onPress={() => activeTab === 'Current' && navigation.navigate('OrderPageScreen', { orderId: item.id })}
      disabled={activeTab === 'History'}
    >
      <Image source={item.image ? { uri: item.image } : require('../assets/images/DALL·E 2024-04-26 00.04.20 - Create an image of a cozy coffee shop interior with wooden tables and chairs, warm ambient lighting, and some green plants in the corner. It should be.webp')} style={styles.orderImage} />
      <View style={styles.orderDetails}>
        <Text style={styles.orderTitle}>{item.title}</Text>
        <Text style={styles.storeName}>{item.storeName}</Text>
        <Text style={styles.orderDate}>{item.date}</Text>
        <Text style={styles.orderPickupHour}>Pick up: {item.pickupHour}</Text>
        <Text style={styles.orderPurchased}>Purchased: {item.purchased}</Text>
      </View>
      {activeTab === 'Current' && <Icon name="chevron-right" size={24} color="#6b6e56" />}
    </TouchableOpacity>
  );

  const handleClearHistory = () => {
    Alert.alert(
      "Clear Order History",
      "Are you sure you want to clear the order history?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: () => {
            dispatch(clearOrderHistory());
          }
        }
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={24} color="#6b6e56" />
      </TouchableOpacity>
      <Text style={styles.pageTitle}>My Orders</Text>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'Current' && styles.activeTab]}
          onPress={() => setActiveTab('Current')}
        >
          <Text style={[styles.tabText, activeTab === 'Current' && styles.activeTabText]}>Current</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'History' && styles.activeTab]}
          onPress={() => setActiveTab('History')}
        >
          <Text style={[styles.tabText, activeTab === 'History' && styles.activeTabText]}>History</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={activeTab === 'Current' ? currentOrders : historyOrders}
        renderItem={renderOrderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.orderList}
      />
      {activeTab === 'History' && historyOrders.length > 0 && (
        <TouchableOpacity style={styles.clearButton} onPress={handleClearHistory}>
          <Text style={styles.clearButtonText}>Clear Order History</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    position: 'absolute',
    top: 52,
    left: 10,
    zIndex: 10,
    padding: 10,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 60,
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
  },
  activeTab: {
    borderBottomColor: '#6b6e56',
  },
  tabText: {
    fontSize: 16,
    color: '#777',
  },
  activeTabText: {
    color: '#6b6e56',
  },
  orderList: {
    paddingHorizontal: 20,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0e8',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  orderImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 15,
  },
  orderDetails: {
    flex: 1,
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6b6e56',
  },
  storeName: {
    fontSize: 14,
    color: '#6b6e56',
    fontWeight: 'bold',
  },
  orderDate: {
    fontSize: 14,
    color: '#6b6e56',
  },
  orderPickupHour: {
    fontSize: 14,
    color: '#6b6e56',
  },
  orderPurchased: {
    fontSize: 12,
    color: '#777',
  },
  clearButton: {
    backgroundColor: '#6b6e56',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    margin: 20,
  },
  clearButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MyOrderScreen;
