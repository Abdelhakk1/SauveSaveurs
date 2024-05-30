import React, { useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Swiper from 'react-native-swiper';
import { useNavigation } from '@react-navigation/native';

const themeColors = {
  background: '#f3f3f0',
  skipButton: '#676a61',
  titleText: '#5c5f4c',
  buttonText: '#ffffff',
  buttonBackground: '#82866b',
};

const screenWidth = Dimensions.get('window').width;

const OnboardingScreen = () => {
  const navigation = useNavigation();
  const swiperRef = useRef(null);

  const screens = [
    {
      key: '1',
      image: require('../assets/images/Ai 1.png'),
      title: 'Get User-friendly service and reduce food waste',
    },
    {
      key: '2',
      image: require('../assets/images/Ai 2.png'),
      title: 'Find nearby Restaurants through the app',
    },
    {
      key: '3',
      image: require('../assets/images/Ai 3.png'),
      title: 'Pay When you pick up',
    }
  ];

  return (
    <Swiper
      ref={swiperRef}
      loop={false}
      dotColor="#ccc"
      activeDotColor={themeColors.buttonBackground}
    >
      {screens.map((screen, index) => (
        <View key={screen.key} style={styles.container}>
          <TouchableOpacity onPress={() => navigation.navigate('RoleSelectionScreen')} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
          <Image source={screen.image} style={styles.image} />
          <Text style={styles.title}>{screen.title}</Text>
          {index < screens.length - 1 ? (
            <TouchableOpacity onPress={() => swiperRef.current.scrollBy(1)} style={styles.button}>
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => navigation.navigate('RoleSelectionScreen')} style={styles.button}>
              <Text style={styles.buttonText}>Finish</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </Swiper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 20,
  },
  skipText: {
    color: themeColors.skipButton,
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {
    width: screenWidth - 100,
    height: (screenWidth - 40) * 1.5,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: themeColors.titleText,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 70,
  },
  button: {
    backgroundColor: themeColors.buttonBackground,
    paddingVertical: 12,
    borderRadius: 25,
    width: 200,
    alignItems: 'center',
    marginBottom: 30,
  },
  buttonText: {
    color: themeColors.buttonText,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default OnboardingScreen;
