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
  Alert
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { supabase } from '../database/supabaseClient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';

const CompleteProfileScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = route.params;

  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [address, setAddress] = useState('');

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDateOfBirth(selectedDate);
    }
  };

  const handleCompleteProfile = async () => {
    try {
      console.log('userId:', userId); // Debugging: Log the userId

      // Check if the userId exists in the employees table
      const { data: existingEmployee, error: checkError } = await supabase
        .from('employees')
        .select('id')
        .eq('id', userId)
        .single();

      if (checkError) {
        throw new Error('Employee not found: ' + checkError.message);
      }

      console.log('Existing Employee:', existingEmployee); // Log existing employee data

      // Update the employee's profile with the address and date of birth
      const { error: updateError } = await supabase
        .from('employees')
        .update({ address: address, date_of_birth: dateOfBirth.toISOString() })
        .eq('id', userId);

      if (updateError) throw updateError;

      // Retrieve the employee's name
      const { data: employee, error: fetchError } = await supabase
        .from('employees')
        .select('full_name')
        .eq('id', userId)
        .single();

      if (fetchError) throw fetchError;

      Alert.alert('Success', 'Profile updated successfully');

      // Navigate to EmployeeMainTabs and pass the employee's name as a parameter
      navigation.navigate('EmployeeMainTabs', {
        screen: 'Home',
        params: { userId: userId, name: employee.full_name },
      });
    } catch (error) {
      Alert.alert('Error', error.message);
    }
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
            <Icon name="account-circle" size={100} color="#6b6e56" />
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Date of Birth</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateInput}>
              <Text style={styles.dateText}>
                {dateOfBirth.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={dateOfBirth}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}
            
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your address"
              value={address}
              onChangeText={setAddress}
              autoCapitalize="words"
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
