import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, ScrollView} from 'react-native';
import { FontAwesome } from "react-native-vector-icons";

export default function UserProfile({ route, navigation }) {

  const username = route.params.username 
  const [userAds, setUserAds] = useState([]);
  const [bio, setBio] = useState("");
  const [learn, setLearn] = useState([]);
  const [teach, setTeach] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const logos = {
    Informatique: require('../assets/Informatique.png'),
    Arts: require('../assets/Arts.png'),
    Bricolage: require('../assets/Bricolage.png'),
    Cuisine: require('../assets/Cuisine.png'),
    Education: require('../assets/Education.png'),
    Environnement: require('../assets/Environnement.png'),
    Humanites: require('../assets/Humanites.png'),
    Ingenierie: require('../assets/Ingenierie.png'),
    Jeux: require('../assets/Jeux.png'),
    Langues: require('../assets/Langues.png'),
    Sante: require('../assets/Sante.png'),
    Sciences: require('../assets/Sciences.png'),
    Sports: require('../assets/Sports.png'),
    Voyages: require('../assets/Voyages.png'),
  };

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    const dateObject = new Date(dateString);
    return dateObject.toLocaleDateString('fr-FR', options);
  };

  useEffect(() => {
    fetch(`https://colab-backend-iota.vercel.app/profiles/users/${username}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          setBio(data.user.bio || '');
          setTeach(data.user.teach || []);
          setLearn(data.user.learn || []);
        } else {
          console.error('Erreur lors de la récupération des informations de profil:', data.error);
        }
        setIsLoading(false); 
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des informations de profil:', error);
        setIsLoading(false);
      });
  }, [username]);
  

  useEffect(() => {
    fetchUserAds();
  }, []);

  const fetchUserAds = () => {
    fetch(`https://colab-backend-iota.vercel.app/profiles/users/${username}`)
      .then(response => response.json())
      .then(data => {
        if (data.result) {
          setUserAds(data.user.annonces);
        } else {
          console.log('Erreur lors de la récupération des annonces:', data.error);
        }
      })
      .catch(error => console.error('Erreur lors de la connexion au serveur:', error));
  };

  const renderAnnonce = (annonce) => (
    <TouchableOpacity 
      key={annonce.token} 
      style={styles.annonce}
      onPress={() => navigation.navigate('AnnonceUser', { annonce: { ...annonce, username } })}
    >
      <View style={styles.imageContainer}>
        <Text style={styles.TextImageContainer}>Catégorie :</Text>
        <Image source={logos[annonce.secteurActivite]} style={styles.logoImage} />
        <Text style={styles.TextImageContainer}>{annonce.secteurActivite}</Text>
      </View> 
      <View style={styles.mesCritere}>
        <View style={styles.apercuAnnonce}>
          <Text style={styles.apercuAnnonceTitre}>
            {annonce.title.length > 46 ? `${annonce.title.substring(0, 45)}...` : annonce.title}
          </Text>
          <Text style={styles.apercuAnnonceDescription}>
            {annonce.description.length > 85 ? `${annonce.description.substring(0, 84)}...` : annonce.description}
          </Text>
          {annonce.programme && (
            <Text style={styles.apercuAnnonceProgramme}>
              <Text style={styles.critereTextTitre}>Programme : </Text>
              <Text style={styles.apercuAnnonceProgramme}>
                {annonce.programme.length > 60 ? `${annonce.programme.substring(0, 59)}...` : annonce.programme}
              </Text>
            </Text>
          )}
          <View style={styles.containerCritere}>
            <Text style={styles.critereTextTitre}>Expérience : </Text>
            <Text style={styles.critereText}>{annonce.experience}</Text>
          </View>
          <View style={styles.containerCritere}>
            <Text style={styles.critereTextTitre}>Fréquence : </Text>
            <Text style={styles.critereText}>{annonce.tempsMax}</Text>
          </View>
          <View style={styles.containerCritere}>
            <Text style={styles.critereTextTitre}>Disponibilité : </Text>
            <Text style={styles.critereText}>
              {Array.isArray(annonce.disponibilite) ? annonce.disponibilite.join(', ') : annonce.disponibilite}
            </Text>
          </View>
          <Text style={styles.apercuAnnonceDate}>Mise en ligne le : {formatDate(annonce.date)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
  
  const halfLength = Math.ceil(learn.length / 2);
  const learnLeftColumn = learn.slice(0, halfLength);
  const learnRightColumn = learn.slice(halfLength);

  const teachLeftColumn = teach.slice(0, halfLength);
  const teachRightColumn = teach.slice(halfLength);
  
  if (isLoading) {
    return <Text>Chargement...</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome name="reply-all" size={28} style={styles.goBack} color={"#287777"} />
        </TouchableOpacity>
      </View>
      <View style={styles.header}>
        <Text style={styles.username}>{username}</Text>
        <Text style={styles.stars}>⭐⭐⭐⭐⭐</Text>
      </View>
      <View style={styles.description}>
        <Text style={styles.bio}>Biographie</Text>
        <Text style={styles.secteurs}>{bio}</Text>
        
        <View style={styles.sectionContainer}>
        <Text style={styles.sectiontitle}>{username} veut apprendre :</Text>
        <View style={styles.row}>
          <View style={styles.column}>
            {learnLeftColumn.map((activity, index) => (
              <Text key={index} style={styles.secteurItem}>• {activity}</Text>
            ))}
          </View>
          <View style={styles.column}>
            {learnRightColumn.map((activity, index) => (
              <Text key={index} style={styles.secteurItem}>• {activity}</Text>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectiontitle}>Il veux aussi enseigner :</Text>
        <View style={styles.row}>
          <View style={styles.column}>
            {teachLeftColumn.map((activity, index) => (
              <Text key={index} style={styles.secteurItem}>• {activity}</Text>
            ))}
          </View>
          <View style={styles.column}>
            {teachRightColumn.map((activity, index) => (
              <Text key={index} style={styles.secteurItem}>• {activity}</Text>
            ))}
          </View>
        </View>
      </View>
      </View>
        <View>
          <Text style={styles.sectionAnnonce}>Toutes ces annonces en ligne</Text>
        </View>
      <FlatList
        data={userAds}
        renderItem={({ item }) => renderAnnonce(item)}
        keyExtractor={(item) => item._id ? item._id.toString() : String(Math.random())}
        contentContainerStyle={styles.flatlistContainer}
      />
    </ScrollView>
  );
}

  const styles = StyleSheet.create({
    container: { 
      flex: 1, 
      paddingHorizontal: 20,
      backgroundColor: '#e5f6f6',
    },
    scrollContainer: {
      flexGrow: 1,
      paddingHorizontal: 20,
      backgroundColor: '#e5f6f6',
    },
    navBar: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: 70,
    },
    flatlist: {
      paddingVertical: 10,
    },
    flatlistContainer: {
      paddingBottom: 20,
    },
    annonce: {
      minHeight: 190,
      width: '100%',
      flexDirection: 'row',
      borderRadius: 30,
      marginVertical: 10,
      backgroundColor: '#ffffff',
      shadowColor: '#000000',
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
      shadowOffset: { width: 0, height: 5 },
      padding: 10,
    },
    TextImageContainer: {
      fontWeight: 'bold',
      color: '#1F5C5C',
      textAlign: 'center',
      paddingBottom: 5,
    },
    mesCritere: {
      paddingLeft: 15,
      flex: 1,
      justifyContent: 'space-between',
    },
    imageContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      borderRightWidth: 1,
      borderColor: '#ccc',
      paddingRight: 10,
    },
    logoImage: {
      width: 80,
      height: 80,
      marginVertical: 15,
      resizeMode: 'contain',
    },
    apercuAnnonce: {
      width: '85%',
      flex: 1,
    },
    apercuAnnonceTitre: {
      paddingVertical: 10,
      fontWeight: 'bold',
      fontSize: 18,
      color: '#1F5C5C',
    },
    apercuAnnonceDescription: {
      fontSize: 13,
      marginVertical: 10,
      color: '#333333',
    },
    apercuAnnonceProgramme: {
      fontSize: 13,
      fontWeight:'bold',
      color:'#14A3A1',
      marginVertical:10
    },
    apercuAnnonceDate: {
      fontSize: 12,
      marginTop: 15,
      color: '#888888',
    },
    containerCritere: {
      flexDirection: 'row',
      paddingVertical: 3,
    },
    critereTextTitre: {
      fontSize: 12,
      fontWeight: 'bold',
      color: '#1F5C5C',
    },
    critereText: {
      fontSize: 12,
      color: '#444444',
    },
    separator: {
      marginBottom: 70,
    },
    favorisIconContainer: {
      position: 'absolute',
      top: 10,
      right: 10,
      zIndex: 1,
    },
    header: {
      fontSize: 28,
      fontWeight: 'bold',
      alignItems: 'center',
      textAlign: 'center',
      color: '#1F5C5C',
      marginVertical: 20,
      paddingVertical:20,
      backgroundColor: 'white',
      borderRadius: 30,
      gap: 10,
    },
    sectionContainer: {
      marginBottom: 20,
    },
    sectiontitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#1f5c5c',
      marginBottom: 10,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    column: {
      flex: 1,
    },
    secteurItem: {
      fontSize: 16,
      fontWeight:'500',
      color: '#333333',
      marginBottom: 5,
      paddingLeft:30
    },
    username: {
      fontSize: 26, 
      fontWeight: 'bold',
      color: '#1f5c5c',
      textAlign: 'center',
    },
    stars: {
      fontSize: 18,
      color: '#ffd700',
      marginTop: 5,
    },
    description:{
      backgroundColor: 'white',
      borderRadius:30,
    },
    bio: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#1f5c5c',
      textAlign: 'center',
      marginVertical: 15,
    },
    sectiontitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#1f5c5c',
      marginTop: 15,
      marginBottom:20,
      textAlign: 'center',
    },
    secteurs: {
      fontSize: 16,
      color: '#333333',
      textAlign: 'center',
      paddingHorizontal:10,
    },

    sectionAnnonce: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#1f5c5c',
      marginTop: 35,
      marginBottom:15,
      textAlign: 'center',
    },
  });
  