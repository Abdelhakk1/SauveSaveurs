import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../database/supabaseClient';

const ChangePasswordScreen = () => {
  const navigation = useNavigation();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => setShowPassword(!showPassword);

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match.');
      return;
    }

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;

      const { user } = session;
      if (!user) throw new Error('No user logged in');

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });
      if (signInError) throw signInError;

      const { error: updatePasswordError } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (updatePasswordError) throw updatePasswordError;

      Alert.alert('Success', 'Password updated successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={24} color="#6b6e56" />
      </TouchableOpacity>
      <Text style={styles.pageTitle}>Change Password</Text>
      <View style={styles.formContainer}>
        <Text style={styles.label}>Current Password</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry={!showPassword}
            placeholder="Enter your current password"
            placeholderTextColor="rgba(0, 0, 0, 0.5)"
          />
          <TouchableOpacity onPress={toggleShowPassword}>
            <Icon name={showPassword ? "eye" : "eye-off"} size={24} color="#6b6e56" />
          </TouchableOpacity>
        </View>
        <Text style={styles.label}>New Password</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={!showPassword}
            placeholder="Enter your new password"
            placeholderTextColor="rgba(0, 0, 0, 0.5)"
          />
          <TouchableOpacity onPress={toggleShowPassword}>
            <Icon name={showPassword ? "eye" : "eye-off"} size={24} color="#6b6e56" />
          </TouchableOpacity>
        </View>
        <Text style={styles.label}>Confirm New Password</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showPassword}
            placeholder="Re-enter new password"
            placeholderTextColor="rgba(0, 0, 0, 0.5)"
          />
          <TouchableOpacity onPress={toggleShowPassword}>
            <Icon name={showPassword ? "eye" : "eye-off"} size={24} color="#6b6e56" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.resetButton} onPress={handleChangePassword}>
          <Text style={styles.resetButtonText}>Reset Password</Text>
        </TouchableOpacity>
      </View>
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
  formContainer: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    color: '#6b6e56',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  resetButton: {
    backgroundColor: '#6b6e56',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ChangePasswordScreen;
