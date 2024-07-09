// SplashScreen.js
import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('OnboardingScreen'); // Replace with the initial screen you want to navigate to
    }, 6000); // 6 seconds delay

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/WhatsApp Image 2024-06-10 at 4.17.51 AM.jpeg')} style={styles.logo} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // Background color from the provided image
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 500, // Increased size
    height: 1000, // Increased size
    resizeMode: 'contain',
  },
});

export default SplashScreen;
