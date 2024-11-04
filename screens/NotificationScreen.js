import React, { useState, useEffect } from "react";
import {View, Text, FlatList, TouchableOpacity, StyleSheet, StatusBar, Alert, ActivityIndicator, } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useSelector } from "react-redux";

const NotificationScreen = ({ navigation }) => {
    
  const user = useSelector((state) => state.utilisateur.value);
  const [activeTab, setActiveTab] = useState("demandes");
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, [activeTab]);

  const fetchNotifications = () => {
    setIsLoading(true);
    const url =
      activeTab === "demandes"
        ? `http://192.168.1.109:3000/propositionCollabs/propositions/initiateur`
        : `http://192.168.1.109:3000/propositionCollabs/propositions/cible`;

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: user.token }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          setNotifications(data.messages);
        }
      })
      .catch((error) => console.error(error))
      .finally(() => setIsLoading(false));
  };

  const handleAction = (messageId, action) => {
    const actionUrl = `http://192.168.1.109:3000/propositionCollabs/propositions/${action}`;
    fetch(actionUrl, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: user.token, propositionId: messageId }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          setTimeout(() => fetchNotifications(), 500);
        }
      })
      .catch((error) => console.error("Erreur lors de l'acceptation/refus:", error));
  };

  const confirmDelete = (itemId) => {
    Alert.alert(
      "Confirmation",
      "Êtes-vous sûr ? Cette action est irréversible.",
      [
        { text: "Annuler", style: "cancel" },
        { text: "Supprimer", style: "destructive", onPress: () => handleDelete(itemId) },
      ]
    );
  };

  const handleDelete = (itemId) => {
    const deleteUrl = `http://192.168.1.109:3000/propositionCollabs/collaboration/delete`;
    fetch(deleteUrl, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: user.token, propositionCollabsId: itemId }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          setNotifications((prevNotifications) =>
            prevNotifications.filter((notif) => notif._id !== itemId)
          );
        }
      })
      .catch((error) => console.error(error));
  };

  const renderReceivedNotificationItem = ({ item }) => {
    const isProcessed = item.statut === "accepté" || item.statut === "refusé";
  
    return (
      <View style={styles.notificationItem}>
        <Text style={styles.notificationText}>{item.message}</Text>
        <View style={styles.buttonsContainer}>
          {isProcessed ? (
            <TouchableOpacity
              style={[styles.button, styles.deleteButton]}
              onPress={() => confirmDelete(item._id)}
            >
              <Text style={styles.choix}>
                {item.statut === "refusé" ? "Supprimer la notification" : "Annuler la colab"}
              </Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity
                style={[styles.button, styles.acceptButton]}
                onPress={() => handleAction(item._id, "accept")}
              >
                <Text style={styles.choix}>Accepté</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.rejectButton]}
                onPress={() => handleAction(item._id, "refuse")}
              >
                <Text style={styles.choix}>Refuser</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    );
  };
  
  const renderSentNotificationItem = ({ item }) => (
    <View style={styles.notificationItem}>
      <Text style={styles.notificationText}>{item.message}</Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={() => confirmDelete(item._id)}
        >
          <Text style={styles.choix}>Annuler la collaboration</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.icon}>
          <FontAwesome name="reply-all" size={28} color={"#287777"} />
        </TouchableOpacity>
        <Text style={styles.title}>Mes collaborations</Text>
      </View>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "offres" && styles.activeTabButton]}
          onPress={() => setActiveTab("offres")}
        >
          <Text style={[styles.tabText, activeTab === "offres" && styles.activeTabText]}>
            Reçu
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "demandes" && styles.activeTabButton]}
          onPress={() => setActiveTab("demandes")}
        >
          <Text style={[styles.tabText, activeTab === "demandes" && styles.activeTabText]}>
            Envoyé
          </Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#287777" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
        data={notifications}
        renderItem={activeTab === "offres" ? renderReceivedNotificationItem : renderSentNotificationItem}
        keyExtractor={(item, index) => (item._id ? item._id.toString() : index.toString())} // Utiliser l'index comme clé si _id est manquant
        contentContainerStyle={styles.listContainer}
      />
      
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1,     backgroundColor: '#e5f6f6',
  },
  header: { flexDirection: "row", alignItems: "center", padding: 16, paddingLeft: 35, paddingTop: 60 },
  icon: { marginRight: 10 },
  title: { fontSize: 22, fontWeight: "bold", color: "#287777", marginLeft: 35 },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    gap: 150,
  },
  tabButton: { padding: 12 },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: "#287777",
  },
  tabText: { fontSize: 16, color: "#666" },
  activeTabText: { color: "#287777", fontWeight: "bold" },
  listContainer: { paddingHorizontal: 16, paddingBottom: 16 },
  notificationItem: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  notificationText: { fontSize: 16, color: "#333" },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "center", // Centre les boutons horizontalement
    alignItems: "center", // Centre les boutons verticalement
    marginTop: 12,
    gap:20
  },
  deleteButton: {
    backgroundColor: "#FF6347",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    width:250,
    alignItems: "center", // Centre le texte du bouton
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: "45%",
    alignItems: "center",
  },
  acceptButton: { backgroundColor: "#28a745" },
  rejectButton: { backgroundColor: "#FF6347" },
  choix: { color: "white", fontWeight: "bold" },
});

export default NotificationScreen;
