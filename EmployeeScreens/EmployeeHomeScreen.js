import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, FlatList } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { supabase } from '../database/supabaseClient';

const themeColors = {
  background: '#f3f3f0',
  titleText: '#5c5f4c',
  buttonText: '#ffffff',
  buttonBackground: '#82866b',
  borderColor: '#676a61',
};

const EmployeeHomeScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userId, uploadSuccess } = route.params || { userId: null, uploadSuccess: false };
  const [name, setName] = useState('Employee');
  const [shopDetails, setShopDetails] = useState(null);
  const [surpriseBags, setSurpriseBags] = useState([]);
  const [surpriseBagsCount, setSurpriseBagsCount] = useState(0);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      const { data: userProfile, error } = await supabase
        .from('employees')
        .select('full_name')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching employee data:', error);
      }

      if (userProfile) {
        setName(userProfile.full_name);
      } else {
        Alert.alert('Error', 'Failed to fetch employee data.');
      }
    };

    const fetchShopDetails = async () => {
      const { data: shop, error } = await supabase
        .from('shops')
        .select('id, shop_name, shop_address')
        .eq('employee_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching shop details:', error);
      }

      if (shop) {
        setShopDetails(shop);
        fetchSurpriseBags(shop.id);
      } else {
        setShopDetails(null);
      }
    };

    const fetchSurpriseBags = async (shopId) => {
      const { data: bags, error } = await supabase
        .from('surprise_bags')
        .select('*')
        .eq('shop_id', shopId);

      if (error) {
        console.error('Error fetching surprise bags:', error);
      } else {
        setSurpriseBags(bags);
        setSurpriseBagsCount(bags.length);
      }
    };

    if (userId) {
      fetchEmployeeData();
      fetchShopDetails();
    }

    if (uploadSuccess) {
      Alert.alert('Success', 'Shop information uploaded successfully.');
    }
  }, [userId, uploadSuccess]);

  useFocusEffect(
    useCallback(() => {
      if (shopDetails) {
        const fetchSurpriseBags = async (shopId) => {
          const { data: bags, error } = await supabase
            .from('surprise_bags')
            .select('*')
            .eq('shop_id', shopId);

          if (error) {
            console.error('Error fetching surprise bags:', error);
          } else {
            setSurpriseBags(bags);
            setSurpriseBagsCount(bags.length);
          }
        };

        fetchSurpriseBags(shopDetails.id);
      }
    }, [shopDetails])
  );

  const handleRegister = () => {
    navigation.navigate('ShopInformationScreen', { userId });
  };

  const renderItem = ({ item }) => (
    <View style={styles.bagCard}>
      <Image source={{ uri: item.image_url }} style={styles.bagImage} />
      <View style={styles.bagInfo}>
        <Text style={styles.bagName}>Surprise Bag</Text>
        <Text style={styles.bagNumber}>Bag no: #{item.bag_number}</Text>
        <Text style={styles.bagDate}>Date: {item.pickup_hour}</Text>
        <Text style={[styles.bagStatus, item.status === 'Reserved' ? styles.reserved : styles.available]}>{item.status}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.locationContainer}>
          <Image source={require('../assets/images/Ai 1.png')} style={styles.profileImage} />
          <View>
            <Text style={styles.headerTitle}>Hello {name}</Text>
            <TouchableOpacity style={styles.locationInfo} onPress={() => navigation.navigate('ChangeLocationScreen')}>
              <Icon name="map-marker-outline" size={20} color="#6b6e56" />
              <Text style={styles.address}>Alger, Algeria</Text>
              <Icon name="chevron-right" size={24} color="#6b6e56" />
            </TouchableOpacity>
            <Text style={styles.distance}>Within 2 km</Text>
          </View>
        </View>
        <Icon name="bell-outline" size={30} color="#6b6e56" />
      </View>

      {shopDetails ? (
        <>
          <TouchableOpacity style={styles.shopContainer} onPress={() => navigation.navigate('SurpriseBagsScreen', { userId })}>
            <Text style={styles.shopTitle}>My Shop</Text>
            <View style={styles.shopCard}>
              <Image source={require('../assets/images/DALL·E 2024-04-26 00.04.20 - Create an image of a cozy coffee shop interior with wooden tables and chairs, warm ambient lighting, and some green plants in the corner. It should be.webp')} style={styles.shopImage} />
              <View style={styles.shopInfo}>
                <Text style={styles.shopName}>{shopDetails.shop_name}</Text>
                <Text style={styles.shopAddress}>{shopDetails.shop_address}</Text>
                <Text style={styles.surpriseBagText}>Surprise Bags: {surpriseBagsCount}</Text>
              </View>
            </View>
          </TouchableOpacity>

          <View style={styles.surpriseBagsContainer}>
            <Text style={styles.surpriseBagsTitle}>Surprise Bags</Text>
            {surpriseBags.length > 0 ? (
              <FlatList
                data={surpriseBags}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.bagList}
              />
            ) : (
              <View style={styles.shopBag}>
                <Text style={styles.bagText}>You have no surprise bags</Text>
              </View>
            )}
          </View>
        </>
      ) : (
        <View style={styles.registrationContainer}>
          <Text style={styles.registrationTitle}>Complete your registration!</Text>
          <Text style={styles.registrationSubtitle}>Upload your shop’s pdf documents and kindly wait for the admin’s approval.</Text>
          <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
            <Text style={styles.registerButtonText}>Register</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: themeColors.titleText,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  address: {
    fontSize: 16,
    color: '#6b6e56',
    marginLeft: 5,
  },
  distance: {
    fontSize: 14,
    color: '#82866b',
  },
  registrationContainer: {
    backgroundColor: '#FFFFFF',
    borderColor: themeColors.borderColor,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 10,
    padding: 20,
    margin: 20,
    alignItems: 'center',
  },
  registrationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: themeColors.titleText,
    marginBottom: 10,
  },
  registrationSubtitle: {
    fontSize: 16,
    color: '#676767',
    textAlign: 'center',
    marginBottom: 20,
  },
  registerButton: {
    backgroundColor: themeColors.buttonBackground,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: themeColors.buttonText,
  },
  shopContainer: {
    padding: 20,
  },
  shopTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: themeColors.titleText,
    marginBottom: 10,
  },
  shopCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
    flexDirection: 'row',
  },
  shopImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 15,
  },
  shopInfo: {
    flex: 1,
  },
  shopName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: themeColors.titleText,
  },
  shopAddress: {
    fontSize: 14,
    color: '#676767',
    marginTop: 5,
  },
  surpriseBagText: {
    fontSize: 14,
    color: '#676767',
    marginTop: 10,
  },
  surpriseBagsContainer: {
    flex: 1,
    padding: 20,
  },
  surpriseBagsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  shopBag: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  bagText: {
    fontSize: 16,
    color: '#82866b',
  },
  bagList: {
    paddingBottom: 20,
  },
  bagCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  bagImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 15,
  },
  bagInfo: {
    flex: 1,
  },
  bagName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5c5f4c',
  },
  bagNumber: {
    fontSize: 14,
    color: '#676767',
  },
  bagDate: {
    fontSize: 14,
    color: '#676767',
  },
  bagStatus: {
    fontSize: 14,
    marginTop: 5,
  },
  reserved: {
    color: 'red',
  },
  available: {
    color: 'green',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#82866b',
    marginTop: 10,
  },
});

export default EmployeeHomeScreen;
