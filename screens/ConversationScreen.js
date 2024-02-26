import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useSelector, useDispatch } from 'react-redux';
import { setDestinataireToken } from '../reducers/utilisateur';

export default function ConversationScreen({ navigation, route }) {

  const dispatch = useDispatch();
  const utilisateurDestinataireToken = useSelector(state => state.utilisateur.destinataireToken);
  const senderToken = useSelector(state => state.utilisateur.value.token);

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [contactUsername, setContactUsername] = useState('');

  const fetchMessages = () => {
    const url = `http://172.20.10.5:3000/messages/${utilisateurDestinataireToken}/${senderToken}`;
    
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const messagesWithUserFlag = data.messages.map(message => {
          return { ...message, isUser: message.senderToken === senderToken };
        });
  
        // Tri des messages par date (ou tout autre critère approprié)
        const sortedMessages = messagesWithUserFlag.sort((a, b) => new Date(a.date) - new Date(b.date));
  
        // Inversion de l'ordre pour afficher les messages les plus récents en bas
        const reversedMessages = sortedMessages.reverse();
  
        setMessages(reversedMessages);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des messages:', error);
      });
  };
  
  
  useEffect(() => {
    fetchMessages();
  }, [utilisateurDestinataireToken]);
  
  useEffect(() => {
    const { contactToken, contactUsername } = route.params;
    dispatch(setDestinataireToken(contactToken));
    setContactUsername(contactUsername);
    console.log('Recipient Token updated:', contactToken);
  }, [route.params, dispatch]);

  const addMessage = () => {
    if (inputText.trim() !== '') {
      fetch('http://172.20.10.5:3000/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputText.trim(),
          senderToken: senderToken,
          recipientToken: utilisateurDestinataireToken,
        }),
      })
      .then(response => response.json())
      .then(data => {
        if (data && data.success !== undefined) {
          if (data.success) {
          } else {
            console.log('Erreur lors de l\'envoi du message au serveur:', data.error);
          }
        } else {
          console.log('Réponse du serveur non conforme:', data);
        }
        fetchMessages();
        setInputText('');
      })
      .catch(error => {
        console.error('Erreur lors de la connexion au serveur:', error);
      });
    }
  };
  
  
  
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardAvoidingView}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          
          <View style={styles.container}>
            <View style={styles.headerMessage}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.icon}>
                <FontAwesome name='chevron-left' size={28} color={'#182A49'} />
              </TouchableOpacity>
              <View style={styles.nomContact}>
                <Text style={styles.headerText}>{contactUsername}</Text>
              </View>
              <TouchableOpacity>
                <FontAwesome name='user' size={35} color={'#182A49'} style={styles.headerIcon} />
              </TouchableOpacity>
            </View>
           
                <FlatList
                  data={messages}
                  renderItem={({ item, index }) => (
                    <View key={index} style={[styles.messageContainer, item.isUser ? styles.userMessageContainer : styles.otherMessageContainer]}>
                      <View style={[styles.messageBubble, item.isUser ? styles.userMessageBubble : styles.otherMessageBubble]}>
                        <Text style={[styles.messageText, item.isUser ? styles.userMessageText : styles.otherMessageText]}>{item.text}</Text>
                      </View>
                    </View>
                  )}
                  inverted
                  onScrollBeginDrag={() => Keyboard.dismiss()}
                  keyboardShouldPersistTaps='handled'
                  keyboardDismissMode='on-drag'
                  keyExtractor={(item, index) => index.toString()}
                  contentContainerStyle={styles.messageList}
                  />
            
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder='Votre message'
                  style={styles.textInput}
                  value={inputText}
                  onChangeText={(text) => setInputText(text)}
                  onSubmitEditing={addMessage}
                  />
                <TouchableOpacity onPress={() => addMessage()}>
                  <FontAwesome name='send' size={20} color={'#007BFF'} style={styles.sendIcon} />
                </TouchableOpacity>
              </View>
            </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeAreaView: {
    backgroundColor: '#blue',
  },
  keyboardAvoidingView: {
  },  
  container: {
    height: '100%',
  },  
  nomContact: {
    justifyContent:'center',
  },
  headerText:{
  },
  headerMessage:{
    flexDirection:'row',
    justifyContent:'space-around'
  },
  icon:{
    marginTop:20,
  },
  headerIcon: {
    marginTop:15,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal:30
  },
  conversationContainer: {
    flex: 1,
    marginBottom: 10,
    justifyContent: 'flex-end', 
  },
  messageContainer: {
    paddingTop:9,
    paddingHorizontal:4
  },
  messageBubble: {
    marginRight: 8,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    padding: 10,
  },
  messageText: {
    paddingRight: 15,
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal:10
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#CED4DA',
    borderRadius: 18,
    padding: 10,
    marginTop:20,
    backgroundColor:'#fff'
  },
  messageScrollView:{
    height:500
  },
  sendIcon:{ 
    marginLeft:10,
    marginTop:30,
    height:30,
    width:30,
}, 
userMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end', 
  },
  userMessageBubble: {
    marginLeft: 8,
    borderRadius: 8,
    backgroundColor: '#007BFF',
  },
  otherMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start', 
  },
  otherMessageBubble: {
    marginRight: 8,
    marginLeft: 8,
    borderRadius: 8,
    backgroundColor: '#e6e6e6',
  },
  messageText: {
    fontSize: 16,
    color: '#000', 
  },
  userMessageText: {
    color: '#FFF', 
  },
  otherMessageText: {
    color: '#000', 
  },

});
