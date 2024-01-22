import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useDispatch } from 'react-redux';

import { logout } from '../reducers/utilisateur';

export default function UtilisateurScreen({ navigation }) {
  const dispatch = useDispatch();

  const [confirmerDeconnexion, setConfirmerDeconnexion] = useState(false);

  const seDeconnecter = () => {
    dispatch(logout());
    navigation.navigate('Connexion');
  };

  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
        {/* BOUTON RETOUR ARRIERE */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome name='chevron-left' size={28} style={styles.goBack} color={'#3A3960'} />
        </TouchableOpacity>
      </View>

      <View style={styles.menuContainer}>
        <View style={styles.boxTitre}>
          <Text style={styles.menuTitre}>MENU</Text>
        </View>
        <TouchableOpacity style={styles.mesMenu} onPress={() => navigation.navigate('ModifierProfil')}>
          <Text style={styles.mesMenuTitre}> Mon espace</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.mesMenu} onPress={() => navigation.navigate('MesAnnonces')}>
          <Text style={styles.mesMenuTitre}>Mes annonces</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.mesMenu} onPress={() => setConfirmerDeconnexion(true)}>
          <Text style={styles.mesMenuTitre}>Se déconnecter</Text>
        </TouchableOpacity>
      </View>

      {/* Boîte de dialogue de confirmation */}
      {confirmerDeconnexion && (
        <View style={styles.confirmation}>
          <View style={styles.confirmationContainer}>
            <Text style={styles.confirmationTexte}>Êtes-vous sûr de vouloir vous déconnecter ?</Text>
            <View style={styles.confirmationBouttonContainer}>
              <TouchableOpacity style={[styles.confirmationBoutton, styles.confirmationBouttonOui]} onPress={() => seDeconnecter()}>
                <Text style={styles.confirmationButtonTexte}>Oui</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.confirmationBoutton, styles.confirmationBouttonAnnule]} onPress={() => setConfirmerDeconnexion(false)}>
                <Text style={styles.confirmationButtonTexte}>Annuler</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',

  },

  // ------------------- NAVBAR : VIEW ---------------------

  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingTop: 45,
    height: 85,
    borderBottomWidth: 1,
    backgroundColor: '#fff'
  },

  // ------------------- MENU ---------------------

  menuContainer: {
    borderRadius: 12,
    height: 700,
    width: 350,
    marginLeft: 40,
    marginTop: 60,
    borderWidth: 2,
    borderColor: '#3A3960',
    alignItems: 'center',
  },
  boxTitre: {
    borderBottomWidth: 1,
    width: 200,
    paddingBottom: 40,
    marginBottom: 40,
    borderColor: '#3A3960'
  },
  menuTitre: {
    textAlign: 'center',
    fontSize: 35,
    fontWeight: 'bold',
    marginTop: 40,
    color: '#3A3960',
  },
  mesMenu: {
    marginVertical: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: 250,
    height: 60,
    borderWidth: 1,
    backgroundColor: '#3A3960'
  },
  mesMenuTitre: {
    fontWeight: 'bold',
    color: 'white',
  },

  // -------------------  SE DECONNECTER ---------------------

  confirmation: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  confirmationContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: 300,
    alignItems: 'center',
  },

  confirmationTexte: {
    marginBottom: 20,
    fontSize: 16,
    textAlign: 'center',
  },

  confirmationBouttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },

  confirmationBoutton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  confirmationBouttonOui: {
    backgroundColor: '#3CB371',
  },

  confirmationBouttonAnnule: {
    backgroundColor: '#E57373',
  },

  confirmationButtonTexte: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
