import { StyleSheet, Text, TouchableOpacity, ScrollView, View, Image, SafeAreaView } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MapView, { Marker } from 'react-native-maps';
import { useSelector } from 'react-redux';
import { Alert } from 'react-native';

export default function MonAnnonceScreen({ route, navigation }) {

  const { annonce } = route.params;

  const utilisateur = useSelector((state) => state.utilisateur.value);

  const coordonnee = {
    latitude: annonce.latitude || 0,
    longitude: annonce.longitude || 0,
  };

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    const dateObject = new Date(dateString);
    return dateObject.toLocaleDateString('fr-FR', options);
  };


  const supprimerAnnonce = () => {


    fetch(`https://colab-backend-iota.vercel.app/annonces/supprime/${utilisateur.token}`, {
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
      {/* Navbar */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome
            name="reply-all"
            size={28}
            style={styles.goBack}
            color={"#287777"}
          />
        </TouchableOpacity>
      </View>

      {/* Scrollable Content */}
      <ScrollView style={styles.annonceComplete}>
        {/* Title and Favorites */}
        <View style={styles.annonceEnTete}>
          <View>
          <Text style={styles.annonceTitre}>{annonce.title}</Text>
          <Text style={styles.descriptionDate}>
            Publier le : {formatDate(annonce.date)}
          </Text>
          </View>
        </View>


        {/* Description */}
        <View style={styles.annonceDescription}>
          <Text style={styles.annonceDescriptionTitre}>Description</Text>
          <Text style={styles.annonceDescriptionText}>{annonce.description} </Text>

       {annonce.programme && annonce.programme.trim() !== '' && (
        <View>
          <Text style={styles.annonceProgrammeTitre}>Programme</Text>
          <Text style={styles.annonceProgrammeText}>{annonce.programme}</Text>
        </View>
       )}        

        <View style={styles.separator}></View>
          
        </View>
           
        {/* Map */}
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            region={{
              ...coordonnee,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            scrollEnabled={false}
            zoomEnabled={false}
            pitchEnabled={false}
            rotateEnabled={false}
            pointerEvents="none"
          >
            <Marker coordinate={coordonnee} />
          </MapView>
        </View>

       
        
        {/* Criteria Section */}
        <View style={styles.annonceCritere}>
           {/* Type and Date */}
        <View style={styles.annonceType}>
          <Text style={styles.annonceTypeText}>{annonce.username} est ici pour {annonce.type.toLowerCase()}</Text>
          
        </View>

          <View style={styles.critereContainer}>
            <View style={styles.titreEtLogo}>
              <FontAwesome name="list" size={15} color="#287777" />
              <Text style={styles.titre}>Domaine</Text>
            </View>
            <Text style={styles.critereReponse}>
              {annonce.secteurActivite}
            </Text>
          </View>
          <View style={styles.critereContainer}>
            <View style={styles.titreEtLogo}>
              <FontAwesome name="hourglass" size={15} color="#194D4D" />
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
              <FontAwesome name="briefcase" size={15} color="#194D4D" />
              <Text style={styles.titre}>Expérience</Text>
            </View>
            <Text style={styles.critereReponse}>{annonce.experience}</Text>
          </View>
          <View style={styles.critereContainer}>
            <View style={styles.titreEtLogo}>
              <FontAwesome name="users" size={15} color="#194D4D" />
              <Text style={styles.titre}>Durée</Text>
            </View>
            <Text style={styles.critereReponse}>{annonce.tempsMax}</Text>
          </View>
          <View style={styles.critereContainer}>
              <View style={styles.titreEtLogo}>
                <FontAwesome name="map-pin" size={15} color="#194D4D" />
                <Text style={styles.titre}>Lieu</Text>
              </View>
              <Text style={styles.critereReponse}>{annonce.mode}</Text>
            </View>
        </View>

        {/* User Information */}
        <TouchableOpacity
          style={styles.utilisateur}
          onPress={() => navigation.navigate("UserProfile", { username: annonce.username })}
        >
          <View style={styles.utilisateurGauche}>
            <FontAwesome name="user" size={50} color="#194D4D" />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.usernameText}>{annonce.username} <Text style={styles.inscriptionText}>- inscrit depuis 2 ans</Text></Text>
            <Text style={styles.ratingStars}>⭐⭐⭐⭐⭐ (96)</Text>
          </View>

          <FontAwesome name="chevron-right" size={30} color={"#194D4D"} />
        </TouchableOpacity>
      </ScrollView>

      {/* Colab Button */}
      <View style={styles.changeBar}>
          <TouchableOpacity onPress={() => navigation.navigate('ModifierAnnonce', { annonce })} style={styles.boutonModifier}>
            <Text style={styles.colabText}>Modifier</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={afficherConfirmation} style={styles.boutonSupprimer}>
            <Text style={styles.colabText}>Supprimer</Text>
          </TouchableOpacity>
      </View>
    </View>
  </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: '#e5f6f6',

  },
  container: {
    flex: 1,
  },

  // Navbar
  navBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    backgroundColor: '#e5f6f6',

  },

  // En Tete (Title and Favorite)
  annonceEnTete: {
    flexDirection: "row",
    borderRadius: 20,
    backgroundColor: "#fff",
    paddingLeft:20,
    marginHorizontal:10,
    paddingTop:10,
    paddingBottom:10
  },
  annonceTitre: {
    fontSize: 18,
    fontWeight: "bold",
    width: 270,
    paddingTop:6,
    paddingRight:5,
    color:'#194D4D',

  },
  annonceFavoris: {
    position:'absolute',
    right:20,
    bottom:35,
    justifyContent: "center",
    backgroundColor: "#fff",
    
  },

  // Annonce Type
  annonceType: {
    borderRadius: 20,
    marginBottom:25,
    backgroundColor: "#fff",
  },
  annonceTypeText: {
    fontSize: 18,
    fontWeight: "bold",
    color:'#194D4D'
  },
  annonceTypeDetails: {
    fontSize: 16,
    marginTop: 5,
    marginLeft:5
  },

  // Annonce Description
  annonceDescription: {
    borderRadius: 20,
    padding: 20,
    marginTop: 10,
    marginHorizontal: 10,
    backgroundColor: "#fff",
  },
  annonceDescriptionTitre: {
    fontSize: 18,
    fontWeight: "bold",
    color:'#194D4D'

  },
  annonceDescriptionText: {
    fontSize: 16,
    marginTop: 10,
    marginLeft:5
  }
  ,annonceProgrammeTitre: {
    marginTop:10,
    fontSize: 18,
    fontWeight: "bold",
    color:'#194D4D'
  },
  annonceProgrammeText:{
    fontSize: 16,
    marginTop: 10,
    marginLeft:5
  },
  descriptionDate: {
    marginTop: 10,
    marginBottom:10,
    fontSize: 14,
    color: "#888",
  },

  // Criteria
  annonceCritere: {
    marginTop: 10,
    padding:20,
    borderRadius: 20,
    backgroundColor: "#fff",
    marginHorizontal: 10,
  },
  critereContainer: {
    marginBottom: 15,
  },
  titreEtLogo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  titre: {
    fontWeight: "bold",
    fontSize: 18,
    paddingLeft: 10,
    color:'#194D4D'

  },
  critereReponse: {
    paddingLeft: 25,
    paddingBottom: 2,
    fontSize: 14,
    color: "#555",
  },
  bulletItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  bulletPoint: {
    fontSize: 16,
    color: "#287777", // Optional color for bullet point
  },

  userInfo: {
    alignItems: 'center',
  },
  usernameText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  ratingStars: {
    marginTop:10,
    fontSize: 16,
    marginLeft: 8,
    color: '#FFD700', // Couleur or pour les étoiles
  },
  reviewCount: {
    fontSize: 16,
    color: '#666',
    marginLeft: 4,
  },
  inscriptionText:{
    fontSize:14,
    color:'#ccc'
  },
  // Map Container
  mapContainer: {
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 20,
    overflow: "hidden",
    height: 200,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },

  // User Information
  utilisateur: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    marginHorizontal: 10,
    padding: 20,
    borderRadius: 20,
    backgroundColor: "#fff",
  },
  textUtilisateur: {
    fontSize: 18,
  },

  // Report Button
  signalez: {
    borderRadius: 30,
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#FF7070",
    height: 20,
    justifyContent: "center", // Centre le contenu verticalement
    alignItems: "center", // Centre le contenu horizontalement
  },
  textSignalez: {
    color: "#fff",
    textAlign: "center",
  },

  // Colab Button
  changeBar: {
    flexDirection:'row',
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    marginBottom: 20,
    gap:50
  },
  boutonModifier: {
    width: 150,
    height: 50,
    borderRadius: 100,
    backgroundColor: "#287777",
    justifyContent: "center",
    alignItems: "center",
  },
  boutonSupprimer: {
    width: 150,
    height: 50,
    borderRadius: 100,
    backgroundColor: "#FF6347",
    justifyContent: "center",
    alignItems: "center",
  },
  colabText: {
    fontSize: 20,
    color: "#fff",
  },
});


