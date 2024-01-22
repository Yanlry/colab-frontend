import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MessagerieScreen() {
  return (
    <View style={styles.container}>
      <Text>Messagerie</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
