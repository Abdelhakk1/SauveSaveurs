import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromFavorites } from '../Actions/storeActions';
import { useNavigation } from '@react-navigation/native';

const FavoritesScreen = () => {
  const dispatch = useDispatch();
  const favorites = useSelector(state => state.store.favorites);
  const navigation = useNavigation();

  const handleRemoveFromFavorites = (storeId) => {
    dispatch(removeFromFavorites(storeId));
  };

  const renderFavoriteItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.favoriteCard}
      onPress={() => navigation.navigate('StoreDetailsScreen', { store: { bag_id: item.id, shop_id: item.shop_id } })}
    >
      <Image
        source={{ uri: item.image_url || 'https://example.com/default-image.jpg' }}
        style={styles.cardImage}
      />
      <View style={styles.cardOverlay}>
        <View style={styles.cardQuantityContainer}>
          <Text style={styles.cardQuantity}>{`${item.quantity_left} left`}</Text>
        </View>
        <TouchableOpacity
          style={styles.heartIconContainer}
          onPress={() => handleRemoveFromFavorites(item.id)}
        >
          <Icon name="heart" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardPrice}>{`${item.price} DZD`}</Text>
        <Text style={styles.cardTime}>{item.pickup_hour} (Pick up)</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Favorites</Text>
      <FlatList
        data={favorites}
        renderItem={renderFavoriteItem}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    top: 20,
  },
  favoriteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    margin: 10,
    width: '90%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: 120,
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
});

export default FavoritesScreen;
