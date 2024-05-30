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
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../database/supabaseClient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const UserSignInScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      const userId = data.user.id;
      const { data: userProfile, error: profileError } = await supabase
        .from('clients')
        .select('full_name')
        .eq('id', userId)
        .single();

      if (profileError) {
        Alert.alert('Error', profileError.message);
      } else {
        const fullName = userProfile.full_name || 'User';
        navigation.navigate('MainTabs', { screen: 'Home', params: { userId, fullName } });
      }
    }
  };

  const handleSignUpNavigation = () => {
    navigation.navigate('UserSignUpScreen'); 
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-left" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Sign In</Text>
          <Text style={styles.headerSubtitle}>Hello, welcome back!</Text>
          
          <View style={styles.form}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <View style={styles.footer}>
            <TouchableOpacity 
              onPress={handleSignIn} 
              style={[styles.signUpButton, (!email || !password) && { backgroundColor: '#cccccc' }]}
              disabled={!email || !password}
            >
              <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>
            
            <View style={styles.signUpContainer}>
              <Text>Dont have an account? </Text>
              <TouchableOpacity onPress={handleSignUpNavigation}>
                <Text style={styles.signUpText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
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
    justifyContent: 'space-between',
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
    marginTop: 60,
  },
  headerSubtitle: {
    fontSize: 18,
    textAlign: 'center',
    color: '#676767',
    fontWeight: 'bold',
    marginBottom: 100,
  },
  form: {
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
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
  signUpButton: {
    backgroundColor: '#82866b',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    width: '60%',
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    paddingBottom: 20,
    paddingTop: 300,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signUpText: {
    color: '#82866b',
    fontWeight: 'bold',
  },
});

export default UserSignInScreen;
