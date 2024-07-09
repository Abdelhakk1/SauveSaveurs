import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TextInput, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../database/supabaseClient';
import { toggleFavorite } from '../utils/favoriteUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SearchScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const favorites = useSelector(state => state.store.favorites);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRecentSearches = async () => {
      try {
        const savedRecentSearches = await AsyncStorage.getItem('recentSearches');
        if (savedRecentSearches) {
          setRecentSearches(JSON.parse(savedRecentSearches));
        }
      } catch (error) {
        console.error('Error fetching recent searches:', error);
      }
    };

    fetchRecentSearches();
  }, []);

  const saveRecentSearches = async (searches) => {
    try {
      await AsyncStorage.setItem('recentSearches', JSON.stringify(searches));
    } catch (error) {
      console.error('Error saving recent searches:', error);
    }
  };

  const handleSearch = async () => {
    if (searchQuery.trim() === '') return;

    setLoading(true);
    try {
      const { data: shopsData, error: shopsError } = await supabase
        .from('shops')
        .select('*')
        .ilike('shop_name', `%${searchQuery}%`);

      if (shopsError) {
        throw shopsError;
      }

      if (shopsData.length === 0) {
        setSearchResults([]);
        setLoading(false);
        return;
      }

      const shopIds = shopsData.map(shop => shop.id);

      const { data: bagsData, error: bagsError } = await supabase
        .from('surprise_bags')
        .select('*')
        .in('shop_id', shopIds);

      if (bagsError) {
        throw bagsError;
      }

      const resultsWithShopNames = bagsData.map(bag => {
        const shop = shopsData.find(shop => shop.id === bag.shop_id);
        return { ...bag, shop_name: shop ? shop.shop_name : 'Unknown' };
      });

      setSearchResults(resultsWithShopNames);
      const updatedRecentSearches = [searchQuery, ...recentSearches.filter(q => q !== searchQuery).slice(0, 4)];
      setRecentSearches(updatedRecentSearches);
      saveRecentSearches(updatedRecentSearches);
      setSearchQuery('');
    } catch (error) {
      console.error('Error searching surprise bags:', error);
      Alert.alert('Error', 'Failed to search surprise bags.');
    } finally {
      setLoading(false);
    }
  };

  const handleRecentSearchPress = (query) => {
    setSearchQuery(query);
    handleSearch();
  };

  const handleClearRecentSearch = (query) => {
    const updatedRecentSearches = recentSearches.filter(q => q !== query);
    setRecentSearches(updatedRecentSearches);
    saveRecentSearches(updatedRecentSearches);
  };

  const renderSearchItem = ({ item }) => {
    const isFavorite = favorites.some(favorite => favorite.id === item.id);

    return (
      <TouchableOpacity onPress={() => navigation.navigate('StoreDetailsScreen', { store: { bag_id: item.id, shop_id: item.shop_id } })}>
        <View style={styles.card}>
          <Image
            source={{ uri: item.image_url || 'https://example.com/default-image.jpg' }}
            style={styles.cardImage}
          />
          <View style={styles.cardOverlay}>
            <View style={styles.cardQuantityContainer}>
              <Text style={styles.cardQuantity}>{`${item.quantity_left || 0} left`}</Text>
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
            <Text style={styles.cardPrice}>{`${item.price} DZD`}</Text>
            <Text style={styles.cardTime}>{item.pickup_hour} (Pick up)</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Search</Text>
        <View style={styles.searchSection}>
          <Icon name="magnify" size={20} color="#000" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search store/restaurant/café"
            placeholderTextColor="#000" // Change the placeholder text color to black
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
        </View>
      </View>
      <View style={styles.recentSearchContainer}>
        <Text style={styles.recentSearchTitle}>Recent Search</Text>
        <View style={styles.recentSearchList}>
          {recentSearches.map(query => (
            <TouchableOpacity
              key={query}
              style={styles.recentSearchItem}
              onPress={() => handleRecentSearchPress(query)}
            >
              <Text style={styles.recentSearchText}>{query}</Text>
              <Icon
                name="close"
                size={16}
                color="#000"
                onPress={() => handleClearRecentSearch(query)}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.resultsContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        ) : (
          <FlatList
            data={searchResults}
            renderItem={renderSearchItem}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={{ paddingBottom: 60 }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  recentSearchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  recentSearchTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  recentSearchList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)', // black and transparent
    borderRadius: 5,
    padding: 5,
    marginRight: 10,
    marginBottom: 10,
  },
  recentSearchText: {
    marginRight: 5,
    color: '#000',
  },
  resultsContainer: {
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
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

export default SearchScreen;
