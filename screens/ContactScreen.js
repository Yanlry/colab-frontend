import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, RefreshControl, Linking } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useSelector } from 'react-redux';

export default function ContactScreen({ navigation }) {
  const user = useSelector(state => state.utilisateur.value);

  const [contacts, setContacts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [recherche, setRecherche] = useState('');
  const [contactsFiltres, setContactsFiltres] = useState([]);

  const fetchContacts = () => {
    const requestBody = {
      token: user.token,
    };
    fetch('http://192.168.1.33:3000/propositionCollabs/collaboration/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
      .then(response => response.json())
      .then(data => {
        if (data.result) {
          setContacts(data.contacts);
        } else {
          console.log('Erreur lors de la récupération des contacts:', data.error);
        }
      })
      .catch(error => {
        console.error('Erreur de connexion:', error);
      });
  };

  const appelerNumero = (numero) => {
    const numeroFormate = `tel:${numero}`;
    Linking.openURL(numeroFormate);
  };

  const rechercherContact = (contact) => {
    const rechercheMinuscules = recherche.toLowerCase();
    const numeroMinuscules = contact.phone.toLowerCase();
    const usernameMinuscules = contact.username.toLowerCase();
  
    return (
      usernameMinuscules.includes(rechercheMinuscules) ||
      numeroMinuscules.includes(rechercheMinuscules)
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchContacts();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    const contactsFiltres = contacts.filter(rechercherContact);
    setContactsFiltres(contactsFiltres);
  }, [contacts, recherche]);

  const organiserContacts = () => {
    const contactsOrganises = {};
    contacts.forEach(contact => {
      const firstLetter = contact.username.charAt(0).toUpperCase();
      if (!contactsOrganises[firstLetter]) {
        contactsOrganises[firstLetter] = [];
      }
      contactsOrganises[firstLetter].push(contact);
    });
    return contactsOrganises;
  };

  return (
    <View style={styles.container}>
      <View style={styles.rechercher}>
        <TextInput
          style={styles.rechercheText}
          value={recherche}
          onChangeText={text => setRecherche(text)}
          placeholder="Rechercher un contact ou un numéro..."
        />
          <FontAwesome name='search' size={22} color={'grey'} style={styles.searchIcon}/>
        </View>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        >
          <View style={styles.content}>
          {contactsFiltres.map((contact, index) => (
            <View key={index} style={styles.contactContainer}>
              <TouchableOpacity style={styles.contactItem} onPress={() => appelerNumero(contact.phone)}>
                <FontAwesome name='user' size={35} color={'#182A49'} />
                <View style={styles.contactInfo}>
                  <Text style={styles.contactName}>{contact.username}</Text>
                  <Text style={styles.contactNumber}>{contact.phone}</Text>
                </View>
                <FontAwesome name='phone' size={35} color={'#182A49'} style={styles.telIcon}/>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },

//-----------------------  BARRE DE RECHERCHE  ---------------------------------

rechercher: {
  width:350,
  justifyContent: 'center',
  marginTop:15,
  marginLeft:15
},
rechercheText: {
  justifyContent:'center',
  borderWidth: 1,
  borderColor:'#8F8F8F',
  height: 50,
  width: 330,
  fontSize: 15,
  paddingLeft: 30,
  margin: 12,
  borderRadius: 12,
  marginHorizontal:5,
},
searchIcon: {
  position: 'absolute',
  paddingBottom:5,
  marginLeft:295,
},

//----------------------- FICHE CONTACT  ---------------------------------

  contactContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  contactInfo: {
    marginLeft: 20,
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  telIcon:{
marginLeft:154
  },
  contactNumber: {
    fontSize: 14,
  },
  
});
