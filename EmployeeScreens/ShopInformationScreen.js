import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Modal
} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { WebView } from 'react-native-webview';
import { supabase } from '../database/supabaseClient';
import { useDispatch } from 'react-redux';
import { fetchShopDetails, fetchUserInfo } from '../Actions/storeActions';

const ShopInformationScreen = ({ navigation, route }) => {
  const { userId, name, profilePicture } = route.params || {};
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();

  const googleFormUrl = `https://docs.google.com/forms/d/e/1FAIpQLScV_yIPi5GNPnjOCKl2F-C6uY2-DsQtwPq_-CaX0rSw3E0f9A/viewform?usp=pp_url&entry.700735324=${userId}`;

  const handleDone = async () => {
    const { error } = await supabase
      .from('shops')
      .update({ status: 'pending' })
      .eq('employee_id', userId);

    if (error) {
      console.error('Error updating shop status:', error);
      Alert.alert('Error', 'There was an error updating your shop status. Please try again.');
    } else {
      await dispatch(fetchUserInfo(userId, 'employee'));
      await dispatch(fetchShopDetails(userId)); // Ensure the state is updated
      navigation.navigate('EmployeeMainTabs', {
        screen: 'Home',
        params: { userId, name, profilePicture, uploadSuccess: true },
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-left" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Shop Information</Text>

          <View style={styles.form}>
            <TouchableOpacity
              style={styles.uploadContainer}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.uploadText}>
                Fill out the Shop Information and Upload your shop’s pdf document via Google Form
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              onPress={handleDone}
              style={[styles.doneButton, !formSubmitted && styles.disabledButton]}
              disabled={!formSubmitted}
            >
              <Text style={styles.buttonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={{ flex: 1 }}>
            <WebView
              source={{ uri: googleFormUrl }}
              onNavigationStateChange={navState => {
                if (navState.url.includes('formResponse')) {
                  setModalVisible(false);
                  setFormSubmitted(true);
                }
              }}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

ShopInformationScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
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
  form: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  uploadContainer: {
    borderColor: '#676a61',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  uploadText: {
    fontSize: 16,
    color: '#5c5f4c',
    textAlign: 'center',
    marginVertical: 10,
  },
  footer: {
    paddingBottom: 20,
  },
  doneButton: {
    backgroundColor: '#82866b',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    marginHorizontal: 90,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  closeButton: {
    backgroundColor: '#82866b',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    margin: 20,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ShopInformationScreen;
