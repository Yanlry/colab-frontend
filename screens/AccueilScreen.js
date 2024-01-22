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
    fetch(`http://10.215.12.147:3000/annonces/offres/${utilisateur.token}`)
      .then(response => response.json())
      .then(data => {
        const trierDateAnnonce = data.annonces.sort((a, b) => new Date(b.date) - new Date(a.date));
        setOffreDate(trierDateAnnonce);
      });

    fetch(`http://10.215.12.147:3000/annonces/demandes/${utilisateur.token}`)
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
      <Text style={styles.apercuAnnonce}>
        <Text style={styles.apercuAnnonceTitre}>
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
        <Text style={styles.apercuAnnonceTempsMax}>
          Mes disponibilités : {annonce.disponibilite}
        </Text>
        {"\n"}
        {"\n"}
        <Text style={styles.apercuAnnonceDate}>
          Mise en ligne le : {formatDate(annonce.date)}
        </Text>
      </Text>
    </TouchableOpacity>
  ));

  const lesDemandes = demandeDate.filter(annonce => !afficherOffre && rechercherAnnonce(annonce)).map(annonce => (
    <TouchableOpacity key={annonce.token} style={styles.annonce} onPress={() => navigation.navigate('Annonce', { annonce: annonce })}>
      <View style={styles.imageAnnonce}>
        <Text style={styles.apercuImage}>Image</Text>
      </View>
      <Text style={styles.apercuAnnonce}>
        <Text style={styles.apercuAnnonceTitre}>
          {annonce.title.length > 30 ? annonce.title.substring(0, 28) + "..." : annonce.title} {"\n"}
        </Text>
        {"\n"}
        <Text style={styles.apercuAnnonceDescription}>
          {annonce.description.length > 100 ? annonce.description.substring(0, 100) + "..." : annonce.description} {"\n"}
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
                  <Text style={[styles.categorieText, afficherOffre && styles.textActive]}>Offre</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.categorieBtn, !afficherOffre && styles.categorieActive]} onPress={() => afficheDemande()}>
                  <Text style={[styles.categorieText, !afficherOffre && styles.textActive]}>Demande</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.rechercher}>
                <TextInput
                  style={styles.rechercheText}
                  value={recherche}
                  onChangeText={text => setRecherche(text)}
                  placeholder="Rechercher..."
                />
                <TouchableOpacity style={styles.filtreAnnonce}>
                  <FontAwesome name="bars" size={40} style={styles.filtreIcone} />
                </TouchableOpacity>
              </View>
              <ScrollView contentContainerStyle={styles.contentContainer} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}>
                {afficherOffre ? lesOffres : lesDemandes}
              </ScrollView>
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
  container: {
    alignItems: 'center',
  },

  //-----------------------  BOUTTON OFFRE ET DEMANDE  ---------------------------------

  offreEtDemande: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  categorieBtn: {
    height: 50,
    borderWidth: 1,
    borderColor: 'gray',
    width: 180,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 20,
    margin:1,
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
  },
  rechercheText: {
    borderWidth: 1,
    borderColor: 'gray',
    height: 50,
    width: 310,
    fontSize: 20,
    paddingLeft: 30,
    margin: 12,
    borderRadius: 12,
    marginHorizontal:5,
  },

  //-----------------------  VIGNETTE D'ANNONCE  ---------------------------------
  
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
    marginRight: 20,
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
  apercuAnnonceExperience: {
    fontSize: 12,
    height: 34,
  },
  apercuAnnonceTempsMax: {
    fontSize: 12,
    fontWeight: 'bold',
    height: 34,
  },
  apercuAnnonceDate: {
    fontSize: 12,
    height: 34,
  },
 
  //-----------------------  AUTRE  ---------------------------------
  
  contentContainer: {
    paddingBottom: 20,
  },
});