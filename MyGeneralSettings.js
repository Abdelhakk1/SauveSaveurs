import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const MyGeneralSettings = () => {
  const navigation = useNavigation();

  const menuItems = [
    { id: '1', title: 'Change Language', iconName: 'translate', screen: 'ChangeLanguageScreen' },
    { id: '2', title: 'Change Password', iconName: 'lock-outline', screen: 'ChangePasswordScreen' },
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate(item.screen)}>
      <Icon name={item.iconName} size={24} color="#676a61" style={styles.icon} />
      <Text style={styles.menuText}>{item.title}</Text>
      <Icon name="chevron-right" size={24} color="#676a61" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={24} color="#6b6e56" />
      </TouchableOpacity>
      <Text style={styles.pageTitle}>General Settings</Text>
      <View style={styles.menuBox}>
        <FlatList
          data={menuItems}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </View>
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
});

export default MyGeneralSettings;
