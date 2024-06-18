import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Modal, Alert, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { supabase } from '../database/supabaseClient';
import PropTypes from 'prop-types';
import { toggleFavorite } from '../utils/favoriteUtils';
import { addToCurrentOrders, updateQuantityLeft } from '../Actions/storeActions';

const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const formatPickupTime = (time, date = new Date()) => {
  const [hours, minutes] = time.replace(/(am|pm)/i, '').split(':').map(Number);
  const isPM = /pm$/i.test(time);
  const formattedHours = isPM ? (hours % 12) + 12 : hours % 12;

  const formattedDate = new Date(date);
  formattedDate.setHours(formattedHours, minutes, 0, 0);

  return formattedDate.toISOString();
};

const StoreDetailsScreen = ({ route }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const favorites = useSelector(state => state.store.favorites);
  const [reserveModalVisible, setReserveModalVisible] = useState(false);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [bagDetails, setBagDetails] = useState(null);
  const [shopDetails, setShopDetails] = useState(null);
  const [userId, setUserId] = useState(null);
  const [fullName, setFullName] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user:', error);
      } else {
        setUserId(data.user.id);
        const { data: userData, error: userError } = await supabase
          .from('clients')
          .select('full_name')
          .eq('id', data.user.id)
          .single();
        if (userError) {
          console.error('Error fetching user details:', userError);
        } else {
          setFullName(userData.full_name);
        }
      }
    };

    fetchUserDetails();

    if (route.params?.store) {
      const { bag_id, shop_id } = route.params.store;
      if (bag_id && shop_id) {
        fetchDetails(bag_id, shop_id);
      } else {
        Alert.alert('Error', 'Invalid shop or bag ID.');
        navigation.goBack();
      }
    }
  }, [route.params?.store]);

  const fetchDetails = async (bagId, shopId) => {
    try {
      const { data: bagData, error: bagError } = await supabase
        .from('surprise_bags')
        .select('*')
        .eq('id', bagId)
        .single();

      if (bagError) {
        throw bagError;
      }

      setBagDetails(bagData);

      const { data: shopData, error: shopError } = await supabase
        .from('shops')
        .select('*')
        .eq('id', shopId)
        .single();

      if (shopError) {
        throw shopError;
      }

      setShopDetails(shopData);
    } catch (error) {
      console.error('Error fetching details:', error);
      Alert.alert('Error', 'Failed to fetch details.');
    }
  };

  const goBack = () => {
    navigation.goBack();
  };

  const openReserveModal = () => setReserveModalVisible(true);
  const closeReserveModal = () => setReserveModalVisible(false);

  const openInfoModal = () => setInfoModalVisible(true);
  const closeInfoModal = () => setInfoModalVisible(false);

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleReserve = async () => {
    if (!userId) {
      Alert.alert('Error', 'User not authenticated.');
      return;
    }

    try {
      const [pickupStart, pickupEnd] = bagDetails.pickup_hour.split('-').map(time => time.trim());

      const reservation = {
        order_id: generateUUID(),
        status: 'Pending',
        amount: (parseFloat(bagDetails.price) * quantity).toFixed(2),
        location: shopDetails.shop_address,
        pickup_hour: bagDetails.pickup_hour,
        pickup_start_time: formatPickupTime(pickupStart),
        pickup_end_time: formatPickupTime(pickupEnd),
        pickup_time: formatPickupTime(pickupEnd),
        surprise_bag_id: bagDetails.id,
        user_id: userId,
        full_name: fullName,
        bag_name: bagDetails.name,
        shop_name: shopDetails.shop_name,
        image_url: bagDetails.image_url,
        employee_id: shopDetails.employee_id, // Add employee ID
      };

      const { error } = await supabase
        .from('reservations')
        .insert([reservation]);

      if (error) {
        throw error;
      }

      dispatch(addToCurrentOrders(reservation));
      dispatch(updateQuantityLeft(bagDetails.id, bagDetails.quantity_left - quantity));
      console.log('Reservation added:', reservation);
      closeReserveModal();
      navigation.navigate('OrderDoneScreen', { orderId: reservation.order_id });
    } catch (error) {
      console.error('Error creating reservation:', error);
      Alert.alert('Error', 'Failed to create reservation.');
    }
  };

  const isFavorite = favorites.some(favorite => favorite.id === route.params?.store.id);

  const price = bagDetails ? (parseFloat(bagDetails.price) * quantity).toFixed(2) : '0.00';

  if (!bagDetails || !shopDetails) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={goBack}>
        <Icon name="arrow-left" size={24} color="#6b6e56" />
      </TouchableOpacity>

      <Text style={styles.pageTitle}>Store Details</Text>

      <View style={styles.imageContainer}>
        <Image
          source={{ uri: bagDetails.image_url }}
          style={styles.storeImage}
        />
        <View style={styles.storeInfoContainer}>
          <Text style={styles.itemsLeft}>{`${bagDetails.quantity_left} left`}</Text>
          <View style={styles.storeNameAndHeart}>
            <Text style={styles.storeName}>{shopDetails.shop_name}</Text>
            <TouchableOpacity style={styles.heartIconContainer} onPress={() => toggleFavorite(route.params?.store, dispatch, favorites)}>
              <Icon name={isFavorite ? "heart" : "heart-outline"} size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.surpriseBagContainer}>
          <Text style={styles.surpriseBagTitle}>{bagDetails.name}</Text>
          <Text style={styles.price}>{`${price} DZD`}</Text>
          <Text style={styles.pickupTime}>Pick up: {bagDetails.pickup_hour}</Text>
          <View style={styles.bagInfoContainer}>
            <Image
              source={{ uri: bagDetails.image_url }}
              style={styles.bagImage}
            />
            <View style={styles.bagDetails}>
              <Text style={styles.bagNumber}>Bag no: #{bagDetails.bag_number}</Text>
              <Text style={styles.validation}>Validation: {bagDetails.validation}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.locationContainer} onPress={() => navigation.navigate('MoreInformationScreen', { storeId: shopDetails.id, image_url: bagDetails.image_url })}>
          <Icon name="map-marker-outline" size={24} color="#6b6e56" />
          <View style={styles.locationDetails}>
            <Text style={styles.locationTitle}>{shopDetails.shop_address}</Text>
            <Text style={styles.moreInfo}>More information about the store</Text>
          </View>
          <Icon name="chevron-right" size={24} color="#6b6e56" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.whatYouGetContainer} onPress={openInfoModal}>
          <Text style={styles.whatYouGetTitle}>What you could get</Text>
          <Text style={styles.whatYouGetDescription}>
            {bagDetails.description}
          </Text>
          <TouchableOpacity style={styles.categoryButton}>
            <Text style={styles.categoryButtonText}>{bagDetails.category}</Text>
          </TouchableOpacity>
        </TouchableOpacity>

        <TouchableOpacity style={styles.reserveButton} onPress={openReserveModal}>
          <Text style={styles.reserveButtonText}>Reserve</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={reserveModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeReserveModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{shopDetails.shop_name}</Text>
              <TouchableOpacity style={styles.closeIconContainer} onPress={closeReserveModal}>
                <Icon name="close" size={24} color="#6b6e56" />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalPickupTime}>Pick up: {bagDetails.pickup_hour}</Text>
            <View style={styles.modalBody}>
              <Text style={styles.selectQuantity}>Select Quantity</Text>
              <View style={styles.quantitySelector}>
                <TouchableOpacity onPress={decrementQuantity} style={styles.quantityButton}>
                  <Icon name="minus" size={24} color="#6b6e56" />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{quantity}</Text>
                <TouchableOpacity onPress={incrementQuantity} style={styles.quantityButton}>
                  <Icon name="plus" size={24} color="#6b6e56" />
                </TouchableOpacity>
              </View>
              <Text style={styles.modalTotal}>Total: {`${price} DZD`}</Text>
              <TouchableOpacity
                style={styles.makeReservationButton}
                onPress={handleReserve}
              >
                <Text style={styles.makeReservationButtonText}>Make Reservation</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={infoModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeInfoModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>What you need to know</Text>
              <TouchableOpacity style={styles.closeIconContainer} onPress={closeInfoModal}>
                <Icon name="close" size={24} color="#6b6e56" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <Text style={styles.modalSubtitle}>Your bag will be a surprise</Text>
              <Text style={styles.modalDescription}>
                We can’t predict what will be in your surprise bag, as it depends on what the store has in surplus. If you’re concerned about allergens or ingredients, please ask the store.
              </Text>
              <TouchableOpacity
                style={styles.infoButton}
                onPress={closeInfoModal}
              >
                <Text style={styles.infoButtonText}>Go for it!</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

StoreDetailsScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      store: PropTypes.shape({
        id: PropTypes.string.isRequired,
        bag_id: PropTypes.string,
        shop_id: PropTypes.string,
      }).isRequired,
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
  backButton: {
    position: 'absolute',
    top: 52,
    left: 10,
    zIndex: 10,
    padding: 10,
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
    marginRight: 300,
  },
  storeNameAndHeart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    left: 40,
    right: 10,
  },
  storeName: {
    backgroundColor: '#6b6e56',
    borderRadius: 5,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    right: 35,
    top: 170,
  },
  heartIconContainer: {
    backgroundColor: '#6b6e56',
    borderRadius: 50,
    padding: 8,
    top: 170,
  },
  detailsContainer: {
    padding: 20,
  },
  surpriseBagContainer: {
    marginBottom: 20,
  },
  surpriseBagTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6b6e56',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6b6e56',
    position: 'absolute',
    right: 0,
  },
  pickupTime: {
    fontSize: 14,
    color: '#6b6e56',
    marginTop: 4,
  },
  bagInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  bagImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  bagDetails: {
    marginLeft: 10,
  },
  bagNumber: {
    fontSize: 14,
    color: '#6b6e56',
  },
  validation: {
    fontSize: 12,
    color: '#6b6e56',
    marginTop: 2,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0e8',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  locationDetails: {
    flex: 1,
    marginLeft: 10,
  },
  locationTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6b6e56',
  },
  moreInfo: {
    fontSize: 12,
    color: '#6b6e56',
  },
  whatYouGetContainer: {
    marginBottom: 20,
  },
  whatYouGetTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6b6e56',
    marginBottom: 8,
  },
  whatYouGetDescription: {
    fontSize: 14,
    color: '#6b6e56',
    marginBottom: 8,
  },
  categoryButton: {
    backgroundColor: '#6b6e56',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  categoryButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  reserveButton: {
    backgroundColor: '#6b6e56',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  reserveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    width: '100%',
    alignItems: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6b6e56',
  },
  closeIconContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 50,
    padding: 5,
  },
  modalPickupTime: {
    fontSize: 14,
    color: '#6b6e56',
    marginTop: 10,
  },
  modalBody: {
    marginTop: 15,
    alignItems: 'center',
    width: '100%',
  },
  selectQuantity: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6b6e56',
    marginBottom: 10,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  quantityButton: {
    backgroundColor: '#f0f0e8',
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 20,
  },
  quantityText: {
    fontSize: 18,
    color: '#6b6e56',
  },
  modalTotal: {
    fontSize: 16,
    color: '#6b6e56',
    marginBottom: 20,
  },
  makeReservationButton: {
    backgroundColor: '#6b6e56',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  makeReservationButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalSubtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6b6e56',
    marginTop: 10,
  },
  modalDescription: {
    fontSize: 14,
    color: '#6b6e56',
    textAlign: 'center',
    marginVertical: 10,
  },
  infoButton: {
    backgroundColor: '#6b6e56',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
  },
  infoButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default StoreDetailsScreen;
