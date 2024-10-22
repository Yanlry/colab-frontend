import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useSelector } from 'react-redux';

export default function MessagerieScreen({ navigation }) {

  const utilisateurDestinataireToken = useSelector(state => state.utilisateur.destinataireToken);
  const senderToken = useSelector(state => state.utilisateur.value.token);
  
  const [messages, setMessages] = useState([]);
  const [forceUpdate, setForceUpdate] = useState(0);

  const fetchMessages = () => {
    const url = `http://192.168.1.109:3000/messages/conversations/${senderToken}`;
    
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Erreur de réseau ou serveur non trouvé');
        }
        return response.json();
      })
      .then(data => {
        console.log('Data from API:', data);
        setMessages(data.conversations); // Mettez à jour avec le bon chemin de données
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des messages:', error);
      });
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const renderMessageItem = ({ item }) => {
    console.log('Rendering message item:', item);
    
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('Conversation', { conversationId: item._id, name: item.participants.join(', '), messages: item.messages })}
        style={styles.conversationContainer}
      >
        <FontAwesome name='user' size={35} color={'#287777'} style={styles.iconMessage} />
        <View style={styles.bubbleContainer}>
          <View style={styles.bubble}>
            <Text style={styles.nomMessage}>{item.participants.join(', ')}</Text>
            <Text style={styles.message}>
              {item.lastMessage ? (item.lastMessage.length > 45 ? `${item.lastMessage.substring(0, 45)}...` : item.lastMessage) : ''}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <View style={styles.maListe}>
          <FlatList
            data={messages}
            extraData={forceUpdate}
            keyExtractor={(item) => item._id.toString()}
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
    borderBottomColor: '#green',
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
