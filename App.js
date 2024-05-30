import React from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import store from './store';

import OnboardingScreen from './screens/OnboardingScreen';
import RoleSelectionScreen from './screens/RoleSelectionScreen';
import UserSignUpScreen from './screens/UserSignUpScreen';
import UserSignInScreen from './screens/UserSignInScreen';
import HomeScreen from './screens/HomeScreen';
import ChangeLocationScreen from './screens/ChangeLocationScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import ProfileScreen from './screens/ProfileScreen';
import SearchScreen from './screens/SearchScreen';
import StoreDetailsScreen from './components/StoreDetailsScreen';
import MoreInformationScreen from './components/MoreInformationScreen';
import OrderDoneScreen from './screens/OrderDoneScreen';
import OrderPageScreen from './screens/OrderPageScreen';
import MyOrderScreen from './screens/MyOrderScreen';
import MyPersonalInformation from './screens/MyPersonalInformation';
import MyGeneralSettings from './screens/MyGeneralSettings';
import ChangeLanguageScreen from './screens/ChangeLanguageScreen';
import ChangePasswordScreen from './screens/ChangePasswordScreen';
import DeleteAccountScreen from './screens/DeleteAccountScreen';
import MySupportScreen from './screens/MySupportScreen';
import SeeAllScreen from './screens/SeeAllScreen';
import NotificationScreen from './screens/NotificationScreen';
import EmployeeSignUpScreen from './EmployeeScreens/EmployeeSignUpScreen';
import EmployeeSignInScreen from './EmployeeScreens/EmployeeSignInScreen';
import EmployeeHomeScreen from './EmployeeScreens/EmployeeHomeScreen';
import EmployeeReservationsScreen from './EmployeeScreens/EmployeeReservationsScreen';
import EmployeeProfileScreen from './EmployeeScreens/EmployeeProfileScreen';
import ShopInformationScreen from './EmployeeScreens/ShopInformationScreen';
import CompleteProfileScreen from './EmployeeScreens/CompleteProfileScreen';
import SurpriseBagsScreen from './EmployeeScreens/SurpriseBagsScreen';
import UploadSurpriseBagScreen from './EmployeeScreens/UploadSurpriseBagScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Favorites':
              iconName = focused ? 'heart' : 'heart-outline';
              break;
            case 'Search':
              iconName = 'magnify';
              break;
            case 'Profile':
              iconName = focused ? 'account' : 'account-outline';
              break;
            default:
              iconName = 'home';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#7B8A47',
        tabBarInactiveTintColor: '#000000',
        tabBarStyle: {
          backgroundColor: '#d8d9d1',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function EmployeeMainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Reservation':
              iconName = focused ? 'clipboard-list' : 'clipboard-list-outline';
              break;
            case 'Profile':
              iconName = focused ? 'account' : 'account-outline';
              break;
            default:
              iconName = 'home';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#7B8A47',
        tabBarInactiveTintColor: '#000000',
        tabBarStyle: {
          backgroundColor: '#d8d9d1',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={EmployeeHomeScreen} />
      <Tab.Screen name="Reservation" component={EmployeeReservationsScreen} />
      <Tab.Screen name="Profile" component={EmployeeProfileScreen} />
    </Tab.Navigator>
  );
}

function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="OnboardingScreen" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} />
          <Stack.Screen name="RoleSelectionScreen" component={RoleSelectionScreen} />
          <Stack.Screen name="UserSignUpScreen" component={UserSignUpScreen} />
          <Stack.Screen name="UserSignInScreen" component={UserSignInScreen} />
          <Stack.Screen name="ChangeLocationScreen" component={ChangeLocationScreen} />
          <Stack.Screen name="StoreDetailsScreen" component={StoreDetailsScreen} />
          <Stack.Screen name="MoreInformationScreen" component={MoreInformationScreen} />
          <Stack.Screen name="OrderDoneScreen" component={OrderDoneScreen} />
          <Stack.Screen name="OrderPageScreen" component={OrderPageScreen} />
          <Stack.Screen name="MyOrderScreen" component={MyOrderScreen} />
          <Stack.Screen name="MyPersonalInformation" component={MyPersonalInformation} />
          <Stack.Screen name="MyGeneralSettings" component={MyGeneralSettings} />
          <Stack.Screen name="ChangeLanguageScreen" component={ChangeLanguageScreen} />
          <Stack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} />
          <Stack.Screen name="DeleteAccountScreen" component={DeleteAccountScreen} />
          <Stack.Screen name="MySupportScreen" component={MySupportScreen} />
          <Stack.Screen name="SeeAllScreen" component={SeeAllScreen} />
          <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
          <Stack.Screen name="EmployeeSignUpScreen" component={EmployeeSignUpScreen} />
          <Stack.Screen name="EmployeeSignInScreen" component={EmployeeSignInScreen} />
          <Stack.Screen name="EmployeeMainTabs" component={EmployeeMainTabs} />
          <Stack.Screen name="ShopInformationScreen" component={ShopInformationScreen} />
          <Stack.Screen name="CompleteProfileScreen" component={CompleteProfileScreen} />
          <Stack.Screen name="SurpriseBagsScreen" component={SurpriseBagsScreen} />
          <Stack.Screen name="UploadSurpriseBagScreen" component={UploadSurpriseBagScreen} />
          <Stack.Screen name="MainTabs" component={MainTabs} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

export default App;
