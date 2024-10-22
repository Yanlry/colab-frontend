import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, ScrollView, View, SafeAreaView, Image, Alert } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MapView, { Marker } from 'react-native-maps';
import { useDispatch, useSelector } from 'react-redux';
import { ajouteFavoris, suprimeFavoris } from '../reducers/utilisateur';

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
    latitude: annonce.latitude,
    longitude: annonce.longitude,
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
    fetch('http://192.168.1.109:3000/propositionCollabs/propositions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: annonce.token, cible: annonce.username, initiateur: utilisateur.username }),
    })
      .then(response => response.json())
      .then(() => {
        Alert.alert('Félicitations !', 'Votre demande de colab a été envoyée avec succès !', [{ text: 'OK', onPress: () => console.log('Demande de colab envoyée') }]);
      })
      .catch(error => {
        console.error('Erreur lors de l\'envoi de la demande de colab', error);
      });
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        {/* Navbar */}
        <View style={styles.navBar}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesome name='chevron-left' size={28} style={styles.goBack} color={'#287777'} />
          </TouchableOpacity>
          <Image resizeMode="contain" source={require('../assets/logo.png')} style={styles.logo} />
          <TouchableOpacity onPress={() => navigation.navigate('Utilisateur')}>
            <FontAwesome name='user' size={30} color="#287777" />
          </TouchableOpacity>
        </View>

        {/* Scrollable Content */}
        <ScrollView style={styles.annonceComplete}>
          {/* Title and Favorites */}
          <View style={styles.annonceEnTete}>
            <Text style={styles.annonceTitre}>{annonce.title}</Text>
            <View style={styles.annonceFavoris}>
              <TouchableOpacity onPress={() => { gererFavoris(annonce); setEnFavori(!enFavori); }} >
                <FontAwesome name={enFavori ? "heart" : 'heart-o'} size={30} color={enFavori ? '#C70039' : '#287777'} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Type and Date */}
          <View style={styles.annonceType}>
            <Text style={styles.annonceTypeText}>{annonce.username} est ici pour :</Text>
            <Text style={styles.annonceTypeDetails}>{annonce.type}</Text>
          </View>

          {/* Description */}
          <View style={styles.annonceDescription}>
            <Text style={styles.annonceDescriptionTitre}>Description :</Text>
            <Text style={styles.annonceDescriptionText}>{annonce.description}</Text>
            <View style={styles.separator}></View>
            <Text style={styles.descriptionDate}>Publier le : {formatDate(annonce.date)}</Text>
          </View>

          {/* Criteria Section */}
          <View style={styles.annonceCritere}>
            <View style={styles.critereContainer}>
              <View style={styles.titreEtLogo}>
                <FontAwesome name='list' size={15} color="#287777" />
                <Text style={styles.titre}>Domaine</Text>
              </View>
              <Text style={styles.critereReponse}>{annonce.secteurActivite}</Text>
            </View>
            <View style={styles.critereContainer}>
              <View style={styles.titreEtLogo}>
                <FontAwesome name='hourglass' size={15} color="#287777" />
                <Text style={styles.titre}>Disponibilité</Text>
              </View>
              {/* Loop through the disponibilite array and display each item */}
              {annonce.disponibilite.map((dispo, index) => (
                <View key={index} style={styles.bulletItem}>
                  <Text style={styles.critereReponse}>• {dispo}</Text>
                </View>
              ))}
            </View>

            <View style={styles.critereContainer}>
              <View style={styles.titreEtLogo}>
                <FontAwesome name='briefcase' size={15} color="#287777" />
                <Text style={styles.titre}>Expérience</Text>
              </View>
              <Text style={styles.critereReponse}>{annonce.experience}</Text>
            </View>
            <View style={styles.critereContainer}>
              <View style={styles.titreEtLogo}>
                <FontAwesome name='users' size={15} color="#287777" />
                <Text style={styles.titre}>Durée</Text>
              </View>
              <Text style={styles.critereReponse}>{annonce.tempsMax}</Text>
            </View>
          </View>

          {/* Map */}
          <View style={styles.mapContainer}>
            <MapView style={styles.map}
              region={{ ...coordonnee, latitudeDelta: 0.0922, longitudeDelta: 0.0421 }}
              scrollEnabled={false}
              zoomEnabled={false}
              pitchEnabled={false}
              rotateEnabled={false}
              pointerEvents="none">
              <Marker coordinate={coordonnee} />
            </MapView>
          </View>

          {/* User Information */}
          <TouchableOpacity style={styles.utilisateur} onPress={() => navigation.navigate('Profil')}>
            <View style={styles.utilisateurGauche}>
              <FontAwesome name="user" size={50} color="#287777" />
            </View>
            <Text style={styles.textUtilisateur}>Nom d'utilisateur : {annonce.username}</Text>
            <FontAwesome name='chevron-right' size={30} color={'#287777'} />
          </TouchableOpacity>

          {/* Report Button */}
          <TouchableOpacity style={styles.signalez}>
            <Text style={styles.textSignalez}>S i g n a l e z    l ' a n n o n c e</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Colab Button */}
        <View style={styles.colabBar}>
          <TouchableOpacity onPress={handleColab} style={styles.colabBtn}>
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
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },

  // Navbar
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    marginTop: 15,
  },
  logo: {
    height: 38,
    width: 130,
  },

  // Annonce Complete
  annonceComplete: {
    flex: 1,
    marginTop: 15,
    backgroundColor: '#f9f9f9',
  },

  // En Tete (Title and Favorite)
  annonceEnTete: {
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  annonceTitre: {
    fontSize: 30,
    fontWeight: 'bold',
    width: '90%',
    marginTop:5,

  },
  annonceFavoris: {
    justifyContent: 'center',
  },

  // Annonce Type
  annonceType: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 15,
    marginTop: 15,
    marginHorizontal: 10,
    backgroundColor: '#fff',
  },
  annonceTypeText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  annonceTypeDetails: {
    fontSize: 16,
    marginTop: 5,
  },

  // Annonce Description
  annonceDescription: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
    marginHorizontal: 10,
    backgroundColor: '#fff',
  },
  annonceDescriptionTitre: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  annonceDescriptionText: {
    fontSize: 16,
    marginTop: 5,
  },
  descriptionDate: {
    marginTop: 10,
    fontSize: 14,
    color: '#888',
  },

  // Criteria
  annonceCritere: {
    marginTop: 10,
    paddingTop:15,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  critereContainer: {
    marginBottom: 10,
  },
  titreEtLogo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  titre: {
    fontWeight: 'bold',
    fontSize: 18,
    paddingLeft: 10,
  },
  critereReponse: {
    paddingLeft: 25,
    paddingBottom:2,
    fontSize: 14,
    color: '#555',
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bulletPoint: {
    fontSize: 16,
    color: '#287777', // Optional color for bullet point
  },

  // Map Container
  mapContainer: {
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    overflow: 'hidden',
    height: 200,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },

  // User Information
  utilisateur: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginHorizontal: 10,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  textUtilisateur: {
    fontSize: 18,
  },

 // Report Button
  signalez: {
    borderRadius: 10,
    marginHorizontal: 10,
    marginTop:10,
    marginBottom:10,
    backgroundColor: '#FF7070',
    height: 20,
    justifyContent: 'center', // Centre le contenu verticalement
    alignItems: 'center',      // Centre le contenu horizontalement
  },
  textSignalez: {
    color: '#fff',
    textAlign: 'center',
  },


  // Colab Button
  colabBar: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 20,
  },
  colabBtn: {
    width: 200,
    height: 50,
    borderRadius: 100,
    backgroundColor: '#287777',
    justifyContent: 'center',
    alignItems: 'center',
  },
  colabText: {
    fontSize: 20,
    color: '#fff',
  },
});
