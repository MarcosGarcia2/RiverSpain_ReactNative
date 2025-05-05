import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, Animated } from 'react-native';

export default function Carga({ navigation }) {
    const fadeAnim = new Animated.Value(0);
  
    useEffect(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
  
      const contador = setTimeout(() => {
        navigation.replace('Main');
      }, 3000);
  
      return () => clearTimeout(contador);
    }, []);
  
    return (
      <View style={styles.contenedor}>
        <Animated.Image
          source={require('../img/logo-azul.png')}
          style={[styles.logo, { opacity: fadeAnim }]}
          resizeMode="contain"
        />
        <Text style={styles.texto}>RiverSpain</Text>
        <Text style={styles.texto2}>©2025 RiverSpain</Text>
        <Text style={styles.texto2}>Versión 1.0</Text>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    contenedor: {
      flex: 1,
      backgroundColor: '#f4f4f4',
      justifyContent: 'center',
      alignItems: 'center',
    },
    logo: {
      width: 150,
      height: 150,
      marginBottom: 10,
    },
    texto: {
      fontSize: 40,
      fontWeight: 'bold',
      marginBottom: 20,
      color: '#333',
    },
    texto2: {
        fontSize: 11,
        color: 'grey',
        top: 250,
    },
  });