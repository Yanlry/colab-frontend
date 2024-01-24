import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, SafeAreaView, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback, Image } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useDispatch } from 'react-redux';
import { login } from '../reducers/utilisateur'


export default function InscriptionScreen({ navigation }) {
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('')
  const [errorMessage, setErrorMessage] = useState('');

  const [voirPassword, setVoirPassword] = useState(false);

  const passwordVisible = () => {
    setVoirPassword(!voirPassword);
  };

  const handleEnregistrer = () => {
    fetch('http://192.168.1.33:3000/users/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, password: password, username: username, phone: phoneNumber }),
    })


      .then(response => response.json())
      .then(data => {
        if (data.result) {
          dispatch(login({
            token: data.token,
            email: data.email,
            username: data.username,
            phone: data.phone,

          }));

          setEmail('');
          setPassword('');
          navigation.navigate('Activite')
        } else {
          setErrorMessage(data.error);
        }
      })


  }

  return (
<SafeAreaView style={styles.safeAreaView}>
  <KeyboardAvoidingView>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>  
      <View style={styles.container}>
        <View style={styles.header}>

          <TouchableOpacity onPress={() => navigation.navigate('Connexion')} style={styles.icone}>
            <FontAwesome name='chevron-left' size={28} color={'#3A3960'} />
          </TouchableOpacity>
          <Text style={styles.title}>Création du profil</Text>
        </View>
        <Image resizeMode="contain" source={require('../assets/logo.png')} style={styles.logo} />

            <Text style={styles.bienvenueMsg}>Commencez par créer votre compte afin d'accéder aux annonces disponibles.</Text>
          <View style={styles.formulaire}>
            <View>
              <TextInput
                style={styles.saisie}
                placeholder="Nom d'utilisateur"
                value={username}
                onChangeText={(text) => setUsername(text)}
              />
              <TextInput
                style={styles.saisie}
                placeholder="E-mail"
                value={email}
                onChangeText={(text) => setEmail(text)}
              />
                <TextInput
                  style={styles.passwordSaisie}
                  placeholder="Mot de passe"
                  secureTextEntry={!voirPassword}
                  value={password}
                  onChangeText={(text) => setPassword(text)}
                />
                <TouchableOpacity onPress={() => passwordVisible()} style={styles.eyeIcone}>
                  <FontAwesome name={voirPassword ? 'eye' : 'eye-slash'} size={25} color="gray" />
                </TouchableOpacity>
              <TextInput
                style={styles.saisie}
                placeholder="Numéro de téléphone"
                value={phoneNumber}
                onChangeText={(text) => setPhoneNumber(text)}
              />
              <TouchableOpacity style={styles.inscrireBtn} onPress={() => handleEnregistrer()}>
                <Text style={styles.inscrireText}>Créer mon compte</Text>
              </TouchableOpacity>
              {errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
            </View>
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
  backgroundColor:'#fff'
  },

  //-----------------------  LOGO  ---------------------------------

logo: {
  height: 200,
  width: 300,
  marginLeft:40
},
 
// ------------------- NAVBAR ---------------------


header: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 10,
  marginTop: 20,
},
icone: {
  marginLeft: 25,
  marginRight:55 
},
title: {
  fontSize: 24,
  fontWeight: 'bold',
},

//----------------------- TITRE  ---------------------------------

  bienvenueMsg: {
    justifyContent: 'center',
    textAlign: 'center',
  },

//-----------------------FORMULAIRE D'INSCRIPTION  ---------------------------------

  formulaire: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
  },
  saisie: {
    height: 50,    
    borderColor:'#8F8F8F',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 12
  },
  passwordSaisie: {
    flexDirection: 'row',
    height: 50,
    width: 335,
    justifyContent: 'space-between',
    borderColor:'#8F8F8F',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    marginBottom:10
  },
  eyeIcone: {
    position:'absolute',
    marginTop:132,
    marginLeft:290,
    height:30
  },

//----------------------- BOUTON INSCRIPTION  ---------------------------------

  inscrireBtn: {
    height: 55,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 45,
    backgroundColor: '#182A49'
  },
  inscrireText: {
    color: '#fff',
    fontSize: 23,
  },

//----------------------- MESSAGE D'ERREUR  ---------------------------------

  errorMessage: {
    color: 'red',
    textAlign:'center',
    marginTop: 10,
    fontSize: 16,
    height:50,
    width:320
  },

//----------------------- SEPARATION  ---------------------------------

  separation: {
    marginTop: 50,
    paddingLeft: 60
  },

//----------------------- SE CONNECTER  ---------------------------------

  connecterBtn: {
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  connecterText: {
    color: '#fff',
    fontSize: 23,
  },
});





