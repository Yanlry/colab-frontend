import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useSelector } from 'react-redux';

export default function MesAnnoncesScreen({ navigation }) {

  const utilisateur = useSelector(state => state.utilisateur.value);

  const [mesAnnonces, setMesAnnonces] = useState([]);

  useEffect(() => {
    fetch(`http://10.215.12.147:3000/annonces/mesAnnonces/${utilisateur.token}`)
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

    <TouchableOpacity key={annonce._id} style={styles.annonce} onPress={() => navigation.navigate('MonAnnonce', { annonce: annonce })} >

      <View style={styles.imageAnnonce}>
        <Text style={styles.apercuImage}>Image </Text>
      </View>

      <Text style={styles.apercuAnnonce}>
        <Text style={styles.apercuAnnonceTitre} >
          {annonce.title.length > 30 ? annonce.title.substring(0, 28) + "..." : annonce.title} {"\n"}
        </Text>
        {"\n"}
        <Text style={styles.apercuAnnonceDescription}>
          {annonce.description.length > 130 ? annonce.description.substring(0, 130) + "..." : annonce.description} {"\n"}
        </Text>
        {"\n"}
        <Text style={styles.apercuAnnonceExperience}>
          Expérience en années: {annonce.experience}
        </Text>
        {"\n"}
        <Text style={styles.apercuAnnonceTempsMax}>
          Nombre d'heures par semaine : {annonce.tempsMax}
        </Text>
        {"\n"}
        {"\n"}
        <Text style={styles.apercuAnnonceDate}>
          Mise en ligne le : {formatDate(annonce.date)}
        </Text>
      </Text>

    </TouchableOpacity>
  ))

  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome name='chevron-left' size={28} color={'#3A3960'} />
        </TouchableOpacity>
      </View>

      <View style={styles.menu}>
        <View style={styles.boxTitre}>
          <Text style={styles.titre}>Mes annonces</Text>
        </View>
        {mesAnnonces.length === 0 ? (
          <Text style={styles.pasDannonces}>Aucune annonce publiée</Text>
        ) :
          <ScrollView>{lesOffres}</ScrollView>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  // ------------------- BARRE DE NAVIGATION : VUE ---------------------

  navBar: {
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingTop: 45,
    height: 85,
    borderBottomWidth: 1,
  },
  menu: {
    flex: 1,
    paddingTop: 20,
    alignItems: 'center',
  },
  boxTitre: {

  },
  titre: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 20
  },
  annonce: {
    height: 190,
    width: 410,
    flexDirection: 'row',
    borderRadius: 12,
    margin: 10,
    borderTopWidth: 1,
    borderBottomColor: 'gray',
    padding: 10,
    justifyContent: 'space-between',
    textAlign: 'center',
    borderColor: 'gray',
  },
  pasDannonces: {
    marginTop: 300,
    fontSize: 30
  },
  imageAnnonce: {
    justifyContent: 'center',
  },
  apercuImage: {
    borderWidth: 1,
    borderColor: 'gray',
    height: 150,
    paddingTop: 63,
    marginTop: 18,
    borderRadius: 12,
    width: 99,
    textAlign: 'center',
    marginRight: 20
  },
  apercuAnnonce: {
    width: 270,
    height: 180,
    marginTop: 15,
  },
  apercuAnnonceTitre: {
    fontSize: 18,
    height: 34,
  },
  apercuAnnonceDescription: {
    fontSize: 13,
    height: 34,
  },
  apercuAnnonceTempsMax: {
    fontSize: 12,
    fontWeight: 'bold',
    height: 34,
  },
  apercuAnnonceExperience: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  apercuAnnonceDate: {
    fontSize: 12,
    width: 350,
  },
});
