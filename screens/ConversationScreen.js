import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';
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

  useEffect(() => {
    const { contactToken } = route.params;
    dispatch(setDestinataireToken(contactToken));
    console.log('Recipient Token updated:', contactToken);
  }, [route.params, dispatch]);
  

  useEffect(() => {
    const { contactUsername } = route.params;
    setContactUsername(contactUsername);
  }, []);

  const addMessage = () => {
    if (inputText.trim() !== '') {
      console.log('Recipient Token:', utilisateurDestinataireToken);
      fetch('http://192.168.1.33:3000/messages', {
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
            setMessages([...messages, { text: inputText.trim(), isUser: true }]);
            setInputText('');
          } else {
            console.log('Erreur lors de l\'envoi du message au serveur:', data.error);
          }
        } else {
          console.log('Réponse du serveur non conforme:', data);
        }
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

            <View style={styles.conversationContainer}>
              <ScrollView
                contentContainerStyle={{ flexGrow: 1, backgroundColor: '#fff' }}
                inverted
                keyboardShouldPersistTaps='handled'
                keyboardDismissMode='on-drag'
                onScrollBeginDrag={() => Keyboard.dismiss()}
              >
                {messages.map((message, index) => (
                  <View key={index} style={[styles.messageContainer, message.isUser ? styles.userMessageContainer : styles.otherMessageContainer]}>
                    <View style={[styles.messageBubble, message.isUser ? styles.userMessageBubble : styles.otherMessageBubble]}>
                      <Text style={[styles.messageText, message.isUser ? styles.userMessageText : styles.otherMessageText]}>{message.text}</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>

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
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: '#F4F6F9',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flex: 1,
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
