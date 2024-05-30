import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const DeleteAccountScreen = () => {
  const navigation = useNavigation();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [modalVisible, setModalVisible] = useState(true);

  const toggleShowPassword = () => setShowPassword(!showPassword);

  const handleDeleteAccount = () => {
    // Add logic to handle account deletion
    console.log('Account deleted');
    setModalVisible(false);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={24} color="#6b6e56" />
      </TouchableOpacity>
      <Text style={styles.pageTitle}>General Settings</Text>
      <View style={styles.menuBox}>
        <TouchableOpacity style={styles.menuItem}>
          <Icon name="lock-outline" size={24} color="#676a61" style={styles.icon} />
          <Text style={styles.menuText}>Change Password</Text>
          <Icon name="chevron-right" size={24} color="#676a61" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Icon name="shield-outline" size={24} color="#676a61" style={styles.icon} />
          <Text style={styles.menuText}>Privacy Policy</Text>
          <Icon name="chevron-right" size={24} color="#676a61" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Icon name="file-document-outline" size={24} color="#676a61" style={styles.icon} />
          <Text style={styles.menuText}>Terms of Services</Text>
          <Icon name="chevron-right" size={24} color="#676a61" />
        </TouchableOpacity>
      </View>
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Enter your current password to delete your account.</Text>
              <TouchableOpacity style={styles.closeIconContainer} onPress={() => setModalVisible(false)}>
                <Icon name="close" size={24} color="#6b6e56" />
              </TouchableOpacity>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                placeholder="Enter your password"
              />
              <TouchableOpacity onPress={toggleShowPassword}>
                <Icon name={showPassword ? "eye" : "eye-off"} size={24} color="#6b6e56" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
              <Text style={styles.deleteButtonText}>Delete Account</Text>
            </TouchableOpacity>
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
  menuBox: {
    width: '90%',
    alignSelf: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  icon: {
    marginRight: 15,
  },
  menuText: {
    fontSize: 18,
    flex: 1,
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
    flex: 1,
    textAlign: 'center',
  },
  closeIconContainer: {
    padding: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginVertical: 20,
    width: '100%',
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: '#6b6e56',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    width: '100%',
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DeleteAccountScreen;
