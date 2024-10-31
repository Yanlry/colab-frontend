import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, RefreshControl, SafeAreaView, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback, Image } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useSelector, useDispatch } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { ajouteFavoris, suprimeFavoris } from '../reducers/utilisateur';

export default function AccueilScreen({ navigation }) {

  const apiUrl = `${process.env.REACT_APP_MY_ADDRESS}`;

  const utilisateur = useSelector(state => state.utilisateur.value);
  const favoris = useSelector(state => state.utilisateur.favoris);
  const dispatch = useDispatch();
  
  const [afficherEnseigner, setAfficherEnseigner] = useState(true);
  const [recherche, setRecherche] = useState('');
  const [enseignerDate, setEnseignerDate] = useState([]);
  const [apprendreDate, setApprendreDate] = useState([]);
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
    fetch(`${apiUrl}/annonces/apprendre/${utilisateur.token}`)
      .then(response => response.json())
      .then(data => {
        const trierDateAnnonce = data.annonces.sort((a, b) => new Date(b.date) - new Date(a.date));
        setEnseignerDate(trierDateAnnonce);
      });

    fetch(`${apiUrl}/annonces/enseigner/${utilisateur.token}`)
      .then(response => response.json())
      .then(data => {
        const trierDateAnnonce = data.annonces.sort((a, b) => new Date(b.date) - new Date(a.date));
        setApprendreDate(trierDateAnnonce);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
    setRefreshing(false);
  };

  const rechercherAnnonce = (annonce) => {
    const rechercheMinuscules = recherche.toLowerCase();
    return (
      annonce.title.toLowerCase().includes(rechercheMinuscules) ||
      annonce.description.toLowerCase().includes(rechercheMinuscules)||
      annonce.programme.toLowerCase().includes(rechercheMinuscules)
    );
  };

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    const dateObject = new Date(dateString);
    return dateObject.toLocaleDateString('fr-FR', options);
  };

  const toggleFavori = (annonce) => {
    if (favoris.some(fav => fav.token === annonce.token)) {
      dispatch(suprimeFavoris(annonce.token));
    } else {
      dispatch(ajouteFavoris(annonce));
    }
  };

  const renderAnnonce = (annonce) => (
    <TouchableOpacity key={annonce.token} style={styles.annonce} onPress={() => navigation.navigate('Annonce', { annonce })}>
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
            {annonce.description.length > 85 ? `${annonce.description.substring(0, 84)}...` : annonce.description}
          </Text>
          {annonce.programme && annonce.programme.trim() !== '' && (
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

  const learn = enseignerDate.filter(rechercherAnnonce).map(renderAnnonce);
  const teach = apprendreDate.filter(rechercherAnnonce).map(renderAnnonce);

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <KeyboardAvoidingView>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <View style={styles.offreEtDemande}>
              <TouchableOpacity style={[styles.categorieBtn, afficherEnseigner && styles.categorieActive]} onPress={() => setAfficherEnseigner(true)}>
                <Text style={[styles.categorieText, afficherEnseigner && styles.textActive]}>Je veux apprendre</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.categorieBtn, !afficherEnseigner && styles.categorieActive]} onPress={() => setAfficherEnseigner(false)}>
                <Text style={[styles.categorieText, !afficherEnseigner && styles.textActive]}>Je veux enseigner</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.rechercher}>
              <TextInput
                style={styles.rechercheText}
                value={recherche}
                onChangeText={setRecherche}
                placeholder="Rechercher une annonce..."
              />
              <TouchableOpacity style={styles.filtreAnnonce}>
                <FontAwesome name="filter" size={25} style={styles.filtreIcone} />
              </TouchableOpacity>
            </View>
            <ScrollView
              style={styles.scroll}
              contentContainerStyle={{ paddingBottom: 90 }}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
            >
              {afficherEnseigner ? learn : teach}
              {afficherEnseigner && learn.length === 0 && (
                <Text style={styles.messageAucuneOffre}>
                  Désolé, actuellement personne n'est disponible pour enseigner les catégories que vous demandez.
                </Text>
              )}
              {!afficherEnseigner && teach.length === 0 && (
                <Text style={styles.messageAucuneOffre}>
                  Désolé, actuellement personne n'est disponible pour apprendre les catégories que vous proposez.
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
  safeAreaView: {
    backgroundColor:'#e5f6f6',
    height: '100%'
  },
 
 //-----------------------  BOUTON OFFRE ET DEMANDE  ---------------------------------

 offreEtDemande: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  marginTop:20,
  paddingHorizontal:10,

},
categorieBtn: {
  height: 50,
  width: '47%',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#fff',
  borderRadius: 30,
},
categorieText: {
  fontSize: 15,
  fontWeight: 'bold',
  color: '#287777',
},
categorieActive: {
  backgroundColor: '#287777'
},
textActive: {
  fontWeight: 'bold',
  color: '#fff',
},

//-----------------------  BARRE DE RECHERCHE  ---------------------------------

rechercher: {
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'row',
  marginVertical: 10,
},
rechercheText: {
  height: 45,
  width: '80%',
  fontSize: 16,
  paddingLeft: 20,
  borderRadius: 30,
  backgroundColor:'white'
},

//-----------------------  ICONE FILTRE  ---------------------------------

filtreAnnonce: {
  padding: 10,
},
filtreIcone: {
  color: '#194D4D',
},

//-----------------------   SCROLLVIEW  ---------------------------------

scroll:{
  height: '80%',
  paddingBottom: 20,

},
  //-----------------------  VIGNETTE D'ANNONCE  ---------------------------------
  
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
    fontSize: 12,
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
  //-----------------------  AUTRE  ---------------------------------
  
  messageAucuneOffre: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    marginHorizontal:15,
    color: 'gray',
  },
});



