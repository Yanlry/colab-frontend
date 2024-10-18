import React, { useState } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { suprimeFavoris } from '../reducers/utilisateur';

export default function FavorisScreen({ navigation }) {

  const dispatch = useDispatch();
  const favoris = useSelector(state => state.utilisateur.favoris);

  const [afficherOffre, setAfficherOffre] = useState(true);
  const favorisOffre = favoris.filter(fav => fav.type === 'Offre');
  const favorisDemande = favoris.filter(fav => fav.type === 'Demande');

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
                <TouchableOpacity style={[styles.categorieBtn, afficherOffre && styles.categorieActive]} onPress={() => setAfficherOffre(true)}>
                  <Text style={[styles.categorieText, afficherOffre && styles.textActive]}>Apprendre</Text>
                </TouchableOpacity>

                {/*  BOUTON DEMANDE  */}
                <TouchableOpacity style={[styles.categorieBtn, !afficherOffre && styles.categorieActive]} onPress={() => setAfficherOffre(false)}>
                  <Text style={[styles.categorieText, !afficherOffre && styles.textActive]}>Enseigner</Text>
                </TouchableOpacity>
              </View>

              {/* AFFICHER LES ANNONCE FAVORIS DE TYPE: */}
              {afficherOffre ? (
                /* OFFRE */
                <View style={styles.scrollView}>
                  <ScrollView>
                    {favorisOffre.length === 0 ? (
                      <Text style={styles.aucunFavoris}>Aucune offre en favoris</Text>
                      ) : (
                        mesFavoris(favorisOffre)
                        )}
                  </ScrollView>
                </View>
              ) : (
                /* DEMANDE */
                <View style={styles.scrollView}>
                  <ScrollView>
                    {favorisDemande.length === 0 ? (
                      <Text style={styles.aucunFavoris}>Aucune demande en favoris</Text>
                    ) : (
                      mesFavoris(favorisDemande)
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
    justifyContent: 'space-around'
  },
  categorieBtn: {
    height: 50,
    borderWidth: 1,
    borderColor: 'gray',
    width: '47%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    margin:1,
    marginTop: 20,
    marginBottom:10
  },
  categorieText: {
    fontSize: 23,
  },
  categorieActive: {
    backgroundColor: '#182A49'
  },
  textActive: {
    fontWeight: 'bold',
    color: '#fff'
  },

  //-----------------------  TITRE DE LA PAGE  ---------------------------------

  aucunFavoris: {
    textAlign: 'center',
    marginTop: 250,
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
    width: '94%',
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
 

//----------------------- BOUTON FAVORIS  ---------------------------------

  favorisBtn: {
    height: 50,
    width: 50,
  },
  favorisIcone: {
    color: "#C70039",

  },
});
