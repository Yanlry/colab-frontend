import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Modal, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { teach } from '../reducers/utilisateur';
import { learn } from '../reducers/utilisateur';

export default function ActiviteScreen({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.utilisateur.value);
  const [selectedOffre, setSelectedOffre] = useState([]);
  const [selectedDemande, setSelectedDemande] = useState([]);
  const [activitesDisponibles, setActivitesDisponibles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [validationMessageOffre, setValidationMessageOffre] = useState('');
  const [validationMessageDemande, setValidationMessageDemande] = useState('');

  const [modalOffreVisible, setModalOffreVisible] = useState(false);
  const [modalDemandeVisible, setModalDemandeVisible] = useState(false);

  useEffect(() => {
    fetch('http://192.168.1.109:3000/profiles/activites')
      .then(response => response.json())
      .then(data => {
        if (data && data.activites) {
          setActivitesDisponibles(data.activites);
        }
        setIsLoading(false); 
      });
  }, []);

  const handleEnregistrer = async () => {
    if (selectedOffre.length === 0) {
      setValidationMessageOffre('Sélectionnez un domaine dans lequel vous pouvez donner votre aide.');
      return;
    }
    setValidationMessageOffre('');
  
    if (selectedDemande.length === 0) {
      setValidationMessageDemande('Sélectionnez un domaine dans lequel vous voulez recevoir de l\'aide.');
      return;
    }
    setValidationMessageDemande('');

    const requestBodyOffre = {
      token: user.token,
      activites: selectedOffre,
    };
  
    const requestBodyDemande = {
      token: user.token,
      activites: selectedDemande,
    };
  
    try {
      const responseOffre = await fetch(`http://192.168.1.109:3000/profiles/teach`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBodyOffre),
      });
      const dataOffre = await responseOffre.json();
      console.log('Réponse teach:', dataOffre);
      dispatch(teach(dataOffre.user));
  
      const responseDemande = await fetch(`http://192.168.1.109:3000/profiles/learn`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBodyDemande),
      });
      const dataDemande = await responseDemande.json();
      console.log('Réponse learn:', dataDemande);
      dispatch(learn(dataDemande.user));
  
      navigation.navigate('Profil');
    } catch (error) {
      console.error('Erreur lors de la résolution des requêtes fetch', error);
    }
  };

  const renderActiviteItem = ({ item, selectedItems, setSelectedItems }) => {
    const isSelected = selectedItems.includes(item);
    return (
      <TouchableOpacity
        style={[styles.activiteItem, isSelected && styles.activiteItemSelected]}
        onPress={() => {
          if (isSelected) {
            setSelectedItems(selectedItems.filter(activite => activite !== item));
          } else {
            setSelectedItems([...selectedItems, item]);
          }
        }}
      >
        <Text style={[styles.activiteText, isSelected && styles.activiteTextSelected]}>{item}</Text>
      </TouchableOpacity>
    );
  };

  const renderModal = (visible, setVisible, selectedItems, setSelectedItems) => (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => {
        if (selectedItems.length > 0) {
          setVisible(false);
        } else {
          alert('Veuillez sélectionner au moins une activité avant de fermer.');
        }
      }}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <FlatList
            data={activitesDisponibles}
            keyExtractor={(item) => item}
            renderItem={({ item }) =>
              renderActiviteItem({ item, selectedItems, setSelectedItems })
            }
          />
          {selectedItems.length > 0 && (
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setVisible(false)}
            >
              <Text style={styles.modalCloseButtonText}>Valider</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <Text style={styles.confirmationCreation}>On y est presque !</Text>
          <Text style={styles.welcomeText}> Choisissez <Text style={styles.boldText}>au moins une</Text> compétence à apprendre et <Text style={styles.boldText}>au moins une</Text> autre à partager pour faire grandir la communauté !</Text>

          {isLoading && <Text style={styles.loadingMsg}>Chargement des activités en cours...</Text>}
          {!isLoading && (
            <View>
              <View style={styles.offreContainer}>
                <Text style={styles.activityLabel}>Que pouvez-vous enseigner ?</Text>
                <TouchableOpacity style={styles.modalButton} onPress={() => setModalOffreVisible(true)}>
                  <Text style={styles.modalButtonText}>{selectedOffre.length > 0 ? `${selectedOffre.length} activité(s) sélectionnée(s)` : 'Sélectionnez votre activité'}</Text>
                </TouchableOpacity>
                <Text style={styles.validationMessageOffre}>{validationMessageOffre}</Text>
              </View>

              <View style={styles.demandeContainer}>
                <Text style={styles.activityLabel}>Que voulez-vous apprendre ?</Text>
                <TouchableOpacity style={styles.modalButton} onPress={() => setModalDemandeVisible(true)}>
                  <Text style={styles.modalButtonText}>{selectedDemande.length > 0 ? `${selectedDemande.length} activité(s) sélectionnée(s)` : 'Sélectionnez votre activité'}</Text>
                </TouchableOpacity>
                <Text style={styles.validationMessageDemande}>{validationMessageDemande}</Text>
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.registerButton}
                  onPress={() => {
                    if (selectedOffre.length === 0 && selectedDemande.length === 0) {
                      alert('Choisissez d\'abord vos activités.');
                    } else {
                      handleEnregistrer();
                    }
                  }}
                >
                  <Text style={styles.registerButtonText}>Valider mes choix</Text>
                </TouchableOpacity>
              </View>

              {renderModal(modalOffreVisible, setModalOffreVisible, selectedOffre, setSelectedOffre)}
              {renderModal(modalDemandeVisible, setModalDemandeVisible, selectedDemande, setSelectedDemande)}
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: '#e5f6f6', // Couleur de fond légèrement grise pour une apparence douce
  },
  container: {
    flex: 1,
    padding: 20,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', // Alignement centré pour une mise en page plus équilibrée
  },
  confirmationCreation: {
    fontSize: 60, // Augmentation de la taille de la police pour une meilleure lisibilité
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 65, // Un peu plus d'espace pour aérer la mise en page
    color: '#287777', // Couleur de texte cohérente avec les boutons
  },
  welcomeText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    color: '#333', // Couleur de texte plus douce pour améliorer la lisibilité
  },
  boldText: {
    fontWeight: 'bold',
    color: '#287777', // Couleur qui correspond aux éléments interactifs
  },
  loadingMsg: {
    textAlign: 'center',
    fontSize: 16,
    color: '#287777',
    marginBottom: 20,
  },
  offreContainer: {
    marginBottom: 20,
    width: '100%', // Prendre toute la largeur pour un alignement plus propre
  },
  demandeContainer: {
    marginBottom: 20,
    width: '100%',
  },
  activityLabel: {
    textAlign:'center',
    fontSize: 18, // Texte légèrement plus grand pour attirer l'attention sur les labels
    marginBottom: 10,
    color:'#1F5C5C',
    fontWeight: '600', // Meilleure emphase sur les labels
  },
  modalButton: {
    backgroundColor: '#287777',
    paddingVertical: 20, // Augmenter la hauteur
    paddingHorizontal: 30, // Augmenter la largeur
    borderRadius: 30, 
    alignItems: 'center',
    width: 300,
    maxWidth: 350, // Largeur maximale augmentée
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 18, // Taille de la police augmentée
    fontWeight: 'bold',
  },
  
  validationMessageOffre: {
    color: 'red',
    marginTop: 5,
    fontSize: 14, // Taille réduite pour les messages d'erreur
  },
  validationMessageDemande: {
    color: 'red',
    marginTop: 5,
    fontSize: 14,
  },
  buttonContainer: {
    marginTop: 20, 
    alignItems:'center',
  },
  registerButton: {
    backgroundColor: '#3CB371',
    marginTop:40,
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
    width:'80%'
  },
  registerButtonText: {
    color: 'white',
    fontSize: 18, // Augmentation de la taille de police pour le bouton d'action principal
    fontWeight: 'bold',
    width:270,
    textAlign:'center',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Arrière-plan transparent pour le modal
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    maxHeight: '60%', // Réduire la hauteur max du modal pour un meilleur focus
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  modalCloseButton: {
    marginTop: 20,
    backgroundColor: '#3CB371',
    padding: 12, // Padding légèrement augmenté pour plus de confort
    borderRadius: 30,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  activiteItem: {
    padding: 15,
    backgroundColor: 'white',
    marginVertical: 4,
    borderRadius: 30, // Coins plus arrondis pour un design plus moderne
    borderWidth: 1,
    borderColor: '#ccc', // Légère bordure pour mieux distinguer les éléments
    alignItems:'center'
  },
  activiteItemSelected: {
    backgroundColor: '#287777',
  },
  activiteText: {
    color: '#333',
  },
  activiteTextSelected: {
    color: 'white',
    fontWeight: 'bold', // Mettre en évidence le texte des éléments sélectionnés
  },
});
