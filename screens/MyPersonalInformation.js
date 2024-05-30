import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const MyPersonalInformation = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState({
    name: 'Abdelhak',
    email: 'abdelkaderkheddaouiabdelhak@gmail.com',
    dob: '07-10-2003',
    address: 'Alger, Algeria',
    profilePicture: require('../assets/images/Ai 1.png') // Make sure the file path is correct
  });
  const [isEdited, setIsEdited] = useState(false);

  const handleInputChange = (field, value) => {
    setUserData({ ...userData, [field]: value });
    setIsEdited(true);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={24} color="#6b6e56" />
      </TouchableOpacity>
      <Text style={styles.pageTitle}>Personal Information</Text>
      <Image source={userData.profilePicture} style={styles.profileImage} />
      <Text style={styles.userName}>{userData.name}</Text>
      <TouchableOpacity style={styles.editIconContainer}>
        <Icon name="pencil" size={20} color="#FFFFFF" />
      </TouchableOpacity>
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
            onChangeText={(text) => handleInputChange('dob', text)}
          />
        </View>
        <Text style={styles.label}>Address</Text>
        <TextInput 
          style={styles.input} 
          value={userData.address} 
          onChangeText={(text) => handleInputChange('address', text)}
        />
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>{isEdited ? 'Save' : 'Update Information'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 15,
  },
  editIconContainer: {
    backgroundColor: '#6b6e56',
    borderRadius: 15,
    padding: 5,
    position: 'absolute',
    top: 140,
    right: 135,
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

export default MyPersonalInformation;
