import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, Modal, FlatList } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useSelector } from 'react-redux';

export default function ModifierProfilScreen({ navigation }) {

  const user = useSelector((state) => state.utilisateur.value);

  const [learn, setLearn] = useState([]); 
  const [teach, setTeach] = useState([]); 
  const [activitesDisponibles, setActivitesDisponibles] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const [isLearnModalVisible, setIsLearnModalVisible] = useState(false);
  const [isTeachModalVisible, setIsTeachModalVisible] = useState(false);
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
  
  const selectImage = async () => {
    const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!cancelled) {
      setProfileImage(uri);
    }
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Modifier mon profil</Text>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.profileImageContainer}>
          {profileImage ? (
            <TouchableOpacity onPress={selectImage}>
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={selectImage} style={styles.imageUploadContainer}>
              <Text>Choisir une photo de profil</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Nom d'utilisateur</Text>
          <TextInput
            style={styles.input}
            defaultValue={user.username}
            editable={false}
          />
        </View>

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

      {renderLearnModal()}
      {renderTeachModal()}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Valider</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileImageContainer: {
    marginBottom: 20,
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
    marginBottom:40
  },
  infoContainer: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 5,
    marginTop:10,
    fontWeight: 'bold',
    textAlign:'center',
    color:'#1F5C5C'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 'auto',
    paddingHorizontal: 20,
    paddingBottom: 40,

  },
  button: {
    width:200,
    backgroundColor: '#287777',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonList: {
    backgroundColor: '#287777',
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginTop:10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign:'center'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical:150
  },
  modalContent: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 5,
    padding: 20,
    width: '80%',
    alignSelf: 'center',
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  modalClose: {
    marginTop: 4,
    padding: 10,
    backgroundColor: '#28A745',
    alignItems: 'center',
    borderRadius: 5,
  },
  listLearnTeach:{
    marginTop:50
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  activitySelected:{
    color:'white',
    marginBottom: 5,
    marginTop:10,
    fontWeight: 'bold',
    textAlign:'center',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    textAlign: 'center',
    marginTop:5
    
  },
});
