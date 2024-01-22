import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useDispatch, useSelector } from 'react-redux';
import { jePeux } from '../reducers/utilisateur';
import { jeVeux } from '../reducers/utilisateur';

export default function ActiviteScreen({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.utilisateur.value);
  const [selectedOffre, setSelectedOffre] = useState([]);
  const [offreOuvert, setOffreOuvert] = useState(false);
  const [selectedDemande, setSelectedDemande] = useState([]);
  const [demandeOuvert, setDemandeOuvert] = useState(false);
  const [activitesDisponibles, setActivitesDisponibles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Récupérer les activités disponibles depuis le backend
    fetch('http://10.215.12.147:3000/profiles/activites')
      .then(response => response.json())
      .then(data => {
        if (data && data.activites) {
          setActivitesDisponibles(data.activites);
        }
        setIsLoading(false); // Mettre fin au chargement
      });
  }, []);

  const handleEnregistrer = () => {
    const requestBody = {
      token: user.token,
      activites: selectedOffre,
    };

    // Envoyer les activités sélectionnées au backend
    fetch(`http://10.215.12.147:3000/profiles/jePeux`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    })
      .then(response => response.json())
      .then(data => {
        dispatch(jePeux(data.user));
      });

    const requestJeVeux = {
      token: user.token,
      activites: selectedDemande,
    };
    fetch(`http://10.215.12.147:3000/profiles/jeVeux`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestJeVeux),
    })
      .then(response => response.json())
      .then(data => {
        dispatch(jeVeux(data.user));
      });

    navigation.navigate('Profil');
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.welcomeText}>Félicitation{'\n'}Dernière étape !{'\n'}🎉</Text>

        {isLoading && <Text style={styles.loadingMsg}>Chargement des activités en cours...</Text>}
        {!isLoading && (
          <View>
            <View style={styles.offreContainer}>
              <Text style={styles.activityLabel}>Donnez votre aide ( 1 activité min.) :</Text>
              <DropDownPicker
                items={activitesDisponibles.map(activite => ({
                  label: activite,
                  value: activite,
                }))}
                open={offreOuvert}
                setOpen={() => setOffreOuvert(!offreOuvert)}
                value={selectedOffre}
                setValue={(value) => setSelectedOffre(value)}
                placeholder="Sélectionnez votre activité"
                showTickIcon={true}
                multiple={true}
                min={1}
                mode='BADGE'
                badgeColors={['#50B200', '#3A3960', '#C23B3B', '#4E98C2']}
                badgeDotColors={['white']}
                badgeTextStyle={{ color: 'white' }}
              />
            </View>

            <View style={styles.demandeContainer}>
              <Text style={styles.activityLabel}>Demandez de l'aide ( 1 activité min.) :</Text>
              <DropDownPicker
                items={activitesDisponibles && activitesDisponibles.map(activite => ({
                  label: activite,
                  value: activite,
                }))}
                open={demandeOuvert}
                setOpen={() => setDemandeOuvert(!demandeOuvert)}
                value={selectedDemande}
                setValue={(value) => setSelectedDemande(value)}
                placeholder="Sélectionnez votre activité"
                showTickIcon={true}
                multiple={true}
                min={1}
                mode='BADGE'
                badgeColors={['#50B200', '#3A3960', '#C23B3B', '#4E98C2']}
                badgeDotColors={['white']}
                badgeTextStyle={{ color: 'white' }}
              />
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.registerButton} onPress={() => handleEnregistrer()}>
                <Text style={styles.registerButtonText}>Valider mes choix</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  welcomeText: {
    justifyContent: 'center',
    marginTop: 45,
    textAlign: 'center',
    fontSize: 45,
  },
  loadingMsg: {
    justifyContent: 'center',
    marginTop: 45,
    textAlign: 'center',
    fontSize: 22,
    padding: 10,
    position: 'relative',
  },
  offreContainer: {
    alignItems: 'center',
    marginTop: 5,
    width: 350,
    zIndex: 100,
  },
  demandeContainer: {
    alignItems: 'center',
    width: 350,
    zIndex: 99,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  registerButton: {
    height: 55,
    width: 200,
    borderRadius: 12,
    marginTop: 150,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3A3960',
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 23,
  },
  activityLabel: {
    justifyContent: 'center',
    marginTop: 45,
    textAlign: 'center',
    fontSize: 22,
    padding: 10,
    position: 'relative',
  },
});

