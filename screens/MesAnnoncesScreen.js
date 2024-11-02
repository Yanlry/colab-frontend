import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useSelector } from 'react-redux';

export default function MesAnnoncesScreen({ navigation }) {
    
  const apiUrl = `${process.env.REACT_APP_MY_ADDRESS}`;


  const utilisateur = useSelector(state => state.utilisateur.value);

  const [mesAnnonces, setMesAnnonces] = useState([]);

  useEffect(() => {
    fetch(`${apiUrl}/annonces/mesAnnonces/${utilisateur.token}`)
      .then(response => response.json())
      .then(data => {
        const trierDateAnnonce = data.annonces.sort((a, b) => new Date(b.date) - new Date(a.date));
        setMesAnnonces(trierDateAnnonce);
      })
  }, []);

  // Sert a formater l'heure
  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    const dateObject = new Date(dateString);
    return dateObject.toLocaleDateString('fr-FR', options);
  };

  const lesOffres = mesAnnonces.map(annonce => (

    <TouchableOpacity key={annonce.token} style={styles.annonce} onPress={() => navigation.navigate('Annonce', { annonce: annonce })}>
    <View style={styles.imageAnnonce}>
      <Text style={styles.apercuImage}>Image </Text>
    </View>
      <View style={styles.mesCritere}>
    <View style={styles.apercuAnnonce}>
      <Text style={styles.apercuAnnonceTitre}>
        {annonce.title.length > 30 ? annonce.title.substring(0, 28) + "..." : annonce.title} {"\n"}
      </Text>
      <View>
      <Text style={styles.apercuAnnonceDescription}>
        {annonce.description.length > 130 ? annonce.description.substring(0, 130) + "..." : annonce.description} {"\n"}
      </Text>
      </View>
      <View style={styles.containerCritere}>
      <Text style={styles.apercuAnnonceExperience}>
        Expérience dans le domaine : {annonce.experience} ans
      </Text>
      </View>
      <View style={styles.containerCritere}>
      <Text style={styles.apercuAnnonceTempsMax}>
        Disponible : {annonce.tempsMax} heures / semaine
      </Text>
      </View>
      <View style={styles.containerCritere}>
      <Text style={styles.apercuAnnonceTempsMax}>
        Moment des séances : {annonce.disponibilite}
      </Text>
      </View>
      <View style={styles.containerCritere}>
      <Text style={styles.apercuAnnonceDate}>
        Mise en ligne le : {formatDate(annonce.date)}
      </Text>
      </View>
      </View>
    </View>
  </TouchableOpacity>
  ))

  return (
    <SafeAreaView style={styles.safeAreaView}>

    <View style={styles.container}>
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.icon}>
          <FontAwesome name='reply-all' size={28} color={'#3A3960'} />
        </TouchableOpacity>
        <Text style={styles.title}>Mes annonces</Text>
      </View>

      <View style={styles.menu}>

        <View>
          {mesAnnonces.length === 0 ? (
            <Text style={styles.pasDannonces}>Aucune annonce publiée</Text>
            ) :
          <ScrollView>{lesOffres}</ScrollView>}
        </View>
      </View>
    </View>
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor:'#fff'
  },
  container: {
    flex:1
  },
  menu: {
    alignItems: 'center',
  },
  containerCritere:{
    marginVertical:3
  },

// ------------------- ICONE RETOUR ARRIERE ---------------------
header: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop:20,
  marginBottom: 10,
},
icon: {
  marginLeft: 25,
  marginRight:82
},
title: {
  fontSize: 24,
  fontWeight: 'bold',
},
  
// ------------------- AUCUNE ANNONCE PUBLIEE ---------------------

  pasDannonces: {
    marginTop: 300,
    fontSize: 30
  },

// ------------------- MON ANNONCES ---------------------

annonce: {
  height: 190,
  width: '94%',
  flexDirection: 'row',
  borderRadius: 12,
  margin: 10,
  padding: 10,
  justifyContent: 'space-between',
  textAlign: 'center',
  backgroundColor: '#fff',
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowRadius: 3.84,
  elevation: 5,
  shadowOffset: { width: 0, height: 5 },
},
imageAnnonce: {
  justifyContent: 'center',
},
apercuImage: {
  borderWidth: 1,
  borderColor:'#8F8F8F',
  height: 150,
  paddingTop: 63,
  borderRadius: 12,
  width: 99,
  textAlign: 'center',
  marginRight: 10,
},
apercuAnnonce: {
  width: 270,
  paddingRight:50
},
apercuAnnonceTitre: {
  fontSize: 18,
},
apercuAnnonceDescription: {
  fontSize: 13,
  marginBottom:19
},
apercuAnnonceExperience: {
  fontSize: 12,
  fontWeight:'bold',
},
apercuAnnonceTempsMax: {
  fontSize: 12,
  fontWeight: 'bold',
},
apercuAnnonceDate: {
  fontSize: 12,
  marginTop:15
},

});
