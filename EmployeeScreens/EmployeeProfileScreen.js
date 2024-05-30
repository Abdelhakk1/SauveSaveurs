import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const EmployeeProfileScreen = () => {
  const navigation = useNavigation();

  const handleNavigation = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.profileContainer}>
        <Image
          source={require('../assets/images/Ai 2.png')} // Update this path to your actual image path
          style={styles.profileImage}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>Annie Maria</Text>
          <Text style={styles.profileId}>Employee ID: #1234</Text>
        </View>
        <TouchableOpacity style={styles.editIcon}>
          <Icon name="pencil" size={24} color="#6b6e56" />
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigation('MyPersonalInformation')}>
        <Icon name="account-circle-outline" size={24} color="#6b6e56" />
        <Text style={styles.menuText}>Personal Information</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigation('MyShop')}>
        <Icon name="store-outline" size={24} color="#6b6e56" />
        <Text style={styles.menuText}>My Shop</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigation('ShopReviews')}>
        <Icon name="star-outline" size={24} color="#6b6e56" />
        <Text style={styles.menuText}>Shop Reviews</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigation('MyGeneralSettings')}>
        <Icon name="cog-outline" size={24} color="#6b6e56" />
        <Text style={styles.menuText}>General Settings</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigation('MySupport')}>
        <Icon name="shield-outline" size={24} color="#6b6e56" />
        <Text style={styles.menuText}>Support</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={[styles.menuItem, styles.logoutItem]} onPress={() => handleNavigation('SignInScreen')}>
        <Icon name="logout" size={24} color="#6b6e56" />
        <Text style={styles.menuText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 60,
    marginBottom: 20,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileInfo: {
    alignItems: 'center',
    marginTop: 10,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5c5f4c',
  },
  profileId: {
    fontSize: 14,
    color: '#82866b',
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 100,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    padding: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0e8',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  menuText: {
    fontSize: 16,
    color: '#5c5f4c',
    marginLeft: 10,
  },
  logoutItem: {
    backgroundColor: '#FFFFFF',
    borderColor: '#6b6e56',
    borderWidth: 1,
  },
});

export default EmployeeProfileScreen;
