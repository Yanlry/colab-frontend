import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, ScrollView, View } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MapView, { Marker } from 'react-native-maps';
import { useDispatch, useSelector } from 'react-redux';
import { ajouteFavoris, suprimeFavoris } from '../reducers/utilisateur'

export default function AnnonceScreen({ route, navigation }) {


  const { annonce } = route.params;

  // Servira a envoyer les donner souhaitez dans mon reducers
  const dispatch = useDispatch();

  // Utilise le reducers "utilisateur" pour acceder au tableau des favoris
  const favoris = useSelector(state => state.utilisateur.favoris);
  const utilisateur = useSelector(state => state.utilisateur.value);

  // État pour savoir si l'annonce est en favori ( Pour la mettre en couleur ou non )
  const [enFavori, setEnFavori] = useState(false);

  // Sert vérifier si l'annonce est déja dans la liste des favoris et met à jour l'état par rapport au données récus
  useEffect(() => {
    const estDejaFavori = favoris.some(fav => fav.token === annonce.token);
    setEnFavori(estDejaFavori);
  }, [favoris, annonce.token]);

  // A remplacer par les données de la ville selectionner dans l'annonce
  const coordonnee = {
    latitude: 48.8566,
    longitude: 2.3522,
  };

  // Permet d'ajouter ou de supprimer une annonces de mes favoris
  const gererFavoris = (annonce) => {

    const estDejaFavori = favoris.some(fav => fav.token === annonce.token);

    if (estDejaFavori) {
      dispatch(suprimeFavoris(annonce.token));
    } else {
      dispatch(ajouteFavoris(annonce));
    }
  };

  // Permet de formatter la date de l'annonce
  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    const dateObject = new Date(dateString);
    return dateObject.toLocaleDateString('fr-FR', options);
  };


  const handleColab = () => {
    fetch('http://10.215.12.147:3000/propositionCollabs/propositions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: annonce.token, cible: annonce.username, initiateur: utilisateur.username }),
    })


      .then(response => response.json())
    navigation.navigate('Notification')

  }

  return (
    <View style={styles.container}>

      <View style={styles.navBar}>
        {/* BOUTON RETOUR ARRIERE */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome name='chevron-left' size={28} style={styles.goBack} color={'#3A3960'} />
        </TouchableOpacity>

        {/* BOUTON PROFIL */}
        <TouchableOpacity onPress={() => navigation.navigate('Utilisateur')}>
          <FontAwesome name='user' size={30} color="#3A3960" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.annonceComplete}>
        <View style={styles.annonceEnTete}>
          {/* TITRE */}
          <Text style={styles.annonceTitre}>
            {annonce.title}
          </Text>

          {/* ICONE FAVORIS */}
          <TouchableOpacity onPress={() => { gererFavoris(annonce); setEnFavori(!enFavori); }}>
            <FontAwesome name={enFavori ? "heart" : 'heart-o'} size={30} color={enFavori ? '#C70039' : '#3A3960'} style={styles.annonceFavoris} />
          </TouchableOpacity>

        </View>

        {/* TYPE */}
        <View style={styles.annonceType}>
          <Text>Type : {annonce.type}</Text>
        </View>

        {/* DATE DE PUBLICATION */}
        <View style={styles.annonceDate}>
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
              <FontAwesome name='user' size={15} color="#3A3960" />
              <Text style={styles.titre}>Secteur d'activité</Text>
            </View>
            <Text style={styles.critereReponse}> {annonce.secteurActivite} </Text>

            {/*  DISPONIBILITÉ */}
            <View style={styles.titreEtLogo}>
              <FontAwesome name='user' size={15} color="#3A3960" />
              <Text style={styles.titre}>Disponibilité</Text>
            </View>
            <Text style={styles.critereReponse}>{annonce.disponibilite}</Text>
          </View>

          {/* CRITÉRE COLONNE 2 */}
          <View style={styles.critereColonne2}>

            {/* EXPÉRIENCE */}
            <View style={styles.titreEtLogo}>
              <FontAwesome name='user' size={15} color="#3A3960" />
              <Text style={styles.titre} >Mon expérience</Text>
            </View>
            <Text style={styles.critereReponse}>{annonce.experience} ans</Text>

            {/* TEMPS MAX */}
            <View style={styles.titreEtLogo}>
              <FontAwesome name='user' size={15} color="#3A3960" />
              <Text style={styles.titre}>Temps max</Text>
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
              <FontAwesome name="user" size={50} color="#3A3960" />
            </TouchableOpacity>
          </View>

          {/* NOM D'UTILISATEUR */}
          <Text style={styles.textUtilisateur}>Nom d'utilisateur : {annonce.username} </Text>
          <FontAwesome name='chevron-right' size={30} color={'#3A3960'} />
        </TouchableOpacity>

        {/*  SIGNALEZ ANNONCE  */}
        <TouchableOpacity style={styles.signalez}>
          <Text >S i g n a l e z    l ' a n n o n c e</Text>
        </TouchableOpacity>

      </ScrollView>


      {/* BARRE DE COLAB */}
      <View style={styles.colabBar}>
        <View >
          <FontAwesome name="users" size={30} color="#3A3960" style={styles.nbColabIcone} />
        </View>
        <TouchableOpacity onPress={() => handleColab()} style={styles.colabBtn}>
          <Text style={styles.colabText}>COLAB</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  // ------------------- NAVBAR : VIEW ---------------------
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingTop: 45,
    height: 85,
    borderBottomWidth: 1
  },

  // ------------------- ANNONCE ENTIERE : SCROLLVIEW ---------------------
  annonceComplete: {
    flex: 1,
    paddingTop: 30,
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
    paddingRight: 5
  },
  annonceType: {
    paddingLeft: 20,
    paddingTop: 10
  },

  // ------------------- DESCRIPTION ---------------------
  annonceDescription: {
    marginTop: 30,
    padding: 10,
    borderWidth: 1,
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
    borderRadius: 12,
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
    marginHorizontal: 10,
    marginBottom: 37,
  },

  // ------------------- COLAB BAR ---------------------
  colabBar: {
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 85,
    borderWidth: 1,
    flexDirection: 'row',
    paddingBottom: 15
  },
  colabBtn: {
    width: 200,
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3A3960'
  },
  nbColabIcone: {
    marginLeft: 50,
    marginTop: 10
  },

  colabText: {
    fontSize: 30,
    color: 'white'
  },
});

