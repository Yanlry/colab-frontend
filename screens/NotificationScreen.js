import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, StatusBar, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

const NotificationScreen = ({ navigation }) => {

  const user = useSelector(state => state.utilisateur.value);

  const [activeTab, setActiveTab] = useState('demandes');
  const [notifications, setNotifications] = useState([]);
  const [demandeMessage, setDemandeMessage] = useState([]);

  const [lastAcceptedMessage, setLastAcceptedMessage] = useState([]);
  const [deletedNotifications, setDeletedNotifications] = useState([]);

  const fetchNotifications = () => {
    const url = activeTab === 'demandes'
      ? 'http://192.168.1.109:3000/propositionCollabs/propositions/initiateur'
      : 'http://192.168.1.109:3000/propositionCollabs/propositions/cible';

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

 
  
  const handleReject = (message) => {

    const rejectUrl = 'http://192.168.1.109:3000/propositionCollabs/propositions/refuse';
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
   
    const deleteUrl = 'http://192.168.1.109:3000/propositionCollabs/collaboration/delete';
  
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

  const handleAccept = (message) => {
    const acceptUrl = 'http://192.168.1.109:3000/propositionCollabs/propositions/accept';
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
          // Ajouter le message dans les notifications supprimées pour actualiser l'affichage
          setDeletedNotifications((prev) => [...prev, message]);
          setLastAcceptedMessage((prev) => [...prev, message]);
        }
      })
      .catch(error => {
        console.error(error);
      });
  };
  
  const renderNotificationItem = ({ item }) => {
    const isAccepted = lastAcceptedMessage && lastAcceptedMessage.includes(item.message);
    const isDeleted = deletedNotifications && deletedNotifications.includes(item.message);
  
    return (
      <View style={[styles.notificationItem, styles.receivedNotification]}>
        <Text style={styles.notificationText}>{item.message}</Text>
        <View style={styles.buttonsContainer}>
          {isAccepted || isDeleted ? (
            <TouchableOpacity
              style={[styles.button, styles.deleteButton]}
              onPress={() => handleDelete(item)}
            >
              <Text style={styles.choix}>Supprimer de la liste</Text>
            </TouchableOpacity>
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
        </View>
      </View>
    );
  };
  
  
  const renderDemandeMessageItem = ({ item, index }) => (
    <View style={[styles.notificationItem, styles.sentNotification]}>
      <Text style={styles.demandeMessageText}>{item.message}</Text>
      <View style={styles.separator} />
    </View>
  );
  

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.icon}>
          <FontAwesome name='chevron-left' size={28} color={'#287777'} />
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
     backgroundColor: '#287777'
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

  notificationItem: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F3F3F3',
    borderColor: '#E0E0E0',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  receivedNotification: {
    backgroundColor: '#E9F7EF', // Couleur de fond pour les messages reçus
  },
  sentNotification: {
    backgroundColor: '#FFF3CD', // Couleur de fond pour les messages envoyés
  },
  notificationText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 12,
    marginHorizontal: 5,
  },
  acceptButton: {
    backgroundColor: '#4CAF50', // Vert pour accepter
  },
  rejectButton: {
    backgroundColor: '#F44336', // Rouge pour refuser
  },
  deleteButton: {
    backgroundColor: '#757575', // Gris pour supprimer
  },
  pendingText: {
    fontSize: 16,
    color: '#FF9800', // Orange pour le texte en cours
  },
  choix: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  //-----------------------  DEMANDES ENVOYÉES  ---------------------------------

  demandeMessageContainer: {
    marginBottom: 10,
  },
  demandeMessageText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  separator: {
    height: 1,
    backgroundColor: '#D3D3D3',
    marginVertical: 10,
  },

  //-----------------------  TAB HEADER  ---------------------------------

  activeTabButton: {   
    height: 50,
    backgroundColor: '#287777'
  },
  activeTabText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default NotificationScreen;
