import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { supabase } from '../database/supabaseClient';
import { updateUserInfo } from '../Actions/storeActions';

const EmployeePersonalInformationScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userInfo = useSelector(state => state.store.userInfo);
  const [userData, setUserData] = useState({
    name: userInfo.full_name || '',
    email: userInfo.email || '',
    dob: userInfo.date_of_birth || '',
    address: userInfo.address || '',
  });
  const [profilePicUrl, setProfilePicUrl] = useState(userInfo.profile_pic_url || '');
  const [isEdited, setIsEdited] = useState(false);

  const profilePictures = [
    'https://rboyqdyoehiiajuvcyft.supabase.co/storage/v1/object/public/profile-pics/profile_picture_1.png',
    'https://rboyqdyoehiiajuvcyft.supabase.co/storage/v1/object/public/profile-pics/profile_picture_2.png',
    'https://rboyqdyoehiiajuvcyft.supabase.co/storage/v1/object/public/profile-pics/profile_picture_3.png',
    'https://rboyqdyoehiiajuvcyft.supabase.co/storage/v1/object/public/profile-pics/profile_picture_4.png'
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          Alert.alert('Error', 'User not logged in.');
          return;
        }
        const userId = session.user.id;

        const { data, error } = await supabase
          .from('employees')
          .select('full_name, email, date_of_birth, address, profile_pic_url')
          .eq('id', userId)
          .single();

        if (error) {
          throw error;
        }

        setUserData(data);
        setProfilePicUrl(data.profile_pic_url);
        dispatch(updateUserInfo(data));
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'Failed to fetch user data.');
      }
    };

    fetchUserData();
  }, [dispatch]);

  const handleInputChange = (field, value) => {
    setUserData({ ...userData, [field]: value });
    setIsEdited(true);
  };

  const handleProfilePictureSelect = async (url) => {
    setProfilePicUrl(url);
    setIsEdited(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        Alert.alert('Error', 'User not logged in.');
        return;
      }
      const userId = session.user.id;

      const { error } = await supabase
        .from('employees')
        .update({ profile_pic_url: url })
        .eq('id', userId);

      if (error) {
        throw error;
      }

      const updatedUserInfo = { ...userInfo, profile_pic_url: url };
      dispatch(updateUserInfo(updatedUserInfo));
      Alert.alert('Success', 'Profile picture updated successfully.');
    } catch (error) {
      console.error('Error updating profile picture:', error);
      Alert.alert('Error', 'Failed to update profile picture. Please try again.');
    }
  };

  const handleSave = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        Alert.alert('Error', 'User not logged in.');
        return;
      }
      const userId = session.user.id;

      const updates = {
        full_name: userData.name,
        email: userData.email,
        date_of_birth: userData.dob,
        address: userData.address,
        profile_pic_url: profilePicUrl,
      };

      const { error } = await supabase
        .from('employees')
        .update(updates)
        .eq('id', userId);

      if (error) {
        throw error;
      }

      dispatch(updateUserInfo(updates));
      Alert.alert('Success', 'User information updated successfully.');
      setIsEdited(false);
    } catch (error) {
      console.error('Error updating user data:', error);
      Alert.alert('Error', 'Failed to update user data.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={24} color="#6b6e56" />
      </TouchableOpacity>
      <Text style={styles.pageTitle}>Personal Information</Text>
      <TouchableOpacity onPress={() => {}}>
        {profilePicUrl ? (
          <Image source={{ uri: profilePicUrl }} style={styles.profileImage} />
        ) : (
          <Icon name="account-circle" size={100} color="#6b6e56" />
        )}
      </TouchableOpacity>
      <View style={styles.profilePicturesContainer}>
        {profilePictures.map((url, index) => (
          <TouchableOpacity key={index} onPress={() => handleProfilePictureSelect(url)}>
            <Image source={{ uri: url }} style={styles.profilePicture} />
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.userName}>{userData.name}</Text>
      <View style={styles.formContainer}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput 
          style={styles.input} 
          value={userData.name} 
          onChangeText={(text) => handleInputChange('name', text)}
        />
        <Text style={styles.label}>Email</Text>
        <TextInput 
          style={styles.input} 
          value={userData.email} 
          keyboardType="email-address"
          onChangeText={(text) => handleInputChange('email', text)}
        />
        <Text style={styles.label}>Date of Birth</Text>
        <View style={styles.dateInputContainer}>
          <Icon name="calendar" size={20} color="#6b6e56" />
          <TextInput 
            style={styles.dateInput} 
            value={userData.dob} 
            placeholder="YYYY-MM-DD"
            onChangeText={(text) => handleInputChange('dob', text)}
          />
        </View>
        <Text style={styles.label}>Address</Text>
        <TextInput 
          style={styles.input} 
          value={userData.address} 
          onChangeText={(text) => handleInputChange('address', text)}
        />
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>{isEdited ? 'Save' : 'Update Information'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingTop: 30,
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
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 20,
  },
  profilePicturesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginHorizontal: 10,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 15,
  },
  formContainer: {
    width: '90%',
    marginTop: 30,
  },
  label: {
    fontSize: 16,
    color: '#6b6e56',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  dateInput: {
    marginLeft: 10,
    fontSize: 16,
    flex: 1,
  },
  saveButton: {
    backgroundColor: '#6b6e56',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EmployeePersonalInformationScreen;
