import React, { useState } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback } from 'react-native';
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
    <TouchableOpacity key={annonce.token} style={styles.annonce} onPress={() => navigation.navigate('Annonce', { annonce: annonce })} >

      <View style={styles.image}>
        <Text style={styles.apercuImage}>Image </Text>
      </View>

      <Text style={styles.apercuAnnonce}>
        <Text style={styles.apercuAnnonceTitre} >
          {annonce.title.length > 30 ? annonce.title.substring(0, 26) + "..." : annonce.title} {"\n"}
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

      <TouchableOpacity style={styles.favorisBtn} onPress={() => retirerDesFavoris(annonce.token)}>
        <FontAwesome name="heart" size={30} style={styles.favorisIcone} />
      </TouchableOpacity>
    </TouchableOpacity>
  ));


  return (

    <SafeAreaView style={styles.safeAreaView}>
      <KeyboardAvoidingView>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      
            <View style={styles.container}>

              {/* BOUTON POUR FILTRER PAR TYPE */}
              <View style={styles.offreEtDemande}>
                {/*  BOUTON OFFRE  */}
                <TouchableOpacity style={[styles.categorieBtn, afficherOffre && styles.categorieActive]} onPress={() => setAfficherOffre(true)}>
                  <Text style={[styles.categorieText, afficherOffre && styles.textActive]}>Offre</Text>
                </TouchableOpacity>

                {/*  BOUTON DEMANDE  */}
                <TouchableOpacity style={[styles.categorieBtn, !afficherOffre && styles.categorieActive]} onPress={() => setAfficherOffre(false)}>
                  <Text style={[styles.categorieText, !afficherOffre && styles.textActive]}>Demande</Text>
                </TouchableOpacity>
              </View>

              {/* AFFICHER LES ANNONCE FAVORIS DE TYPE: */}
              {afficherOffre ? (
                /* OFFRE */
                <ScrollView>
                  <Text style={styles.mesFavoris}>Mes offres favorites</Text>
                  {favorisOffre.length === 0 ? (
                    <Text style={styles.aucunFavoris}>Aucune offre en favoris</Text>
                  ) : (
                    mesFavoris(favorisOffre)
                  )}
                </ScrollView>
              ) : (
                /* DEMANDE */
                <ScrollView>
                  <Text style={styles.mesFavoris}>Mes demandes favorites</Text>
                  {favorisDemande.length === 0 ? (
                    <Text style={styles.aucunFavoris}>Aucune demande en favoris</Text>
                  ) : (
                    mesFavoris(favorisDemande)
                  )}
                </ScrollView>
              )}

            </View>

          </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
  </SafeAreaView>
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
    justifyContent: 'space-around'
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
    margin:1,
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
    color: '#fff'
  },


  //-----------------------  TITRE DE LA PAGE  ---------------------------------

  mesFavoris: {
    textAlign: 'center',
    fontSize: 25,
    fontWeight: 'bold',
    padding: 20
  },
  aucunFavoris: {
    textAlign: 'center',
    marginTop: 250,
    fontSize: 30
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
    marginRight: 20
  },
  apercuAnnonce: {
    width: 270,
    height: 180,
    marginTop: 15,
    marginRight: -30
  },
  apercuAnnonceTitre: {
    fontSize: 18,
    height: 34,
  },
  apercuAnnonceDescription: {
    fontSize: 13,
    height: 34,
  },
  apercuAnnonceTempsMax: {
    fontSize: 12,
    fontWeight: 'bold',
    height: 34,
  },
  apercuAnnonceExperience: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  apercuAnnonceDate: {
    fontSize: 12,
    width: 350,
  },
  favorisBtn: {
    height: 50,
    width: 50,
  },
  favorisIcone: {
    color: "#C70039",

  },
});
