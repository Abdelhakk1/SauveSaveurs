import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const themeColors = {
  background: '#f3f3f0',
  titleText: '#5c5f4c',
  buttonText: '#ffffff',
  buttonBackground: '#82866b',
  borderColor: '#676a61',
};

const screenWidth = Dimensions.get('window').width;

const RoleSelectionScreen = () => {
  const navigation = useNavigation();

  const handleUserSelect = () => {
    navigation.navigate('UserSignInScreen');
  };

  const handleEmployeeSelect = () => {
    navigation.navigate('EmployeeSignInScreen');
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/Ai 5.png')}
        style={styles.image}
      />
      <Text style={styles.promptText}>
        Please select your preferable role and get started!
      </Text>

      <Text style={styles.promptText}>
        Join with us as...
      </Text>

      <TouchableOpacity 
        onPress={handleUserSelect} 
        style={[styles.button, styles.userButton]}
      >
        <Text style={styles.buttonText}>User</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={handleEmployeeSelect} 
        style={[styles.button, styles.employeeButton]}
      >
        <Text style={[styles.buttonText, styles.employeeButtonText]}>Employee</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  promptText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: themeColors.titleText,
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    width: 200,
    paddingVertical: 12,
    borderRadius: 25,
    marginVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: themeColors.borderColor,
  },
  userButton: {
    backgroundColor: themeColors.buttonBackground,
  },
  employeeButton: {
    backgroundColor: '#FFFFFF',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: themeColors.buttonText,
  },
  image: {
    marginBottom: 40,
    width: screenWidth * 0.8,
    height: screenWidth * 0.70,
    resizeMode: 'contain',
  },
  employeeButtonText: {
    color: themeColors.titleText,
  },
});

export default RoleSelectionScreen;
