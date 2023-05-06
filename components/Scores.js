import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Scores = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>High Scores</Text>
      <View style={styles.scores}>
        <Text style={styles.score}>1. 100</Text>
        <Text style={styles.score}>2. 80</Text>
        <Text style={styles.score}>3. 60</Text>
        <Text style={styles.score}>4. 40</Text>
        <Text style={styles.score}>5. 10</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f2f2f2',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 250,
  },
  scores: {
    alignItems: 'flex-start',
  },
  score: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default Scores;
  
