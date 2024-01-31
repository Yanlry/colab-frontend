import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback } from 'react-native';
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
    <SafeAreaView style={styles.safeAreaView}>
      <KeyboardAvoidingView>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          
          <View style={styles.container}>
              {/* BOUTON RETOUR ARRIERE */}
              <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.icon}>
                  <FontAwesome name='chevron-left' size={28} color={'#182A49'} />
                </TouchableOpacity>
                <Text style={styles.title}>Menu utilisateur</Text>
              </View>

            <View style={styles.menuContainer}>
              <TouchableOpacity style={styles.mesMenu} onPress={() => navigation.navigate('ModifierProfil')}>
                <Text style={styles.mesMenuTitre}> Mon espace</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.mesMenu} onPress={() => navigation.navigate('MesAnnonces')}>
                <Text style={styles.mesMenuTitre}>Mes annonces</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.mesMenu} >
                <Text style={styles.mesMenuTitre}>Notifications</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.mesMenu} >
                <Text style={styles.mesMenuTitre}>F.A.Q</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.mesMenu} >
                <Text style={styles.mesMenuTitre}>Préférence de l'application</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.mesMenu} onPress={() => setConfirmerDeconnexion(true)}>
                <Text style={styles.mesMenuTitre}>Se déconnecter</Text>
              </TouchableOpacity> 
              <TouchableOpacity style={styles.menuSupprimer} >
                <Text style={styles.mesMenuTitre}>Supprimer profil</Text>
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
        </ TouchableWithoutFeedback>
      </ KeyboardAvoidingView>
    </ SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor:'#fff'
  },


 //-----------------------  NAVBAR  ---------------------------------

 header: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop:20,
  marginBottom: 10,
},
icon: {
  marginLeft: 25,
  marginRight:60
},
title: {
  fontSize: 24,
  fontWeight: 'bold',
},
  // ------------------- MENU ---------------------

  menuContainer: {
    borderRadius: 12,
    height: 700,
    width: 350,
    marginLeft:13,
    alignItems: 'center',
    marginTop:50,
  },
  mesMenu: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: 250,
    height: 60,
    margin:10,
    backgroundColor: '#182A49'
  },
  menuSupprimer: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: 250,
    height: 60,
    margin:10,
    backgroundColor: '#C14A44'
  },
  mesMenuTitre: {
    fontSize:18,
    color: 'white',
  },

  // -------------------  CONFIRMER LA DECONNECTION ---------------------

  confirmation: {
    position: 'absolute',
    top: -120,
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

//-----------------------  BOUTTON CONFIRMER LA DECONNECTION ---------------------------------

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
    width:100,
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
