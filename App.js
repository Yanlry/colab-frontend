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
import MessagerieScreen from './screens/MessagerieScreen';
import FavorisScreen from './screens/FavorisScreen';
import NotificationScreen from './screens/NotificationScreen';
import ProfilScreen from './screens/ProfilScreen'
import ActiviteScreen from './screens/ActiviteScreen';
import AnnonceScreen from './screens/AnnonceScreen';
import UtilisateurScreen from './screens/UtilisateurScreen'
import MesAnnoncesScreen from './screens/MesAnnoncesScreen'
import MonAnnonceScreen from './screens/MonAnnonceScreen';
import ModifierProfilScreen from './screens/ModifierProfilScreen'

import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import utilisateur from './reducers/utilisateur';

LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications

const store = configureStore({
  reducer: { utilisateur },
});

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const CustomHeader = ({ navigation }) => {
  return (

    <View style={styles.navBar}>
      <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
        <FontAwesome style={styles.cloche} name="bell" size={28} color="#182A49" />
      </TouchableOpacity>
      <TouchableOpacity>
        <Image resizeMode="contain" source={require('./assets/logo.png')} style={styles.logo} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Utilisateur')}>
        <FontAwesome name="user" style={styles.iconeUser} size={30} color="#182A49" />
      </TouchableOpacity>
    </View>
  );
};

const TabNavigator = ({ navigation }) => {
  return (

    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => {
          let iconName = '';
          if (route.name === 'Accueil') {
            iconName = 'home';
          } else if (route.name === 'Contact') {
            iconName = 'address-book';
          } else if (route.name === 'Publier') {
            iconName = 'plus';
          } else if (route.name === 'Messagerie') {
            iconName = 'comments';
          } else if (route.name === 'Favoris') {
            iconName = 'heart';
          }
          return <FontAwesome name={`${iconName}`} size={28} color={color} />;
        },
        tabBarActiveTintColor: '"#182A49"',
        tabBarInactiveTintColor: '#7E7E7E',
        header: props => <CustomHeader {...props} navigation={navigation} />,
      })}
    >
      <Tab.Screen name="Accueil" component={AccueilScreen} />
      <Tab.Screen name="Contact" component={ContactScreen} />
      <Tab.Screen name="Publier" component={PublierScreen} />
      <Tab.Screen name="Messagerie" component={MessagerieScreen} />
      <Tab.Screen name="Favoris" component={FavorisScreen} />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Connexion" component={ConnexionScreen} />
          <Stack.Screen name="Inscription" component={InscriptionScreen} />
          <Stack.Screen name="Activite" component={ActiviteScreen} />
          <Stack.Screen name="TabNavigator" component={TabNavigator} />
          <Stack.Screen name="Accueil" component={AccueilScreen} />
          <Stack.Screen name="Annonce" component={AnnonceScreen} />
          <Stack.Screen name="Notification" component={NotificationScreen} />
          <Stack.Screen name="Utilisateur" component={UtilisateurScreen} />
          <Stack.Screen name="Profil" component={ProfilScreen} />
          <Stack.Screen name="MesAnnonces" component={MesAnnoncesScreen} />
          <Stack.Screen name="MonAnnonce" component={MonAnnonceScreen} />
          <Stack.Screen name="ModifierProfil" component={ModifierProfilScreen} />
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
    paddingTop: 45,
    marginTop: 5,
    height: 85,
    backgroundColor: '#fff',
  },
  logo: {
    height: 38,
    width: 130,
    marginRight: 5
  },
  cloche: {
    marginTop: 5
  },
  iconeUser: {
    marginTop: 5
  }
});
