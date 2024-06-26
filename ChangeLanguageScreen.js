import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'French' },
  { code: 'ar', label: 'Arabic' }
];

const ChangeLanguageScreen = () => {
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language.code);
    i18n.changeLanguage(language.code);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.languageItem} onPress={() => handleLanguageChange(item)}>
      <Icon name={selectedLanguage === item.code ? "radiobox-marked" : "radiobox-blank"} size={24} color="#6b6e56" />
      <Text style={styles.languageText}>{t(item.label)}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={24} color="#6b6e56" />
      </TouchableOpacity>
      <Text style={styles.pageTitle}>{t('Change Language')}</Text>
      <FlatList
        data={languages}
        renderItem={renderItem}
        keyExtractor={item => item.code}
        contentContainerStyle={styles.languageList}
      />
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
  languageList: {
    padding: 20,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  languageText: {
    fontSize: 18,
    marginLeft: 10,
  },
});

export default ChangeLanguageScreen;
