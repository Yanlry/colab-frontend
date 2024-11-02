import React from 'react';
import { LogBox } from 'react-native';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import ConnexionScreen from './screens/ConnexionScreen';
import InscriptionScreen from './screens/InscriptionScreen';
import AccueilScreen from './screens/AccueilScreen';
import ContactScreen from './screens/ContactScreen';
import PublierScreen from './screens/PublierScreen';
import MapScreen from './screens/MapScreen';
import FavorisScreen from './screens/FavorisScreen';
import NotificationScreen from './screens/NotificationScreen';
import ProfilScreen from './screens/ProfilScreen';
import ActiviteScreen from './screens/ActiviteScreen';
import AnnonceScreen from './screens/AnnonceScreen';
import UtilisateurScreen from './screens/UtilisateurScreen';
import MesAnnoncesScreen from './screens/MesAnnoncesScreen';
import MonAnnonceScreen from './screens/MonAnnonceScreen';
import ConversationScreen from './screens/ConversationScreen';
import AnnonceMapScreen from './screens/AnnonceMapScreen';
import UserProfileScreen from './screens/UserProfileScreen';
import AnnonceUserScreen from './screens/AnnonceUserScreen'

import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import utilisateur from './reducers/utilisateur';

LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();

const store = configureStore({
  reducer: { utilisateur },
});

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const CustomHeader = ({ navigation }) => {
  return (
    <View style={styles.navBar}>
      <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
        <FontAwesome style={styles.cloche} name="bell" size={28} color="#287777" />
      </TouchableOpacity>
      <TouchableOpacity>
        <Image resizeMode="contain" source={require('./assets/logo.png')} style={styles.logo} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Utilisateur')}>
        <FontAwesome name="user" style={styles.iconeUser} size={30} color="#287777" />
      </TouchableOpacity>
    </View>
  );
};

const TabNavigator = ({ navigation }) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        gestureEnabled: false, // Désactive le swipe back
        tabBarIcon: ({ focused }) => {
          let iconName = '';
          let iconSize = focused ? 40 : 28;
          let backgroundColor = focused ? '#fff' : 'transparent';

          if (route.name === 'Accueil') {
            iconName = 'home';
          } else if (route.name === 'Contact') {
            iconName = 'address-book';
          } else if (route.name === 'Publier') {
            iconName = 'plus';
          } else if (route.name === 'Map') {
            iconName = 'map';
          } else if (route.name === 'Favoris') {
            iconName = 'heart';
          }

          return (
            <View style={[
              styles.tabIconContainer,
              focused && styles.activeTabContainer
            ]}>
              <FontAwesome name={iconName} size={iconSize} color={focused ? '#287777' : '#FFFFFF'} />
            </View>
          );
        },
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        header: props => <CustomHeader {...props} navigation={navigation} />,
      })}
    >
      <Tab.Screen name="Accueil" component={AccueilScreen} />
      <Tab.Screen name="Contact" component={ContactScreen} />
      <Tab.Screen name="Publier" component={PublierScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Favoris" component={FavorisScreen} />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false, gestureEnabled: false }}>
          <Stack.Screen name="Connexion" component={ConnexionScreen} />
          <Stack.Screen name="Inscription" component={InscriptionScreen} />
          <Stack.Screen name="Activite" component={ActiviteScreen} />
          <Stack.Screen name="TabNavigator" component={TabNavigator} />
          <Stack.Screen name="Accueil" component={AccueilScreen} />
          <Stack.Screen name="Annonce" component={AnnonceScreen} />
          <Stack.Screen name="AnnonceMap" component={AnnonceMapScreen} />
          <Stack.Screen name="Notification" component={NotificationScreen} />
          <Stack.Screen name="Utilisateur" component={UtilisateurScreen} />
          <Stack.Screen name="Profil" component={ProfilScreen} />
          <Stack.Screen name="MesAnnonces" component={MesAnnoncesScreen} />
          <Stack.Screen name="MonAnnonce" component={MonAnnonceScreen} />
          <Stack.Screen name="Conversation" component={ConversationScreen} />
          <Stack.Screen name="UserProfile" component={UserProfileScreen} />
          <Stack.Screen name="AnnonceUser" component={AnnonceUserScreen} />

        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingTop: 40,
    marginTop: 5,
    height: 95,
    backgroundColor: '#e5f6f6',
  },
  logo: {
    height: 48,
    width: 100,
    marginRight: 5
  },
  cloche: {
    marginTop: 5
  },
  iconeUser: {
    marginTop: 5
  },
  tabBar: {
    position: 'absolute',
    backgroundColor: '#287777',
    paddingTop: 20,
    paddingRight: 30,
    paddingLeft: 10,
    height: 90,
    width: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  tabIconContainer: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 35,
    backgroundColor: 'transparent',
  },
  activeTabContainer: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  }
});
