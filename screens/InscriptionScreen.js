import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback, Image, ScrollView } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch } from 'react-redux';
import { login } from '../reducers/utilisateur';

export default function InscriptionScreen({ navigation }) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [voirPassword, setVoirPassword] = useState(false);

  const passwordVisible = () => {
    setVoirPassword(!voirPassword);
  };

  const handleEnregistrer = () => {
    fetch('http://192.168.1.109:3000/users/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, username, phone: phoneNumber }),
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
          navigation.navigate('Activite');
        } else {
          setErrorMessage(data.error);
        }
      });
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#d9e7e7', '#287777']} style={styles.gradient}>
        <KeyboardAvoidingView style={styles.keyboardAvoidingView} behavior="padding" enabled>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
              <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('Connexion')} style={styles.icone}>
                  <FontAwesome name='chevron-left' size={28} color={'#287777'} />
                </TouchableOpacity>
                <Text style={styles.title}>Création du profil</Text>
              </View>
              <Image resizeMode="contain" source={require('../assets/logo.png')} style={styles.logo} />
              <Text style={styles.bienvenueMsg}>Commencez par créer votre compte afin d'accéder aux annonces disponibles.</Text>
              <View style={styles.formulaire}>
                <TextInput
                  style={styles.saisie}
                  placeholder="Nom d'utilisateur"
                  value={username}
                  onChangeText={setUsername}
                />
                <TextInput
                  style={styles.saisie}
                  placeholder="E-mail"
                  value={email}
                  onChangeText={setEmail}
                />
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordSaisie}
                    placeholder="Mot de passe"
                    secureTextEntry={!voirPassword}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity onPress={passwordVisible} style={styles.eyeIcone}>
                    <FontAwesome name={voirPassword ? 'eye' : 'eye-slash'} size={25} color="#287777" />
                  </TouchableOpacity>
                </View>
                <TextInput
                  style={styles.saisie}
                  placeholder="Numéro de téléphone"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                />
                <TouchableOpacity style={styles.inscrireBtn} onPress={handleEnregistrer}>
                  <Text style={styles.inscrireText}>Créer mon compte</Text>
                </TouchableOpacity>
                {errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
              </View>
            </ScrollView>
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
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 60,
  },
  icone: {
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#287777',
    textAlign: 'center',
    flex: 1,
  },
  logo: {
    height: 180,
    width: 280,
    alignSelf: 'center',
    marginBottom: 10,
  },
  bienvenueMsg: {
    textAlign: 'center',
    fontSize: 16,
    color: '#555',
    marginVertical: 20,
    paddingHorizontal: 30,
  },
  formulaire: {
    alignItems: 'center',
    width: '100%',
  },
  saisie: {
    height: 55,
    width: '85%',
    marginVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 30,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
  },
  passwordContainer: {
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    width: '85%',
    marginVertical: 8,
    borderRadius: 30,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
  },
  passwordSaisie: {
    flex: 1,
    fontSize: 17,
  },
  eyeIcone: {
    marginLeft: 10,
  },
  inscrireBtn: {
    height: 55,
    width: '70%',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    backgroundColor: '#A8F0DF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
  },
  inscrireText: {
    color: '#287777',
    fontSize: 20,
    fontWeight: 'bold',
  },
  errorMessage: {
    color: '#D9534F',
    textAlign: 'center',
    fontSize: 15,
    marginTop: 15,
    marginBottom: 10,
  },
});
