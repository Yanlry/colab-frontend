import React, { useState } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { suprimeFavoris } from '../reducers/utilisateur';

export default function FavorisScreen({ navigation }) {

  const dispatch = useDispatch();
  const favoris = useSelector(state => state.utilisateur.favoris);

  const [afficherEnseigner, setAfficherEnseigner] = useState(true);
  const favorisTeach = favoris.filter(fav => fav.type === 'Enseigner');
  const favorisLearn = favoris.filter(fav => fav.type === 'Apprendre');

  const retirerDesFavoris = (token) => {
    dispatch(suprimeFavoris(token));
  };

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    const dateObject = new Date(dateString);
    return dateObject.toLocaleDateString('fr-FR', options);
  };

  const mesFavoris = (favoris) => favoris.map(annonce => (
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
          {annonce.description.length > 68 ? annonce.description.substring(0, 67) + "..." : annonce.description} {"\n"}
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


  return (

    <SafeAreaView style={styles.safeAreaView}>
            <View style={styles.container}>

              {/* BOUTON POUR FILTRER PAR TYPE */}
              <View style={styles.offreEtDemande}>
                {/*  BOUTON OFFRE  */}
                <TouchableOpacity style={[styles.categorieBtn, afficherEnseigner && styles.categorieActive]} onPress={() => setAfficherEnseigner(true)}>
                  <Text style={[styles.categorieText, afficherEnseigner && styles.textActive]}>Je veux apprendre</Text>
                </TouchableOpacity>

                {/*  BOUTON DEMANDE  */}
                <TouchableOpacity style={[styles.categorieBtn, !afficherEnseigner && styles.categorieActive]} onPress={() => setAfficherEnseigner(false)}>
                  <Text style={[styles.categorieText, !afficherEnseigner && styles.textActive]}>Je veux enseigner</Text>
                </TouchableOpacity>
              </View>

              {/* AFFICHER LES ANNONCE FAVORIS DE TYPE: */}
              {afficherEnseigner ? (
                /* OFFRE */
                <View style={styles.scrollView}>
                  <ScrollView>
                    {favorisTeach.length === 0 ? (
                      <Text style={styles.aucunFavoris}>Aucune annonce liée à l'apprentissage n'a été ajoutée</Text>
                      ) : (
                        mesFavoris(favorisTeach)
                        )}
                  </ScrollView>
                </View>
              ) : (
                /* DEMANDE */
                <View style={styles.scrollView}>
                  <ScrollView>
                    {favorisLearn.length === 0 ? (
                      <Text style={styles.aucunFavoris}>Aucune annonce liée à l'enseignement n'a été ajoutée</Text>
                    ) : (
                      mesFavoris(favorisLearn)
                    )}
                  </ScrollView>
                </View>

              )}
            </View>
  </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    height: '100%',
    backgroundColor:'#fff'
  },

  //-----------------------  BOUTTON OFFRE ET DEMANDE  ---------------------------------

  offreEtDemande: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop:20,
    marginBottom: 20,
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
  

  //-----------------------  TITRE DE LA PAGE  ---------------------------------

  aucunFavoris: {
    textAlign: 'center',
    marginTop: 200,
    paddingHorizontal:50,
    fontSize: 20,
    color:'gray'
  },

  //-----------------------  ICONE FILTRE  ---------------------------------

  scrollView:{
    height:'88%'
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
  containerCritere: {
    flexDirection:'row'
  },
  critereText:{
    fontSize:12,
  },
 
 

//----------------------- BOUTON FAVORIS  ---------------------------------

  favorisBtn: {
    height: 50,
    width: 50,
  },
  favorisIcone: {
    color: "#C70039",

  },
});
