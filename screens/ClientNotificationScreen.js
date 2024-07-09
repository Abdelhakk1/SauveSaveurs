import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { clearNotifications } from '../Actions/storeActions';
import PropTypes from 'prop-types';

const ClientNotificationScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const notifications = useSelector(state => state.store.clientNotifications);
  const userId = useSelector(state => state.store.userInfo.id);

  const handleClearNotifications = () => {
    if (userId) {
      dispatch(clearNotifications(userId, 'client'));
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.notificationItem}>
      <View style={styles.iconContainer}>
        <Icon name="account-circle-outline" size={24} color="#6b6e56" />
      </View>
      <View style={styles.messageContainer}>
        <Text style={styles.messageText}>{item.message}</Text>
        <Text style={styles.timeText}>{item.created_at}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={item => item.id ? item.id.toString() : Math.random().toString(36).substr(2, 9)}
      />
      <TouchableOpacity style={styles.clearButton} onPress={handleClearNotifications}>
        <Text style={styles.clearButtonText}>Clear Notifications</Text>
      </TouchableOpacity>
    </View>
  );
};

ClientNotificationScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f3f0',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    marginTop: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    elevation: 1,
  },
  iconContainer: {
    backgroundColor: '#e1e1d0',
    borderRadius: 24,
    padding: 6,
    marginRight: 10,
  },
  messageContainer: {
    flex: 1,
  },
  messageText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  timeText: {
    fontSize: 14,
    color: '#82866b',
    marginTop: 5,
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

export default ClientNotificationScreen;
