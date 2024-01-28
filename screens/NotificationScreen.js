import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, StatusBar, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { updateCollaborations } from '../reducers/utilisateur';

const NotificationScreen = ({ navigation }) => {

  const user = useSelector(state => state.utilisateur.value);

  const [activeTab, setActiveTab] = useState('demandes');
  const [notifications, setNotifications] = useState([]);
  const [demandeMessage, setDemandeMessage] = useState([]);

  const [lastAcceptedMessage, setLastAcceptedMessage] = useState([]);
  const [deletedNotifications, setDeletedNotifications] = useState([]);

  const fetchNotifications = () => {
    const url = activeTab === 'demandes'
      ? 'http://192.168.1.33:3000/propositionCollabs/propositions/initiateur'
      : 'http://192.168.1.33:3000/propositionCollabs/propositions/cible';

    const requestBody = {
      token: user.token,
    };

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
      .then(response => response.json())
      .then(data => {
        if (data.result) {
          if (activeTab === 'demandes') {
            setDemandeMessage(data.messages);
          } else {
            setNotifications(data.messages);
          }
        }
      })
      .catch(error => {
        console.error(error);
      });
    };
    
  useEffect(() => {
  
      if (lastAcceptedMessage && lastAcceptedMessage.length > 0) {
        const lastMessage = lastAcceptedMessage[lastAcceptedMessage.length - 1];
        Alert.alert('Acceptation réussie', `Acceptation de "${lastMessage}" réussie.`, [{ text: 'OK', onPress: () => fetchNotifications() }]);
      }
  }, [lastAcceptedMessage]);

  const handleAccept = (message) => {
    const acceptUrl = 'http://192.168.1.33:3000/propositionCollabs/propositions/accept';
    const requestBody = {
      token: user.token,
      message: message,
    };
  
    fetch(acceptUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
      .then(response => response.json())
      .then(data => {
        if (data.result) {
          setDeletedNotifications(prevDeletedNotifications => [...prevDeletedNotifications, message]);
          setLastAcceptedMessage(prevAcceptedMessages => [...prevAcceptedMessages, message]);
        }
      })
      .catch(error => {
        console.error(error);
      });
  };
  
  
  const handleReject = (message) => {

    const rejectUrl = 'http://192.168.1.33:3000/propositionCollabs/propositions/refuse';
    const requestBody = {
      token: user.token,
      message: message,
    };
  
    fetch(rejectUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
      .then(response => response.json())
      .then(data => {
        setDeletedNotifications(prevDeletedNotifications => [...prevDeletedNotifications, message]);
        fetchNotifications();
      })
      .catch(error => {
        console.error(error);
      });
  };
  
  const handleDelete = (item) => {

    const propositionCollabsId = item?.propositionCollabsId || item?._id;
   
    const deleteUrl = 'http://192.168.1.33:3000/propositionCollabs/collaboration/delete';
  
    fetch(deleteUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ propositionCollabsId }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.result) {
          setDeletedNotifications(prevDeletedNotifications =>
            [...prevDeletedNotifications, item]
          );
        } else {
          console.error('Erreur lors de la suppression:', data.error);
        }
      })
      .catch(error => {
        console.error('Erreur lors de la suppression:', error);
      });
  };
  
  useEffect(() => {
    fetchNotifications();
  }, [activeTab]);

  const renderNotificationItem = ({ item, index }) => (
    <View style={styles.notificationItem}>
      <Text style={styles.notificationText}>{item.message}</Text>
      <View style={styles.buttonsContainer}>
        {deletedNotifications.includes(item.message) ? (
          <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            onPress={() => {
              handleDelete(item);
            }}
          >
            <Text style={styles.choix}>Supprimer</Text>
          </TouchableOpacity>
        ) : (
          <>
            {console.log('Index:', index)}
            {console.log('Last Accepted Message:', lastAcceptedMessage)}
  
            {lastAcceptedMessage && lastAcceptedMessage.includes(item.message) ? (
              <Text style={styles.choix}>En cours de traitement...</Text>
            ) : (
              <>
                <TouchableOpacity
                  style={[styles.button, styles.acceptButton]}
                  onPress={() => handleAccept(item.message)}
                >
                  <Text style={styles.choix}>Accepté</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.rejectButton]}
                  onPress={() => handleReject(item.message)}
                >
                  <Text style={styles.choix}>Refuser</Text>
                </TouchableOpacity>
              </>
            )}
          </>
        )}
      </View>
    </View>
  );
  
  
  
  const renderDemandeMessageItem = ({ item, index }) => (
    <View style={styles.demandeMessageContainer}>
      <Text style={styles.demandeMessageText}>{item.message}</Text>
      <View style={styles.separator} />
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.icon}>
          <FontAwesome name='chevron-left' size={28} color={'#3A3960'} />
        </TouchableOpacity>
        <Text style={styles.title}>Mes collaboration</Text>
      </View>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'offres' && styles.activeTabButton]}
          onPress={() => setActiveTab('offres')}
        >
          <Text style={[styles.tabText, activeTab === 'offres' && styles.activeTabText]}>Reçu</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'demandes' && styles.activeTabButton]}
          onPress={() => setActiveTab('demandes')}
        >
          <Text style={[styles.tabText, activeTab === 'demandes' && styles.activeTabText]}>Envoyé</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {activeTab === 'offres' ? (
          <View style={styles.listContainer}>
            <FlatList
              data={notifications}
              renderItem={renderNotificationItem}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        ) : (
          <View style={styles.listContainer}>
            <FlatList
              data={demandeMessage}
              renderItem={renderDemandeMessageItem}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  //-----------------------  NAVBAR  ---------------------------------

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop:60,
    marginBottom: 10,
  },
  icon: {
    marginLeft: 25,
    marginRight:60
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },

  //-----------------------  BOUTONS  ---------------------------------

  tabContainer: {
    flexDirection: 'row',
    marginTop:10
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth:1,
    margin:5,
    borderRadius: 12,
    backgroundColor:'#fff'
  },
  activeTabButton: {   
    height:50,
     backgroundColor: '#182A49'
  },
  tabText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 18,
  },
  activeTabText: {
    color: 'white',
    padding: 5,
  },

  //-----------------------  NOTIFICATIONS  ---------------------------------

  content: {
    flex: 1,
    padding: 16,
  },
  listContainer: {
    flex: 1,
  },
  notificationItem: {
    marginBottom: 16,
    padding: 16,
    borderRadius:12,
    backgroundColor: '#E9E9E9',
  },
  notificationText: {
    fontSize: 16,
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 12,
  },
  acceptButton: {
    backgroundColor: '#349013',
    marginRight: 10,
  },
  rejectButton: {
    backgroundColor: '#EC4C4C',
    marginLeft: 15,
  },
  choix:{
    color:'white',
    fontSize:18
  },
  demandeMessageContainer: {
    marginBottom: 10,
  },
  demandeMessageText: {
    fontSize: 16,
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 10,
  },
});

export default NotificationScreen;
