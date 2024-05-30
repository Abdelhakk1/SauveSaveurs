import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { supabase } from '../database/supabaseClient'; // Ensure the correct path

const defaultImageUrls = [
  { id: 1, uri: 'https://rboyqdyoehiiajuvcyft.supabase.co/storage/v1/object/public/surprise_bags/DALL_E_2024-05-26_12.27.48_-_A_variety_of_breakfast_items_like_pancakes__eggs__toast__and_fruit.webp', label: 'Breakfast' },
  { id: 2, uri: 'https://rboyqdyoehiiajuvcyft.supabase.co/storage/v1/object/public/surprise_bags/DALL_E_2024-05-26_12.27.50_-_A_hearty_meal_with_items_like_sandwiches__salads__or_pasta_dishes.webp', label: 'Lunch/Dinner' },
  { id: 3, uri: 'https://rboyqdyoehiiajuvcyft.supabase.co/storage/v1/object/public/surprise_bags/DALL_E_2024-05-26_12.27.53_-_A_variety_of_baked_goods_such_as_croissants__muffins__and_bread.webp', label: 'Bakery' },
  { id: 4, uri: 'https://rboyqdyoehiiajuvcyft.supabase.co/storage/v1/object/public/surprise_bags/DALL_E_2024-05-26_12.27.56_-_Fresh_fruits_and_vegetables_in_a_basket_or_on_a_table.webp', label: 'Fruits/Vegetables' },
  { id: 5, uri: 'https://rboyqdyoehiiajuvcyft.supabase.co/storage/v1/object/public/surprise_bags/DALL_E_2024-05-26_12.27.59_-_A_variety_of_snacks_such_as_chips__cookies__or_nuts.webp', label: 'Snacks' },
  { id: 6, uri: 'https://rboyqdyoehiiajuvcyft.supabase.co/storage/v1/object/public/surprise_bags/DALL_E_2024-05-26_12.28.02_-_A_variety_of_dairy_products_like_cheese__yogurt__and_milk.webp', label: 'Dairy' },
];

const UploadSurpriseBagScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = route.params || {};

  const [name, setName] = useState('');
  const [bagNumber, setBagNumber] = useState('');
  const [pickupHour, setPickupHour] = useState('');
  const [validation, setValidation] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Breakfast');
  const [selectedImage, setSelectedImage] = useState('');

  const handleSelectImage = (uri) => {
    setSelectedImage(uri);
  };

  const handleUploadBag = async () => {
    if (!name || !bagNumber || !pickupHour || !validation || !price || !description || !selectedImage) {
      Alert.alert('Error', 'Please fill out all fields and select an image');
      return;
    }

    try {
      const { data: shop, error: shopError } = await supabase
        .from('shops')
        .select('id')
        .eq('employee_id', userId)
        .single();

      if (shopError) {
        console.error('Error fetching shop:', shopError);
        Alert.alert('Error fetching shop information', shopError.message);
        return;
      }

      const { data, error } = await supabase
        .from('surprise_bags')
        .insert([
          {
            employee_id: userId,
            shop_id: shop.id,
            name,
            bag_number: bagNumber,
            pickup_hour: pickupHour,
            validation,
            price,
            description,
            category,
            image_url: selectedImage,
          },
        ]);

      if (error) {
        console.error('Error uploading surprise bag:', error);
        Alert.alert('Error uploading surprise bag', error.message);
      } else {
        console.log('Inserted data:', data);
        Alert.alert('Success', 'Surprise bag uploaded successfully');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Network request failed:', error);
      Alert.alert('Network request failed', error.message);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleSelectImage(item.uri)}>
      <Image
        source={{ uri: item.uri }}
        style={[styles.imageThumbnail, selectedImage === item.uri && styles.selectedImage]}
      />
      <Text style={styles.imageLabel}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Icon name="arrow-left" size={24} color="#000" />
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.headerTitle}>Upload Surprise Bags</Text>
        <Text style={styles.label}>Select an Image</Text>
        <FlatList
          data={defaultImageUrls}
          horizontal
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.imageList}
        />
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Surprise Bag"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Bag no.</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. #001"
          value={bagNumber}
          onChangeText={setBagNumber}
        />

        <Text style={styles.label}>Pick up Hour</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 12:30pm - 4:30am"
          value={pickupHour}
          onChangeText={setPickupHour}
        />

        <Text style={styles.label}>Validation</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 07/02/24 - 09/02/24"
          value={validation}
          onChangeText={setValidation}
        />

        <Text style={styles.label}>Price</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. $3.50"
          value={price}
          onChangeText={setPrice}
        />

        <Text style={styles.label}>What you could get</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Lorem ipsum dolor sit amet consectetur."
          value={description}
          onChangeText={setDescription}
        />

        <Text style={styles.label}>Food Category</Text>
        <View style={styles.pickerContainer}>
          <TouchableOpacity
            onPress={() => setCategory('Breakfast')}
            style={[styles.pickerButton, category === 'Breakfast' && styles.pickerButtonSelected]}
          >
            <Text style={styles.pickerButtonText}>Breakfast</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setCategory('Lunch')}
            style={[styles.pickerButton, category === 'Lunch' && styles.pickerButtonSelected]}
          >
            <Text style={styles.pickerButtonText}>Lunch</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setCategory('Dinner')}
            style={[styles.pickerButton, category === 'Dinner' && styles.pickerButtonSelected]}
          >
            <Text style={styles.pickerButtonText}>Dinner</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleUploadBag}>
          <Text style={styles.submitButtonText}>Submit Bag</Text>
        </TouchableOpacity>
      </ScrollView>
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
  scrollContainer: {
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  imageList: {
    paddingVertical: 10,
  },
  imageThumbnail: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  selectedImage: {
    borderWidth: 2,
    borderColor: 'blue',
  },
  imageLabel: {
    textAlign: 'center',
    marginTop: 5,
    color: '#5c5f4c',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#5c5f4c',
  },
  input: {
    borderWidth: 1,
    borderColor: '#000',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 20,
    height: 50,
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  pickerButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    marginHorizontal: 5,
    backgroundColor: '#fff',
  },
  pickerButtonSelected: {
    backgroundColor: '#82866b',
  },
  pickerButtonText: {
    color: '#5c5f4c',
  },
  submitButton: {
    backgroundColor: '#5c5f4c',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default UploadSurpriseBagScreen;
