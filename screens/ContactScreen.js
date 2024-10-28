import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, RefreshControl, Linking } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useSelector, useDispatch } from 'react-redux';
import { setDestinataireToken } from '../reducers/utilisateur';
import { useFocusEffect } from '@react-navigation/native';

export default function ContactScreen({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector(state => state.utilisateur.value);
  const [contacts, setContacts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [recherche, setRecherche] = useState('');
  const [contactsFiltres, setContactsFiltres] = useState([]);

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    const contactsFiltres = contacts.filter(rechercherContact);
    setContactsFiltres(contactsFiltres);
  }, [contacts, recherche]);

  
  useFocusEffect(
    React.useCallback(() => {
      fetchContacts();
    }, [])
  );

  const fetchContacts = () => {
    const requestBody = {
      token: user.token,
    };
    fetch('http://192.168.1.109:3000/propositionCollabs/collaboration/contact', {
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

  const ouvrirConversation = (contact) => {
    if (contact && contact.token) {
      dispatch(setDestinataireToken(contact.token));
  
      // Naviguez vers la page de conversation
      navigation.navigate('Conversation', {
        contactToken: contact.token,
        contactId: contact.id,
        contactUsername: contact.username,
        contactName: contact.name,
        contactPhone: contact.phone,
      });
    }
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
    {contactsFiltres.length === 0 ? (
      <Text style={styles.noContactsText}>Aucune collaboration actuellement</Text>
    ) : (
      contactsFiltres.map((contact, index) => (
        <View key={index} style={styles.contactContainer}>
          <TouchableOpacity style={styles.contactItem}>
            <FontAwesome name='user' size={35} color={'#287777'} />
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>{contact.username}</Text>
              <Text style={styles.contactNumber}>{contact.phone}</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.phoneButton} onPress={() => appelerNumero(contact.phone)}>
              <FontAwesome name='phone' size={35} color={'#287777'} style={styles.telIcon}/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.messageButton} onPress={() => ouvrirConversation(contact)}>
              <FontAwesome name='comment' size={33} color={'#287777'} />
            </TouchableOpacity>
          </View>
        </View>
      ))
    )}
  </View>
</ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e5f6f6',
    alignItems: 'center',
  },
  content: {
    width: '100%', 
    alignItems: 'center',
  },

  
  rechercher: {
    width: '90%', 
    justifyContent: 'center',
    marginTop: 10,
  },
  rechercheText: {
    backgroundColor:'white',
    height: 50,
    fontSize: 15,
    paddingLeft: 30,
    borderRadius: 30,
    marginTop: 10,

  },
  searchIcon: {
    position: 'absolute',
    right: 20,
    top: 22,
  },

  noContactsText: {
    marginTop: 30,
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
  },

  contactContainer: {
    width: '90%',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contactItem: {
    marginTop:25,
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactInfo: {
    marginLeft: 20,
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  contactNumber: {
    fontSize: 14,
    
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phoneButton: {
    marginRight: 20,
    marginTop:25,
  },
  messageButton: {
    marginRight: 10,
    marginTop:20,
  },
});
