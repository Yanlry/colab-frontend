import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, SafeAreaView, Modal, FlatList, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';

export default function ProfilScreen({ navigation }) {

  const user = useSelector((state) => state.utilisateur.value);


  const [bio, setBio] = useState('');
  const [isLearnModalVisible, setIsLearnModalVisible] = useState(false);
  const [isTeachModalVisible, setIsTeachModalVisible] = useState(false);
  const [activitesDisponibles, setActivitesDisponibles] = useState(['Mathématiques', 'Physique', 'Programmation', 'Musique']);
  const [username, setUsername] = useState(user.username); 
  const [phone, setPhone] = useState(user.phone); 
  const [learn, setLearn] = useState([]); 
  const [teach, setTeach] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  
  useEffect(() => {
    // Récupérer toutes les activités disponibles
    fetch('http://192.168.1.109:3000/profiles/activites')
      .then(response => response.json())
      .then(data => {
        if (data && data.activites) {
          setActivitesDisponibles(data.activites);
        }
      });
  
    // Récupérer les informations de profil de l'utilisateur
    fetch(`http://192.168.1.109:3000/users/profile/${user.token}`)
      .then(response => response.json())
      .then(data => {
        if (data.result) {
          // Mettre à jour l'état avec les données récupérées
          setBio(data.profile.bio || '');
          setPhone(data.profile.phone || '');
          setUsername(data.profile.username || '');
        } else {
          console.error('Erreur lors de la récupération des informations de profil:', data.error);
        }
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des informations de profil:', error);
      });
  
    // Récupérer les activités sélectionnées par l'utilisateur
    fetch(`http://192.168.1.109:3000/annonces/activites/${user.token}`)
      .then(response => response.json())
      .then(data => {
        if (data.result) {
          setTeach(data.teach); // Activités que l'utilisateur enseigne
          setLearn(data.learn); // Activités que l'utilisateur apprend
        }
        setIsLoading(false); // Arrêter le chargement une fois les données récupérées
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des activités de l\'utilisateur:', error);
        setIsLoading(false);
      });
  }, []);
  
  const renderLearnModal = () => {
    const currentCategoriesHeight = Math.min(learn.length * 50, 200); // Calculer la hauteur en fonction du nombre d'éléments sélectionnés
    const availableCategoriesHeight = Math.min(
      (activitesDisponibles.length - learn.length) * 50,
      400
    );

    return (
      <Modal visible={isLearnModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Catégories actuelles</Text>
            <FlatList
              style={[styles.activitySelected, { height: currentCategoriesHeight }]}
              data={learn}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => toggleLearnSelection(item)}
                  style={[styles.modalItem, { backgroundColor: learn.includes(item) ? '#93DCDC' : 'white' }]}
                >
                  <Text>{item}</Text>
                </TouchableOpacity>
              )}
            />

            <Text style={styles.modalTitle}>Autres catégories</Text>
            <FlatList
              style={{ height: availableCategoriesHeight }}
              data={activitesDisponibles.filter((activite) => !learn.includes(activite))}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => toggleLearnSelection(item)}
                  style={[styles.modalItem, { backgroundColor: learn.includes(item) ? '#93DCDC' : 'white' }]}
                >
                  <Text>{item}</Text>
                </TouchableOpacity>
              )}
            />

            {/* Afficher le message d'erreur si nécessaire */}
            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}

            <TouchableOpacity style={styles.modalClose} onPress={handleSaveLearn}>
              <Text style={{ color: 'white' }}>Valider</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  const renderTeachModal = () => {
    const currentCategoriesHeight = Math.min(teach.length * 50, 200); // Calculer la hauteur en fonction du nombre d'éléments sélectionnés
    const availableCategoriesHeight = Math.min(
      (activitesDisponibles.length - teach.length) * 50,
      400
    );

    return (
      <Modal visible={isTeachModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Catégories actuelles</Text>
            <FlatList
              style={[styles.activitySelected, { height: currentCategoriesHeight }]}
              data={teach}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => toggleTeachSelection(item)}
                  style={[styles.modalItem, { backgroundColor: teach.includes(item) ? '#93DCDC' : 'white' }]}
                >
                  <Text>{item}</Text>
                </TouchableOpacity>
              )}
            />

            <Text style={styles.modalTitle}>Autres catégories</Text>
            <FlatList
              style={{ height: availableCategoriesHeight }}
              data={activitesDisponibles.filter((activite) => !teach.includes(activite))}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => toggleTeachSelection(item)}
                  style={[styles.modalItem, { backgroundColor: teach.includes(item) ? '#93DCDC' : 'white' }]}
                >
                  <Text>{item}</Text>
                </TouchableOpacity>
              )}
            />

            {/* Afficher le message d'erreur si nécessaire */}
            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}

            <TouchableOpacity style={styles.modalClose} onPress={handleSaveTeach}>
              <Text style={{ color: 'white' }}>Valider</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  const toggleLearnSelection = (activity) => {
    if (learn.includes(activity)) {
      setLearn(learn.filter(item => item !== activity)); // Retirer si déjà sélectionné
    } else {
      setLearn([...learn, activity]); // Ajouter si pas encore sélectionné
    }
  };

  const toggleTeachSelection = (activity) => {
    if (teach.includes(activity)) {
      setTeach(teach.filter(item => item !== activity)); // Retirer si déjà sélectionné
    } else {
      setTeach([...teach, activity]); // Ajouter si pas encore sélectionné
    }
  };

  const handleSaveLearn = () => {
    if (learn.length === 0) {
      setErrorMessage('Veuillez choisir au moins une catégorie avant de valider.');
      return;
    }
  
    // Si l'utilisateur a sélectionné une catégorie, on continue le processus
    setErrorMessage(''); // Réinitialiser le message d'erreur si tout est correct
  
    fetch(`http://192.168.1.109:3000/profiles/learn`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: user.token, activites: learn }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.result) {
          console.log('Activités "learn" mises à jour avec succès');
          setIsLearnModalVisible(false); // Fermer le modal après validation
        } else {
          console.error('Erreur lors de la mise à jour des activités "learn":', data.error);
        }
      })
      .catch(error => console.error('Erreur lors de la mise à jour des activités "learn":', error));
  };

  const handleSaveTeach = () => {
    if (teach.length === 0) {
      setErrorMessage('Veuillez choisir au moins une catégorie avant de valider.');
      return;
    }
  
    // Si l'utilisateur a sélectionné une catégorie, on continue le processus
    setErrorMessage(''); // Réinitialiser le message d'erreur si tout est correct
  
    fetch(`http://192.168.1.109:3000/profiles/teach`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: user.token, activites: teach }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.result) {
          console.log('Activités "teach" mises à jour avec succès');
          setIsTeachModalVisible(false); // Fermer le modal après validation
        } else {
          console.error('Erreur lors de la mise à jour des activités "teach":', data.error);
        }
      })
      .catch(error => console.error('Erreur lors de la mise à jour des activités "teach":', error));
  };  
  
  const handleBioChange = (text) => {
    setBio(text);
  };
  
  const handleValider = () => {
    if (!bio.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer une bio avant de continuer.');
      return;
    }

    const requestBody = {
      token: user.token,
      username: username,
      phone: phone,
      bio: bio,
    };

    fetch('http://192.168.1.109:3000/users/updateProfile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    })
      .then(response => response.json())
      .then(data => {
        if (data.result) {
          Alert.alert(
            'Profil mis à jour avec succès!',
            'Votre profil a été mis à jour.',
            [
              {
                text: 'OK',
                onPress: () => {
                  navigation.navigate('TabNavigator', { screen: 'Accueil' });
                }
                
              },
            ],
            {
              cancelable: false,
            }
          );
        } else {
          Alert.alert('Erreur', data.error || 'Erreur lors de la mise à jour du profil');
        }
      })
      .catch(error => {
        console.error('Erreur lors de la mise à jour du profil:', error);
        Alert.alert('Erreur', 'Une erreur est survenue lors de la mise à jour du profil');
      });
  };

return (
    <SafeAreaView style={styles.safeAreaView}>
      <KeyboardAvoidingView behavior={null} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.container}>
            <View style={styles.titleContainer}>
              <Text style={styles.titleText}>Mon profil</Text>
            </View>

            <View style={styles.contentContainer}>
            <View style={styles.infoContainer}>
                <Text style={styles.label}>Nom d'utilisateur</Text>
                <TextInput
                  style={styles.input}
                  value={username}
                  onChangeText={setUsername}
                />

                <Text style={styles.label}>Téléphone</Text>
                <TextInput
                  style={styles.inputPhone}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />

                <Text style={styles.label}>Votre bio</Text>
                <TextInput
                  style={styles.inputTextarea}
                  multiline
                  placeholder="Toucher pour écrire (3000 caractères max.)"
                  onChangeText={handleBioChange}
                  value={bio}
                />

              {isLoading ? (
                          <Text style={styles.conditionMsg}>Chargement des activités en cours...</Text>
                        ) : (
                          <View style={styles.listLearnTeach}>
                            <View style={styles.listeLearn}>
                              <Text style={styles.label}>Que pouvez voulez vous apprendre ?</Text>
                              <TouchableOpacity onPress={() => setIsLearnModalVisible(true)} style={styles.buttonList}>
                                <Text style={styles.activitySelected}>
                                  {learn.length > 0 ? `${learn.length} activité${learn.length > 1 ? 's' : ''} choisie${learn.length > 1 ? 's' : ''}` : 'Sélectionnez vos activités à apprendre'}
                                </Text>
                              </TouchableOpacity>
                            </View>

                            <View style={styles.listeTeach}>
                              <Text style={styles.label}>Que pouvez vous nous enseignez ?</Text>
                              <TouchableOpacity onPress={() => setIsTeachModalVisible(true)} style={styles.buttonList}>
                                <Text style={styles.activitySelected}>
                                  {teach.length > 0 ? `${teach.length} activité${teach.length > 1 ? 's' : ''} choisie${teach.length > 1 ? 's' : ''}` : 'Sélectionnez vos activités à enseigner'}
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        )}
              </View>          
            </View>

            {renderLearnModal()}
            {renderTeachModal()}
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={handleValider}>
                <Text style={styles.buttonText}>Valider</Text>
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      {renderLearnModal()}
      {renderTeachModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  contentContainer:{
    padding:20
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileImageContainer: {
    marginBottom: 25,
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  imageUploadContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  label: {
    marginBottom: 5,
    fontWeight: 'bold',
    color: '#1F5C5C',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    height: 50,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom:20,
    width: 330,
  },
  inputPhone: {
    borderWidth: 1,
    height: 50,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom:20,
    
    padding: 12,
  },
  inputTextarea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom:20,
    
    height: 120,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
    height: 50,
    
  },
  button: {
    backgroundColor: '#3CB371',
    borderRadius: 10,
    justifyContent: 'center',
    width: 200,
    paddingVertical: 15,
    alignItems: 'center',
    
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 20,
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
    width: '80%',
    maxHeight: '80%',
    alignSelf: 'center',
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
  
  listLearnTeach:{
  },
  activitySelected:{
    color:'white',
    marginBottom: 5,
    marginTop:10,
    fontWeight: 'bold',
    textAlign:'center',
  },
  buttonList: {
    backgroundColor: '#287777',
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginTop:10,
    marginBottom:20,
    borderRadius: 8,
  },
});
