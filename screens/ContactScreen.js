import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, RefreshControl, Linking } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useSelector } from 'react-redux';

export default function ContactScreen({ navigation }) {
  const user = useSelector(state => state.utilisateur.value);
  const [contacts, setContacts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

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

  const onRefresh = () => {
    setRefreshing(true);
    fetchContacts();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchContacts();
  }, []);

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

  const contactsTries = () => {
    const contactsOrganises = organiserContacts();
    const clesTries = Object.keys(contactsOrganises).sort();
    const contactsTries = [];
    clesTries.forEach(key => {
      contactsTries.push(...contactsOrganises[key]);
    });
    return contactsTries;
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
    >
      <View style={styles.content}>
        <Text style={styles.title}>Mes contacts</Text>
        {contactsTries().map((contact, index) => (
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

//-----------------------  TITRE  ---------------------------------

  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
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
