import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback, SafeAreaView } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useSelector } from 'react-redux';
import MapView, { Marker } from 'react-native-maps';
import GeoAPIGouvAutocomplete from './GeoAPIGouvAutocomplete';

export default function PublierScreen({ navigation }) {

  const utilisateur = useSelector(state => state.utilisateur.value);

  const [activitesDisponibles, setActivitesDisponibles] = useState([]);
  const [offreOuvert, setOffreOuvert] = useState(false);
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tempsMax, setTempsMax] = useState('');
  const [experience, setExperience] = useState('');
  const [secteurActivite, setSecteurActivite] = useState([]);
  const [disponibilite, setDisponibilite] = useState('');
  const [ville, setVille] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const [afficherMessage, setAfficherMessage] = useState(false);

  useEffect(() => {
    fetch('http://192.168.1.109:3000/profiles/activites')
      .then(response => response.json())
      .then(data => {
        if (data && data.activites) {
          setActivitesDisponibles(data.activites);
        }
      });
  }, []);

  useEffect(() => {
    if (offreOuvert && secteurActivite.length === 1) {
      setOffreOuvert(false);
    }
  }, [secteurActivite]);

  const handleCitySelected = (city) => {
    setVille(city.nom);
    fetchCoordinates(city.nom);
  };
  
  const fetchCoordinates = (ville) => {
    // Exemple avec OpenStreetMap Nominatim
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${ville}`;
  
    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data && data.length > 0) {
          setLatitude(parseFloat(data[0].lat)); 
          setLongitude(parseFloat(data[0].lon)); 
        } else {
          console.error("Les coordonnées ne sont pas disponibles pour cette ville.");
        }
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des coordonnées :", error);
      });
  };
  
  

  const envoyerDonnee = () => {
    if (!type || !title || secteurActivite.length === 0 || !description || !tempsMax || !experience || !disponibilite || !ville || !latitude || !longitude) {
      console.log("Vérifiez tous les champs obligatoires");
      return;
    }
  
    const annonceData = {
      type,
      title,
      description,
      secteurActivite,
      tempsMax,
      experience,
      disponibilite,
      ville,
      latitude, 
      longitude,
      date: new Date(),
    };

    console.log("Données de l'annonce envoyées :", annonceData);

    fetch(`http://192.168.1.109:3000/annonces/publier/${utilisateur.token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(annonceData),
    })
      .then(response => response.json())
      .then(data => {
        setAfficherMessage(true);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const cacherMessage = () => {
    setAfficherMessage(false);
    setType('');
    setTitle('');
    setDescription('');
    setTempsMax('');
    setExperience('');
    setDisponibilite('');
    setVille('');
    setLatitude(null);
    setLongitude(null);
    navigation.navigate('Accueil');
  };

  const supprimerVille = () => {
    setVille('');
    setLatitude(null);
    setLongitude(null);
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <View style={styles.content}>
              <Text style={styles.titreCritere}>Titre</Text>
              <TextInput
                style={styles.saisie}
                placeholder="Titre de l'annonce"
                value={title}
                onChangeText={(text) => setTitle(text)}
              />
              <Text style={styles.titreCritere}>Localisation</Text>
             <GeoAPIGouvAutocomplete
                onCitySelected={handleCitySelected}
              />
              {ville && (
                <View style={styles.villeContainer}>
                  <Text style={styles.selectedCity}>
                    Ville sélectionnée : <Text style={styles.selectedCity2}>{ville}</Text>
                  </Text>
                  <TouchableOpacity onPress={supprimerVille}>
                    <Text style={styles.supprimerVille}>l Supprimer</Text>
                  </TouchableOpacity>
                </View>
              )}
              
              <Text style={styles.titreCritere}>Type d'annonce</Text>
              <TextInput
                style={styles.saisie}
                placeholder="Choisissez entre : Offre ou Demande"
                value={type}
                onChangeText={(text) => setType(text)}
                />
                  
              <Text style={styles.titreCritere}>Secteur d'activités</Text>
              <DropDownPicker
                items={activitesDisponibles.map(activite => ({
                  label: activite,
                  value: activite,
                }))}
                open={offreOuvert}
                setOpen={setOffreOuvert}
                value={secteurActivite}
                setValue={setSecteurActivite}
                placeholder="Sélectionnez votre activité"
                showTickIcon={true}
                multiple={true}
                min={1}
                max={1}
                mode="BADGE"
                badgeColors={['#50B200', '#182A49', '#C23B3B', '#4E98C2']}
                badgeDotColors={['white']}
                badgeTextStyle={{ color: 'white' }}
                placeholderStyle={{ color: 'gray' }}
                style={styles.dropDownPicker}
                dropDownContainerStyle={{ width: '95%', marginLeft: 9 }}
                />
                </View>
                <ScrollView style={styles.scrollContent}>
              <Text style={styles.titreDescription}>Description</Text>
              <TextInput
                style={styles.saisieDescription}
                placeholder="Description de l'annonce"
                value={description}
                onChangeText={(text) => setDescription(text)}
                multiline
              />
              <Text style={styles.titreCritere}>Expérience en années</Text>
              <TextInput
                style={styles.saisie}
                placeholder="Votre niveau ou le niveau que vous recherchez ?"
                value={experience}
                onChangeText={(text) => setExperience(text)}
                keyboardType="numeric"
              />
              <Text style={styles.titreCritere}>Vos disponibilités</Text>
              <TextInput
                style={styles.saisie}
                placeholder="Vos disponibilités : Semaine, soir, ou Week-end ?"
                value={disponibilite}
                onChangeText={(text) => setDisponibilite(text)}
              />
              <Text style={styles.titreCritere}>Temps par semaine</Text>
              <TextInput
                style={styles.saisie}
                placeholder="Temps à consacrer par semaine ?"
                value={tempsMax}
                onChangeText={(text) => setTempsMax(text)}
                keyboardType="numeric"
              />
              <TouchableOpacity style={styles.boutonEnvoyer} onPress={envoyerDonnee}>
                <Text style={styles.textEnvoyer}>Publier l'annonce</Text>
              </TouchableOpacity>
              {afficherMessage && (
                <View style={styles.messageContainer}>
                  <Text style={styles.messageText}>Votre annonce a bien été enregistrée !</Text>
                  <TouchableOpacity style={styles.boutonOK} onPress={cacherMessage}>
                    <Text style={styles.textOK}>OK</Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
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
  content: {
    padding: 20,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20, 
  },
  titreCritere: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  saisie: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  dropDownPicker: {
    marginBottom: 20,
  },
  titreDescription: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  saisieDescription: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    height: 100,
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  boutonEnvoyer: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  textEnvoyer: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  messageContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  messageText: {
    fontSize: 16,
    color: '#28A745',
    marginBottom: 10,
  },
  boutonOK: {
    backgroundColor: '#28A745',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  textOK: {
    color: '#fff',
    fontSize: 16,
  },
  villeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  selectedCity: {
    fontSize: 16,
    marginRight: 10,
  },
  selectedCity2: {
    color: 'blue',
  },
  supprimerVille: {
    color: 'red',
  },
  map: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
});
