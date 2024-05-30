import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

import React from 'react';


import OnboardingScreen from './screens/OnboardingScreen';
import RoleSelectionScreen from './screens/RoleSelectionScreen';
import UserSignUpScreen from './screens/UserSignUpScreen';
import UserSignInScreen from './screens/UserSignInScreen';
import HomeScreen from './screens/HomeScreen';
import ChangeLocationScreen from './screens/ChangeLocationScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import ProfileScreen from './screens/ProfileScreen';
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
import SignInScreen from './EmployeeScreens/EmployeeSignInScreen';
import EmployeeHomeScreen from './EmployeeScreens/EmployeeHomeScreen';
import EmployeeReservationsScreen from './EmployeeScreens/EmployeeReservationsScreen';
import EmployeeProfileScreen from './EmployeeScreens/EmployeeProfileScreen';
import ShopInformationScreen from './EmployeeScreens/ShopInformationScreen';
import CompleteProfileScreen from './EmployeeScreens/CompleteProfileScreen';
import SurpriseBagsScreen from './EmployeeScreens/SurpriseBagsScreen';
import UploadSurpriseBagScreen from './EmployeeScreens/UploadSurpriseBagScreen';

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
    
        <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} />
        <Stack.Screen name="RoleSelectionScreen" component={RoleSelectionScreen} />
        <Stack.Screen name="UserSignUpScreen" component={UserSignUpScreen} />
        <Stack.Screen name="UserSignInScreen" component={UserSignInScreen} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="ChangeLocationScreen" component={ChangeLocationScreen} />
        <Stack.Screen name="FavoritesScreen" component={FavoritesScreen} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
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
        <Stack.Screen name="SignInScreen" component={SignInScreen} />
        <Stack.Screen name="EmployeeHomeScreen" component={EmployeeHomeScreen} />
        <Stack.Screen name="EmployeeReservationsScreen" component={EmployeeReservationsScreen} />
        <Stack.Screen name="EmployeeProfileScreen" component={EmployeeProfileScreen} />
        <Stack.Screen name="ShopInformationScreen" component={ShopInformationScreen} />
        <Stack.Screen name="CompleteProfileScreen" component={CompleteProfileScreen} />
        <Stack.Screen name="SurpriseBagsScreen" component={SurpriseBagsScreen} />
        <Stack.Screen name="UploadSurpriseBagScreen" component={UploadSurpriseBagScreen} />


















      </Stack.Navigator>
    </NavigationContainer>
  );
}
