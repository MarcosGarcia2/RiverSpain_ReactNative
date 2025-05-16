import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions, TextInput, Keyboard, TouchableWithoutFeedback, Platform } from 'react-native';
import Constants from 'expo-constants';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable';

const { width } = Dimensions.get('window');
const itemSize = (width - 30) / 2;
const aspectRatio = 16 / 9;
const dynamicHeight = itemSize / aspectRatio;

export default function Explorar() {
  const [peces, setPeces] = useState([]);
  const [error, setError] = useState(null);
  const [imagenError, setImagenError] = useState(false);
  const [filtro, setFiltro] = useState('');

  const navigation = useNavigation();

  const fetchPeces = async () => {
    const apiUrl = Constants.expoConfig.extra.apiUrl;

    try {
      const response = await axios.get(`${apiUrl}/peces`);
      setPeces(response.data);
    } catch (err) {
      setError('Error cargando los peces');
      console.error(err.message);
    }
  };

  const calcularImagenError = (id) => {
    setImagenError((prevError) => ({
      ...prevError,
      [id]: true,
    }));
  };

  const pecesFiltrados = peces.filter(p =>
    p.nombrecomun.toLowerCase().includes(filtro.toLowerCase()) ||
    p.nombrecientifico.toLowerCase().includes(filtro.toLowerCase())
  );


  useEffect(() => {
    fetchPeces();
  }, []);

  const renderItem = ({ item }) => (

    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('DetallesPez', { pez: item })}
    >
      <View style={styles.imagenContainer}>
        <Image
          source={
            imagenError[item.id] || !item.urlimagen
              ? require('../img/pez-error.png')
              : { uri: item.urlimagen }
          }
          onError={() => calcularImagenError(item.id)}
          style={styles.imagen}
        />
      </View>
      <View style={styles.tituloContainer}>
        <Text style={styles.nombre}>{item.nombrecomun}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.titulo}>Explorar Peces</Text>
        <Animatable.View animation="fadeInLeft" duration={500} style={styles.buscadorContainer}>
          <Icon name="search" size={22} color="#007AFF" style={styles.iconoLupa} />
          <TextInput
            style={styles.buscador}
            placeholder="Buscar pez..."
            value={filtro}
            onChangeText={setFiltro}
            onBlur={Keyboard.dismiss}
          />
          {filtro.length > 0 && (
            <TouchableOpacity onPress={() => setFiltro('')}>
              <Icon name="close-circle" size={26} color="#007AFF" style={styles.iconoX} />
            </TouchableOpacity>
          )}
        </Animatable.View>
        {error ? (
          <Text style={styles.error}>{error}</Text>
        ) : (
          <FlatList
            data={pecesFiltrados}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            numColumns={2}
            contentContainerStyle={styles.lista}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    paddingTop: 40,
    paddingHorizontal: 10,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#007AFF',
    textAlign: 'left',
    marginBottom: 20,
    marginTop: Platform.OS === 'ios' ? 70 : 50,
  },
  card: {
    backgroundColor: '#111',
    borderRadius: 15,
    marginBottom: 15,
    width: itemSize,
    elevation: 6,
    shadowColor: '#000', // iOS
    shadowOffset: { width: 0, height: 3 }, // iOS
    shadowOpacity: 0.3, // iOS
    shadowRadius: 4.65,
  },
  imagenContainer: {
    width: '100%',
    height: dynamicHeight,
    overflow: 'hidden',
    borderRadius: 15,
  },
  imagen: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  tituloContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nombre: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
  },
  error: {
    color: 'red',
    textAlign: 'center',
  },
  buscadorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === 'ios' ? 15 : 5,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000', // iOS
    shadowOffset: { width: 0, height: 3 }, // iOS
    shadowOpacity: 0.1, // iOS
    shadowRadius: 4.65,
    borderWidth: 2,
    borderColor: '#007AFF'
  },
  iconoLupa: {
    marginRight: 4,
    marginLeft: 6
  },
  buscador: {
    flex: 1,
    fontSize: 16,
  },
  iconoX: {
    marginLeft: 6,
    marginRight: 4
  },

});

