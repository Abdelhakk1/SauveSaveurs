import React, { useState, useEffect } from 'react';
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
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Picker } from '@react-native-picker/picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { supabase } from '../database/supabaseClient';

const defaultImageUrls = [
  { id: 1, uri: 'https://rboyqdyoehiiajuvcyft.supabase.co/storage/v1/object/public/surprise_bags/DALL_E_2024-05-26_12.27.48_-_A_variety_of_breakfast_items_like_pancakes__eggs__toast__and_fruit.webp', label: 'Breakfast' },
  { id: 2, uri: 'https://rboyqdyoehiiajuvcyft.supabase.co/storage/v1/object/public/surprise_bags/DALL_E_2024-05-26_12.27.50_-_A_hearty_meal_with_items_like_sandwiches__salads__or_pasta_dishes.webp', label: 'Lunch/Dinner' },
  { id: 3, uri: 'https://rboyqdyoehiiajuvcyft.supabase.co/storage/v1/object/public/surprise_bags/DALL_E_2024-05-26_12.27.53_-_A_variety_of_baked_goods_such_as_croissants__muffins__and_bread.webp', label: 'Bakery' },
  { id: 4, uri: 'https://rboyqdyoehiiajuvcyft.supabase.co/storage/v1/object/public/surprise_bags/DALL_E_2024-05-26_12.27.56_-_Fresh_fruits_and_vegetables_in_a_basket_or_on_a_table.webp', label: 'Fruits/Vegetables' },
  { id: 5, uri: 'https://rboyqdyoehiiajuvcyft.supabase.co/storage/v1/object/public/surprise_bags/DALL_E_2024-05-26_12.27.59_-_A_variety_of_snacks_such_as_chips__cookies__or_nuts.webp', label: 'Snacks' },
  { id: 6, uri: 'https://rboyqdyoehiiajuvcyft.supabase.co/storage/v1/object/public/surprise_bags/DALL_E_2024-05-26_12.28.02_-_A_variety_of_dairy_products_like_cheese__yogurt__and_milk.webp', label: 'Dairy' },
];

const UpdateSurpriseBagScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { surpriseBag } = route.params || {};

  const [name, setName] = useState(surpriseBag.name || '');
  const [bagNumber, setBagNumber] = useState(surpriseBag.bag_number || '');
  const [pickupHourFrom, setPickupHourFrom] = useState(new Date());
  const [pickupHourTo, setPickupHourTo] = useState(new Date());
  const [validationFrom, setValidationFrom] = useState(new Date(surpriseBag.validation.split(' - ')[0]));
  const [validationTo, setValidationTo] = useState(new Date(surpriseBag.validation.split(' - ')[1]));
  const [price, setPrice] = useState(surpriseBag.price ? surpriseBag.price.toString() : '');
  const [quantityLeft, setQuantityLeft] = useState(surpriseBag.quantity_left ? surpriseBag.quantity_left.toString() : '');
  const [description, setDescription] = useState(surpriseBag.description || '');
  const [category, setCategory] = useState(surpriseBag.category || 'Breakfast');
  const [selectedImage, setSelectedImage] = useState(surpriseBag.image_url || '');
  const [pickerVisible, setPickerVisible] = useState(false);
  const [showTimePickerFrom, setShowTimePickerFrom] = useState(false);
  const [showTimePickerTo, setShowTimePickerTo] = useState(false);
  const [showDatePickerFrom, setShowDatePickerFrom] = useState(false);
  const [showDatePickerTo, setShowDatePickerTo] = useState(false);

  useEffect(() => {
    const [pickupStart, pickupEnd] = surpriseBag.pickup_hour.split(' - ');
    const pickupStartTime = new Date();
    const pickupEndTime = new Date();
    const [pickupStartHour, pickupStartMinute] = pickupStart.split(':');
    const [pickupEndHour, pickupEndMinute] = pickupEnd.split(':');
    pickupStartTime.setHours(pickupStartHour, pickupStartMinute);
    pickupEndTime.setHours(pickupEndHour, pickupEndMinute);
    setPickupHourFrom(pickupStartTime);
    setPickupHourTo(pickupEndTime);
  }, [surpriseBag]);

  const handleSelectImage = (uri) => {
    setSelectedImage(uri);
  };

  const handleUpdateBag = async () => {
    if (!name || !bagNumber || !pickupHourFrom || !pickupHourTo || !validationFrom || !validationTo || !price || !quantityLeft || !description || !selectedImage) {
      Alert.alert('Error', 'Please fill out all fields and select an image');
      return;
    }

    const formatTimeTo24Hour = (date) => {
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    };

    const pickupHourFromString = formatTimeTo24Hour(pickupHourFrom);
    const pickupHourToString = formatTimeTo24Hour(pickupHourTo);
    const validationFromString = validationFrom.toISOString().split('T')[0];
    const validationToString = validationTo.toISOString().split('T')[0];

    try {
      const { error } = await supabase
        .from('surprise_bags')
        .update({
          name,
          bag_number: bagNumber,
          pickup_hour: `${pickupHourFromString} - ${pickupHourToString}`,
          validation: `${validationFromString} - ${validationToString}`,
          price: parseFloat(price),
          quantity_left: parseInt(quantityLeft),
          description,
          category,
          image_url: selectedImage,
          pickup_start_time: pickupHourFromString,
          pickup_end_time: pickupHourToString,
        })
        .eq('id', surpriseBag.id);

      if (error) {
        console.error('Error updating surprise bag:', error);
        Alert.alert('Error updating surprise bag', error.message);
      } else {
        Alert.alert('Success', 'Surprise bag updated successfully');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Network request failed:', error);
      Alert.alert('Network request failed', error.message);
    }
  };

  const handleDeleteBag = async () => {
    try {
      const { error } = await supabase
        .from('surprise_bags')
        .delete()
        .eq('id', surpriseBag.id);

      if (error) {
        console.error('Error deleting surprise bag:', error);
        Alert.alert('Error deleting surprise bag', error.message);
      } else {
        Alert.alert('Success', 'Surprise bag deleted successfully');
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
        <Text style={styles.headerTitle}>Update Surprise Bag</Text>
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
          placeholderTextColor="rgba(0, 0, 0, 0.5)"
          placeholder="e.g. Surprise Bag"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Bag no.</Text>
        <TextInput
          style={styles.input}
          placeholderTextColor="rgba(0, 0, 0, 0.5)"
          placeholder="e.g. #001"
          value={bagNumber}
          onChangeText={setBagNumber}
        />

        <Text style={styles.label}>Pick up Hour</Text>
        <View style={styles.timeContainer}>
          <TouchableOpacity onPress={() => setShowTimePickerFrom(true)} style={styles.fullTouchable}>
            <TextInput
              style={styles.input}
              placeholderTextColor="rgba(0, 0, 0, 0.5)"
              placeholder="From"
              value={pickupHourFrom.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
              editable={false}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowTimePickerTo(true)} style={styles.fullTouchable}>
            <TextInput
              style={styles.input}
              placeholderTextColor="rgba(0, 0, 0, 0.5)"
              placeholder="To"
              value={pickupHourTo.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
              editable={false}
            />
          </TouchableOpacity>
        </View>
        <DateTimePickerModal
          isVisible={showTimePickerFrom}
          mode="time"
          onConfirm={(time) => {
            setShowTimePickerFrom(false);
            setPickupHourFrom(time);
          }}
          onCancel={() => setShowTimePickerFrom(false)}
        />
        <DateTimePickerModal
          isVisible={showTimePickerTo}
          mode="time"
          onConfirm={(time) => {
            setShowTimePickerTo(false);
            setPickupHourTo(time);
          }}
          onCancel={() => setShowTimePickerTo(false)}
        />

        <Text style={styles.label}>Validation</Text>
        <View style={styles.dateContainer}>
          <TouchableOpacity onPress={() => setShowDatePickerFrom(true)} style={styles.fullTouchable}>
            <TextInput
              style={styles.input}
              placeholderTextColor="rgba(0, 0, 0, 0.5)"
              placeholder="From"
              value={validationFrom.toISOString().split('T')[0]}
              editable={false}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowDatePickerTo(true)} style={styles.fullTouchable}>
            <TextInput
              style={styles.input}
              placeholderTextColor="rgba(0, 0, 0, 0.5)"
              placeholder="To"
              value={validationTo.toISOString().split('T')[0]}
              editable={false}
            />
          </TouchableOpacity>
        </View>
        <DateTimePickerModal
          isVisible={showDatePickerFrom}
          mode="date"
          onConfirm={(date) => {
            setShowDatePickerFrom(false);
            setValidationFrom(date);
          }}
          onCancel={() => setShowDatePickerFrom(false)}
        />
        <DateTimePickerModal
          isVisible={showDatePickerTo}
          mode="date"
          onConfirm={(date) => {
            setShowDatePickerTo(false);
            setValidationTo(date);
          }}
          onCancel={() => setShowDatePickerTo(false)}
        />

        <Text style={styles.label}>Price (DZD)</Text>
        <TextInput
          style={styles.input}
          placeholderTextColor="rgba(0, 0, 0, 0.5)"
          placeholder="e.g. 250"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Quantity Left</Text>
        <TextInput
          style={styles.input}
          placeholderTextColor="rgba(0, 0, 0, 0.5)"
          placeholder="e.g. 10"
          value={quantityLeft}
          onChangeText={setQuantityLeft}
          keyboardType="numeric"
        />

        <Text style={styles.label}>What you could get</Text>
        <TextInput
          style={styles.input}
          placeholderTextColor="rgba(0, 0, 0, 0.5)"
          placeholder="e.g. Lorem ipsum dolor sit amet consectetur."
          value={description}
          onChangeText={setDescription}
        />

        <Text style={styles.label}>Food Category</Text>
        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => setPickerVisible(true)}
        >
          <Text style={styles.pickerButtonText}>{category}</Text>
        </TouchableOpacity>
        <Modal
          visible={pickerVisible}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.pickerContainer}>
            <View style={styles.pickerContent}>
              <TouchableOpacity onPress={() => setPickerVisible(false)}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
              <Picker
                selectedValue={category}
                onValueChange={(itemValue) => {
                  setCategory(itemValue);
                  setPickerVisible(false);
                }}
                style={{ width: '100%' }}
              >
                <Picker.Item label="Breakfast" value="Breakfast" />
                <Picker.Item label="Lunch/Dinner" value="Lunch/Dinner" />
                <Picker.Item label="Bakery" value="Bakery" />
                <Picker.Item label="Fruits/Vegetables" value="Fruits/Vegetables" />
                <Picker.Item label="Snacks" value="Snacks" />
                <Picker.Item label="Dairy" value="Dairy" />
              </Picker>
            </View>
          </View>
        </Modal>

        <TouchableOpacity style={styles.submitButton} onPress={handleUpdateBag}>
          <Text style={styles.submitButtonText}>Update Bag</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.submitButton, styles.deleteButton]} onPress={handleDeleteBag}>
          <Text style={styles.submitButtonText}>Delete Bag</Text>
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
    color: '#000',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fullTouchable: {
    flex: 1,
    marginRight: 10,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pickerButton: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  pickerButtonText: {
    fontSize: 16,
    color: '#5c5f4c',
  },
  pickerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  pickerContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    width: '80%',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#5c5f4c',
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#5c5f4c',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  deleteButton: {
    backgroundColor: 'red',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default UpdateSurpriseBagScreen;
