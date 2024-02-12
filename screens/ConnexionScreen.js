import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../reducers/utilisateur'
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { StyleSheet, TextInput, View, TouchableOpacity, Text, Image, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback, SafeAreaView } from 'react-native';

export default function ConnexionScreen({ navigation }) {
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [voirPassword, setVoirPassword] = useState(false);

  const passwordVisible = () => {
    setVoirPassword(!voirPassword);
  };

  const handleConnection = () => {
    
    fetch('http://172.20.10.5:3000/users/signin', {
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
    <SafeAreaView style={styles.safeAreaView}>
      <KeyboardAvoidingView>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>

            <Image resizeMode="contain" source={require('../assets/logo.png')} style={styles.logo} />

            <TextInput
              style={styles.saisie}
              value={email}
              onChangeText={(text) => setEmail(text)}
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

            <TouchableOpacity onPress={() => navigation.navigate('Inscription')} style={styles.inscription} >
              <Text style={styles.creeCompte}>Pas encore de compte ?{' '} <Text style={{ fontWeight: 'bold' }}>Inscription</Text></Text>
            </TouchableOpacity>
          </View>
          </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
  </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor:'#fff'
  },
  container: {
    alignItems: 'center',
  },

//-----------------------  LOGO  ---------------------------------

  logo: {
    height: 200,
    width: 300,
    marginTop:25,
  },
 
//-----------------------  CHAMPS DE SAISIE  ---------------------------------

  saisie: {
    display: 'flex',
    borderWidth: 1,
    borderColor:'#8F8F8F',
    fontSize: 17,
    paddingLeft: 23,
    height: 58,
    width: 350,
    marginTop: 24,
    borderRadius: 15,
  },
  saisieMdp: {
    display: 'flex',
    borderWidth: 1,
    borderColor:'#8F8F8F',
    fontSize: 17,
    paddingLeft: 23,
    height: 58,
    width: 350,
    marginTop: 24,
    borderRadius: 15,
  },
  saisieMdpEtIcon: {
    flexDirection: 'row'
  },
  eyeIcone: {
    position:'absolute',
    marginTop: 40,
    marginLeft: 302
  },

//-----------------------  BOUTTON CONNEXION  ---------------------------------

  homeBtn: {
    width: 350,
    height: 45,
    borderRadius: 12,
    marginTop: 34,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#182A49',
  },
  textBtn: {
    display: 'flex',
    textAlign: 'center',
    color: 'white',
    fontSize: 25,
  },
  
//-----------------------  MESSAGE D'ERREUR  ---------------------------------

  errorMessage: {
    color: 'red',
    marginTop: 10,
    fontSize: 16,
  },

//-----------------------  ICONE RESAUX SOCIAUX  ---------------------------------

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

//----------------------- INSCRIPTION  ---------------------------------

  inscription: {
    marginTop: 50,
  },
  creeCompte:{
    marginTop:10,
    fontSize:16
  }

});