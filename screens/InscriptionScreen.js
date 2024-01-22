import React, { useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
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

  // Sert a stocker l'information "la liste Dropdown est ouverte ou non  ?"
  const [ouvert, setOuvert] = useState(false)
  // Sert a stocker l'information " Homme ou femme" ?"
  const [genre, setGenre] = useState('')
  // Sert a stocker l'information "mot de passe de cacher ou non ?"
  const [voirPassword, setVoirPassword] = useState(false);

  //Etablis la liste disponible
  const items = [
    { label: 'Homme', value: 'homme' },
    { label: 'Femme', value: 'femme' },
  ]

  // Rend le mot de passe visible ou non au click
  const passwordVisible = () => {
    setVoirPassword(!voirPassword);
  };

  // Permet d'envoyer les données en base de données et naviguer a la page suivante
  const handleEnregistrer = () => {
    fetch('http://10.215.12.147:3000/users/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, password: password, username: username, phone: phoneNumber, sexe: genre }),
    })


      .then(response => response.json())
      .then(data => {
        if (data.result) {
          dispatch(login({
            token: data.token,
            email: data.email,
            username: data.username,
            phone: data.phone,
            sexe: data.sexe,

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
    <View style={styles.container}>

      <TouchableOpacity onPress={() => navigation.navigate('Connexion')} style={styles.icone}>
        <FontAwesome name='chevron-left' size={28} color={'#3A3960'} />
      </TouchableOpacity>

      <Text style={styles.bienvenue}>Bienvenue !   🎉</Text>
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

          <View style={styles.passwordContainer}>
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
          </View>
          <TextInput
            style={styles.saisie}
            placeholder="Numéro de téléphone"
            value={phoneNumber}
            onChangeText={(text) => setPhoneNumber(text)}
          />
          <DropDownPicker
            items={items}
            open={ouvert}
            setOpen={() => setOuvert(!ouvert)}
            value={genre}
            setValue={(value) => setGenre(value)}
            placeholder="Selectionner votre sexe"
            showTickIcon={true}
          />

          <TouchableOpacity style={styles.inscrireBtn} onPress={() => handleEnregistrer()}>
            <Text style={styles.inscrireText}>Créer mon compte</Text>
          </TouchableOpacity>
          {errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
        </View>

        <Text style={styles.separation}>________________ OU ________________</Text>

        <TouchableOpacity style={styles.connecterBtn} onPress={() => navigation.navigate('Connexion')}>
          <Text>Tu as déja un compte ? Connexion</Text>
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
  icone: {
    paddingTop: 50,
    paddingLeft: 30,
  },
  bienvenue: {
    justifyContent: 'center',
    marginTop: 45,
    textAlign: 'center',
    fontSize: 45,
    paddingLeft: 35
  },
  bienvenueMsg: {
    justifyContent: 'center',
    marginTop: 45,
    textAlign: 'center',
    fontSize: 22
  },
  formulaire: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
  },
  saisie: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 12
  },
  inscrireBtn: {
    height: 55,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 45,
    backgroundColor: '#3A3960'
  },
  inscrireText: {
    color: '#fff',
    fontSize: 23,
  },
  separation: {
    marginTop: 50,
    paddingLeft: 60
  },
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
  passwordSaisie: {
    flexDirection: 'row',
    height: 50,
    width: 335,
    justifyContent: 'space-between',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  eyeIcone: {
    justifyContent: 'center',
    paddingLeft: 10,
    marginBottom: 10,
  },
  passwordContainer: {
    flexDirection: 'row',
  },
  errorMessage: {
    color: 'red',
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
  },
});





