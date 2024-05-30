import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { supabase } from '../database/supabaseClient';
import { addToFavorites } from '../Actions/storeActions';

const MoreInformationScreen = ({ route }) => {
  const { storeId, image_url } = route.params;
  const dispatch = useDispatch();
  const [store, setStore] = useState(null);

  useEffect(() => {
    const fetchStoreDetails = async () => {
      try {
        const { data: shopData, error: shopError } = await supabase
          .from('shops')
          .select('*')
          .eq('id', storeId)
          .single();

        if (shopError) {
          throw shopError;
        }

        setStore(shopData);
      } catch (error) {
        console.error('Error fetching store details:', error);
      }
    };

    fetchStoreDetails();
  }, [storeId]);

  const handleAddToFavorites = () => {
    dispatch(addToFavorites(store));
    console.log('Added to favorites:', store);
  };

  if (!store) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.pageTitle}>More Information</Text>

      <View style={styles.imageContainer}>
        <Image
          source={{ uri: image_url }}
          style={styles.storeImage}
        />
        <View style={styles.storeInfoContainer}>
          <Text style={styles.itemsLeft}>{`${store.quantity} left`}</Text>
          <View style={styles.storeNameAndHeart}>
            <Text style={styles.storeName}>{store.shop_name}</Text>
            <TouchableOpacity style={styles.heartIconContainer} onPress={handleAddToFavorites}>
              <Icon name="heart-outline" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.storeTitle}>{store.shop_name}</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Shop Address</Text>
          <Text style={styles.infoValue}>{store.shop_address}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Shop Category</Text>
          <Text style={styles.infoValue}>{store.shop_category}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Opening Hour</Text>
          <Text style={styles.infoValue}>{store.shop_opening_hour}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Weekend</Text>
          <Text style={styles.infoValue}>{store.shop_weekend}</Text>
        </View>
        <View className={styles.aboutSection}>
          <Text className={styles.infoLabel}>About</Text>
          <Text className={styles.aboutText}>{store.about_shop}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

MoreInformationScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      storeId: PropTypes.string.isRequired,
      image_url: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 60,
    marginBottom: 20,
  },
  imageContainer: {
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 3,
    backgroundColor: '#f0f0e8',
    marginBottom: 25,
  },
  storeImage: {
    width: '100%',
    height: 200,
  },
  storeInfoContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
  },
  itemsLeft: {
    backgroundColor: '#6b6e56',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginRight: 310,
  },
  storeNameAndHeart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    left: 45,
    right: 10,
  },
  storeName: {
    backgroundColor: '#6b6e56',
    borderRadius: 5,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    right: 35,
    top: 130,
  },
  heartIconContainer: {
    backgroundColor: '#6b6e56',
    borderRadius: 50,
    padding: 8,
    top: 130,
  },
  detailsContainer: {
    padding: 20,
  },
  storeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6b6e56',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6b6e56',
  },
  infoValue: {
    fontSize: 14,
    color: '#6b6e56',
  },
  aboutSection: {
    marginTop: 15,
  },
  aboutText: {
    fontSize: 14,
    color: '#6b6e56',
    marginTop: 5,
    fontWeight: 'bold',
  },
});

export default MoreInformationScreen;
