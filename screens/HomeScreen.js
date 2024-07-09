import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, Alert, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { supabase } from '../database/supabaseClient';
import { toggleFavorite } from '../utils/favoriteUtils';
import { fetchCurrentOrders, fetchSurpriseBags, updateUserInfo } from '../Actions/storeActions';

const HomeScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = route.params || {};
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.store.userInfo);
  const favorites = useSelector((state) => state.store.favorites);
  const currentOrders = useSelector((state) => state.store.currentOrders);
  const surpriseBags = useSelector((state) => state.store.surpriseBags);

  const [userName, setUserName] = useState(userInfo?.full_name || 'User');
  const [userAddress, setUserAddress] = useState(''); // Added state for user's address
  const [profilePicUrl, setProfilePicUrl] = useState(userInfo?.profile_pic_url || '');
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchUserData = async () => {
        try {
          const { data: userData, error: userError } = await supabase
            .from('clients')
            .select('full_name, address, profile_pic_url')
            .eq('id', userId)
            .single();

          if (userError) {
            throw userError;
          }

          setUserName(userData.full_name);
          setUserAddress(userData.address); // Set the address state
          setProfilePicUrl(userData.profile_pic_url);
          dispatch(updateUserInfo(userData));
        } catch (error) {
          console.error('Error fetching user data:', error);
          Alert.alert('Error', 'Failed to fetch user data.');
        }
      };

      const fetchSurpriseBagsData = async () => {
        try {
          const { data: bagsData, error: bagsError } = await supabase
            .from('surprise_bags')
            .select('*')
            .eq('status', 'available');

          if (bagsError) {
            throw bagsError;
          }

          const shopIds = bagsData.map((bag) => bag.shop_id);
          const { data: shopsData, error: shopsError } = await supabase
            .from('shops')
            .select('*')
            .in('id', shopIds);

          if (shopsError) {
            throw shopsError;
          }

          const bagsWithShopNames = bagsData.map((bag) => {
            const shop = shopsData.find((shop) => shop.id === bag.shop_id);
            return { 
              ...bag, 
              shop_name: shop ? shop.shop_name : 'Unknown',
              shop_id: shop ? shop.id : undefined // Ensure shop_id is included
            };
          });

          dispatch(fetchSurpriseBags(bagsWithShopNames));
        } catch (error) {
          console.error('Error fetching surprise bags:', error);
          Alert.alert('Error', 'Failed to fetch surprise bags.');
        } finally {
          setLoading(false);
        }
      };

      if (userId) {
        fetchUserData();
        fetchSurpriseBagsData();
        dispatch(fetchCurrentOrders(userId));
      }
    }, [userId])
  );

  useEffect(() => {
    setUserName(userInfo?.full_name || 'User');
    setProfilePicUrl(userInfo?.profile_pic_url || '');
  }, [userInfo?.full_name, userInfo?.profile_pic_url]);

  const navigateToStoreDetails = (item) => {
    const store = {
      id: item.id, // Ensure id is included
      bag_id: item.id,
      shop_id: item.shop_id,
    };
    navigation.navigate('StoreDetailsScreen', { store });
  };

  const navigateToSeeAll = (title, data) => {
    const updatedData = data.map(item => ({
      ...item,
      quantity: item.quantity_left // Map quantity_left to quantity
    }));
    navigation.navigate('SeeAllScreen', { title, data: updatedData });
  };

  const navigateToOrderPage = (order) => {
    navigation.navigate('OrderPageScreen', { order });
  };

  const navigateToChangeLocation = () => {
    navigation.navigate('ChangeLocationScreen', { userId, shopId: userInfo.shop_id }); // Ensure shopId is included
  };

  const renderItem = ({ item }) => {
    const isFavorite = favorites.some((favorite) => favorite.id === item.id);
    const isSoldOut = item.quantity_left === 0;

    return (
      <TouchableOpacity onPress={() => !isSoldOut && navigateToStoreDetails(item)} disabled={isSoldOut}>
        <View style={[styles.card, isSoldOut && styles.soldOutCard]}>
          <Image source={{ uri: item.image_url || 'https://example.com/default-image.jpg' }} style={styles.cardImage} />
          <View style={styles.cardOverlay}>
            <View style={styles.cardQuantityContainer}>
              <Text style={styles.cardQuantity}>{isSoldOut ? 'Sold Out' : `${item.quantity_left || 0} left`}</Text>
            </View>
            <TouchableOpacity
              style={styles.heartIconContainer}
              onPress={() => toggleFavorite(item, dispatch, favorites)}
            >
              <Icon name={isFavorite ? 'heart' : 'heart-outline'} size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <View style={styles.storeNameOverlay}>
            <Text style={styles.storeNameText}>{item.shop_name}</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardPrice}>{`${item.price} DZD`}</Text>
            <Text style={styles.cardTime}>{item.pickup_hour} (Pick up)</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSectionHeader = (sectionTitle, data) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitleText}>{sectionTitle}</Text>
      <TouchableOpacity onPress={() => navigateToSeeAll(sectionTitle, data)}>
        <Text style={styles.seeAllText}>See All</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.locationContainer}>
          {profilePicUrl ? (
            <Image source={{ uri: profilePicUrl }} style={styles.profileImage} />
          ) : (
            <Icon name="account-circle" size={50} color="#6b6e56" />
          )}
          <View>
            <Text style={styles.headerTitle}>Hello {userName}</Text>
            <View style={styles.locationInfo}>
              <Icon name="map-marker-outline" size={20} color="#6b6e56" />
              <TouchableOpacity onPress={navigateToChangeLocation}>
                <Text style={styles.address}>{userAddress || 'Set your location'}</Text> 
              </TouchableOpacity>
              <Icon name="chevron-right" size={24} color="#6b6e56" />
            </View>
          </View>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('ClientNotificationScreen', { userType: 'client' })}>
          <Icon name="bell-outline" size={30} color="#6b6e56" />
        </TouchableOpacity>
      </View>

      {renderSectionHeader('Recommended for You', surpriseBags)}
      <FlatList
        data={surpriseBags}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      {renderSectionHeader('Save Before It\'s Too Late', surpriseBags)}
      <FlatList
        data={surpriseBags}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      {currentOrders.length > 0 && (
        <View style={styles.orderNotificationWrapper}>
          <TouchableOpacity style={styles.orderNotification} onPress={() => navigateToOrderPage(currentOrders.slice(-1)[0])}>
            <Image source={{ uri: currentOrders.slice(-1)[0].image_url }} style={styles.notificationImage} />
            <View style={styles.notificationTextContainer}>
              <Text style={styles.notificationTitle}>Your Order</Text>
              <Text style={styles.notificationText}>Pick up: {currentOrders.slice(-1)[0].pickup_hour}</Text>
            </View>
            <Icon name="chevron-right" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
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
    color: '#6b6e56',
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
  noNearbyContainer: {
    backgroundColor: '#f3f3f3',
    borderColor: '#c2c2c2',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 10,
    padding: 20,
    margin: 20,
    alignItems: 'center',
  },
  noNearbyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6b6e56',
    marginBottom: 10,
  },
  noNearbySubText: {
    fontSize: 16,
    color: '#676767',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    margin: 10,
    width: 250,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    top: 20,
  },
  soldOutCard: {
    opacity: 0.5,
  },
  cardImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  cardOverlay: {
    position: 'absolute',
    top: 10,
    right: 10,
    left: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardQuantityContainer: {
    backgroundColor: '#6b6e56',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  cardQuantity: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  heartIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  storeNameOverlay: {
    position: 'absolute',
    bottom: 90,
    left: 0,
    right: 35,
    backgroundColor: 'rgba(107, 110, 86, 0.8)',
    padding: 5,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  storeNameText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cardContent: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#484a3b',
    marginTop: 8,
  },
  cardTime: {
    fontSize: 14,
    color: '#000',
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6b6e56',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6b6e56',
  },
  orderNotificationWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: '#d8d9d1',
    paddingBottom: 20,
  },
  orderNotification: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6b6e56',
    padding: 10,
    paddingHorizontal: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  notificationImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  notificationTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  notificationText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#82866b',
  },
});

export default HomeScreen;
