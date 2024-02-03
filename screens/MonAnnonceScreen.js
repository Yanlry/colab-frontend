import { StyleSheet, Text, TouchableOpacity, ScrollView, View, Image, SafeAreaView } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MapView, { Marker } from 'react-native-maps';
import { useSelector } from 'react-redux';
import { Alert } from 'react-native';

export default function MonAnnonceScreen({ route, navigation }) {

  const { annonce } = route.params;

  const utilisateur = useSelector((state) => state.utilisateur.value);

  const coordinates = {
    latitude: 48.8566,
    longitude: 2.3522,
  };

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    const dateObject = new Date(dateString);
    return dateObject.toLocaleDateString('fr-FR', options);
  };


  const supprimerAnnonce = () => {


    fetch(`http://192.168.1.9:3000/annonces/supprime/${utilisateur.token}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ annonceId: annonce._id }),
    })
  }


  const afficherConfirmation = () => {
    Alert.alert(
      'Confirmation',
      'Êtes-vous sûr de vouloir supprimer cette annonce ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Supprimer',
          onPress: () => supprimerAnnonce(navigation.navigate('Utilisateur')),
          style: 'destructive',
        },

      ],
      { cancelable: true }

    );

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
        <TouchableOpacity onPress={() => navigation.navigate('Profil')}>
          <FontAwesome name='user' size={30} color="#182A49" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.annonceComplete}>
        <View style={styles.annonceHeader}>
          {/* TITRE */}
          <Text style={styles.annonceTitre}>
            {annonce.title}
          </Text>
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
              <Text style={styles.titre}>Disponibilité</Text>
            </View>
            <Text style={styles.critereReponse}>{annonce.experience}</Text>
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
              <Text style={styles.titre}>Temps max</Text>
            </View>
            <Text style={styles.critereReponse}>{annonce.tempsMax} heure / semaine </Text>
          </View>
        </View>

        {/* MAP LOCALISATION */}
        <View style={styles.mapContainer}>
          <MapView style={styles.map} region={{ ...coordinates, latitudeDelta: 0.0922, longitudeDelta: 0.0421 }}>
            <Marker coordinate={coordinates} />
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
          <Text style={styles.textUtilisateur}>Nom d'utilisateur : {utilisateur.username} </Text>
          <FontAwesome name='chevron-right' size={30} color={'#182A49'} />
        </TouchableOpacity>

        {/*  SIGNALEZ ANNONCE  */}
        <TouchableOpacity style={styles.signalez}>
          <Text  style={styles.textSignalez}>S i g n a l e z    l ' a n n o n c e</Text>
        </TouchableOpacity>

      </ScrollView>


      {/* BARRE DE MODIFICATION */}
      <View style={styles.suprimerAnnonce}>
        <TouchableOpacity style={styles.modifierBoutton} onPress={() => afficherConfirmation()}>
          <Text style={styles.modifierTexte}>SUPPRIMER ANNONCE</Text>
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
    paddingTop: 30,
    backgroundColor: '#fff6',
  },
  annonceHeader: {
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
  annonceTypeEtDate: {
    flexDirection:'row',
    justifyContent:'space-between',
    paddingHorizontal: 20,
    marginTop:18
  },

  // ------------------- DESCRIPTION ---------------------
  annonceDescription: {
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderColor:'grey',
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
    borderColor:'grey',
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
    borderColor:'grey',
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
    marginBottom: 37,
    backgroundColor: '#fff',
    fontWeight:'bold'
  },
  textSignalez: {
    color:'#FF1F1F'
  },

  // ------------------- BARRE DE MODIFICATION ---------------------

  suprimerAnnonce: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 85,
    flexDirection: 'row',
    paddingBottom: 15
  },
  modifierBoutton: {
    width: 250,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#CE5A5A'
  },
  modifierTexte: {
    fontSize: 15,
    textAlign: 'center',
    color: 'white'
  },
});

