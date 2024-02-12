import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default function MessagerieScreen({ navigation }) {

  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    // Charger les conversations depuis le backend
    // Vous devrez remplacer cette partie par une requête à votre API
    fetch(`http://172.20.10.5:3000/messages`)
      .then(response => response.json())
      .then(data => {
        setConversations(data)
  
  }, []);
})

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.id}
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
