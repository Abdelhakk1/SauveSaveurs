import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Modal } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { supabase } from '../database/supabaseClient';

const MyShopScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = route.params || { userId: null };
  const [shopDetails, setShopDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [surpriseBagsCount, setSurpriseBagsCount] = useState(0);

  useEffect(() => {
    const fetchShopDetails = async () => {
      setLoading(true);
      const { data: shop, error } = await supabase
        .from('shops')
        .select('*')
        .eq('employee_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching shop details:', error);
        Alert.alert('Error', 'Failed to fetch shop details.');
      }

      if (shop) {
        setShopDetails(shop);
        fetchSurpriseBags(shop.id);
      } else {
        setShopDetails(null);
      }

      setLoading(false);
    };

    const fetchSurpriseBags = async (shopId) => {
      const { data: bags, error } = await supabase
        .from('surprise_bags')
        .select('*')
        .eq('shop_id', shopId);

      if (error) {
        console.error('Error fetching surprise bags:', error);
      } else {
        setSurpriseBagsCount(bags.length);
      }
    };

    fetchShopDetails();
  }, [userId]);

  const handleDeleteShop = async () => {
    try {
      const { error } = await supabase
        .from('shops')
        .delete()
        .eq('employee_id', userId);

      if (error) {
        throw error;
      }

      setShopDetails(null);
      setDeleteModalVisible(false);
      Alert.alert('Success', 'Shop deleted successfully.');
    } catch (error) {
      console.error('Error deleting shop:', error);
      Alert.alert('Error', 'Failed to delete shop.');
    }
  };

  const formatTime = (timeString) => {
    const date = new Date(timeString);
    if (isNaN(date)) return 'Invalid Date';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6b6e56" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#6b6e56" />
        </TouchableOpacity>
        <Text style={styles.title}>My Shop</Text>
        <TouchableOpacity style={styles.menuButton} onPress={() => setDeleteModalVisible(true)}>
          <Icon name="dots-vertical" size={24} color="#6b6e56" />
        </TouchableOpacity>
      </View>
      {shopDetails ? (
        <>
          <View style={styles.imageContainer}>
            <Image source={{ uri: shopDetails.shop_image_url }} style={styles.shopImage} />
            <View style={styles.overlay}>
              <Text style={styles.overlayText}>{shopDetails.shop_name}</Text>
            </View>
          </View>
          <View style={styles.shopDetailsContainer}>
            <Text style={styles.shopName}>{shopDetails.shop_name}</Text>
            <Text style={styles.shopInfo}>Shop Address: {shopDetails.shop_address}</Text>
            <Text style={styles.shopInfo}>Shop Category: {shopDetails.shop_category}</Text>
            <Text style={styles.shopInfo}>Opening Hour: {formatTime(shopDetails.shop_opening_hour)}</Text>
            <Text style={styles.shopInfo}>Weekend: {formatTime(shopDetails.shop_weekend)}</Text>
            <Text style={styles.shopInfo}>Surprise Bags: {surpriseBagsCount}</Text>
            <Text style={styles.aboutTitle}>About</Text>
            <Text style={styles.aboutText}>{shopDetails.about_shop}</Text>
          </View>
        </>
      ) : (
        <View style={styles.noShopContainer}>
          <Text style={styles.noShopText}>You do not have a shop registered. Please register your shop first.</Text>
        </View>
      )}

      <Modal visible={deleteModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Do you want to delete your shop?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={() => setDeleteModalVisible(false)}>
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.modalButtonYes]} onPress={handleDeleteShop}>
                <Text style={[styles.modalButtonText, styles.modalButtonTextYes]}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 40,
  },
  backButton: {
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  menuButton: {
    padding: 10,
  },
  imageContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  shopImage: {
    width: '100%',
    height: 200,
    borderRadius: 15,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  overlayText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  shopDetailsContainer: {
    padding: 20,
  },
  shopName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  shopInfo: {
    fontSize: 16,
    marginBottom: 5,
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
  },
  aboutText: {
    fontSize: 16,
    color: '#676767',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noShopContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noShopText: {
    fontSize: 18,
    color: '#676767',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    backgroundColor: '#6b6e56',
    borderRadius: 5,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  modalButtonYes: {
    backgroundColor: 'red',
  },
  modalButtonTextYes: {
    color: '#FFFFFF',
  },
});

export default MyShopScreen;
