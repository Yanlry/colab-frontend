import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useSelector } from 'react-redux';

export default function MessagerieScreen({ navigation }) {
  const utilisateurDestinataireToken = useSelector(state => state.utilisateur.destinataireToken);
  const [conversations, setConversations] = useState([]);

  const fetchConversations = () => {
    const url = `http://172.20.10.5:3000/conversations/${utilisateurDestinataireToken}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        const conversationsWithLastMessage = mapConversationsWithLastMessage(data.conversations);
        setConversations(conversationsWithLastMessage);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des conversations:', error);
      });
  };

  const mapConversationsWithLastMessage = (conversations) => {
    return conversations.map(conversation => {
      const lastMessage = conversation.messages[0] || {};

      return {
        ...conversation,
        lastMessage: {
          text: lastMessage.text || '',
          isUser: lastMessage.senderToken === utilisateurDestinataireToken,
        },
      };
    });
  };

  const createConversationIfNotFound = async () => {
    // Faites une requête pour vérifier si le token existe déjà dans les conversations
    const checkUrl = `http://172.20.10.5:3000/conversations/check/${utilisateurDestinataireToken}`;
    const checkResponse = await fetch(checkUrl);
    const checkData = await checkResponse.json();
    if (!checkData.exists) {
      // Si le token n'existe pas, créez une nouvelle conversation
      const createUrl = `http://172.20.10.5:3000/conversations/create/${utilisateurDestinataireToken}`;
      const createResponse = await fetch(createUrl, { method: 'POST' });
      const createData = await createResponse.json();

      if (createData.success) {
        // Rechargez la liste des conversations après la création
        fetchConversations();
      } else {
        console.error('Erreur lors de la création de la conversation:', createData.error);
      }
    }
  };

  useEffect(() => {
    // Appeler fetchConversations et createConversationIfNotFound au montage du composant
    fetchConversations();
    createConversationIfNotFound();
  }, []);

  const renderConversationItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('Conversation', { conversationId: item.id, name: item.name, messages: item.messages })}
      style={styles.conversationContainer}
    >
      <FontAwesome name='user' size={35} color={'#182A49'} style={styles.iconMessage} />
      <View style={styles.bubbleContainer}>
        <View style={styles.bubble}>
          <Text style={styles.nomMessage}>{item.name}</Text>
          <Text style={styles.message}>
            {item.lastMessage.text.length > 45 ? `${item.lastMessage.text.substring(0, 45)}...` : item.lastMessage.text}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderConversationItem}
        />
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
