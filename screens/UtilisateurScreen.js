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
                  <FontAwesome name='chevron-left' size={28} color={'#287777'} />
                </TouchableOpacity>
                <Text style={styles.title}>Menu utilisateur</Text>
              </View>

            <View style={styles.menuContainer}>
              <TouchableOpacity style={styles.mesMenu} onPress={() => navigation.navigate('Profil')}>
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
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

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
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor:'#e5f6f6',
    alignItems:'center'
  },

  //-----------------------  NAVBAR  ---------------------------------
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop:20,
    marginBottom: 10,
  },
  icon: {
    paddingLeft:20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#236C6C',
    paddingLeft:65

  },

  //------------------- MENU ---------------------
  menuContainer: {
    height: 700,
    width: 350,
    marginLeft:13,
    alignItems: 'center',
    marginTop:50,
  },
  mesMenu: {
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: 250,
    height: 60,
    margin:10,
    backgroundColor: '#287777'
  },
  menuSupprimer: {
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: 250,
    height: 60,
    margin:10,
    backgroundColor: '#FF6347'
  },
  mesMenuTitre: {
    fontSize:18,
    color: 'white',
  },

  //-------------------  CONFIRMER LA DECONNECTION ---------------------
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
    width: 100,
    backgroundColor: '#FF6347',
  },
  confirmationButtonTexte: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
