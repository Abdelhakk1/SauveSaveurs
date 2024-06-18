import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  Alert,
  Image
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { supabase } from '../database/supabaseClient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const CompleteProfileScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = route.params;

  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [address, setAddress] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);

  const profilePictures = [
    'https://rboyqdyoehiiajuvcyft.supabase.co/storage/v1/object/public/profile-pics/profile_picture_1.png?t=2024-06-09T18%3A54%3A34.449Z',
    'https://rboyqdyoehiiajuvcyft.supabase.co/storage/v1/object/public/profile-pics/profile_picture_2.png?t=2024-06-09T18%3A54%3A48.091Z',
    'https://rboyqdyoehiiajuvcyft.supabase.co/storage/v1/object/public/profile-pics/profile_picture_3.png?t=2024-06-09T18%3A54%3A54.048Z',
    'https://rboyqdyoehiiajuvcyft.supabase.co/storage/v1/object/public/profile-pics/profile_picture_4.png?t=2024-06-09T18%3A55%3A02.710Z'
  ];

  const handleDateChange = (date) => {
    setShowDatePicker(false);
    setDateOfBirth(date);
  };

  const handleCompleteProfile = async () => {
    try {
      // Check if the userId exists in the employees table
      const { data: employee, error: checkError } = await supabase
        .from('employees')
        .select('id')
        .eq('id', userId)
        .single();

      if (checkError || !employee) {
        throw new Error('Employee not found');
      }

      // Update the employee's profile with the address, date of birth, and profile picture
      const { error: updateError } = await supabase
        .from('employees')
        .update({ address, date_of_birth: dateOfBirth.toISOString(), profile_pic_url: profilePicture })
        .eq('id', userId);

      if (updateError) throw updateError;

      // Retrieve the employee's name and profile picture
      const { data: updatedEmployee, error: fetchError } = await supabase
        .from('employees')
        .select('full_name, profile_pic_url')
        .eq('id', userId)
        .single();

      if (fetchError || !updatedEmployee) throw new Error('Failed to fetch updated employee data');

      Alert.alert('Success', 'Profile updated successfully');

      // Navigate to EmployeeHomeScreen and pass the employee's name and profile picture as parameters
      navigation.navigate('EmployeeMainTabs', {
        screen: 'Home',
        params: { userId: userId, name: updatedEmployee.full_name, profilePicture: updatedEmployee.profile_pic_url },
      });
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleProfilePictureSelect = (url) => {
    setProfilePicture(url);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-left" size={24} color="#6b6e56" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Complete Your Profile</Text>
          <Text style={styles.headerSubtitle}>Please fill up your information. Don’t worry, no one will see this.</Text>
          
          <View style={styles.avatarContainer}>
            <TouchableOpacity onPress={() => handleProfilePictureSelect(profilePicture)}>
              {profilePicture ? (
                <Image source={{ uri: profilePicture }} style={styles.profileImage} />
              ) : (
                <Icon name="account-circle" size={100} color="#6b6e56" />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.profilePicturesContainer}>
            {profilePictures.map((url, index) => (
              <TouchableOpacity key={index} onPress={() => handleProfilePictureSelect(url)}>
                <Image source={{ uri: url }} style={styles.profilePicture} />
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Date of Birth</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateInput}>
              <Text style={styles.dateText}>
                {dateOfBirth.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={showDatePicker}
              mode="date"
              onConfirm={handleDateChange}
              onCancel={() => setShowDatePicker(false)}
            />
            
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your address"
              value={address}
              onChangeText={setAddress}
              autoCapitalize="words"
              placeholderTextColor="rgba(0, 0, 0, 0.6)"
            />
          </View>

          <View style={styles.footer}>
            <TouchableOpacity onPress={handleCompleteProfile} style={styles.completeProfileButton}>
              <Text style={styles.buttonText}>Complete Profile</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  backButton: {
    marginTop: 10,
    marginLeft: 10,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 30,
  },
  headerSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#82866b',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
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
  form: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#000',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 20,
    height: 50,
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#000',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 20,
    height: 50,
    color: '#000'
  },
  completeProfileButton: {
    backgroundColor: '#82866b',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    width: '60%',
    alignSelf: 'center', 
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    paddingBottom: 20,
  },
});

export default CompleteProfileScreen;
