import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput,Image, Alert,  KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback, SafeAreaView} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch, useSelector } from 'react-redux';

export default function ProfilScreen({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.utilisateur.value);

  const teach = useSelector((state) => state.utilisateur.teach);
  const learn = useSelector((state) => state.utilisateur.learn);
  const [profileImage, setProfileImage] = useState(null);
  const [bio, setBio] = useState('');


  const handleBioChange = (text) => {
    setBio(text);
  };

  const handleEnregistrer = () => {
    const requestBody = {
      token: user.token,
      bio: bio,
    };


    fetch(`http://192.168.1.109:3000/profiles/bio`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then((data) => {
        Alert.alert(
          'Profil créé avec succès!',
          'Vous avez terminé de compléter votre profil.',
          [
            {
              text: 'Retour',
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: () => {
                navigation.navigate('TabNavigator');
              },
            },
          ],
          {
            cancelable: false,
          }
        );
      })
      .catch((error) => {
        console.error('Erreur lors de la mise à jour du profil:', error);
      });
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
    <SafeAreaView style={styles.safeAreaView}>
      <KeyboardAvoidingView>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <View style={styles.titleContainer}>
              <Text style={styles.titleText}>Récapitulatif du profil</Text>
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
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    defaultValue={user.username}
                    editable={false}
                  />
                </View>

                <Text style={styles.label}>Téléphone</Text>
                <TextInput
                  style={styles.inputPhone}
                  defaultValue={user.phone}
                  editable={false}
                />

                <Text style={styles.label}>Votre bio</Text>
                <TextInput style={styles.inputTextarea} multiline placeholder="Toucher pour écrire ( 3000. caractére max. )" onChangeText={handleBioChange} />

                <Text style={styles.label}>Je peux aider</Text>
                <TextInput
                  style={styles.inputJP}
                  defaultValue={teach ? teach.join(', ') : ''}
                  editable={false}
                />

                <Text style={styles.label}>Je veux aider</Text>
                <TextInput
                  style={styles.input}
                  defaultValue={learn ? learn.join(', ') : ''}
                  editable={false}
                />
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={() => navigation.navigate('Activite')} style={styles.button}>
                <Text style={styles.buttonText}>Précédent</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={handleEnregistrer}>
                <Text style={styles.buttonText}>Terminer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor:'#fff',
    alignItems: 'center',
  },
// ------------------- TITRE ---------------------

  titleContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
  },

// ------------------- IMAGE DE PROFIL ---------------------

  profileImageContainer: {
    marginBottom: 25,
    marginTop:75,
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

// ------------------- CHAMPS DE SAISIE---------------------

  label: {
    marginBottom: 5,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    height:50,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    width:350
  },
  inputPhone:{
    borderWidth: 1,
    height:50,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom:10,
    padding: 12,
    width:350
  },
  inputJP: {
    borderWidth: 1,
    height:50,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom:10,

    padding: 12,
    width:350
  },
  infoContainer: {
    marginBottom: 20,
},
  inputTextarea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    height: 120,
  },

// ------------------- BOUTTON PRECEDENT ET TERMINER ---------------------

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom:55,
    height:50
  },
  button: {
    backgroundColor: '#287777',
    borderRadius: 10,
    justifyContent:'center',
    width:150
  },
  buttonText: {
  textAlign: 'center',
  color: 'white',
  fontSize: 20,
  },
});

