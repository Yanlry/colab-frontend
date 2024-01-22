import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from '../reducers/utilisateur'
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { StyleSheet, TextInput, View, TouchableOpacity, Text, Image } from 'react-native';

export default function ConnexionScreen({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.utilisateur.value);

  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Sert a stocker l'information "mot de passe de cacher ou non ?"
  const [voirPassword, setVoirPassword] = useState(false);

  // Rend le mot de passe visible ou non au click
  const passwordVisible = () => {
    setVoirPassword(!voirPassword);
  };

  const handleConnection = () => {
    //Route qui gère la connexion 
    fetch('http://10.215.12.147:3000/users/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, password: motDePasse }),
    })


      .then(response => response.json())
      .then(data => {
        if (data.result) {
          dispatch(login({ token: data.token, email: data.email, username: data.username }));

          setEmail('');
          setMotDePasse('');
          navigation.navigate('TabNavigator')
        } else {
          setErrorMessage(data.error);
        }

      });
  };

  return (
    <View style={styles.container}>

      <Image resizeMode="contain" source={require('../assets/logo.png')} style={styles.logo} />

      <TextInput
        style={styles.saisie}
        value={email}
        onChangeText={(text) => setEmail(text)}
        /*  defaultValue=""*/
        placeholder="Adresse mail"
      />
      <View style={styles.saisieMdpEtIcon}>
        <TextInput
          style={styles.saisieMdp}
          value={motDePasse}
          secureTextEntry={!voirPassword}
          onChangeText={(text) => setMotDePasse(text)}
          placeholder="Mot de passe"
        />
        <TouchableOpacity onPress={() => passwordVisible()} style={styles.eyeIcone}>
          <FontAwesome name={voirPassword ? 'eye' : 'eye-slash'} size={25} color="gray" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.homeBtn}
        onPress={() => handleConnection()}>
        <Text style={styles.textBtn}>Connexion</Text>
      </TouchableOpacity>
      {errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
      <View style={styles.iconeContainer} >
        <TouchableOpacity>
          <Image resizeMode="contain" source={require('../assets/iconeFacebook.png')} style={styles.icone} />
        </TouchableOpacity>

        <TouchableOpacity>
          <Image resizeMode="contain" source={require('../assets/iconeInstagram.png')} style={styles.icone} />
        </TouchableOpacity>

        <TouchableOpacity>
          <Image resizeMode="contain" source={require('../assets/iconeGoogle.png')} style={styles.icone} />
        </TouchableOpacity>
      </View>

      <Text style={styles.separation}>________________ OU ________________</Text>

      <TouchableOpacity onPress={() => navigation.navigate('Inscription')} style={styles.inscription} >
        <Text>Pas encore de compte ? Inscription</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    height: 200,
    width: 300,
    marginBottom: 45
  },
  iconeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 100,
    width: 300,
    paddingTop: 25
  },
  icone: {
    height: 100,
    width: 50,
  },
  homeBtn: {
    width: 350,
    height: 45,
    borderRadius: 12,
    marginTop: 34,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3A3960',
  },
  textBtn: {
    display: 'flex',
    textAlign: 'center',
    color: 'white',
    fontSize: 25,
  },
  saisie: {
    display: 'flex',
    borderWidth: 1,
    fontSize: 17,
    paddingLeft: 23,
    height: 58,
    width: 350,
    marginTop: 24,
    borderRadius: 15,
    borderBottomColor: '#3A3960'
  },
  separation: {
    marginTop: 50
  },
  inscription: {
    marginTop: 50,
  },
  errorMessage: {
    color: 'red',
    marginTop: 10,
    fontSize: 16,
  },
  saisieMdp: {
    display: 'flex',
    borderWidth: 1,
    fontSize: 17,
    paddingLeft: 23,
    height: 58,
    width: 300,
    marginTop: 24,
    borderRadius: 15,
    borderBottomColor: '#3A3960'
  },
  saisieMdpEtIcon: {
    flexDirection: 'row'
  },
  eyeIcone: {
    marginTop: 40,
    marginLeft: 23
  },
});