import React, { useState } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView, TextInput, Image } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { suprimeFavoris, ajouteFavoris } from '../reducers/utilisateur'; // Importez l'action pour ajouter et retirer des favoris

export default function FavorisScreen({ navigation }) {
  const dispatch = useDispatch();
  const favoris = useSelector(state => state.utilisateur.favoris);

  const [afficherEnseigner, setAfficherEnseigner] = useState(true);
  const [recherche, setRecherche] = useState('');

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

  const rechercherAnnonce = (annonce) => {
    const rechercheMinuscules = recherche.toLowerCase();
    return (
      annonce.title.toLowerCase().includes(rechercheMinuscules) ||
      annonce.description.toLowerCase().includes(rechercheMinuscules)
    );
  };

  const favorisTeach = favoris.filter(fav => fav.type === 'Enseigner');
  const favorisLearn = favoris.filter(fav => fav.type === 'Apprendre');

  // Fonction pour ajouter ou retirer une annonce des favoris
  const toggleFavori = (annonce) => {
    if (favoris.some(fav => fav.token === annonce.token)) {
      dispatch(suprimeFavoris(annonce.token)); // Retire des favoris si l'annonce y est déjà
    } else {
      dispatch(ajouteFavoris(annonce)); // Ajoute aux favoris si l'annonce n'y est pas
    }
  };

  const mesFavoris = (favoris) =>
    favoris.filter(rechercherAnnonce).map((annonce) => (
      <TouchableOpacity
        key={annonce.token}
        style={styles.annonce}
        onPress={() => navigation.navigate('Annonce', { annonce })}
      >
        <View style={styles.imageContainer}>
          <Text style={styles.textImageContainer}>Catégorie :</Text>
          <Image source={logos[annonce.secteurActivite]} style={styles.logoImage} />
          <Text style={styles.textImageContainer}>{annonce.secteurActivite}</Text>
        </View>
        
        {/* Icône de favoris en haut à droite */}
        <TouchableOpacity style={styles.favorisIconContainer} onPress={() => toggleFavori(annonce)}>
          <FontAwesome
            name="heart"
            size={25}
            color={favoris.some(fav => fav.token === annonce.token) ? '#FF6347' : '#ccc'} // Rouge si favori, gris sinon
          />
        </TouchableOpacity>

        <View style={styles.mesCritere}>
          <View style={styles.apercuAnnonce}>
            <Text style={styles.apercuAnnonceTitre}>
              {annonce.title.length > 46 ? annonce.title.substring(0, 45) + "..." : annonce.title}
            </Text>
            <Text style={styles.apercuAnnonceDescription}>
              {annonce.description.length > 85 ? annonce.description.substring(0, 84) + "..." : annonce.description}
            </Text>
            <View style={styles.containerCritere}>
              <Text style={styles.apercuAnnonceExperience}>Expérience :</Text>
              <Text style={styles.critereText}> {annonce.experience}</Text>
            </View>
            <View style={styles.containerCritere}>
              <Text style={styles.apercuAnnonceTempsMax}>Fréquence :</Text>
              <Text style={styles.critereText}> {annonce.tempsMax}</Text>
            </View>
            <View style={styles.containerCritere}>
            <Text style={styles.apercuAnnonceTempsMax}>Disponibilité :</Text>
            <Text style={styles.critereText}>
              {Array.isArray(annonce.disponibilite) ? annonce.disponibilite.join(', ') : annonce.disponibilite}
            </Text>
          </View>
            <Text style={styles.apercuAnnonceDate}>Mise en ligne le : {formatDate(annonce.date)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    ));

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    const dateObject = new Date(dateString);
    return dateObject.toLocaleDateString('fr-FR', options);
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <View style={styles.offreEtDemande}>
          <TouchableOpacity
            style={[styles.categorieBtn, afficherEnseigner && styles.categorieActive]}
            onPress={() => setAfficherEnseigner(true)}
          >
            <Text style={[styles.categorieText, afficherEnseigner && styles.textActive]}>Je veux apprendre</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.categorieBtn, !afficherEnseigner && styles.categorieActive]}
            onPress={() => setAfficherEnseigner(false)}
          >
            <Text style={[styles.categorieText, !afficherEnseigner && styles.textActive]}>Je veux enseigner</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.rechercher}>
          <TextInput
            style={styles.rechercheText}
            value={recherche}
            onChangeText={text => setRecherche(text)}
            placeholder="Rechercher une annonce..."
          />
          <TouchableOpacity style={styles.filtreAnnonce}>
            <FontAwesome name="filter" size={25} style={styles.filtreIcone} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 90 }}>
          {afficherEnseigner ? (
            favorisTeach.length > 0 ? (
              mesFavoris(favorisTeach)
            ) : (
              <Text style={styles.messageAucuneOffre}>Aucun favori d'apprentissage trouvé.</Text>
            )
          ) : (
            favorisLearn.length > 0 ? (
              mesFavoris(favorisLearn)
            ) : (
              <Text style={styles.messageAucuneOffre}>Aucun favori d'enseignement trouvé.</Text>
            )
          )}
        </ScrollView>

      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeAreaView: {
    backgroundColor: '#e5f6f6',
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
  backgroundColor:'white',
  height: 45,
  width: '80%',
  fontSize: 16,
  paddingLeft: 20,
  borderRadius: 30,
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
    marginVertical: 15,
    borderRightWidth: 1,
    borderColor: '#ccc',
    paddingRight: 10,
  },
  logoImage: {
    width: 100,
    height: 100,
    marginBottom: 15,
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
  apercuAnnonceExperience: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F5C5C',
  },
  apercuAnnonceTempsMax: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F5C5C',
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



