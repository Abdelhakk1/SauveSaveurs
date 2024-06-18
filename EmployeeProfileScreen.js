import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { supabase } from '../database/supabaseClient';
import { fetchUserInfo } from '../Actions/storeActions';

const EmployeeProfileScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userInfo = useSelector(state => state.store.userInfo);

  useEffect(() => {
    const fetchEmployeeName = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error fetching session:', error);
        Alert.alert('Error', 'Failed to fetch session.');
        return;
      }
      if (!session) {
        Alert.alert('Error', 'User not logged in.');
        return;
      }
      const user = session.user;
      if (!user) {
        Alert.alert('Error', 'User not logged in.');
        return;
      }
      dispatch(fetchUserInfo(user.id, 'employee'));
    };

    fetchEmployeeName();
  }, [dispatch]);

  const handleNavigation = (screen, params = {}) => {
    navigation.navigate(screen, params);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('Error', 'Failed to log out.');
      return;
    }
    navigation.navigate('EmployeeSignInScreen');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.profileContainer}>
        {userInfo.profile_pic_url ? (
          <Image
            source={{ uri: userInfo.profile_pic_url }}
            style={styles.profileImage}
          />
        ) : (
          <Icon name="account-circle" size={100} color="#6b6e56" />
        )}
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{userInfo.full_name}</Text>
        </View>
        <TouchableOpacity style={styles.editIcon} onPress={() => handleNavigation('EmployeePersonalInformationScreen')}>
          <Icon name="pencil" size={24} color="#6b6e56" />
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigation('EmployeePersonalInformationScreen')}>
        <Icon name="account-circle-outline" size={24} color="#6b6e56" />
        <Text style={styles.menuText}>Personal Information</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigation('MyShopScreen', { userId: userInfo.id })}>
        <Icon name="store-outline" size={24} color="#6b6e56" />
        <Text style={styles.menuText}>My Shop</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigation('MyGeneralSettings')}>
        <Icon name="cog-outline" size={24} color="#6b6e56" />
        <Text style={styles.menuText}>General Settings</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigation('MySupportScreen')}>
        <Icon name="shield-outline" size={24} color="#6b6e56" />
        <Text style={styles.menuText}>Support</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={[styles.menuItem, styles.logoutItem]} onPress={handleLogout}>
        <Icon name="logout" size={24} color="#6b6e56" />
        <Text style={styles.menuText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Changed to white
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
  editIcon: {
    position: 'absolute',
    bottom: 30,
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
