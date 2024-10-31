import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, Modal, Text, View, Button, FlatList, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function MapScreen({ navigation }) {
    
  const apiUrl = `${process.env.REACT_APP_MY_ADDRESS}`;

  const [annonces, setAnnonces] = useState([]);
  const [selectedAnnonces, setSelectedAnnonces] = useState([]);
  const [selectedCity, setSelectedCity] = useState(''); 
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchAnnonces = async () => {
      try {
        const response = await fetch('http://192.168.1.4:3000/annonces/annonces-localisation');
        const data = await response.json();
        setAnnonces(data.annonces || []);
      } catch (error) {
        console.error('Erreur lors de la récupération des annonces:', error);
      }
    };
    
    

    fetchAnnonces();
  }, []);

  const handleMarkerPress = (latitude, longitude, ville) => {
    const annoncesForLocation = annonces.filter(
      annonce => annonce.latitude === latitude && annonce.longitude === longitude
    );
    setSelectedAnnonces(annoncesForLocation);
    setSelectedCity(ville); 
    setModalVisible(true);
  };

  const handleAnnoncePress = (annonce) => {
    console.log("Annonce sélectionnée :", annonce); // Vérifie les données de l'annonce
    setModalVisible(false);
    navigation.navigate('AnnonceMap', { annonce }); // Redirige vers AnnonceMapScreen avec les détails de l'annonce
  };
  
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <MapView
  style={styles.map}
  initialRegion={{
    latitude: 46.603354,
    longitude: 1.888334,
    latitudeDelta: 8.5,
    longitudeDelta: 8.5,
  }}
>
  {annonces.map((annonce, index) => (
    annonce.latitude && annonce.longitude ? (
      <Marker
        key={index}
        coordinate={{
          latitude: annonce.latitude,
          longitude: annonce.longitude,
        }}
        onPress={() => handleMarkerPress(annonce.latitude, annonce.longitude, annonce.ville)}
      />
    ) : null
  ))}
</MapView>


      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Annonces situées à {selectedCity}</Text>
            <FlatList
              data={selectedAnnonces}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.annonceItem}>
                  <Text style={styles.modalText}>{item.title}</Text>
                  <TouchableOpacity
                    style={styles.viewButton}
                    onPress={() => handleAnnoncePress(item)} // Appelle handleAnnoncePress avec l'annonce sélectionnée
                  >
                    <Text style={styles.buttonText}>Voir l'annonce</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
            <Button title="Fermer" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  annonceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    flex: 1,
  },
  viewButton: {
    backgroundColor: '#007BFF',
    padding: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
  },
});
