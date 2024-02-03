import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView  } from 'react-native';
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

  const [validationMessageOffre, setValidationMessageOffre] = useState('');
  const [validationMessageDemande, setValidationMessageDemande] = useState('');

  useEffect(() => {
    
    fetch('http://192.168.1.9:3000/profiles/activites')
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
      const responseOffre = await fetch(`http://192.168.1.9:3000/profiles/jePeux`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBodyOffre),
      });
      const dataOffre = await responseOffre.json();
      console.log('Réponse jePeux:', dataOffre);
      dispatch(jePeux(dataOffre.user));
  
      const responseDemande = await fetch(`http://192.168.1.9:3000/profiles/jeVeux`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBodyDemande),
      });
      const dataDemande = await responseDemande.json();
      console.log('Réponse jeVeux:', dataDemande);
      dispatch(jeVeux(dataDemande.user));
  
      navigation.navigate('Profil');
    } catch (error) {
      console.error('Erreur lors de la résolution des requêtes fetch', error);
    }
  };
  

  return (
<SafeAreaView style={styles.safeAreaView}>
          <View style={styles.container}>
            <View style={styles.contentContainer}>
              <Text style={styles.confirmationCreation}>Profil crée avec succés !</Text>
              <Text style={styles.welcomeText}>Sélectionnez au moins une catégorie dans laquelle vous aspirez à acquérir de nouvelles connaissances, ainsi qu'une catégorie où vous désirez apporter votre aide à autrui.</Text>

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
                      setOpen={(isOpen) => {
                        setOffreOuvert(isOpen);
                        setDemandeOuvert(false); 
                      }}
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
                    <Text style={styles.validationMessageOffre}>{validationMessageOffre}</Text>
                  </View>

                  <View style={styles.demandeContainer}>
                    <Text style={styles.activityLabel}>Demandez de l'aide ( 1 activité min.) :</Text>
                    <DropDownPicker
                      items={activitesDisponibles && activitesDisponibles.map(activite => ({
                        label: activite,
                        value: activite,
                      }))}
                      open={demandeOuvert}
                      setOpen={(isOpen) => {
                        setDemandeOuvert(isOpen);
                        setOffreOuvert(false); 
                      }}
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
                    <Text style={styles.validationMessageOffre}>{validationMessageDemande}</Text>
                  </View>

                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={styles.registerButton}
                      onPress={() => handleEnregistrer()}
                    >
                      <Text style={styles.registerButtonText}>Valider mes choix</Text>
                    </TouchableOpacity>
                  </View>
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
    alignItems: 'center',
    backgroundColor:'#fff'
  },

  //-----------------------  TITRE  ---------------------------------

  confirmationCreation: {
    justifyContent: 'center',
    marginTop: 35,
    textAlign: 'center',
    fontSize: 45,
  },
  welcomeText: {
    textAlign:'center',
    margin:15,
    marginTop:45
  },

  //-----------------------  MESSAGE DE CHARGEMENT  ---------------------------------

  loadingMsg: {
    justifyContent: 'center',
    marginTop: 45,
    textAlign: 'center',
    fontSize: 22,
    padding: 10,
    position: 'relative',
  },

  //-----------------------  DROP DOWN PICKER  ---------------------------------

  offreContainer: {
    marginLeft: 12,
    marginTop: 45,
    width: 350,
    zIndex: 100,
  },
  demandeContainer: {
    marginLeft: 12,
    marginTop: 45,
    width: 350,
    zIndex: 99,
  },
  activityLabel: {
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: 22,
    padding: 10,
    position: 'relative',
  },

  //-----------------------  BOUTTON VALIDER  ---------------------------------
 
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  registerButton: {
    height: 55,
    width: 200,
    borderRadius: 12,
    marginTop: 70,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#182A49',
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 23,
  },
  validationMessageOffre: {
    color: 'red', 
    fontSize: 15,   
    marginHorizontal:15,
    textAlign:'center',
    margin:5
  },
  
});

