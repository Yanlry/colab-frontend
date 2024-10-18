import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import * as ImagePicker from 'expo-image-picker';
import { useSelector } from 'react-redux';

export default function ModifierProfilScreen({ navigation }) {
  const user = useSelector((state) => state.utilisateur.value);
  const [offre, setOffre] = useState([]);
  const [offreOuvert, setOffreOuvert] = useState(false);
  const [demande, setDemande] = useState([]);
  const [demandeOuvert, setDemandeOuvert] = useState(false);
  const [activitesDisponibles, setActivitesDisponibles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(null);

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

  const handleEnregistrer = () => {
    
    fetch(`http://192.168.1.109:3000/profiles/jePeux/${user.token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ activites: offre }),
    });

    fetch(`http://192.168.1.109:3000/profiles/jeVeux/${user.token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ activites: demande }),
    });

    navigation.goBack();
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
    <View style={localStyles.container}>
      <View style={localStyles.titleContainer}>
        <Text style={localStyles.titleText}>Modifier mon profil</Text>
      </View>

      <View style={localStyles.contentContainer}>
        <View style={localStyles.profileImageContainer}>
          {profileImage ? (
            <TouchableOpacity onPress={selectImage}>
              <Image source={{ uri: profileImage }} style={localStyles.profileImage} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={selectImage} style={localStyles.imageUploadContainer}>
              <Text>Choisir une photo de profil</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={localStyles.infoContainer}>
          <Text style={localStyles.label}>Nom d'utilisateur</Text>
          <View style={localStyles.inputContainer}>
            <TextInput
              style={localStyles.input}
              defaultValue={user.username}
              editable={false}
            />
          </View>
        </View>

        {isLoading ? (
          <Text style={localStyles.conditionMsg}>Chargement des activités en cours...</Text>
        ) : (
          <View>
            <View style={localStyles.listeOffre}>
              <Text style={localStyles.label}>Donnez votre aide (1 activité min.) :</Text>
              <DropDownPicker
                items={activitesDisponibles.map(activite => ({
                  label: activite,
                  value: activite,
                }))}
                open={offreOuvert}
                setOpen={() => setOffreOuvert(!offreOuvert)}
                value={offre}
                setValue={(value) => setOffre(value)}
                placeholder="Selectionnez votre activité"
                showTickIcon={true}
                multiple={true}
                min={1}
                mode='BADGE'
                badgeColors={['#50B200', '#3A3960', '#C23B3B', '#4E98C2']}
                badgeDotColors={['white']}
                badgeTextStyle={{ color: 'white' }}
              />
            </View>

            <View style={localStyles.listeDemande}>
              <Text style={localStyles.label}>Demandez de l'aide (1 activité min.) :</Text>
              <DropDownPicker
                items={activitesDisponibles.map(activite => ({
                  label: activite,
                  value: activite,
                }))}
                open={demandeOuvert}
                setOpen={() => setDemandeOuvert(!demandeOuvert)}
                value={demande}
                setValue={(value) => setDemande(value)}
                placeholder="Selectionnez votre activité"
                showTickIcon={true}
                multiple={true}
                min={1}
                mode='BADGE'
                badgeColors={['#50B200', '#3A3960', '#C23B3B', '#4E98C2']}
                badgeDotColors={['white']}
                badgeTextStyle={{ color: 'white' }}
              />
            </View>
          </View>
        )}
      </View>

      <View style={localStyles.buttonContainer}>
        <TouchableOpacity style={localStyles.button} onPress={() => navigation.goBack()}>
          <Text style={localStyles.buttonText}>Précédent</Text>
        </TouchableOpacity>
        <TouchableOpacity style={localStyles.button} onPress={() => handleEnregistrer()}>
          <Text style={localStyles.buttonText}>Terminer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },

// ------------------- TITRE ---------------------

  titleContainer: {
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 130,
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
  },

// ------------------- PHOTO DE PROFIL ---------------------
  
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
  },

// ------------------- NOM D'UTILISATEUR ---------------------

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
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    width: '100%',
  },

// ------------------- MESSAGE DE CHARGEMENT DES LISTES ---------------------

  conditionMsg: {
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: 22,
    padding: 10,
  },

// ------------------- MES LISTES ---------------------

  listeOffre: {
    alignItems: 'center',
    marginTop: 30,
    width: '100%',
    zIndex: 999,
  },
  listeDemande: {
    alignItems: 'center',
    width: '100%',
    marginTop: 40,
  },

// ------------------- BOUTTONS PRECEDENT ET TERMINER ---------------------

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  button: {
    backgroundColor: '#3A3960',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});
