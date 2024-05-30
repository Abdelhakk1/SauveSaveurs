import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { supabase } from '../database/supabaseClient';
import { toggleFavorite } from '../utils/favoriteUtils'; // Import the utility function

const HomeScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userId, fullName } = route.params || {};
  const dispatch = useDispatch();
  const favorites = useSelector(state => state.store.favorites);
  const currentOrders = useSelector(state => state.store.currentOrders);

  const [userName, setUserName] = useState(fullName || 'User');
  const [surpriseBags, setSurpriseBags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: userData, error: userError } = await supabase
          .from('clients')
          .select('full_name')
          .eq('id', userId)
          .single();

        if (userError) {
          throw userError;
        }

        setUserName(userData.full_name);
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'Failed to fetch user data.');
      }
    };

    const fetchSurpriseBags = async () => {
      try {
        const { data: bagsData, error: bagsError } = await supabase
          .from('surprise_bags')
          .select('*');

        if (bagsError) {
          throw bagsError;
        }

        const shopIds = bagsData.map(bag => bag.shop_id);
        const { data: shopsData, error: shopsError } = await supabase
          .from('shops')
          .select('*')
          .in('id', shopIds);

        if (shopsError) {
          throw shopsError;
        }

        const bagsWithShopNames = bagsData.map(bag => {
          const shop = shopsData.find(shop => shop.id === bag.shop_id);
          return { ...bag, shop_name: shop ? shop.shop_name : 'Unknown' };
        });

        setSurpriseBags(bagsWithShopNames);
      } catch (error) {
        console.error('Error fetching surprise bags:', error);
        Alert.alert('Error', 'Failed to fetch surprise bags.');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
      fetchSurpriseBags();
    }
  }, [userId]);

  const navigateToStoreDetails = (item) => {
    navigation.navigate('StoreDetailsScreen', { store: item });
  };

  const navigateToSeeAll = (title, data) => {
    navigation.navigate('SeeAllScreen', { title, data });
  };

  const renderItem = ({ item }) => {
    const isFavorite = favorites.some(favorite => favorite.id === item.id);

    return (
      <TouchableOpacity onPress={() => navigateToStoreDetails(item)}>
        <View style={styles.card}>
          <Image
            source={{ uri: item.image_url || 'https://example.com/default-image.jpg' }}
            style={styles.cardImage}
          />
          <View style={styles.cardOverlay}>
            <View style={styles.cardQuantityContainer}>
              <Text style={styles.cardQuantity}>{`${item.quantity || 0} left`}</Text>
            </View>
            <TouchableOpacity
              style={styles.heartIconContainer}
              onPress={() => toggleFavorite(item, dispatch, favorites)}
            >
              <Icon name={isFavorite ? "heart" : "heart-outline"} size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <View style={styles.storeNameOverlay}>
            <Text style={styles.storeNameText}>{item.shop_name}</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardPrice}>{`$${item.price}`}</Text>
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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.locationContainer}>
          <Image source={require('../assets/images/Ai 1.png')} style={styles.profileImage} />
          <View>
            <Text style={styles.headerTitle}>Hello {userName}</Text>
            <View style={styles.locationInfo}>
              <Icon name="map-marker-outline" size={20} color="#6b6e56" />
              <TouchableOpacity onPress={() => navigation.navigate('ChangeLocationScreen')}>
                <Text style={styles.address}>Alger, Algeria</Text>
              </TouchableOpacity>
              <Icon name="chevron-right" size={24} color="#6b6e56" />
            </View>
            <Text style={styles.distance}>Within 2 km</Text>
          </View>
        </View>
        <Icon name="bell-outline" size={30} color="#6b6e56" />
      </View>

      {renderSectionHeader('Nearby', surpriseBags)}
      <FlatList
        data={surpriseBags}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      {renderSectionHeader('Top Rated', surpriseBags)}
      <FlatList
        data={surpriseBags}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      {currentOrders.length > 0 && (
        <View style={styles.orderNotificationWrapper}>
          <TouchableOpacity style={styles.orderNotification} onPress={() => navigation.navigate('OrderPageScreen', { orderId: currentOrders.slice(-1)[0].order_id })}>
            <Image source={require('../assets/images/DALL·E 2024-04-26 00.04.20 - Create an image of a cozy coffee shop interior with wooden tables and chairs, warm ambient lighting, and some green plants in the corner. It should be.webp')} style={styles.notificationImage} />
            <View style={styles.notificationTextContainer}>
              <Text style={styles.notificationTitle}>Your Order</Text>
              <Text style={styles.notificationText}>Pick up: {currentOrders.slice(-1)[0].pickup_time}</Text>
            </View>
            <Icon name="chevron-right" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
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
    right: 10,
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
    paddingBottom: 20, // Add padding to adjust for the tab bar
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
