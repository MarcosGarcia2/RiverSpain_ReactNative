import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

const { width, height } = Dimensions.get('window');

export default DetallesRio = ({ route }) => {
  const { rio } = route.params;
  const [imagenError, setImagenError] = useState(false);
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.botonAtras}>
          <Ionicons name="arrow-back" size={28} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalles del Río</Text>
      </View>
      <Animatable.View animation="fadeInUp" duration={800} style={styles.header}>
        <Text style={styles.titulo}>{rio.nombre}</Text>
      </Animatable.View>
      <Animatable.View animation="zoomIn" duration={800} delay={200} style={styles.imageContainer}>
        <Image source={
          imagenError || !rio.imagen
            ? require('../img/pez-error.png')
            : { uri: rio.imagen }
        }
          onError={() => setImagenError(true)}
          style={styles.imagen} />
      </Animatable.View>
      <Animatable.View animation="fadeInUp" duration={800} delay={400} style={styles.infoContainer}>
        <Text style={styles.label}>Descripción:</Text>
        <Text style={styles.texto}>{rio.descripcion}</Text>
        
      </Animatable.View>
      <Animatable.View animation="fadeInUp" duration={800} delay={400} style={{ height: 150, flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
        <Image source={require('../img/logo-azul-claro.png')} style={{ height: 60, width: 60, borderRadius: 50, backgroundColor: '#007AFF', elevation: 3 }}></Image>
      </Animatable.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    paddingHorizontal: width * 0.03,

  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: height * 0.04,
  },
  botonAtras: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
    marginLeft: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 10,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginTop: height * 0.03,
  },
  subtitulo: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#555',
  },
  imagen: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 12,
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  infoContainer: {
    paddingHorizontal: 10,
    marginBottom: 40,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    marginTop: 10,
  },
  texto: {
    fontSize: 14,
    color: '#000',
    marginBottom: 10,
    textAlign: 'justify',
  },
});
