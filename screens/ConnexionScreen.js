import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../reducers/utilisateur';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, TextInput, View, TouchableOpacity, Text, Image, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback } from 'react-native';

export default function ConnexionScreen({ navigation }) {

  const apiUrl = `${process.env.REACT_APP_MY_ADDRESS}`;
  
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [voirPassword, setVoirPassword] = useState(false);

  const passwordVisible = () => setVoirPassword(!voirPassword);

  const handleConnection = () => {
    fetch(`http://colab-backend-iota.vercel.app:3000/users/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: motDePasse }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.result) {
          dispatch(login({ token: data.token, email: data.email, username: data.username }));
          setEmail('');
          setMotDePasse('');
          navigation.navigate('TabNavigator');
        } else {
          setErrorMessage(data.error);
        }
      });
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#d9e7e7', '#287777']} style={styles.gradient}>
        <KeyboardAvoidingView style={styles.keyboardAvoidingView} behavior="padding">
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.innerContainer}>
              <Image resizeMode="contain" source={require('../assets/logo.png')} style={styles.logo} />

              <TextInput
                style={styles.saisie}
                value={email}
                onChangeText={setEmail}
                placeholder="Adresse mail"
              />
              <View style={styles.saisieMdpEtIcon}>
                <TextInput
                  style={styles.saisieMdp}
                  value={motDePasse}
                  secureTextEntry={!voirPassword}
                  onChangeText={setMotDePasse}
                  placeholder="Mot de passe"
                />
                <TouchableOpacity onPress={passwordVisible} style={styles.eyeIcone}>
                  <FontAwesome name={voirPassword ? 'eye' : 'eye-slash'} size={25} color="#287777" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.homeBtn} onPress={handleConnection}>
                <Text style={styles.textBtn}>Connexion</Text>
              </TouchableOpacity>

              {errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}

              <View style={styles.iconeContainer}>
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

              <TouchableOpacity onPress={() => navigation.navigate('Inscription')} style={styles.inscription}>
                <Text style={styles.creeCompte}>Pas encore de compte ? <Text style={{ fontWeight: 'bold', color:'white' }}> Inscrivez-vous ici</Text></Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
}

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    gradient: {
      flex: 1,
    },
    keyboardAvoidingView: {
      flex: 1,
    },
    innerContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 20,
    },
    logo: {
      height: 250,
      width: 300,
      marginBottom: 30,
    },
    saisie: {
      fontSize: 17,
      paddingLeft: 20,
      height: 50,
      width: '90%',
      marginVertical: 10,
      borderRadius: 25,
      backgroundColor: 'white',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 3,
    },
    saisieMdpEtIcon: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '90%',
      marginVertical: 10,
    },
    saisieMdp: {
      fontSize: 17,
      paddingLeft: 20,
      height: 50,
      width: '100%',
      borderRadius: 25,
      backgroundColor: 'white',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 3,
    },
    eyeIcone: {
      position: 'absolute',
      right: 20,
    },
    homeBtn: {
      width: '70%',
      height: 50,
      borderRadius: 25,
      marginTop: 20,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#A8F0DF',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 3,
    },
    textBtn: {
      color: '#287777',
      fontSize: 18,
      fontWeight: 'bold',
    },
    errorMessage: {
      color: 'red',
      marginTop: 10,
      fontSize: 14,
    },
    iconeContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '70%',
      marginTop: 30,
    },
    icone: {
      height: 50,
      width: 50,
    },
    inscription: {
      marginTop: 30,
    },
    creeCompte: {
      fontSize: 16,
      color: 'white',
      textAlign: 'center',
    },
  });
  