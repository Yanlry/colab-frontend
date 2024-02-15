import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useSelector } from 'react-redux';

export default function MessagerieScreen({ navigation }) {

  const [sentMessages, setSentMessages] = useState([]);
  const [receivedMessages, setReceivedMessages] = useState([]);

  // Récupérer le token d'utilisateur depuis le Redux Store
  const utilisateur = useSelector(state => state.utilisateur.value);
  

  useEffect(() => {
    if (utilisateur) {
      // Charger les messages envoyés par l'utilisateur depuis le backend
      fetch(`http://192.168.1.33:3000/messages/sent/${utilisateur.token}`)
        .then(response => response.json())
        .then(data => {
          setSentMessages(data);
        })
        .catch(error => {
          console.error('Erreur lors du chargement des messages envoyés :', error);
        });

      // Charger les messages reçus par l'utilisateur depuis le backend
      fetch(`http://192.168.1.33:3000/messages/received/${utilisateur.token}`)
        .then(response => response.json())
        .then(data => {
          setReceivedMessages(data);
        })
        .catch(error => {
          console.error('Erreur lors du chargement des messages reçus :', error);
        });
    }
  }, [utilisateur]);

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <Text>Mes messages envoyés :</Text>
        <FlatList
          data={sentMessages}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate('Conversation', { conversationId: item.id, name: item.name })} style={styles.containerMessage}>
              <FontAwesome name='user' size={35} color={'#182A49'} style={styles.iconMessage} />
              <View>
                <Text style={styles.nomMessage}>{item.name}</Text>
                <Text style={styles.message}>{item.lastMessage}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
        <Text>Mes messages reçus :</Text>
        <FlatList
          data={receivedMessages}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate('Conversation', { conversationId: item.id, name: item.name })} style={styles.containerMessage}>
              <FontAwesome name='user' size={35} color={'#182A49'} style={styles.iconMessage} />
              <View>
                <Text style={styles.nomMessage}>{item.name}</Text>
                <Text style={styles.message}>{item.lastMessage}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor:'#fff',
  },
  container: {
    marginTop:10,
    justifyContent: 'center',
    alignItems: 'center',
  },

//-----------------------  MESSAGE  ---------------------------------
  
  iconMessage:{
    marginRight:20
  },
  containerMessage: {
    flexDirection:'row',  
    borderBottomWidth:1,
    borderColor:'#C9C9C9',
    width:320,
    height:50,
    alignItems:'center',
    marginTop:15,
    justifyContent:'flex-start'
  },
  nomMessage:{
    fontWeight:'bold',
    fontSize:17,
    marginBottom:5
  },
  message:{
    marginBottom:5
  },
});
