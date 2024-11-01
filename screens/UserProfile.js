import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';

export default function UserProfile({ route, navigation }) {
  const username = route.params?.username ?? 'Utilisateur';
  const [userAds, setUserAds] = useState([]);
  const apiUrl = `${process.env.REACT_APP_MY_ADDRESS}`;

  const logos = {
    Informatique: require('../assets/Informatique.png'),
    Arts: require('../assets/Arts.png'),
    Bricolage: require('../assets/Bricolage.png'),
    Cuisine: require('../assets/Cuisine.png'),
    Education: require('../assets/Education.png'),
    Environnement: require('../assets/Environnement.png'),
    Humanites: require('../assets/Humanites.png'),
    Ingenierie: require('../assets/Ingenierie.png'),
    Jeux: require('../assets/Jeux.png'),
    Langues: require('../assets/Langues.png'),
    Sante: require('../assets/Sante.png'),
    Sciences: require('../assets/Sciences.png'),
    Sports: require('../assets/Sports.png'),
    Voyages: require('../assets/Voyages.png'),
  };

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    const dateObject = new Date(dateString);
    return dateObject.toLocaleDateString('fr-FR', options);
  };

  useEffect(() => {
    fetchUserAds();
  }, []);

  const fetchUserAds = () => {
    fetch(`${apiUrl}/profiles/users/${username}`)
      .then(response => response.json())
      .then(data => {
        if (data.result) {
          setUserAds(data.user.annonces);
        } else {
          console.log('Erreur lors de la récupération des annonces:', data.error);
        }
      })
      .catch(error => console.error('Erreur lors de la connexion au serveur:', error));
  };

  const renderAnnonce = (annonce) => (
    <TouchableOpacity key={annonce.token} style={styles.annonce}>
      <View style={styles.imageContainer}>
        <Text style={styles.TextImageContainer}>Catégorie :</Text>
        <Image source={logos[annonce.secteurActivite]} style={styles.logoImage} />
        <Text style={styles.TextImageContainer}>{annonce.secteurActivite}</Text>
      </View>
      <View style={styles.mesCritere}>
        <View style={styles.apercuAnnonce}>
          <Text style={styles.apercuAnnonceTitre}>
            {annonce.title.length > 46 ? `${annonce.title.substring(0, 45)}...` : annonce.title}
          </Text>
          <Text style={styles.apercuAnnonceDescription}>
            {annonce.description.length > 85 ? `${annonce.description.substring(0, 84)}...` : annonce.description}
          </Text>
          {annonce.programme && (
            <Text style={styles.apercuAnnonceProgramme}>
              <Text style={styles.critereTextTitre}>Programme : </Text>
              <Text style={styles.critereText}>
                {annonce.programme.length > 60 ? `${annonce.programme.substring(0, 59)}...` : annonce.programme}
              </Text>
            </Text>
          )}
          <View style={styles.containerCritere}>
            <Text style={styles.critereTextTitre}>Expérience : </Text>
            <Text style={styles.critereText}>{annonce.experience}</Text>
          </View>
          <View style={styles.containerCritere}>
            <Text style={styles.critereTextTitre}>Fréquence : </Text>
            <Text style={styles.critereText}>{annonce.tempsMax}</Text>
          </View>
          <View style={styles.containerCritere}>
            <Text style={styles.critereTextTitre}>Disponibilité : </Text>
            <Text style={styles.critereText}>
              {Array.isArray(annonce.disponibilite) ? annonce.disponibilite.join(', ') : annonce.disponibilite}
            </Text>
          </View>
          <Text style={styles.apercuAnnonceDate}>Mise en ligne le : {formatDate(annonce.date)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
  
  return (
    <View style={styles.container}>
        <View style={styles.header}>
            <Text style={styles.username}>{username}</Text>
            <Text style={styles.stars}>⭐⭐⭐⭐⭐</Text>
        </View>
            <Text style={styles.bio}>Biographie</Text>
            <Text style={styles.sectiontitle}>secteurs qu'il veut apprendre</Text>
            <Text style={styles.secteurs}>Beaucoup</Text>
            <Text style={styles.sectiontitle}>secteurs qu'il enseigne</Text>
            <Text style={styles.secteurs}>Beaucoup</Text>
      <FlatList
        data={userAds}
        renderItem={({ item }) => renderAnnonce(item)}
        keyExtractor={(item) => item._id ? item._id.toString() : String(Math.random())}
        style={styles.flatlist}
        contentContainerStyle={styles.flatlistContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    paddingHorizontal: 20,
    backgroundColor:'#e5f6f6',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    TextAlign: 'center',
    color: '#1F5C5C',
    marginTop:100,
    marginVertical: 20,
  },
  flatlist: {
    flexGrow: 0,
    maxHeight: '75%', // Limite la hauteur de la FlatList
    paddingVertical: 10,
  },
  flatlistContainer: {
    paddingBottom: 20,
  },
  annonce: {
    minHeight: 190,
    width: '100%',
    flexDirection: 'row',
    borderRadius: 12,
    marginVertical: 10,
    backgroundColor: '#ffffff',
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    shadowOffset: { width: 0, height: 5 },
    padding: 10,
  },
  TextImageContainer: {
    fontWeight: 'bold',
    color: '#1F5C5C',
    TextAlign: 'center',
    paddingBottom: 5,
  },
  mesCritere: {
    paddingLeft: 15,
    flex: 1,
    justifyContent: 'space-between',
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderColor: '#ccc',
    paddingRight: 10,
  },
  logoImage: {
    width: 80,
    height: 80,
    marginVertical: 15,
    resizeMode: 'contain',
  },
  apercuAnnonce: {
    width: '85%',
    flex: 1,
  },
  apercuAnnonceTitre: {
    paddingVertical: 10,
    fontWeight: 'bold',
    fontSize: 18,
    color: '#1F5C5C',
  },
  apercuAnnonceDescription: {
    fontSize: 13,
    marginVertical: 10,
    color: '#333333',
  },
  apercuAnnonceProgramme: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#14A3A1',
    marginVertical: 10,
  },
  apercuAnnonceDate: {
    fontSize: 12,
    marginTop: 15,
    color: '#888888',
  },
  containerCritere: {
    flexDirection: 'row',
    paddingVertical: 3,
  },
  critereTextTitre: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F5C5C',
  },
  critereText: {
    fontSize: 12,
    color: '#444444',
  },
  separator: {
    marginBottom: 70,
  },
  favorisIconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },



  username: {
    fontsize: 26,
    fontweight: 'bold',
    color: '#1f5c5c',
    textalign: 'center',
  },
  stars: {
    fontsize: 18,
    color: '#ffd700',
    margintop: 5,
  },
  bio: {
    fontsize: 16,
    color: '#666666',
    textalign: 'center',
    marginvertical: 15,
  },
  sectiontitle: {
    fontsize: 18,
    fontweight: 'bold',
    color: '#1f5c5c',
    margintop: 15,
    textalign: 'center',
  },
  secteurs: {
    fontsize: 16,
    color: '#333333',
    textalign: 'center',
    marginbottom: 10,
  },
});
