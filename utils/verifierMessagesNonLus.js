// utils/verifierMessagesNonLus.js

export const verifierMessagesNonLus = async (apiUrl, userToken) => {
    try {
      const response = await fetch(`${apiUrl}/messages/conversations/${userToken}`);
      const data = await response.json();
  
      console.log("Réponse API pour les conversations:", data);
  
      // Vérifie que 'conversations' est un tableau
      if (Array.isArray(data.conversations)) {
        // Vérifie s'il y a des messages non lus dans les conversations
        return data.conversations.some(convo => convo.isRead === false && convo.recipientToken === userToken);
      }
      return false;
    } catch (error) {
      console.error('Erreur lors de la vérification des messages non lus:', error);
      return false;
    }
  };
  