import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, FlatList, RefreshControl, SafeAreaView } from 'react-native';
import PropTypes from 'prop-types';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { supabase } from '../database/supabaseClient';
import { fetchUserInfo, fetchShopDetails } from '../Actions/storeActions';

const themeColors = {
  background: '#FFFFFF',
  titleText: '#5c5f4c',
  buttonText: '#ffffff',
  buttonBackground: '#82866b',
  borderColor: '#676a61',
};

const EmployeeHomeScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userId, uploadSuccess } = route.params || { userId: null, uploadSuccess: false };
  const dispatch = useDispatch();
  const userInfo = useSelector(state => state.store.userInfo);
  const shopDetails = useSelector(state => state.store.shopDetails);
  const [surpriseBags, setSurpriseBags] = useState([]);
  const [surpriseBagsCount, setSurpriseBagsCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [shopAddress, setShopAddress] = useState(''); // State to hold the shop address

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserInfo(userId, 'employee'));
      dispatch(fetchShopDetails(userId));
    }
  }, [userId]);

  useEffect(() => {
    if (uploadSuccess) {
      Alert.alert('Success', 'Shop information uploaded successfully.');
      dispatch(fetchShopDetails(userId));
    }
  }, [uploadSuccess]);

  useFocusEffect(
    useCallback(() => {
      if (shopDetails) {
        fetchSurpriseBags(shopDetails.id);
        setShopAddress(shopDetails.shop_address); // Set the shop address state
      }
    }, [shopDetails])
  );

  const fetchSurpriseBags = async (shopId) => {
    const { data: bags, error } = await supabase
      .from('surprise_bags')
      .select('*')
      .eq('shop_id', shopId);

    if (error) {
      console.error('Error fetching surprise bags:', error);
    } else {
      const updatedBags = bags.map((bag) => ({
        ...bag,
        status: bag.quantity_left === 0 ? 'Reserved' : 'Available',
      }));
      setSurpriseBags(updatedBags);
      setSurpriseBagsCount(updatedBags.length);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    dispatch(fetchUserInfo(userId, 'employee'));
    dispatch(fetchShopDetails(userId)).then(() => setRefreshing(false));
  }, [userId]);

  const handleRegister = () => {
    navigation.navigate('ShopInformationScreen', { userId });
  };

  const navigateToSurpriseBags = () => {
    navigation.navigate('SurpriseBagsScreen', { userId });
  };

  const navigateToUpdateSurpriseBag = (item) => {
    navigation.navigate('UpdateSurpriseBagScreen', { surpriseBag: item });
  };

  const navigateToChangeLocation = () => {
    if (shopDetails) {
      navigation.navigate('EmployeeChangeLocationScreen', { shopId: shopDetails.id });
    } else {
      Alert.alert('Error', 'Shop details not found.');
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigateToUpdateSurpriseBag(item)}>
      <View style={styles.bagCard}>
        <Image source={{ uri: item.image_url }} style={styles.bagImage} />
        <View style={styles.bagInfo}>
          <Text style={styles.bagName}>Surprise Bag</Text>
          <Text style={styles.bagNumber}>Bag no: #{item.bag_number}</Text>
          <Text style={styles.bagDate}>Date: {item.pickup_hour}</Text>
          <Text style={[styles.bagStatus, item.status === 'Reserved' ? styles.reserved : styles.available]}>{item.status}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <>
      <View style={styles.header}>
        <View style={styles.locationContainer}>
          {userInfo.profile_pic_url ? (
            <Image source={{ uri: userInfo.profile_pic_url }} style={styles.profileImage} />
          ) : null}
          <View>
            <Text style={styles.headerTitle}>Hello {userInfo.full_name}</Text>
            <TouchableOpacity style={styles.locationInfo} onPress={navigateToChangeLocation}>
              <Icon name="map-marker-outline" size={20} color="#6b6e56" />
              <Text style={styles.address}>{shopAddress || 'Change Shop Location'}</Text>
              <Icon name="chevron-right" size={24} color="#6b6e56" />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('EmployeeNotificationScreen')}>
          <Icon name="bell-outline" size={30} color="#6b6e56" />
        </TouchableOpacity>
      </View>
      {shopDetails ? (
        <>
          {shopDetails.status === 'pending' && (
            <View style={styles.registrationContainer}>
              <Text style={styles.registrationTitle}>You have completed registration.</Text>
              <Text style={styles.registrationSubtitle}>Please wait for admin’s approval.</Text>
            </View>
          )}
          {shopDetails.status === 'approved' && (
            <>
              <TouchableOpacity style={styles.shopContainer} onPress={navigateToSurpriseBags}>
                <Text style={styles.shopTitle}>My Shop</Text>
                <View style={styles.shopCard}>
                  <Image source={{ uri: shopDetails.shop_image_url }} style={styles.shopImage} />
                  <View style={styles.shopInfo}>
                    <Text style={styles.shopName}>{shopDetails.shop_name}</Text>
                    <Text style={styles.shopAddress}>{shopDetails.shop_address}</Text>
                    <Text style={styles.surpriseBagText}>Surprise Bags: {surpriseBagsCount}</Text>
                  </View>
                </View>
              </TouchableOpacity>
              <Text style={styles.surpriseBagsTitle}>Surprise Bags</Text>
            </>
          )}
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
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={surpriseBags}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>You have no surprise bags</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

EmployeeHomeScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColors.background,
  },
  scrollView: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
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
    color: '#5c5f4c',
    marginBottom: 20,
    marginLeft: 20,
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
