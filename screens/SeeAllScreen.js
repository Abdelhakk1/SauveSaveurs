import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { toggleFavorite } from '../utils/favoriteUtils';

const SeeAllScreen = ({ route }) => {
  const { title, data } = route.params;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const favorites = useSelector(state => state.store.favorites);

  const renderItem = ({ item }) => {
    const isFavorite = favorites.some(favorite => favorite.id === item.id);

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('StoreDetailsScreen', { store: { id: item.id, bag_id: item.id, shop_id: item.shop_id } })}
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
            onPress={() => toggleFavorite(item, dispatch, favorites)}
          >
            <Icon name={isFavorite ? "heart" : "heart-outline"} size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.cardPrice}>{`${item.price} DZD`}</Text>
          <Text style={styles.cardTime}>{item.pickup_hour} (Pick up)</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>{title}</Text>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

SeeAllScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      title: PropTypes.string.isRequired,
      data: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          quantity_left: PropTypes.number.isRequired,
          price: PropTypes.number.isRequired,
          pickup_hour: PropTypes.string.isRequired,
          image_url: PropTypes.string,
        })
      ).isRequired,
    }).isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    paddingTop: 20,
  },
  card: {
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

export default SeeAllScreen;
