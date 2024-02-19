
import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default function MessagerieScreen({ navigation }) {
  const [conversations, setConversations] = useState([
    { id: 1, name: 'Benoit', lastMessage: 'Salut comment ça va ?', messages: [] },
    { id: 2, name: 'Johan', lastMessage: 'Une prochaine fois', messages: [] },
    { id: 3, name: 'Ismael', lastMessage: 'Pas trop compris', messages: [] },
    { id: 4, name: 'Meriton', lastMessage: 'Salut, il faudrait vraiment ce voir pour que je comprenne mieux de quoi tu veux parler', messages: [] },
    { id: 5, name: 'Eddy', lastMessage: 'Tu verra avec lui mais je pense pas que ça lui plaise', messages: [] },
    // Ajoutez d'autres conversations ici
  ]);

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
            {item.lastMessage.length > 45 ? `${item.lastMessage.substring(0, 45)}...` : item.lastMessage}
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
