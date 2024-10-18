import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, RefreshControl, SafeAreaView, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useSelector } from 'react-redux';

export default function AccueilScreen({ navigation }) {

  const utilisateur = useSelector(state => state.utilisateur.value);
  
  const [afficherOffre, setAfficherOffre] = useState(true);
  const [recherche, setRecherche] = useState('');
  const [offreDate, setOffreDate] = useState([]);
  const [demandeDate, setDemandeDate] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = () => {
    fetch(`http://192.168.1.109:3000/annonces/offres/${utilisateur.token}`)
      .then(response => response.json())
      .then(data => {
        const trierDateAnnonce = data.annonces.sort((a, b) => new Date(b.date) - new Date(a.date));
        setOffreDate(trierDateAnnonce);
      });

    fetch(`http://192.168.1.109:3000/annonces/demandes/${utilisateur.token}`)
      .then(response => response.json())
      .then(data => {
        const trierDateAnnonce = data.annonces.sort((a, b) => new Date(b.date) - new Date(a.date));
        setDemandeDate(trierDateAnnonce);
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
      annonce.description.toLowerCase().includes(rechercheMinuscules) ||
      annonce.tempsMax.toString().includes(rechercheMinuscules) ||
      annonce.secteurActivite.toString().includes(rechercheMinuscules)
    );
  };

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    const dateObject = new Date(dateString);
    return dateObject.toLocaleDateString('fr-FR', options);
  };

  const lesOffres = offreDate.filter(annonce => afficherOffre && rechercherAnnonce(annonce)).map(annonce => (
    <TouchableOpacity key={annonce.token} style={styles.annonce} onPress={() => navigation.navigate('Annonce', { annonce: annonce })}>
      <View style={styles.imageAnnonce}>
        <Text style={styles.apercuImage}>Image </Text>
      </View>
        <View style={styles.mesCritere}>
      <View style={styles.apercuAnnonce}>
        <Text style={styles.apercuAnnonceTitre}>
          {annonce.title.length > 49 ? annonce.title.substring(0, 48) + "..." : annonce.title} {"\n"}
        </Text>
        <View>
        <Text style={styles.apercuAnnonceDescription}>
          {annonce.description.length > 61 ? annonce.description.substring(0,60) + "..." : annonce.description} {"\n"}
        </Text>
        </View>
        <View style={styles.containerCritere}>
        <Text style={styles.apercuAnnonceExperience}>
          Expérience : {annonce.experience} ans
        </Text>
        </View>
        <View style={styles.containerCritere}>
        <Text style={styles.apercuAnnonceTempsMax}>
          Fréquence : {annonce.tempsMax} heures / semaine
        </Text>
        </View>
        <View style={styles.containerCritere}>
        <Text style={styles.apercuAnnonceTempsMax}>
          Disponibilité : {annonce.disponibilite}
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
  ));

  const lesDemandes = demandeDate.filter(annonce => !afficherOffre && rechercherAnnonce(annonce)).map(annonce => (
    <TouchableOpacity key={annonce.token} style={styles.annonce} onPress={() => navigation.navigate('Annonce', { annonce: annonce })}>
      <View style={styles.imageAnnonce}>
        <Text style={styles.apercuImage}>Image </Text>
      </View>
        <View style={styles.mesCritere}>
      <View style={styles.apercuAnnonce}>
        <Text style={styles.apercuAnnonceTitre}>
          {annonce.title.length > 49 ? annonce.title.substring(0, 48) + "..." : annonce.title} {"\n"}
        </Text>
        <View>
        <Text style={styles.apercuAnnonceDescription}>
          {annonce.description.length > 61 ? annonce.description.substring(0,60) + "..." : annonce.description} {"\n"}
        </Text>
        </View>
        <View style={styles.containerCritere}>
        <Text style={styles.apercuAnnonceExperience}>
          Expérience min. recherché : {annonce.experience} ans
        </Text>
        </View>
        <View style={styles.containerCritere}>
        <Text style={styles.apercuAnnonceTempsMax}>
          Fréquence : {annonce.tempsMax} heures / semaine
        </Text>
        </View>
        <View style={styles.containerCritere}>
        <Text style={styles.apercuAnnonceTempsMax}>
        Disponibilité : {annonce.disponibilite}
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
  ));

  const afficheOffre = () => {
    setAfficherOffre(true);
  };

  const afficheDemande = () => {
    setAfficherOffre(false);
  };

  return (

    <SafeAreaView style={styles.safeAreaView}>
      <KeyboardAvoidingView>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          
            <View style={styles.container}>
              <View style={styles.offreEtDemande}>
                <TouchableOpacity style={[styles.categorieBtn, afficherOffre && styles.categorieActive]} onPress={() => afficheOffre()}>
                  <Text style={[styles.categorieText, afficherOffre && styles.textActive]}>Apprendre</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.categorieBtn, !afficherOffre && styles.categorieActive]} onPress={() => afficheDemande()}>
                  <Text style={[styles.categorieText, !afficherOffre && styles.textActive]}>Enseigner</Text>
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
              <View style={styles.scroll}>
              <ScrollView
                style={styles.contentContainer}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
              >
                {afficherOffre ? lesOffres : lesDemandes}
                {afficherOffre && lesOffres.length === 0 && (
                  <Text style={styles.messageAucuneOffre}>
                   Désolé, actuellement personne n'est disponible pour enseigner les catégories que vous demandez.
                  </Text>
                )}
                {!afficherOffre && lesDemandes.length === 0 && (
                  <Text style={styles.messageAucuneOffre}>
                   Désolé, actuellement personne n'est disponible pour apprendre les catégories que vous proposez.
                  </Text>
                )}
              </ScrollView>
            </View>
            </View>
        </ TouchableWithoutFeedback>
      </ KeyboardAvoidingView>
    </ SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    backgroundColor:'#fff',
    height: '100%'
  },

  //-----------------------  BOUTTON OFFRE ET DEMANDE  ---------------------------------

  offreEtDemande: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  categorieBtn: {
    height: 50,
    borderWidth: 1,
    borderColor:'#8F8F8F',
    width: '47%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 20,
  },
  categorieText: {
    fontSize: 23,
  },
  categorieActive: {
    backgroundColor: '#182A49'
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
    marginVertical:'6%',
  },
  rechercheText: {
    borderWidth: 1,
    borderColor:'#8F8F8F',
    height:'200%',
    width: '85%',
    fontSize: 15,
    paddingLeft: 30,
    borderRadius: 12,
    marginHorizontal:5,
  },
  
  //-----------------------  ICONE FILTRE  ---------------------------------

  filtreIcone: {
    marginLeft:8
  },

  //-----------------------   SCROLLVIEW  ---------------------------------

  scroll:{
    height: '80%'
  },
  //-----------------------  VIGNETTE D'ANNONCE  ---------------------------------
  
  annonce: {
    height: 190,
    width: '96%',
    flexDirection: 'row',
    borderRadius: 12,
    margin: 10,
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
    width: '85%',
  },
  apercuAnnonceTitre: {
    fontSize: 18,
  },
  apercuAnnonceDescription: {
    fontSize: 13,
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
 
  //-----------------------  AUTRE  ---------------------------------
  
  messageAucuneOffre: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    marginHorizontal:15,
    color: 'gray',
  },
});

