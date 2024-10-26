import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback, SafeAreaView, Modal, FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import GeoAPIGouvAutocomplete from './GeoAPIGouvAutocomplete';
import MapView, { Marker } from 'react-native-maps';

export default function PublierScreen({ navigation }) {

  const utilisateur = useSelector(state => state.utilisateur.value);

  const [activitesDisponibles, setActivitesDisponibles] = useState([]);
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tempsMax, setTempsMax] = useState('');
  const [experience, setExperience] = useState('');
  const [secteurActivite, setSecteurActivite] = useState([]);
  const [disponibilite, setDisponibilite] = useState([]);
  const [ville, setVille] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [afficherMessage, setAfficherMessage] = useState(false);
  const [isTypeModalVisible, setIsTypeModalVisible] = useState(false);
  const [isSecteurModalVisible, setIsSecteurModalVisible] = useState(false);
  const [isDispoModalVisible, setIsDispoModalVisible] = useState(false);
  const [isExperienceModalVisible, setIsExperienceModalVisible] = useState(false);
  const [isTempsModalVisible, setIsTempsModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const scrollViewRef = useRef(null);

  useEffect(() => {
    fetch('http://192.168.1.109:3000/profiles/activites')
      .then(response => response.json())
      .then(data => {
        if (data && data.activites) {
          setActivitesDisponibles(data.activites);
        }
      });
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ y: 0, animated: true });
      }
    }, [])
  );

const handleCitySelected = (city) => {
    setVille(city.nom);
    fetchCoordinates(city.nom);
};

const fetchCoordinates = (ville) => {
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
    setErrorMessage("Veuillez remplir tous les champs obligatoires.");
    return;
  }

  // Effacez le message d'erreur si tout est correct
  setErrorMessage('');

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

  fetch(`http://192.168.1.109:3000/annonces/publier/${utilisateur.token}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(annonceData),
  })
    .then(response => response.json())
    .then(data => {
      console.log("Réponse du serveur :", data);

      if (data.result) {
        setAfficherMessage(true);
        resetForm();
      } else {
        setErrorMessage("Erreur lors de la publication de l'annonce.");
      }
    })
    .catch(error => {
      setErrorMessage("Erreur lors de la connexion au serveur.");
      console.error("Erreur :", error.message);
    });
};

const resetForm = () => {
  setType('');
  setTitle('');
  setDescription('');
  setTempsMax('');
  setExperience('');
  setSecteurActivite([]);
  setDisponibilite('');
  setVille('');
  setLatitude(null);
  setLongitude(null);
};

const cacherMessage = () => {
  setAfficherMessage(false);
  resetForm();
  navigation.navigate('Accueil');
};

const supprimerVille = () => {
    setVille('');
    setLatitude(null);
    setLongitude(null);
};

const renderTypeModal = () => (
    <Modal visible={isTypeModalVisible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <FlatList
            data={[{ label: 'Apprendre', value: 'Apprendre' }, { label: 'Enseigner', value: 'Enseigner' }]}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => { setType(item.value); setIsTypeModalVisible(false); }} style={styles.modalItem}>
                <Text>{item.label}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity onPress={() => setIsTypeModalVisible(false)} style={styles.modalClose}>
            <Text style={{ color: 'white' }}>Fermer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
);

const renderSecteurModal = () => (
    <Modal visible={isSecteurModalVisible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <FlatList
            data={activitesDisponibles.map(activite => ({ label: activite, value: activite }))}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => { setSecteurActivite([item.value]); setIsSecteurModalVisible(false); }} style={styles.modalItem}>
                <Text>{item.label}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity onPress={() => setIsSecteurModalVisible(false)} style={styles.modalClose}>
            <Text style={{ color: 'white' }}>Fermer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
);

const toggleDisponibilite = (value) => {
  // Si l'élément est déjà sélectionné, on le retire. Sinon, on l'ajoute.
  if (disponibilite.includes(value)) {
    setDisponibilite(disponibilite.filter(item => item !== value));
  } else {
    setDisponibilite([...disponibilite, value]);
  }
};

const renderDispoModal = () => (
  <Modal visible={isDispoModalVisible} animationType="slide" transparent={true}>
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <FlatList
          data={[
            { label: 'Semaine', value: 'Semaine' },
            { label: 'Soir', value: 'Soir' },
            { label: 'Week-end', value: 'Week-end' }
          ]}
          keyExtractor={(item) => item.value}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => toggleDisponibilite(item.value)}
              style={[
                styles.modalItem,
                { backgroundColor: disponibilite.includes(item.value) ? '#93DCDC' : 'white' } // Change la couleur si sélectionné
              ]}
            >
              <Text>{item.label}</Text>
            </TouchableOpacity>
          )}
        />
        <TouchableOpacity onPress={() => setIsDispoModalVisible(false)} style={styles.modalClose}>
          <Text style={{ color: 'white' }}>Fermer</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const renderExperienceModal = () => (
  <Modal visible={isExperienceModalVisible} animationType="slide" transparent={true}>
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <FlatList
          data={[
            { label: 'Débutant', value: 'Débutant' },
            { label: 'Intermédiaire', value: 'Intermédiaire' },
            { label: 'Confirmé', value: 'Confirmé' }
          ]}
          keyExtractor={(item) => item.value}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => { setExperience(item.value); setIsExperienceModalVisible(false); }} style={styles.modalItem}>
              <Text>{item.label}</Text>
            </TouchableOpacity>
          )}
        />
        <TouchableOpacity onPress={() => setIsExperienceModalVisible(false)} style={styles.modalClose}>
          <Text style={{ color: 'white' }}>Fermer</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const renderTempsModal = () => (
  <Modal visible={isTempsModalVisible} animationType="slide" transparent={true}>
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <FlatList
          data={[
            { label: "Moins d'une heure", value: "Moins d'une heure" },
            { label: "Entre 1 heure et 2 heures", value: "Entre 1 heure et 2 heures" },
            { label: "Entre 2 heures et 3 heures", value: "Entre 2 heures et 3 heures" },
            { label: "4 heures ou plus", value: "4 heures ou plus" }
          ]}
          keyExtractor={(item) => item.value}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => { setTempsMax(item.value); setIsTempsModalVisible(false); }}
              style={styles.modalItem}
            >
              <Text>{item.label}</Text>
            </TouchableOpacity>
          )}
        />
        <TouchableOpacity onPress={() => setIsTempsModalVisible(false)} style={styles.modalClose}>
          <Text style={{ color: 'white' }}>Fermer</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="height" keyboardVerticalOffset={90}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView ref={scrollViewRef} nestedScrollEnabled={true} contentContainerStyle={styles.scrollContent}>
            <View style={styles.content}>
              
              <Text style={styles.titreCritere}>Titre</Text>
              <TextInput
                style={styles.saisie}
                placeholder="Titre de l'annonce"
                placeholderTextColor="#8E8E93"
                value={title}
                onChangeText={(text) => setTitle(text)}
              />
      
              <Text style={styles.titreDescription}>Description</Text>
              <TextInput
                style={styles.saisieDescription}
                placeholder="Description de l'annonce"
                value={description}
                onChangeText={(text) => setDescription(text)}
                multiline
               />

              <View style={{ marginBottom: 10 }}>
                <Text style={styles.titreCritere}>Localisation</Text>
                <GeoAPIGouvAutocomplete onCitySelected={handleCitySelected} />
                {ville && (
                  <View style={styles.villeContainer}>
                    <Text style={styles.selectedCity}>
                      Ville sélectionnée : <Text style={styles.selectedCity2}>{ville}</Text>
                    </Text>
                    <TouchableOpacity onPress={supprimerVille}>
                      <Text style={styles.supprimerVille}>Supprimer</Text>
                    </TouchableOpacity>
                  </View>
                )}
                {latitude && longitude && (
                  <MapView
                    style={styles.map}
                    region={{
                      latitude: latitude || 48.8566, 
                      longitude: longitude || 2.3522,
                      latitudeDelta: 0.05,
                      longitudeDelta: 0.05,
                    }}
                    scrollEnabled={false}  
                    zoomEnabled={false}    
                    pitchEnabled={false}   
                    rotateEnabled={false}  
                    pointerEvents="none"   
                  >
                    <Marker
                      coordinate={{ latitude: latitude, longitude: longitude }}
                      title={ville}
                    />
                  </MapView>
                )}
              </View>

              <Text style={styles.titreCritere}>Type d'annonce</Text>
              <TouchableOpacity style={styles.saisie} onPress={() => setIsTypeModalVisible(true)}>
                <Text style={type ? styles.selectedText : styles.placeholderText}>
                  {type || "Souhaitez apprendre ou enseigner ?"}
                </Text>
              </TouchableOpacity>

              <Text style={styles.titreCritere}>Secteur d'activités</Text>
                <TouchableOpacity style={styles.saisie} onPress={() => setIsSecteurModalVisible(true)}>
                  <Text style={secteurActivite.length > 0 ? styles.selectedText : styles.placeholderText}>
                    {secteurActivite.length > 0 ? secteurActivite[0] : "Sélectionnez votre activité"}
                  </Text>
                </TouchableOpacity>
              
              <Text style={styles.titreCritere}>Expérience</Text>
                <TouchableOpacity style={styles.saisie} onPress={() => setIsExperienceModalVisible(true)}>
                  <Text style={experience ? styles.selectedText : styles.placeholderText}>
                    {experience || "Sélectionnez votre niveau dans le domaine"}
                  </Text>
                </TouchableOpacity>

              <Text style={styles.titreCritere}>Disponibilités</Text>
                <TouchableOpacity style={styles.saisie} onPress={() => setIsDispoModalVisible(true)}>
                  <Text style={disponibilite.length > 0 ? styles.selectedText : styles.placeholderText}>
                    {disponibilite.length > 0 ? disponibilite.join(', ') : "Choisissez entre : Semaine, Soir, ou Week-end"}
                  </Text>
                </TouchableOpacity>

              <Text style={styles.titreCritere}>Temps moyen des séances</Text>
                <TouchableOpacity style={styles.saisie} onPress={() => setIsTempsModalVisible(true)}>
                  <Text style={tempsMax ? styles.selectedText : styles.placeholderText}>
                    {tempsMax || "Temps moyen des séances ?"}
                  </Text>
                </TouchableOpacity>

                {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
              <TouchableOpacity style={styles.boutonEnvoyer} onPress={envoyerDonnee}>
                <Text style={styles.textEnvoyer}>Publier l'annonce</Text>
              </TouchableOpacity>
              <View style={styles.separator}></View>

              <Modal
                animationType="slide"
                transparent={false}
                visible={afficherMessage}
                onRequestClose={() => {}}>
                <View style={styles.modalContainerRegister}>
                  <Text style={styles.modalTextRegister}>Votre annonce a bien été enregistrée !</Text>
                  <TouchableOpacity style={styles.modalButtonRegister} onPress={cacherMessage}>
                    <Text style={styles.modalButtonTextRegister}>OK</Text>
                  </TouchableOpacity>
                </View>
              </Modal>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      {renderTempsModal()}
      {renderExperienceModal()}
      {renderDispoModal()}        
      {renderTypeModal()}
      {renderSecteurModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    paddingVertical: 20,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  saisie: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  titreCritere: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color:'#1F5C5C'
  },
  titreDescription: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color:'#1F5C5C'
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
    backgroundColor: '#3CB371',
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
  placeholderText: {
    color: '#8E8E93', // Gris clair
  },
  errorText: {
    color: 'red',
    textAlign:'center',
    marginBottom: 10,
    fontSize: 14,
  },
  
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 5,
    padding: 20,
    width: '80%', // Réduit la largeur du modal
    maxHeight: '50%', // Réduit la hauteur maximale du modal
    alignSelf: 'center', // Centre le modal sur l'écran,
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  modalClose: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#28A745',
    alignItems: 'center',
    borderRadius: 5,
  },
  map: {
    height: 300, // Hauteur de la carte
    width: '100%',
    marginBottom: 20,
  },
  modalContainerRegister: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',  // Couleur de fond du modal
  },
  modalTextRegister: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalButtonRegister: {
    backgroundColor: '#28A745',
    padding: 15,
    borderRadius: 5,
  },
  modalButtonTextRegister: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
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
  separator:{
    marginBottom:30,
  },
});
