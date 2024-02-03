import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { View, Text, StyleSheet, SafeAreaView, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback, ScrollView, TouchableOpacity } from 'react-native';

export default function MessagerieScreen({navigation}) {
  return (
  <SafeAreaView style={styles.safeAreaView}>
    <KeyboardAvoidingView>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView>
          <View style={styles.container}>
            <TouchableOpacity  onPress={() => navigation.navigate('Conversation')} style={styles.containerMessage}>
            <FontAwesome name='user' size={35} color={'#182A49'} style={styles.iconMessage}/>
            <View>
              <Text style={styles.nomMessage}>Antoine</Text>
              <Text style={styles.message}>Je n'en ai aucune idées , il faudrais que je re..</Text>
            </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
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
