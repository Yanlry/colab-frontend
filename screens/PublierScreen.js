import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useSelector } from 'react-redux';

export default function PublierScreen({ navigation }) {

  const utilisateur = useSelector(state => state.utilisateur.value);

  const [activitesDisponibles, setActivitesDisponibles] = useState([]);
  const [offreOuvert, setOffreOuvert] = useState(false);

  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tempsMax, setTempsMax] = useState('');
  const [experience, setExperience] = useState('');
  const [secteurActivite, setSecteurActivite] = useState([])
  const [disponibilite, setDisponibilite] = useState('')

  const [afficherMessage, setAfficherMessage] = useState(false);

  useEffect(() => {
    fetch('http://10.215.12.147:3000/profiles/activites')
      .then(response => response.json())
      .then(data => {
        if (data && data.activites) {
          setActivitesDisponibles(data.activites);
        }
      });
  }, []);

  const envoyerDonnee = () => {
    if (!type || !title || !secteurActivite.length === 0 || !description || !tempsMax || !experience || !disponibilite) {
      return;
    }

    const annonceData = {
      type: type,
      title: title,
      description: description,
      secteurActivite: secteurActivite,
      tempsMax: tempsMax,
      experience: experience,
      disponibilite: disponibilite,
      date: new Date(),
    };

    fetch(`http://10.215.12.147:3000/annonces/publier/${utilisateur.token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(annonceData),
    })
      .then(response => response.json())
      .then(data => {
        setAfficherMessage(true);
      });
  };

  const cacherMessage = () => {
    setAfficherMessage(false);
    setType('');
    setTitle('');
    setDescription('');
    setTempsMax('');
    setExperience('');
    setDisponibilite('')
    navigation.navigate('Accueil');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.titre}>Publier une annonce</Text>
        <Text style={styles.titreCritere}>Titre</Text>
        <TextInput
          style={styles.saisie}
          placeholder="Titre de l'annonce"
          value={title}
          onChangeText={(text) => setTitle(text)}
        />
        <Text style={styles.titreCritere}>Type d'annonce</Text>
        <TextInput
          style={styles.saisie}
          placeholder="Choississez entre : Offre ou Demande"
          value={type}
          onChangeText={(text) => setType(text)}
        />
        <Text style={styles.titreCritere}>Secteur d'activités</Text>
        <DropDownPicker
          items={activitesDisponibles.map(activite => ({
            label: activite,
            value: activite,
          }))}
          open={offreOuvert}
          setOpen={() => setOffreOuvert(!offreOuvert)}
          value={secteurActivite}
          setValue={(values) => setSecteurActivite(values)}
          placeholder="Selectionnez votre activité"
          showTickIcon={true}
          multiple={true}
          min={1}
          max={1}
          mode='BADGE'
          badgeColors={['#50B200', '#3A3960', '#C23B3B', '#4E98C2']}
          badgeDotColors={['white']}
          badgeTextStyle={{ color: 'white' }}
        />
        <Text style={styles.titreDescription}>Description</Text>
        <TextInput
          style={styles.saisieDescription}
          placeholder="Description de l'annonce"
          value={description}
          onChangeText={(text) => setDescription(text)}
          multiline
        />
        <Text style={styles.titreCritere}>Expérience en années</Text>
        <TextInput
          style={styles.saisie}
          placeholder="Votre niveau ou le niveau que vous recherchez ?"
          value={experience}
          onChangeText={(text) => setExperience(text)}
          keyboardType="numeric"
        />
        <Text style={styles.titreCritere}>Vos disponibilité</Text>
        <TextInput
          style={styles.saisie}
          placeholder="Vos disponibilite : Semaine , soir , ou Week-end ?"
          value={disponibilite}
          onChangeText={(text) => setDisponibilite(text)}
        />
        <Text style={styles.titreCritere}>Temps par semaine</Text>
        <TextInput
          style={styles.saisie}
          placeholder="Temps a consacrer par semaine ?"
          value={tempsMax}
          onChangeText={(text) => setTempsMax(text)}
          keyboardType="numeric"
        />


        <TouchableOpacity style={styles.publierButton} onPress={() => envoyerDonnee()}>
          <Text style={styles.publierButtonText}>Publier</Text>
        </TouchableOpacity>
      </View>
      {afficherMessage && (
        <View style={styles.messageValidation}>
          <View style={styles.annonceCree}>
            <Text style={styles.annonceCreeText}>Annonce créée avec succès !</Text>

            <TouchableOpacity style={styles.okButton} onPress={() => cacherMessage()}>
              <Text style={styles.okButtonText}>Retour a l'accueil</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    padding: 20,
  },
  titreCritere: {
    fontSize: 16,
    color: '#3A3960',
  },
  titre: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#3A3960',
  },
  titreDescription: {
    fontSize: 16,
    marginTop: 10,
    color: '#3A3960',
  },
  saisie: {
    borderWidth: 1,
    borderColor: '#D1D1D1',
    borderRadius: 8,
    height: 45,
    padding: 10,
    marginBottom: 10,
    width: '100%',
  },
  saisieDescription: {
    borderWidth: 1,
    borderColor: '#D1D1D1',
    borderRadius: 8,
    height: 95,
    padding: 10,
    marginBottom: 10,
    width: '100%',
  },
  publierButton: {
    width: 200,
    height: 40,
    backgroundColor: '#3A3960',
    padding: 10,
    justifyContent: 'center',
    borderRadius: 5,
  },
  publierButtonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  messageValidation: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  annonceCree: {
    position: 'absolute',
    borderWidth: 1,
    height: 250,
    width: 330,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingBottom: 40,
  },
  annonceCreeText: {
    textAlign: 'center',
    fontSize: 23,
    margin: 45,
  },
  okButton: {
    borderWidth: 1,
    backgroundColor: '#3A3960',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    height: 50,
    width: 150,
  },
  okButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
