import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, RefreshControl, SafeAreaView, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useSelector } from 'react-redux';

export default function AccueilScreen({ navigation }) {

  const utilisateur = useSelector(state => state.utilisateur.value);
  
  const [afficherEnseigner, setAfficherEnseigner] = useState(true);
  const [recherche, setRecherche] = useState('');
  const [enseignerDate, setEnseignerDate] = useState([]);
  const [apprendreDate, setApprendreDate] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = () => {
    fetch(`http://192.168.1.109:3000/annonces/enseigner/${utilisateur.token}`)
      .then(response => response.json())
      .then(data => {
        const trierDateAnnonce = data.annonces.sort((a, b) => new Date(b.date) - new Date(a.date));
        setEnseignerDate(trierDateAnnonce);
      });

    fetch(`http://192.168.1.109:3000/annonces/apprendre/${utilisateur.token}`)
      .then(response => response.json())
      .then(data => {
        const trierDateAnnonce = data.annonces.sort((a, b) => new Date(b.date) - new Date(a.date));
        setApprendreDate(trierDateAnnonce);
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

  const learn = enseignerDate.filter(annonce => afficherEnseigner && rechercherAnnonce(annonce)).map(annonce => (
    <TouchableOpacity key={annonce.token} style={styles.annonce} onPress={() => navigation.navigate('Annonce', { annonce: annonce })}>
      <View style={styles.imageAnnonce}>
        <Text style={styles.apercuImage}>Image </Text>
      </View>
        <View style={styles.mesCritere}>
      <View style={styles.apercuAnnonce}>
        <Text style={styles.apercuAnnonceTitre}>
          {annonce.title.length > 46 ? annonce.title.substring(0, 45) + "..." : annonce.title} {"\n"}
        </Text>
        <View>
        <Text style={styles.apercuAnnonceDescription}>
          {annonce.description.length > 85 ? annonce.description.substring(0,84) + "..." : annonce.description} {"\n"}
        </Text>
        </View>
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
          <Text style={styles.critereText}> {Array.isArray(annonce.disponibilite) ? annonce.disponibilite.join(', ') : annonce.disponibilite}</Text> 
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

  const teach = apprendreDate.filter(annonce => !afficherEnseigner && rechercherAnnonce(annonce)).map(annonce => (
    <TouchableOpacity key={annonce.token} style={styles.annonce} onPress={() => navigation.navigate('Annonce', { annonce: annonce })}>
      <View style={styles.imageAnnonce}>
        <Text style={styles.apercuImage}>Image </Text>
      </View>
        <View style={styles.mesCritere}>
      <View style={styles.apercuAnnonce}>
        <Text style={styles.apercuAnnonceTitre}>
          {annonce.title.length > 46 ? annonce.title.substring(0, 45) + "..." : annonce.title} {"\n"}
        </Text>
        <View>
        <Text style={styles.apercuAnnonceDescription}>
          {annonce.description.length > 85 ? annonce.description.substring(0,84) + "..." : annonce.description} {"\n"}
        </Text>
        </View>
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
          <Text style={styles.critereText}> {Array.isArray(annonce.disponibilite) ? annonce.disponibilite.join(', ') : annonce.disponibilite}</Text> 
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
    setAfficherEnseigner(true);
  };

  const afficheDemande = () => {
    setAfficherEnseigner(false);
  };

  return (

    <SafeAreaView style={styles.safeAreaView}>
      <KeyboardAvoidingView>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          
            <View style={styles.container}>
              <View style={styles.offreEtDemande}>
                <TouchableOpacity style={[styles.categorieBtn, afficherEnseigner && styles.categorieActive]} onPress={() => afficheOffre()}>
                  <Text style={[styles.categorieText, afficherEnseigner && styles.textActive]}>Je veux apprendre</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.categorieBtn, !afficherEnseigner && styles.categorieActive]} onPress={() => afficheDemande()}>
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
              <View style={styles.scroll}>
              <ScrollView
                style={styles.contentContainer}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
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
              <View style={styles.separator}></View>
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
 
 //-----------------------  BOUTON OFFRE ET DEMANDE  ---------------------------------

 offreEtDemande: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  marginTop:20,
  marginBottom: 10,
},
categorieBtn: {
  height: 50,
  borderWidth: 1,
  borderColor:'#287777',
  width: '47%',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#fff',
  borderRadius: 12,
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
  borderWidth: 1,
  borderColor:'#287777',
  height: 45,
  width: '80%',
  fontSize: 16,
  paddingLeft: 20,
  borderRadius: 12,
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
    paddingHorizontal:15
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
    fontWeight:'bold',
    paddingRight:5,
    fontSize: 18,
    color:'#1F5C5C',
  },
  apercuAnnonceDescription: {
    fontSize: 13,
  },
  apercuAnnonceExperience: {
    fontSize: 12,
    fontWeight:'bold',
    color:'#1F5C5C',

  },
  apercuAnnonceTempsMax: {
    fontSize: 12,
    fontWeight: 'bold',
    color:'#1F5C5C',

  },
  apercuAnnonceDate: {
    fontSize: 12,
    marginTop:15,

  },
  containerCritere: {
    flexDirection:'row'
  },
  critereText:{
    fontSize:12,
  },
 
  separator:{
    marginBottom:50,
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



