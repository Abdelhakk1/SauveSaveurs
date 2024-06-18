import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, Modal, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { supabase } from '../database/supabaseClient';
import { fetchUserInfo } from '../Actions/storeActions';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const userInfo = useSelector(state => state.store.userInfo);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          Alert.alert('Error', 'User not logged in.');
          return;
        }
        const user = session.user;
        if (!user) {
          Alert.alert('Error', 'User not logged in.');
          return;
        }
        dispatch(fetchUserInfo(user.id, 'client'));
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'Failed to fetch user data.');
      }
    };

    fetchUserData();
  }, [dispatch]);

  const handleLogout = async () => {
    setLogoutModalVisible(false);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      navigation.reset({ index: 0, routes: [{ name: 'UserSignInScreen' }] });
    } catch (error) {
      Alert.alert('Error', 'Failed to log out.');
    }
  };

  const menuItems = [
    { id: '1', title: 'Personal Information', iconName: 'account-circle-outline', screen: 'MyPersonalInformation' },
    { id: '2', title: 'My Order', iconName: 'package-variant-closed', screen: 'MyOrderScreen' },
    { id: '3', title: 'General Settings', iconName: 'cog-outline', screen: 'MyGeneralSettings' },
    { id: '4', title: 'Support', iconName: 'lifebuoy', screen: 'MySupportScreen' },
    { id: '5', title: 'Log Out', iconName: 'logout', action: () => setLogoutModalVisible(true) },
  ];

  const handleMenuItemPress = (item) => {
    if (item.screen) {
      navigation.navigate(item.screen);
    } else if (item.action) {
      item.action();
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuItemPress(item)}>
      <Icon name={item.iconName} size={24} color="#676a61" style={styles.icon} />
      <Text style={styles.menuText}>{item.title}</Text>
    </TouchableOpacity>
  );

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
        <TouchableOpacity style={styles.editIcon} onPress={() => handleMenuItemPress({ screen: 'MyPersonalInformation' })}>
          <Icon name="pencil" size={24} color="#6b6e56" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.menuBox}>
        <FlatList
          data={menuItems}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </View>

      <Modal
        visible={logoutModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Do you want to log out?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={() => setLogoutModalVisible(false)}>
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={handleLogout}>
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
  menuBox: {
    width: '100%',
    marginTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0e8',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  icon: {
    marginRight: 15,
  },
  menuText: {
    fontSize: 18,
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
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    backgroundColor: '#6b6e56',
    borderRadius: 5,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default ProfileScreen;
