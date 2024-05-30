import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const EmployeeReservationsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reservations</Text>
      <Text style={styles.totalReservations}>Total Reservations <Text style={styles.totalCount}>(00)</Text></Text>
      <Icon name="format-list-checks" size={50} color="#6b6e56" style={styles.icon} />
      <Text style={styles.noReservationsText}>You have no reservations</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 60,
    marginBottom: 20,
    color: '#5c5f4c',
  },
  totalReservations: {
    fontSize: 18,
    color: '#5c5f4c',
  },
  totalCount: {
    color: '#7B8A47',
  },
  icon: {
    marginVertical: 20,
  },
  noReservationsText: {
    fontSize: 18,
    color: '#82866b',
    textAlign: 'center',
  },
});

export default EmployeeReservationsScreen;
