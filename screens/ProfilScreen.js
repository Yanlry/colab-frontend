import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../reducers/utilisateur';

export default function ProfilScreen({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.utilisateur.value);
  const jePeux = useSelector((state) => state.utilisateur.jePeux);
  const jeVeux = useSelector((state) => state.utilisateur.jeVeux);
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


    fetch(`http://10.215.12.147:3000/profiles/bio`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then((data) => {
        Alert.alert(
          'Profil créé avec succès!',
          'Vous avez terminé de compléter votre profil. Veuillez vous authentifier pour débuter votre expérience Colab.',
          [
            {
              text: 'Retour',
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: () => {
                dispatch(logout());
                navigation.navigate('Connexion');
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
        // Gérer l'erreur si le fetch échoue
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
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Création de mon profil</Text>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
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

          <Text style={styles.label}>Votre n° de téléphone ne sera visible qu’en cas de collaboration</Text>
          <TextInput
            style={styles.input}
            defaultValue={user.phone}
            editable={false}
          />

          <Text style={styles.label}>Votre bio</Text>
          <TextInput style={styles.inputTextarea} multiline placeholder="Bio de l'utilisateur depuis le backend" onChangeText={handleBioChange} />

          <Text style={styles.label}>Genre</Text>
          <TextInput
            style={styles.input}
            defaultValue={user.sexe}
            editable={false}
          />

          <Text style={styles.label}>Je peux aider</Text>
          <TextInput
            style={styles.input}
            defaultValue={jePeux.join(', ')}
            editable={false}
          />

          <Text style={styles.label}>Je veux aider</Text>
          <TextInput
            style={styles.input}
            defaultValue={jeVeux.join(', ')}
            editable={false}
          />
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Activite')} style={styles.button}>
          <Text style={styles.buttonText}>Précédent</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleEnregistrer}>
          <Text style={styles.buttonText}>Terminer</Text>
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
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  titleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 20,
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
    width: '100%',
    alignItems: 'center',
  },
  infoContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    marginBottom: 5,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    width: '100%',
  },
  inputTextarea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    height: 120,
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
    paddingHorizontal: 40,
    paddingBottom: 20,
  },
  button: {
    backgroundColor: '#3A3960',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 80,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
