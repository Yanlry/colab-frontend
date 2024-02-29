import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useSelector } from 'react-redux';

export default function MessagerieScreen({ navigation }) {
  
  const utilisateurDestinataireToken = useSelector(state => state.utilisateur.destinataireToken);
  const [messages, setMessages] = useState([]);

  const fetchMessages = () => {
    console.log("Début de fetchMessages");
    const url = `http://192.168.1.33:3000/messages/messages/${utilisateurDestinataireToken}`;

    fetch(url)
      .then(response => {
        console.log("Statut de la réponse fetchMessages:", response.status);
        if (!response.ok) {
          throw new Error('Erreur de réseau ou serveur non trouvé');
        }
        return response.json();
      })
      .then(data => {
        setMessages(data.messages);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des messages :', error);
      });
  };

  useEffect(() => {
    console.log("Le composant MessagerieScreen est monté")
    fetchMessages();
  }, []);

  const renderMessageItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('Conversation', { conversationId: item.id, name: item.senderName, messages: [item] })}
      style={styles.conversationContainer} // Utilisez le même style que pour les conversations
    >
      <FontAwesome name='user' size={35} color={'#182A49'} style={styles.iconMessage} />
      <View style={styles.bubbleContainer}>
        <View style={styles.bubble}>
          <Text style={styles.nomMessage}>{item.senderName}</Text>
          <Text style={styles.message}>
            {item.text.length > 45 ? `${item.text.substring(0, 45)}...` : item.text}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <View style={styles.maListe}>
        <FlatList
          data={messages}
          keyExtractor={(item) => item.messageId.toString()}
          renderItem={renderMessageItem}
        />
        </View>
      </View>
    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  conversationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  iconMessage: {
    marginRight: 10,
  },
  bubbleContainer: {
    flex: 1,
  },
  bubble: {
    paddingVertical: 8,
    paddingLeft: 10,
  },
  nomMessage: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  message: {
    fontSize: 14,
   
  },
});
