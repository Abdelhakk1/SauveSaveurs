import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { supabase } from '../database/supabaseClient';

const SurpriseBagsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = route.params || {};
  const [surpriseBags, setSurpriseBags] = useState([]);

  const fetchSurpriseBags = async () => {
    const { data, error } = await supabase
      .from('surprise_bags')
      .select('*')
      .eq('employee_id', userId);

    if (error) {
      console.error('Error fetching surprise bags:', error);
    } else {
      setSurpriseBags(data);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchSurpriseBags();
    }
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      if (userId) {
        fetchSurpriseBags();
      }
    }, [userId])
  );

  const renderItem = ({ item }) => (
    <View style={styles.bagCard}>
      <Image source={{ uri: item.image_url }} style={styles.bagImage} />
      <View style={styles.bagInfo}>
        <Text style={styles.bagName}>Surprise Bag</Text>
        <Text style={styles.bagNumber}>Bag no: #{item.bag_number}</Text>
        <Text style={styles.bagDate}>Date: {item.pickup_hour}</Text>
        <Text style={styles.bagStatus}>{item.status}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Icon name="arrow-left" size={24} color="#000" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Surprise Bags</Text>
      <TouchableOpacity
        style={styles.addBagContainer}
        onPress={() => navigation.navigate('UploadSurpriseBagScreen', { userId })}
      >
        <Icon name="plus" size={24} color="#6b6e56" />
        <Text style={styles.addBagText}>Upload your new surprise bag.</Text>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>Add Bag</Text>
        </TouchableOpacity>
      </TouchableOpacity>
      <FlatList
        data={surpriseBags}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.bagList}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    marginTop: 10,
    marginLeft: 10,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 30,
  },
  addBagContainer: {
    borderColor: '#676a61',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    margin: 20,
  },
  addBagText: {
    fontSize: 16,
    color: '#5c5f4c',
    textAlign: 'center',
    marginVertical: 10,
  },
  addButton: {
    backgroundColor: '#82866b',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    width: '60%',
    alignSelf: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
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
    color: '#6b6e56',
    marginTop: 5,
  },
});

export default SurpriseBagsScreen;
