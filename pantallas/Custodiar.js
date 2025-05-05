import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Custodiar() {
  return (
    <View style={styles.container}>
      <Text>Pantalla de Custodiar Zonas</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});