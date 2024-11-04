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
  const [unreadConversations, setUnreadConversations] = useState([]);

  const checkUnreadConversations = () => {
    fetch(`http://192.168.1.109:3000/messages/conversations/unread/${user.token}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
  
        if (data.result && data.unreadConversations.length > 0) {
          setUnreadConversations(data.unreadConversations);
        } else {
          setUnreadConversations([]); // Réinitialiser si aucune conversation non lue
        }
      })
      .catch(error => {
        console.error('Erreur lors de la vérification des conversations non lues:', error);
      });      
  };
  
  

  useEffect(() => {
    fetchContacts();
    checkUnreadConversations();
  }, []);

  useEffect(() => {
    const contactsFiltres = contacts.filter(rechercherContact);
    setContactsFiltres(contactsFiltres);
  }, [contacts, recherche]);

  useFocusEffect(
    React.useCallback(() => {
      fetchContacts();
      checkUnreadConversations();
    }, [])
  );

  const fetchContacts = () => {
    const requestBody = { token: user.token };
    fetch(`http://192.168.1.109:3000/propositionCollabs/collaboration/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    })
      .then(response => response.json())
      .then(data => {
        if (data.result) {
          const contactsWithConversationId = data.contacts.map(contact => ({
            ...contact,
            conversationId: [user.token, contact.token].sort().join('') // Génération du `conversationId`
          }));
          setContacts(contactsWithConversationId);
        } else {
          console.log('Erreur lors de la récupération des contacts:', data.error);
        }
      })
      .catch(error => console.error('Erreur de connexion:', error));
  };
  

  const appelerNumero = (numero) => {
    const numeroFormate = `tel:${numero}`;
    Linking.openURL(numeroFormate);
  };

  const ouvrirConversation = (contact) => {
    if (contact && contact.token) {
      dispatch(setDestinataireToken(contact.token));
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
    checkUnreadConversations();
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
      <View style={styles.content}>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} style={styles.scrollview} />
          }
        >
          <View>
            {contactsFiltres.length === 0 ? (
              <Text style={styles.noContactsText}>Aucune collaboration actuellement</Text>
            ) : (
              contactsFiltres.map((contact, index) => {
                const hasUnreadMessages = unreadConversations.includes(contact.conversationId);
                
                return (
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
                      <FontAwesome name='envelope' size={33} color={hasUnreadMessages ? '#F36F68' : '#287777'} />
                    </TouchableOpacity>
                  </View>
                </View>
                );
              })
            )}
          </View>
        </ScrollView>
      </View>
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
    backgroundColor: '#fff',
    alignItems: 'center',
    marginTop: 10,
    width:'90%',
    flex:1,
    paddingBottom:100,
    borderRadius: 30,
  },
  scrollview: {
    width:'90%',
    alignItems: 'center',
    
  },
  rechercher: {
    width: '90%', 
    justifyContent: 'center',
    marginTop: 10,
  },
  rechercheText: {
    backgroundColor: 'white',
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
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 15,
    paddingTop: 15, // Pour créer un espace supérieur
    borderBottomWidth: 1, // Ajout de la bordure en bas
    borderBottomColor: '#ccc', // Couleur de la bordure
    paddingLeft: 35,
    paddingHorizontal:20,
    borderRadius: 30,

  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
marginVertical:10,

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
    marginTop:6,
    marginRight: 20,
  },
  messageButton: {
    marginRight: 10,
  },
});
