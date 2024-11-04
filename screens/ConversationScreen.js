import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';
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
  const [isInputFocused, setIsInputFocused] = useState(false);

  const fetchMessages = () => {
    
    fetch(`https://colab-backend-iota.vercel.app/messages/${utilisateurDestinataireToken}/${senderToken}`)
      .then(response => response.json())
      .then(data => {
        const messagesWithUserFlag = data.messages.map(message => {
          return { ...message, isUser: message.senderToken === senderToken };
        });
        const sortedMessages = messagesWithUserFlag.sort((a, b) => new Date(b.date) - new Date(a.date));
        setMessages(sortedMessages);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des messages:', error);
      });
  };

  const markMessagesAsRead = () => {
    fetch(`https://colab-backend-iota.vercel.app/messages/read/${utilisateurDestinataireToken}/${senderToken}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        if (data.result) {
          fetchMessages(); 
        } else {
          console.log('Erreur lors de la mise à jour des messages:', data.error);
        }
      })
      .catch(error => console.error('Erreur lors de la mise à jour des messages comme lus:', error));
  };

  useEffect(() => {
    fetchMessages();
    markMessagesAsRead(); 
    const intervalId = setInterval(fetchMessages, 1000);

    return () => clearInterval(intervalId);
  }, [utilisateurDestinataireToken]);

  useEffect(() => {
    const { contactToken, contactUsername } = route.params;
    dispatch(setDestinataireToken(contactToken));
    setContactUsername(contactUsername);
  }, [route.params, dispatch]);

  const addMessage = () => {
    if (inputText.trim() !== '') {
      const messageData = {
        text: inputText.trim(),
        senderToken: senderToken,
        recipientToken: utilisateurDestinataireToken,
        conversationId: `${senderToken}${utilisateurDestinataireToken}`,
      };

      fetch(`https://colab-backend-iota.vercel.app/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
      })
        .then(response => response.json())
        .then(data => {
          if (data && data.success) {
            setMessages(prevMessages => [{ ...data.savedMessage, isUser: true }, ...prevMessages]);
          } else {
            console.log('Erreur lors de l\'envoi du message:', data.error || 'Erreur inconnue');
          }
          setInputText('');
        })
        .catch(error => {
          console.error('Erreur lors de la connexion au serveur:', error);
        });
    }
  };
  
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <View style={styles.headerMessage}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.icon}>
            <FontAwesome name='reply-all' size={28} color={'#287777'} />
          </TouchableOpacity>
          <View style={styles.nomContact}>
            <Text style={styles.headerText}>{contactUsername}</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("Utilisateur")}>
            <FontAwesome name='user' size={35} color={'#287777'} style={styles.headerIcon} />
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : null}
          style={styles.keyboardAvoidingView}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
          </TouchableWithoutFeedback>

          <View style={styles.inputContainer}>
            <TextInput
              placeholder='Votre message'
              style={[styles.textInput, isInputFocused ? { marginBottom: 50 } : null ]}
              value={inputText}
              onChangeText={(text) => setInputText(text)}
              onSubmitEditing={addMessage}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
            />
            <TouchableOpacity onPress={() => addMessage()}>
              <FontAwesome name='send' size={20} color={'#007BFF'} style={[styles.sendIcon,  isInputFocused ? { marginBottom: 50 } : null]} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex:1,
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
