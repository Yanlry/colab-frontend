import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, RefreshControl, SafeAreaView, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback, Image } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useSelector, useDispatch } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { ajouteFavoris, suprimeFavoris } from '../reducers/utilisateur';

export default function MesAnnoncesScreen({ navigation }) {

  const apiUrl = `${process.env.REACT_APP_MY_ADDRESS}`;

  const utilisateur = useSelector(state => state.utilisateur.value);
  const favoris = useSelector(state => state.utilisateur.favoris);
  const dispatch = useDispatch();

  const [mesAnnonces, setMesAnnonces] = useState([]);
  const [recherche, setRecherche] = useState('');
  const [refreshing, setRefreshing] = useState(false);

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

  const fetchData = () => {
    fetch(`${apiUrl}/annonces/mesAnnonces/${utilisateur.token}`)
      .then(response => response.json())
      .then(data => {
        const trierDateAnnonce = data.annonces.sort((a, b) => new Date(b.date) - new Date(a.date));
        setMesAnnonces(trierDateAnnonce);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);


  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
    setRefreshing(false);
  };

  const rechercherAnnonce = (annonce) => {
    const rechercheMinuscules = recherche.toLowerCase();
    return (
      annonce.title.toLowerCase().includes(rechercheMinuscules) ||
      annonce.description.toLowerCase().includes(rechercheMinuscules)
    );
  };

  const toggleFavori = (annonce) => {
    if (favoris.some(fav => fav.token === annonce.token)) {
      dispatch(suprimeFavoris(annonce.token));
    } else {
      dispatch(ajouteFavoris(annonce));
    }
  };

  const renderAnnonce = (annonce) => (
    <TouchableOpacity key={annonce.token} style={styles.annonce} onPress={() => navigation.navigate('MonAnnonce', { annonce })}>
      <View style={styles.imageContainer}>
        <Text style={styles.textImageContainer}>Catégorie :</Text>
        <Image source={logos[annonce.secteurActivite]} style={styles.logoImage} />
        <Text style={styles.textImageContainer}>{annonce.secteurActivite}</Text>
      </View>

      <TouchableOpacity style={styles.favorisIconContainer} onPress={() => toggleFavori(annonce)}>
        <FontAwesome
          name="heart"
          size={25}
          color={favoris.some(fav => fav.token === annonce.token) ? '#FF6347' : '#ddd'}
        />
      </TouchableOpacity>

      <View style={styles.mesCritere}>
        <View style={styles.apercuAnnonce}>
          <Text style={styles.apercuAnnonceTitre}>
            {annonce.title.length > 46 ? `${annonce.title.substring(0, 45)}...` : annonce.title}
          </Text>
          <Text style={styles.apercuAnnonceDescription}>
            {annonce.description.length > 105 ? `${annonce.description.substring(0, 104)}...` : annonce.description}
          </Text>
          <View style={styles.containerCritere}>
            <Text style={styles.critereTextTitre}>Expérience : </Text>
            <Text style={styles.critereText}>{annonce.experience}</Text>
          </View>
          <View style={styles.containerCritere}>
            <Text style={styles.critereTextTitre}>Fréquence : </Text>
            <Text style={styles.critereText}>{annonce.tempsMax}</Text>
          </View>
          <Text style={styles.apercuAnnonceDate}>Mise en ligne le : {new Date(annonce.date).toLocaleDateString('fr-FR')}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <KeyboardAvoidingView>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <View style={styles.navBar}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <FontAwesome name="reply-all" size={28} style={styles.goBack} color={"#287777"} />
              </TouchableOpacity>
            </View>
            <ScrollView
              style={styles.scroll}
              contentContainerStyle={{ paddingBottom: 90 }}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
            >
              {mesAnnonces.filter(rechercherAnnonce).map(renderAnnonce)}
              {mesAnnonces.length === 0 && (
                <Text style={styles.messageAucuneOffre}>
                  Aucune annonce publiée pour le moment.
                </Text>
              )}
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Style similaire à AccueilScreen pour uniformité
  safeAreaView: {
    backgroundColor: '#e5f6f6',
    height: '100%',
  },
  container: {

    height: '100%',
    padding: 10,
  },
  navBar: {
    paddingLeft:20
  },
  rechercheText: {
    height: 45,
    width: '80%',
    fontSize: 16,
    paddingLeft: 20,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  filtreAnnonce: {
    padding: 10,
  },
  filtreIcone: {
    color: '#194D4D',
  },
  scroll: {
    marginTop:15,
    height: '80%',
  },
    
  annonce: {
    minHeight: 190, 
    width: '95%',
    flexDirection: 'row',
    borderRadius: 12,
    margin: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    shadowOffset: { width: 0, height: 5 },
    paddingRight: 5,
    paddingLeft:10,
    flexGrow: 1,
    paddingBottom: 10,
  },
  textImageContainer: {
    fontWeight: 'bold',
    color: '#1F5C5C',
  },
  mesCritere: {
    paddingLeft: 15,
    flex: 1, // Permet d'occuper tout l’espace vertical disponible
    justifyContent: 'space-between', // Sépare le contenu principal et la date
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderColor: '#ccc',
    paddingRight: 10,
  },
  logoImage: {
    width: 100,
    height: 100,
    marginVertical: 15,

    resizeMode: 'contain',
  },
  apercuAnnonce: {
    width: '85%',
    flex: 1, // Permet de remplir l'espace vertical
  },
  apercuAnnonceTitre: {
    paddingVertical:10,
    fontWeight: 'bold',
    paddingRight: 10,
    paddingTop: 10,
    fontSize: 18,
    color: '#1F5C5C',
  },
  apercuAnnonceDescription: {
    fontSize: 13,
    marginVertical:10
  },
  apercuAnnonceProgramme: {
    fontSize: 13,
    fontWeight:'bold',
    color:'#14A3A1',
    marginVertical:10
  },

  apercuAnnonceDate: {
    fontSize: 11,
    marginTop: 15,
    alignSelf: 'flex-start', // Aligne la date en bas de la vignette
  },
  containerCritere: {
    flexDirection: 'row',
    paddingVertical:3,
  },
  critereTextTitre: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F5C5C',
  },
  critereText: {
    fontSize: 12,
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
  messageAucuneOffre: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: 'gray',
  },
});
