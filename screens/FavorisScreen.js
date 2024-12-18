import React, { useState } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView, TextInput, Image,Modal } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { suprimeFavoris, ajouteFavoris } from '../reducers/utilisateur'; // Importez l'action pour ajouter et retirer des favoris

export default function FavorisScreen({ navigation }) {
  const dispatch = useDispatch();
  const favoris = useSelector(state => state.utilisateur.favoris);

  const [afficherEnseigner, setAfficherEnseigner] = useState(true);
  const [recherche, setRecherche] = useState('');
  const [filtreDisponibilite, setFiltreDisponibilite] = useState(null);
  const [filtreExperience, setFiltreExperience] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

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
    const correspondRecherche = 
      annonce.title.toLowerCase().includes(rechercheMinuscules) ||
      annonce.description.toLowerCase().includes(rechercheMinuscules) ||
      (annonce.programme && annonce.programme.toLowerCase().includes(rechercheMinuscules));

    const correspondDisponibilite = !filtreDisponibilite || (annonce.disponibilite && annonce.disponibilite.includes(filtreDisponibilite));
    const correspondExperience = !filtreExperience || annonce.experience === filtreExperience;

    return correspondRecherche && correspondDisponibilite && correspondExperience;
  };

  const toggleFavori = (annonce) => {
    if (favoris.some(fav => fav.token === annonce.token)) {
      dispatch(suprimeFavoris(annonce.token));
    } else {
      dispatch(ajouteFavoris(annonce)); 
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
        
        <TouchableOpacity style={styles.favorisIconContainer} onPress={() => toggleFavori(annonce)}>
          <FontAwesome
            name="heart"
            size={25}
            color={favoris.some(fav => fav.token === annonce.token) ? '#FF6347' : '#ccc'} 
          />
        </TouchableOpacity>

        <View style={styles.mesCritere}>
          <View style={styles.apercuAnnonce}>
            <Text style={styles.apercuAnnonceTitre}>
              {annonce.title.length > 46 ? annonce.title.substring(0, 45) + "..." : annonce.title}
            </Text>
            <Text style={styles.apercuAnnonceDescription}>
              {annonce.description.length > 105 ? annonce.description.substring(0, 104) + "..." : annonce.description}
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

  const favorisTeach = favoris.filter(fav => fav.type === 'Enseigner');
  const favorisLearn = favoris.filter(fav => fav.type === 'Apprendre');
  
  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    const dateObject = new Date(dateString);
    return dateObject.toLocaleDateString('fr-FR', options);
  };

  const RenderFiltreModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          
          <Text style={styles.modalTitle}>Disponibilité</Text>
          <TouchableOpacity onPress={() => { setFiltreDisponibilite("Soir"); setModalVisible(false); }}>
            <Text style={[styles.modalOption, filtreDisponibilite === "Soir" && styles.selectedOption]}>Soir</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setFiltreDisponibilite("Semaine"); setModalVisible(false); }}>
            <Text style={[styles.modalOption, filtreDisponibilite === "Semaine" && styles.selectedOption]}>Semaine</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setFiltreDisponibilite("Week-end"); setModalVisible(false); }}>
            <Text style={[styles.modalOption, filtreDisponibilite === "Week-end" && styles.selectedOption]}>Week-end</Text>
          </TouchableOpacity>
          
          <View style={styles.divider} />
  
          <Text style={styles.modalTitle}>Expérience</Text>
          <TouchableOpacity onPress={() => { setFiltreExperience("Débutant"); setModalVisible(false); }}>
            <Text style={[styles.modalOption, filtreExperience === "Débutant" && styles.selectedOption]}>Débutant</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setFiltreExperience("Intermédiaire"); setModalVisible(false); }}>
            <Text style={[styles.modalOption, filtreExperience === "Intermédiaire" && styles.selectedOption]}>Intermédiaire</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setFiltreExperience("Confirmé"); setModalVisible(false); }}>
            <Text style={[styles.modalOption, filtreExperience === "Confirmé" && styles.selectedOption]}>Confirmé</Text>
          </TouchableOpacity>
  
          <TouchableOpacity onPress={() => { setFiltreDisponibilite(null); setFiltreExperience(null); setModalVisible(false); }}>
            <Text style={styles.clearFilters}>Réinitialiser les filtres</Text>
          </TouchableOpacity>
  
          <TouchableOpacity style={styles.closeModalButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.closeModalButtonText}>Appliquer les filtres</Text>
          </TouchableOpacity>
          
        </View>
      </View>
    </Modal>
  );

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
         <TouchableOpacity style={styles.filtreAnnonce} onPress={() => setModalVisible(true)}>
                <FontAwesome name="filter" size={25} style={styles.filtreIcone} />
              </TouchableOpacity>
            </View>
          <RenderFiltreModal />

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
filtreAnnonce: {
  padding: 10,
},
filtreIcone: {
  color: '#194D4D',
},
modalContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
},
modalContent: {
  width: '90%',
  backgroundColor: '#fff',
  borderRadius: 20,
  padding: 20,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 5 },
  shadowOpacity: 0.3,
  shadowRadius: 10,
  elevation: 10,
},
modalTitle: {
  fontSize: 20,
  fontWeight: '600',
  color: '#333',
  marginBottom: 15,
  textAlign: 'center',
},
modalOption: {
  fontSize: 16,
  color: '#555',
  paddingVertical: 12,
  paddingHorizontal: 20,
  backgroundColor: '#f5f5f5',
  borderRadius: 10,
  textAlign: 'center',
  marginVertical: 5,
  borderWidth: 1,
  borderColor: '#ddd',
},
selectedOption: {
  backgroundColor: '#3CB371',
  color: '#fff',
  borderColor: '#3CB371',
},
clearFilters: {
  fontSize: 16,
  color: '#FF6347',
  textAlign: 'center',
  marginTop: 15,
},
closeModalButton: {
  marginTop: 20,
  backgroundColor: '#287777',
  borderRadius: 15,
  paddingVertical: 12,
  alignItems: 'center',
},
closeModalButtonText: {
  color: '#fff',
  fontSize: 18,
  fontWeight: '600',
},
divider: {
  height: 1,
  backgroundColor: '#ddd',
  marginVertical: 15,
},
scroll:{
  height: '80%',
  paddingBottom: 20,
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
  critereTextTitre: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F5C5C',
  },
  mesCritere: {
    paddingLeft: 15,
    flex: 1, 
    justifyContent: 'space-between', 
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
    flex: 1, 
  },
  apercuAnnonceTitre: {
    paddingVertical:10,
    fontWeight: 'bold',
    paddingRight: 10,
    paddingTop: 10,
    fontSize: 18,
    color: '#1F5C5C',
  },
  apercuAnnonceProgramme: {
    fontSize: 13,
    fontWeight:'bold',
    color:'#14A3A1',
    marginVertical:10
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
    fontSize: 10,
    marginTop: 15,
    color:'#555',
    alignSelf: 'flex-start', 
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
  messageAucuneOffre: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    marginHorizontal:15,
    color: 'gray',
  },
});



