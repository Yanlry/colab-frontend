import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useDebounce } from 'use-debounce';

export default function GeoAPIGouvAutocomplete({ onCitySelected }) {
  const [query, setQuery] = useState('');
  const [cities, setCities] = useState([]);
  const [debouncedQuery] = useDebounce(query, 300);

  useEffect(() => {
    
    if (debouncedQuery.length >= 3) {
      const fetchCities = async () => {
        try {
          const response = await fetch(`https://geo.api.gouv.fr/communes?nom=${debouncedQuery}&fields=departement&boost=population&limit=5`);
          const data = await response.json();
          console.log('Données reçues :', data);
          setCities(data);
        } catch (error) {
          console.error('Erreur lors de la récupération des villes:', error);
        }
      };

      fetchCities();
    } else {
      setCities([]);
    }
  }, [debouncedQuery]);

  const selectCity = (city) => {
    onCitySelected(city);
    setQuery('');
    setCities([]); 
  };

  return (
    <FlatList
      ListHeaderComponent={
        <TextInput
          style={styles.saisie}
          placeholder='Rechercher une ville'
          value={query}
          onChangeText={(text) => setQuery(text)}
        />
      }
      data={cities}
      keyExtractor={(item) => item.code || item.nom}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => selectCity(item)}>
          <Text style={styles.cityItem}>{item.nom}, {item.departement.nom}</Text>
        </TouchableOpacity>
      )}
    />
  );
};

const styles = StyleSheet.create({
  saisie: {
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 20,
    marginBottom: 10,
  },
  cityItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    backgroundColor:'white'

  },
});
