import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback, SafeAreaView, Modal, FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import GeoAPIGouvAutocomplete from './GeoAPIGouvAutocomplete';
import MapView, { Marker } from 'react-native-maps';

export default function ModifierAnnonceScreen({ route, navigation }) {
  const { annonce } = route.params;
  
  const utilisateur = useSelector(state => state.utilisateur.value);

  const [activitesDisponibles, setActivitesDisponibles] = useState([]);
  const [type, setType] = useState(annonce.type);
  const [title, setTitle] = useState(annonce.title);
  const [description, setDescription] = useState(annonce.description);
  const [tempsMax, setTempsMax] = useState(annonce.tempsMax);
  const [experience, setExperience] = useState(annonce.experience);
  const [mode, setMode] = useState(annonce.mode);
  const [secteurActivite, setSecteurActivite] = useState(annonce.secteurActivite || []);
  const [disponibilite, setDisponibilite] = useState(annonce.disponibilite || []);
  const [ville, setVille] = useState(annonce.ville);
  const [latitude, setLatitude] = useState(annonce.latitude);
  const [longitude, setLongitude] = useState(annonce.longitude);
  const [afficherMessage, setAfficherMessage] = useState(false);
  const [isTypeModalVisible, setIsTypeModalVisible] = useState(false);
  const [isSecteurModalVisible, setIsSecteurModalVisible] = useState(false);
  const [isDispoModalVisible, setIsDispoModalVisible] = useState(false);
  const [isExperienceModalVisible, setIsExperienceModalVisible] = useState(false);
  const [isModeModalVisible, setIsModeModalVisible] = useState(false);
  const [isTempsModalVisible, setIsTempsModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const scrollViewRef = useRef(null);
  const [programme, setProgramme] = useState(annonce.programme || '');
  const [inputHeight, setInputHeight] = useState(40);

  useEffect(() => {
    fetch(`https://colab-backend-iota.vercel.app/profiles/activites`)
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

  const toggleDisponibilite = (value) => {
    if (disponibilite.includes(value)) {
      setDisponibilite(disponibilite.filter(item => item !== value));
    } else {
      setDisponibilite([...disponibilite, value]);
    }
  };

  const modifierAnnonce = () => {
    if (!type || !title || secteurActivite.length === 0 || !description || !tempsMax || !experience || !disponibilite || !ville || !latitude || !longitude || !mode) {
      setErrorMessage("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    setErrorMessage('');

    const annonceData = {
      annonceId: annonce._id,
      type,
      title: title.trim(),
      description: description.trim(),
      programme: programme.trim(),
      secteurActivite,
      mode,
      tempsMax,
      experience,
      disponibilite,
      ville,
      latitude,
      longitude,
    };

    fetch(`https://colab-backend-iota.vercel.app/annonces/modifier/${utilisateur.token}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(annonceData),
    })
      .then(response => response.json())
      .then(data => {
        if (data.result) {
          setAfficherMessage(true);
        } else {
          setErrorMessage("Erreur lors de la modification de l'annonce.");
        }
      })
      .catch(error => {
        setErrorMessage("Erreur lors de la connexion au serveur.");
        console.error("Erreur :", error.message);
      });
  };

  const cacherMessage = () => {
    setAfficherMessage(false);
    navigation.navigate('Utilisateur');
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
            data={[{ label: 'Je veux apprendre', value: 'Apprendre' }, { label: 'Je veux enseigner', value: 'Enseigner' }]}
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
                  { backgroundColor: disponibilite.includes(item.value) ? '#93DCDC' : 'white' }
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
  
  const renderModeModal = () => (
    <Modal visible={isModeModalVisible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <FlatList
            data={[
              { label: 'À distance', value: 'À distance' },
              { label: 'Rencontre réelle', value: 'Rencontre réelle' },
            ]}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => { setMode(item.value); setIsModeModalVisible(false); }} style={styles.modalItem}>
                <Text>{item.label}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity onPress={() => setIsModeModalVisible(false)} style={styles.modalClose}>
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

  const confirmerAnnulation = () => {
    Alert.alert(
      "Confirmation",
      "Êtes-vous sûr de vouloir annuler les modifications ? Les changements non sauvegardés seront perdus.",
      [
        {
          text: "Non",
          style: "cancel"
        },
        {
          text: "Oui",
          onPress: () => navigation.navigate("MesAnnonces")
        }
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="height" keyboardVerticalOffset={90}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView ref={scrollViewRef} nestedScrollEnabled={true} contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>  
            
            <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Modifier une annonce</Text>
          </View>

          <Text style={styles.titreCritere}>Type d'annonce</Text>
            <TouchableOpacity style={styles.saisie} onPress={() => setIsTypeModalVisible(true)}>
              <Text style={type ? styles.selectedText : styles.placeholderText}>
                {type || "Souhaitez vous apprendre ou enseigner ?"}
              </Text>
            </TouchableOpacity>

           
            <Text style={styles.titreCritere}>Titre</Text>
            <TextInput
              style={styles.saisie}
              placeholder="Pourquoi êtes vous ici ?"
              placeholderTextColor="#8E8E93"
              value={title}
              onChangeText={(text) => setTitle(text)}
            />
            
            <View style={styles.descriptionContainer}>
            <Text style={styles.titreDescription}>Description</Text>
              <TextInput
                  style={[styles.saisieDescription, { height: inputHeight }]} 
                  placeholder="Votre objectif, vos attentes, votre expérience, etc..."
                  value={description}
                  onChangeText={(text) => setDescription(text)}
                  multiline
                  onContentSizeChange={(event) => setInputHeight(event.nativeEvent.contentSize.height)} 
                  scrollEnabled={false}
              />

              <Text style={styles.titreProgramme}>Programme (optionnel)</Text>
              <TextInput
                style={styles.saisieProgramme}
                placeholder="Détaillez le programme si vous le souhaitez"
                value={programme}
                onChangeText={(text) => setProgramme(text)}
                multiline
              />
            </View>

            <View style={{ marginBottom: 10 }}>
              <Text style={styles.titreCritere}>Localisation</Text>
              <GeoAPIGouvAutocomplete onCitySelected={handleCitySelected} />
              {ville && (
                <View style={styles.villeContainer}>
                  <Text style={styles.selectedCity}>
                    <Text style={styles.selectedCity2}>{ville}</Text>
                  </Text>
                  <View  style={styles.supprimerContainer}>
                  <TouchableOpacity onPress={supprimerVille}>
                    <Text style={styles.supprimerVille}>Supprimer</Text>
                  </TouchableOpacity>
                  </View>
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

            <Text style={styles.titreCritere}>Catégorie</Text>
              <TouchableOpacity style={styles.saisie} onPress={() => setIsSecteurModalVisible(true)}>
                <Text style={secteurActivite.length > 0 ? styles.selectedText : styles.placeholderText}>
                  {secteurActivite.length > 0 ? secteurActivite[0] : "Quel est le domaine concerné ?"}
                </Text>
              </TouchableOpacity>
            
            <Text style={styles.titreCritere}>Expérience</Text>
              <TouchableOpacity style={styles.saisie} onPress={() => setIsExperienceModalVisible(true)}>
                <Text style={experience ? styles.selectedText : styles.placeholderText}>
                  {experience || "Quel est votre niveau dans le domaine"}
                </Text>
              </TouchableOpacity>

              <Text style={styles.titreCritere}>Lieu</Text>
              <TouchableOpacity style={styles.saisie} onPress={() => setIsModeModalVisible(true)}>
                <Text style={mode ? styles.selectedText : styles.placeholderText}>
                  {mode || "Quel mode d'apprentissage souhaitez vous ? "}
                </Text>
              </TouchableOpacity>

            <Text style={styles.titreCritere}>Disponibilités</Text>
              <TouchableOpacity style={styles.saisie} onPress={() => setIsDispoModalVisible(true)}>
                <Text style={disponibilite.length > 0 ? styles.selectedText : styles.placeholderText}>
                  {disponibilite.length > 0 ? disponibilite.join(', ') : "Quand êtes vous disponible ?"}
                </Text>
              </TouchableOpacity>

            <Text style={styles.titreCritere}>Temps moyen des séances</Text>
              <TouchableOpacity style={styles.saisie} onPress={() => setIsTempsModalVisible(true)}>
                <Text style={tempsMax ? styles.selectedText : styles.placeholderText}>
                  {tempsMax || "Choisissez le temps idéal pour vous"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.boutonEnvoyer} onPress={modifierAnnonce}>
                <Text style={styles.textEnvoyer}>Modifier l'annonce</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.boutonAnnuler}  onPress={confirmerAnnulation}>
                <Text style={styles.textEnvoyer}>Annuler les modifications</Text>
              </TouchableOpacity>
              {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

              <Modal
                animationType="fade"
                transparent={true}
                visible={afficherMessage}
                onRequestClose={() => {}}>
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContainerRegister}>
                    <Text style={styles.modalTextRegister}>L'annonce a été modifiée avec succès !</Text>
                    <TouchableOpacity style={styles.modalButtonRegister} onPress={cacherMessage}>
                      <Text style={styles.modalButtonTextRegister}>OK</Text>
                    </TouchableOpacity>
                  </View>
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
      {renderModeModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    safeAreaView: {
      flex: 1,
      backgroundColor: '#e5f6f6',
    },
    content: {
    },
    scrollContent: {
      paddingHorizontal: 20,
      paddingBottom: 50,
  
    },
    saisie: {
      backgroundColor:'white',
      borderRadius: 30,
      padding: 20,
      marginBottom: 20,
    },
    titleContainer: {
      alignItems: "center",
      marginBottom: 20,
    },
    titleText: {
      fontSize: 24,
      fontWeight: "bold",
      color:'#287777'
    },
  
    titreCritere: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 10,
      color:'#1F5C5C',
      textAlign:'center'
    },
    descriptionContainer: {
      backgroundColor: 'white',
      borderRadius: 30,
      padding: 20,
      marginBottom: 20,
    },
    titreDescription: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 10,
      color: '#1F5C5C',
      textAlign: 'left',
    },
    saisieDescription: {
      borderRadius: 10,
      padding: 10,
      height: 40,
      marginBottom: 10,
       textAlignVertical: 'top',
    },
    titreProgramme: {
      fontSize: 14,
      fontWeight: 'bold',
      marginTop: 10,
      color: '#1F5C5C',
      textAlign: 'left',
    },
    saisieProgramme: {
      borderRadius: 10,
      padding: 10,
      height: 40,
      textAlignVertical: 'top',
    },
    boutonEnvoyer: {
      backgroundColor: '#3CB371',
      padding: 15,
      borderRadius: 30,
      alignItems: 'center',
      marginTop:25,
      marginBottom: 10,
    },
    boutonAnnuler: {
        backgroundColor: '#FF6347',
        padding: 15,
        borderRadius: 30,
        alignItems: 'center',
        marginBottom: 10,
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
      color: '#8E8E93', 
    },
    errorText: {
      color: 'red',
      textAlign:'center',
      marginBottom: 10,
      fontSize: 14,
    },
    boutonVider: {
      backgroundColor: '#FF6347',
      padding: 15,
      borderRadius: 30,
      alignItems: 'center',
     
     
    },
    textVider: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
      backgroundColor: 'white',
      marginHorizontal: 20,
      borderRadius: 30,
      padding: 20,
      width: '80%', 
      maxHeight: '50%', 
      alignSelf: 'center', 
    },
    modalItem: {
      padding: 15,
      borderWidth: 1,
      marginVertical:2,
      borderColor: '#ddd',
      borderRadius:30,
      alignItems:'center'
    },
    modalClose: {
      marginTop: 20,
      padding: 10,
      backgroundColor: '#28A745',
      alignItems: 'center',
      borderRadius: 30,
    },
    map: {
      height: 200, 
      width: '100%',
      marginBottom: 20,
      borderRadius:30
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)', 
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainerRegister: {
      width: '80%',
      backgroundColor: '#fff',
      borderRadius: 15,
      padding: 20,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5,
    },
    modalTextRegister: {
      fontSize: 22,
      fontWeight: '600',
      textAlign: 'center',
      color: '#333',
      marginBottom: 20,
    },
    modalButtonRegister: {
      backgroundColor: '#28A745',
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 25,
      width: '50%',
      alignItems: 'center',
    },
    modalButtonTextRegister: {
      color: '#fff',
      fontSize: 18,
      fontWeight: '600',
    },
    villeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
      backgroundColor: 'white',
      borderRadius: 30, 
    },
    supprimerContainer: {
      backgroundColor: '#FF6347', 
      borderRadius: 15, 
      paddingVertical: 5,
      paddingHorizontal: 10,
    },
    supprimerVille: {
      color: 'white', 
      fontWeight: 'bold', 
      textAlign: 'center',
    },
    selectedCity: {
      padding:20,
      fontSize: 16,
      marginRight: 10,
    },
    selectedCity2: {
      fontSize: 20,
      color: 'blue',
    },
    separator:{
      marginBottom:30,
    },
  });
  