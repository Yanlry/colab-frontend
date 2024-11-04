import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, Modal, Text, View, FlatList, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function MapScreen({ navigation }) {

  const [annonces, setAnnonces] = useState([]);
  const [selectedAnnonces, setSelectedAnnonces] = useState([]);
  const [selectedCity, setSelectedCity] = useState(''); 
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchAnnonces = async () => {
      try {
        const response = await fetch('https://colab-backend-iota.vercel.app/annonces/annonces-localisation');
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
    setModalVisible(false);
    navigation.navigate('AnnonceMap', { annonce });
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
        animationType="fade"
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
                    onPress={() => handleAnnoncePress(item)}
                  >
                    <Text style={styles.buttonText}>VOIR</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Fermer</Text>
            </TouchableOpacity>
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
    width: '95%',
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  annonceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalText: {
    fontSize: 16,
    paddingRight:5,
    textAlign:'center',
    flex: 1,
    color: '#333',
  },
  viewButton: {
    backgroundColor: '#2874A6',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight:'bold',
    fontSize: 14,
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: '#d9534f',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignSelf: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    fontWeight:'bold'
  },
});
