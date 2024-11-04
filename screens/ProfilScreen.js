import React, { useState, useEffect } from "react";
import {StyleSheet, Text, View, TouchableOpacity,TextInput, Alert, KeyboardAvoidingView, SafeAreaView, Modal, FlatList, ScrollView, } from "react-native";
import { useSelector } from "react-redux";

export default function ProfilScreen({ navigation }) {
    
  const user = useSelector((state) => state.utilisateur.value);

  const [isLearnModalVisible, setIsLearnModalVisible] = useState(false);
  const [isTeachModalVisible, setIsTeachModalVisible] = useState(false);
  const [activitesDisponibles, setActivitesDisponibles] = useState([]);
  const [bio, setBio] = useState("");
  const [username, setUsername] = useState(user.username);
  const [phone, setPhone] = useState(user.phone);
  const [learn, setLearn] = useState([]);
  const [teach, setTeach] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetch(`https://colab-backend-iota.vercel.app/profiles/activites`)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.activites) {
          setActivitesDisponibles(data.activites);
        }
      });

    fetch(`https://colab-backend-iota.vercel.app/users/profile/${user.token}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          setBio(data.profile.bio || "");
          setPhone(data.profile.phone || "");
          setUsername(data.profile.username || "");
        } else {
          console.error(
            "Erreur lors de la récupération des informations de profil:",
            data.error
          );
        }
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la récupération des informations de profil:",
          error
        );
      });

    fetch(`https://colab-backend-iota.vercel.app/profiles/activites/${user.token}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          setTeach(data.teach); 
          setLearn(data.learn); 
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la récupération des activités de l'utilisateur:",
          error
        );
        setIsLoading(false);
      });
  }, []);

  const renderLearnModal = () => {
    const currentCategoriesHeight = learn.length * 50;
    const availableCategoriesHeight = Math.min(
      (activitesDisponibles.length - learn.length) * 50,
      400
    );

    return (
      <Modal
        visible={isLearnModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Catégories actuelles</Text>
            <FlatList
              style={[
                styles.activitySelected,
                { height: currentCategoriesHeight },
              ]}
              data={learn}
              keyExtractor={(item) => item}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  onPress={() => toggleLearnSelection(item)}
                  style={[
                    styles.modalItem,
                    {
                      alignItems: "center",
                      borderRadius: 30,
                      margin: 2,
                      backgroundColor: learn.includes(item)
                        ? "#287777"
                        : "white",
                      marginBottom: index === learn.length - 1 ? 10 : 0, 
                    },
                  ]}
                >
                  <Text
                    style={{ color: learn.includes(item) ? "white" : "black" }}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />

            <Text style={styles.modalTitle}>Autres catégories</Text>
            <FlatList
              style={{ height: availableCategoriesHeight }}
              data={activitesDisponibles.filter(
                (activite) => !learn.includes(activite)
              )}
              keyExtractor={(item) => item}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  onPress={() => toggleLearnSelection(item)}
                  style={[
                    styles.modalItem,
                    {
                      alignItems: "center",
                      borderRadius: 30,
                      margin: 2,
                      backgroundColor: learn.includes(item)
                        ? "#287777"
                        : "white",
                      marginBottom:
                        index ===
                        activitesDisponibles.filter(
                          (activite) => !learn.includes(activite)
                        ).length -
                          1
                          ? 10
                          : 0, 
                    },
                  ]}
                >
                  <Text
                    style={{ color: learn.includes(item) ? "white" : "black" }}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />

            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}

            <TouchableOpacity
              style={styles.modalClose}
              onPress={handleSaveLearn}
            >
              <Text style={{ color: "white" }}>Valider</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  const renderTeachModal = () => {
    const currentCategoriesHeight = teach.length * 50;
    const availableCategoriesHeight = Math.min(
      (activitesDisponibles.length - teach.length) * 50,
      400
    );

    return (
      <Modal
        visible={isTeachModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Catégories actuelles</Text>
            <FlatList
              style={[
                styles.activitySelected,
                { height: currentCategoriesHeight },
              ]}
              data={teach}
              keyExtractor={(item) => item}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  onPress={() => toggleTeachSelection(item)}
                  style={[
                    styles.modalItem,
                    {
                      alignItems: "center",
                      borderRadius: 30,
                      margin: 1,
                      backgroundColor: teach.includes(item)
                        ? "#287777"
                        : "white",
                      marginBottom: index === teach.length - 1 ? 10 : 0,
                    },
                  ]}
                >
                  <Text
                    style={{ color: teach.includes(item) ? "white" : "black" }}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />

            <Text style={styles.modalTitle}>Autres catégories</Text>
            <FlatList
              style={{ height: availableCategoriesHeight }}
              data={activitesDisponibles.filter(
                (activite) => !teach.includes(activite)
              )}
              keyExtractor={(item) => item}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  onPress={() => toggleTeachSelection(item)}
                  style={[
                    styles.modalItem,
                    {
                      alignItems: "center",
                      borderRadius: 30,
                      margin: 1,
                      backgroundColor: teach.includes(item)
                        ? "#287777"
                        : "white",
                      marginBottom:
                        index ===
                        activitesDisponibles.filter(
                          (activite) => !teach.includes(activite)
                        ).length -
                          1
                          ? 10
                          : 0, 
                    },
                  ]}
                >
                  <Text
                    style={{ color: teach.includes(item) ? "white" : "black" }}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />

            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}

            <TouchableOpacity
              style={styles.modalClose}
              onPress={handleSaveTeach}
            >
              <Text style={{ color: "white" }}>Valider</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  const toggleLearnSelection = (activity) => {
    if (learn.includes(activity)) {
      setLearn(learn.filter((item) => item !== activity)); 
    } else {
      setLearn([...learn, activity]); 
    }
  };

  const toggleTeachSelection = (activity) => {
    if (teach.includes(activity)) {
      setTeach(teach.filter((item) => item !== activity)); 
    } else {
      setTeach([...teach, activity]); 
    }
  };

  const handleSaveLearn = () => {
    if (learn.length === 0) {
      setErrorMessage(
        "Veuillez choisir au moins une catégorie avant de valider."
      );
      return;
    }

    setErrorMessage(""); 

    fetch(`https://colab-backend-iota.vercel.app/profiles/learn`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: user.token, activites: learn }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          console.log('Activités "learn" mises à jour avec succès');
          setIsLearnModalVisible(false); 
        } else {
          console.error(
            'Erreur lors de la mise à jour des activités "learn":',
            data.error
          );
        }
      })
      .catch((error) =>
        console.error(
          'Erreur lors de la mise à jour des activités "learn":',
          error
        )
      );
  };

  const handleSaveTeach = () => {
    if (teach.length === 0) {
      setErrorMessage(
        "Veuillez choisir au moins une catégorie avant de valider."
      );
      return;
    }

    setErrorMessage(""); 

    fetch(`https://colab-backend-iota.vercel.app/profiles/teach`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: user.token, activites: teach }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          console.log('Activités "teach" mises à jour avec succès');
          setIsTeachModalVisible(false); 
        } else {
          console.error(
            'Erreur lors de la mise à jour des activités "teach":',
            data.error
          );
        }
      })
      .catch((error) =>
        console.error(
          'Erreur lors de la mise à jour des activités "teach":',
          error
        )
      );
  };

  const handleBioChange = (text) => {
    setBio(text);
  };

  const handleValider = () => {
    if (!bio.trim()) {
      Alert.alert("Erreur", "Veuillez entrer une bio avant de continuer.");
      return;
    }

    const requestBody = {
      token: user.token,
      username: username,
      phone: phone,
      bio: bio,
    };

    fetch(`https://colab-backend-iota.vercel.app/users/updateProfile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          Alert.alert(
            "Profil mis à jour avec succès!",
            "Votre profil a été mis à jour.",
            [
              {
                text: "OK",
                onPress: () => {
                  navigation.navigate("TabNavigator", { screen: "Accueil" });
                },
              },
            ],
            {
              cancelable: false,
            }
          );
        } else {
          Alert.alert(
            "Erreur",
            data.error || "Erreur lors de la mise à jour du profil"
          );
        }
      })
      .catch((error) => {
        console.error("Erreur lors de la mise à jour du profil:", error);
        Alert.alert(
          "Erreur",
          "Une erreur est survenue lors de la mise à jour du profil"
        );
      });
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <KeyboardAvoidingView behavior={null} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.container}>
            <View style={styles.titleContainer}>
              <Text style={styles.titleText}>Mon profil</Text>
            </View>

            <View style={styles.contentContainer}>
              <View style={styles.infoContainer}>
                <Text style={styles.label}>Nom d'utilisateur</Text>
                <TextInput
                  style={styles.input}
                  value={username}
                  onChangeText={setUsername}
                />

                <Text style={styles.label}>Téléphone</Text>
                <TextInput
                  style={styles.inputPhone}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />

                <Text style={styles.label}>Votre bio</Text>
                <TextInput
                  style={styles.inputTextarea}
                  multiline
                  placeholder="Parlez-nous un peu plus de vous pour permettre aux autres utilisateurs de mieux vous connaître (3000 caractères maximum)."
                  onChangeText={handleBioChange}
                  value={bio}
                />

                {isLoading ? (
                  <Text style={styles.conditionMsg}>
                    Chargement des activités en cours...
                  </Text>
                ) : (
                  <View style={styles.listLearnTeach}>
                    <View style={styles.listeLearn}>
                      <Text style={styles.labelList}>
                        Que pouvez voulez vous apprendre ?
                      </Text>
                      <TouchableOpacity
                        onPress={() => setIsLearnModalVisible(true)}
                        style={styles.buttonList}
                      >
                        <Text style={styles.activitySelected}>
                          {learn.length > 0
                            ? `${learn.length} activité${
                                learn.length > 1 ? "s" : ""
                              } choisie${learn.length > 1 ? "s" : ""}`
                            : "Sélectionnez vos activités à apprendre"}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.listeTeach}>
                      <Text style={styles.labelList}>
                        Que pouvez vous nous enseignez ?
                      </Text>
                      <TouchableOpacity
                        onPress={() => setIsTeachModalVisible(true)}
                        style={styles.buttonList}
                      >
                        <Text style={styles.activitySelected}>
                          {teach.length > 0
                            ? `${teach.length} activité${
                                teach.length > 1 ? "s" : ""
                              } choisie${teach.length > 1 ? "s" : ""}`
                            : "Sélectionnez vos activités à enseigner"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            </View>

            {renderLearnModal()}
            {renderTeachModal()}

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={handleValider}>
                <Text style={styles.buttonText}>Valider</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      {renderLearnModal()}
      {renderTeachModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: "#e5f6f6",
    alignItems: "center",
  },
  contentContainer: {
    padding: 20,
  },
  titleContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
    color:'#287777'
  },
  profileImageContainer: {
    marginBottom: 25,
    alignItems: "center",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  imageUploadContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
  },
  label: {
    marginBottom:12,
    fontWeight: "bold",
    color: "#1F5C5C",
    textAlign:'center'
  },
  labelList: {
    marginBottom:5,
    fontWeight: "bold",
    color: "#1F5C5C",
    textAlign:'center',
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderRadius: 30,
    padding: 20,
    marginBottom: 20,
    width: 330,
    backgroundColor:'white'
  },
  inputPhone: {
    height: 50,
    borderColor: "#ccc",
    borderRadius: 30,
    marginBottom: 20,
    backgroundColor:'white',
    padding: 20,
  },
  inputTextarea: {
    borderColor: "#ccc",
    borderRadius: 30,
    padding: 20,
    marginBottom: 20,
    backgroundColor:'white',
    height: 120,
  },
  inputTextarea: {
    width: '100%',
    marginBottom: 20,
    height: 120,
    backgroundColor:'white',
    padding: 20,
    fontSize: 16,
    lineHeight: 22, 
    borderRadius: 30,
    textAlignVertical: 'top', 
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    height: 50,
  },
  button: {
    backgroundColor: "#3CB371",
    borderRadius: 30,
    justifyContent: "center",
    width: 200,
    paddingVertical: 15,
    alignItems: "center",
  },
  buttonText: {
    textAlign: "center",
    color: "white",
    fontSize: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    marginHorizontal: 20,
    borderRadius: 5,
    padding: 20,
    width: "80%",
    maxHeight: "80%",
    alignSelf: "center",
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  modalClose: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#28A745",
    alignItems: "center",
    borderRadius: 5,
  },
  activitySelected: {
    color: "white",
    marginBottom: 5,
    marginTop: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonList: {
    backgroundColor: "#287777",
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 30,
  },
});
