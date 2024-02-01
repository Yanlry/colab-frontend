import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, ScrollView, View,SafeAreaView, Image, Alert } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MapView, { Marker } from 'react-native-maps';
import { useDispatch, useSelector } from 'react-redux';
import { ajouteFavoris, suprimeFavoris } from '../reducers/utilisateur'

export default function AnnonceScreen({ route, navigation }) {


  const { annonce } = route.params;

  const dispatch = useDispatch();

  const favoris = useSelector(state => state.utilisateur.favoris);
  const utilisateur = useSelector(state => state.utilisateur.value);

  const [enFavori, setEnFavori] = useState(false);

  useEffect(() => {
    const estDejaFavori = favoris.some(fav => fav.token === annonce.token);
    setEnFavori(estDejaFavori);
  }, [favoris, annonce.token]);

  const coordonnee = {
    latitude: 48.8566,
    longitude: 2.3522,
  };

  const gererFavoris = (annonce) => {

    const estDejaFavori = favoris.some(fav => fav.token === annonce.token);

    if (estDejaFavori) {
      dispatch(suprimeFavoris(annonce.token));
    } else {
      dispatch(ajouteFavoris(annonce));
    }
  };

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    const dateObject = new Date(dateString);
    return dateObject.toLocaleDateString('fr-FR', options);
  };

  const handleColab = () => {
    Alert.alert(
      'Confirmation',
      'Êtes-vous sûr de vouloir envoyer une demande de colab ?',
      [
        { text: 'Non', style: 'cancel' },
        { text: 'Oui', onPress: () => envoyerDemandeColab() },
      ],
      { cancelable: false }
    );
  };
  
  const envoyerDemandeColab = () => {
    fetch('http://192.168.1.33:3000/propositionCollabs/propositions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: annonce.token, cible: annonce.username, initiateur: utilisateur.username }),
    })
      .then(response => response.json())
      .then(() => {
        Alert.alert(
          'Felicitation !',
          'Votre demande de colab a été envoyée avec succès !',
          [{ text: 'OK', onPress: () => console.log('Demande de colab envoyée') }]
        );
      })
      .catch(error => {
        console.error('Erreur lors de l\'envoi de la demande de colab', error);
      });
  };
  
  return (
    <SafeAreaView style={styles.safeAreaView}>
          <View style={styles.container}>

            <View style={styles.navBar}>
              {/* BOUTON RETOUR ARRIERE */}
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <FontAwesome name='chevron-left' size={28} style={styles.goBack} color={'#182A49'} />
              </TouchableOpacity>

              <Image resizeMode="contain" source={require('../assets/logo.png')} style={styles.logo} />

              {/* BOUTON PROFIL */}
              <TouchableOpacity onPress={() => navigation.navigate('Utilisateur')}>
                <FontAwesome name='user' size={30} color="#182A49" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.annonceComplete}>
              <View style={styles.annonceEnTete}>
                {/* TITRE */}
                <Text style={styles.annonceTitre}>
                  {annonce.title}
                </Text>

                {/* ICONE FAVORIS */}
                <View style={styles.annonceFavoris}>
                <TouchableOpacity onPress={() => { gererFavoris(annonce); setEnFavori(!enFavori); }} >
                  <FontAwesome name={enFavori ? "heart" : 'heart-o'} size={30} color={enFavori ? '#C70039' : '#182A49'}  />
                </TouchableOpacity>

                </View>

              </View>

              {/* TYPE ET DATE DE PUBLICATION */}
              <View style={styles.annonceTypeEtDate}>
                <Text>Type : {annonce.type}</Text>
                <Text>Publier le : {formatDate(annonce.date)}</Text>
              </View>

              {/* DESCRIPTION */}
              <View style={styles.annonceDescription}>
                <Text style={styles.annonceDescriptionText}>Description :{"\n"}</Text>
                <Text>{annonce.description}</Text>
              </View>

              {/* CRITÉRE */}
              <View style={styles.annonceCritere}>

                {/* CRITERE COLONNE 1 */}
                <View style={styles.critereColonne1}>

                  {/* SECTEUR D'ACTIVITE */}
                  <View style={styles.titreEtLogo}>
                    <FontAwesome name='list' size={15} color="#182A49" />
                    <Text style={styles.titre}>Secteur d'activité</Text>
                  </View>
                  <Text style={styles.critereReponse}> {annonce.secteurActivite} </Text>

                  {/*  DISPONIBILITÉ */}
                  <View style={styles.titreEtLogo}>
                    <FontAwesome name='hourglass' size={15} color="#182A49" />
                    <Text style={styles.titre}>Moment des séances</Text>
                  </View>
                  <Text style={styles.critereReponse}>{annonce.disponibilite}</Text>
                </View>

                {/* CRITÉRE COLONNE 2 */}
                <View style={styles.critereColonne2}>

                  {/* EXPÉRIENCE */}
                  <View style={styles.titreEtLogo}>
                    <FontAwesome name='briefcase' size={15} color="#182A49" />
                    <Text style={styles.titre} >Mon expérience</Text>
                  </View>
                  <Text style={styles.critereReponse}>{annonce.experience} ans</Text>

                  {/* TEMPS MAX */}
                  <View style={styles.titreEtLogo}>
                    <FontAwesome name='users' size={15} color="#182A49" />
                    <Text style={styles.titre}>Disponibilité</Text>
                  </View>
                  <Text style={styles.critereReponse}>{annonce.tempsMax} heure / semaine </Text>
                </View>
              </View>

              {/* MAP LOCALISATION */}
              <View style={styles.mapContainer}>
                <MapView style={styles.map} region={{ ...coordonnee, latitudeDelta: 0.0922, longitudeDelta: 0.0421 }}>
                  <Marker coordinate={coordonnee} />
                </MapView>
              </View>

              {/* INFORMATIONS UTILISATEUR DE L'ANNONCE */}
              <TouchableOpacity style={styles.utilisateur} onPress={() => navigation.navigate('Profil')}>
                {/* ICONE PROFIL */}
                <View style={styles.utilisateurGauche}>
                  <TouchableOpacity onPress={() => navigation.navigate('Profil')}>
                    <FontAwesome name="user" size={50} color="#182A49" />
                  </TouchableOpacity>
                </View>

                {/* NOM D'UTILISATEUR */}
                <Text style={styles.textUtilisateur}>Nom d'utilisateur : {annonce.username} </Text>
                <FontAwesome name='chevron-right' size={30} color={'#182A49'} />
              </TouchableOpacity>

              {/*  SIGNALEZ ANNONCE  */}
              <TouchableOpacity style={styles.signalez}>
                <Text style={styles.textSignalez}>S i g n a l e z    l ' a n n o n c e</Text>
              </TouchableOpacity>

            </ScrollView>


            {/* BARRE DE COLAB */}
            <View style={styles.colabBar}>
              <TouchableOpacity onPress={() => handleColab()} style={styles.colabBtn}>
                <Text style={styles.colabText}>COLAB</Text>
              </TouchableOpacity>
            </View>

          </View>
  </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor:'#fff'
  },
  container: {
    flex:1
  },

  // ------------------- NAVBAR ---------------------
  
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems:'center',
    paddingHorizontal: 30,
    marginTop:15
  },
  logo: {
    height: 38,
    width: 130,
    marginRight: 5
  },
  // ------------------- ANNONCE ENTIERE : SCROLLVIEW ---------------------

  annonceComplete: {
    flex: 1,
    marginTop:15,
    backgroundColor: '#fff6',
  },
  annonceEnTete: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  annonceDate: {
    paddingLeft: 20,
    paddingTop: 5
  },
  annonceTitre: {
    fontSize: 29,
    width: 335,
  },
  annonceFavoris: {
    position:'absolute',
    marginLeft:320
  },
  annonceTypeEtDate: {
    flexDirection:'row',
    justifyContent:'space-between',
    paddingHorizontal: 20,
    paddingTop: 15
  },

  // ------------------- DESCRIPTION ---------------------

  annonceDescription: {
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderColor:'#8F8F8F',
    borderRadius: 12,
    marginVertical: 5,
    marginHorizontal: 10
  },
  annonceDescriptionText: {
    fontWeight: 'bold'
  },

  // ------------------- CRITÉRE ---------------------

  annonceCritere: {
    borderWidth: 1,
    borderColor:'#8F8F8F',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    borderRadius: 12,
    marginVertical: 5,
    marginHorizontal: 10
  },
  critereColonne1: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  critereColonne2: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  titreEtLogo: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  titre: {
    fontWeight: 'bold',
    padding: 10
  },
  critere1: {
    fontWeight: 'bold',
  },
  critere2: {
    fontWeight: 'bold'
  },
  critere3: {
    fontWeight: 'bold'
  },
  critere4: {
    fontWeight: 'bold'
  },
  critereReponse: {
    padding: 7
  },

  // ------------------- MAP ---------------------

  mapContainer: {
    height: 200,
  },
  map: {
    borderRadius: 50,
    ...StyleSheet.absoluteFillObject,
  },

  // ------------------- UTILISATEUR BOUTON ---------------------

  utilisateur: {
    borderWidth: 1,
    borderColor:'#8F8F8F',
    borderRadius: 12,
    height: 90,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    marginVertical: 5,
    marginHorizontal: 10
  },
  textUtilisateur: {
    fontSize: 23
  },
  utilisateurGauche: {
    justifyContent: 'center'
  },

  // ------------------- SIGNALEZ ANNONCE BOUTON ---------------------

  signalez: {
    borderWidth: 1,
    borderColor:'#FF1F1F',
    borderRadius: 12,
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
    marginHorizontal: 10,
    backgroundColor: '#fff',
    fontWeight:'bold'
  },
  textSignalez: {
    color:'#FF1F1F'
  },

  // ------------------- COLAB BAR ---------------------

  colabBar: {
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 85,
    borderColor: 'grey',
    flexDirection: 'row',
  },
  colabBtn: {
    width: 200,
    height: 50,
    borderWidth: 1,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#182A49'
  },
  colabText: {
    fontSize: 30,
    color: 'white'
  },
  nbColabIcone: {
    marginLeft: 50,
    marginTop: 10
  },
});

