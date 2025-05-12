import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import axios from 'axios';
import Constants from 'expo-constants';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRoute, useFocusEffect } from '@react-navigation/native';

export default function Zonas() {
  const [zonas, setZonas] = useState([]);
  const [error, setError] = useState(null);
  const [ciudadBuscada, setCiudadBuscada] = useState('');
  const [zonasFiltradas, setZonasFiltradas] = useState([]);
  const [zonaSeleccionada, setZonaSeleccionada] = useState(null);

  const mapRef = useRef(null);

  const route = useRoute();
  const ciudadid = route.params?.ciudadid;

  const ciudades = {
    1: 'Madrid',
    2: 'Sevilla',
    3: 'Barcelona',
    4: 'Valencia',
    5: 'Salamanca',
  };

  useFocusEffect(
    useCallback(() => {
      if (ciudadid) {
        setCiudadBuscada(ciudades[ciudadid]);
      }
    }, [ciudadid])
  );

  useEffect(() => {
    if (!ciudadBuscada) {
      setZonasFiltradas(zonas);

      if (mapRef.current) {
        mapRef.current.animateToRegion({
          latitude: 40.4168,
          longitude: -3.7038,
          latitudeDelta: 17,
          longitudeDelta: 17,
        }, 1000);
      }

    } else {
      const resultado = zonas.filter(z =>
        ciudades[z.ciudadid]?.toLowerCase().includes(ciudadBuscada.toLowerCase())
      );
      setZonasFiltradas(resultado);

      if (resultado.length > 0 && mapRef.current) {
        const zona = resultado[0];
        mapRef.current.animateToRegion({
          latitude: parseFloat(zona.latitud),
          longitude: parseFloat(zona.longitud),
          latitudeDelta: 0.3,
          longitudeDelta: 0.3,
        }, 1000);
      }
    }
  }, [ciudadBuscada, zonas]);


  useEffect(() => {
    const fetchZonas = async () => {
      const apiUrl = Constants.expoConfig.extra.apiUrl;
      try {
        const response = await axios.get(`${apiUrl}/zonas`);
        setZonas(response.data);
      } catch (err) {
        console.error('Error al obtener zonas:', err.message);
        setError('No se pudieron cargar las zonas');
      }
    };

    fetchZonas();
  }, []);

  const markerPulsado = (zona) => {
    setZonaSeleccionada(zona);
  };

  const custodiar = () => {
    Alert.alert(
      'Próximamente',
      'Actualmente solo es posible custodiar una zona desde nuestra página web: riverspain.com',
      [
        { text: 'Aceptar', style: 'cancel' },
      ],
      { cancelable: true }
    );

  };

  const cerrarInfo = () => {
    setZonaSeleccionada(null);
  };


  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.buscadorContainer}>
        <Icon name="search" size={22} color="#007AFF" style={styles.iconoLupa} />
        <TextInput
          placeholder="Buscar ciudad (ej: Madrid)"
          value={ciudadBuscada}
          onChangeText={setCiudadBuscada}
          style={styles.buscador}
        />
        {ciudadBuscada.length > 0 && (
          <TouchableOpacity onPress={() => setCiudadBuscada('')}>
            <Icon name="close-circle" size={26} color="#007AFF" style={styles.iconoX} />
          </TouchableOpacity>
        )}

      </View>

      <MapView
        ref={mapRef}
        style={styles.mapa}
        initialRegion={{
          latitude: 40.4168,
          longitude: -3.7038,
          latitudeDelta: 5,
          longitudeDelta: 5,
        }}
      >
        {zonasFiltradas.map((zona) => {
          return (
            <Marker
              key={zona.id}
              coordinate={{
                latitude: parseFloat(zona.latitud),
                longitude: parseFloat(zona.longitud),
              }}
              onPress={() => markerPulsado(zona)}
            >
              <Image
                source={require('../img/logo-azul-claro.png')}
                style={{ width: 35, height: 35, backgroundColor: '#007AFF', borderRadius: 20, resizeMode: 'contain' }}
              />
            </Marker>
          );
        })}
      </MapView>
      {zonaSeleccionada && (
        <View style={styles.infoContainer}>
          <View>
            <Text style={styles.infoTitulo}>
              {ciudades[zonaSeleccionada.ciudadid] || 'Ciudad desconocida'}
            </Text>
            <Text style={styles.infoTitulo2}>
              {zonaSeleccionada.nombre || 'Sin nombre'}
            </Text>
            <Text style={styles.infoDescripcion}>
              Voluntarios: {zonaSeleccionada.voluntarioszona ? zonaSeleccionada.voluntarioszona.split(',').length : 0}
            </Text>
          </View>
          <View>
            <TouchableOpacity
              style={styles.infoBoton}
              onPress={() => custodiar(zonaSeleccionada.nombre)}
            >
              <Text style={styles.infoBotonTexto}>Custodiar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cerrarBoton}
              onPress={cerrarInfo}
            >
              <Text style={styles.cerrarBotonTexto}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  buscadorContainer: {
    backgroundColor: 'transparent',
    zIndex: 1,
    top: 80,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingHorizontal: 8,
    paddingVertical: 3,
    elevation: 2,
    borderWidth: 2,
    borderColor: '#007AFF',
    marginHorizontal: 8,
    marginTop: 10,
  },
  iconoLupa: {
    marginRight: 4,
    marginLeft: 6,
  },
  buscador: {
    flex: 1,
    fontSize: 16,
  },
  iconoX: {
    marginLeft: 6,
    marginRight: 4,
  },
  mapa: {
    flex: 1,
  },
  infoContainer: {
    position: 'absolute',
    flexDirection: 'row',
    top: 150,
    left: 20,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#cccccc',
    alignItems: 'center',
    gap: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  infoTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 10,
    textAlign: 'center',
  },
  infoTitulo2: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 2,
    textAlign: 'center',
  },
  infoDescripcion: {
    fontSize: 14,
    color: '#333333',
    textAlign: 'center',
  },
  infoBoton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginBottom: 10,
  },
  infoBotonTexto: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  cerrarBoton: {
    backgroundColor: '#ff3b30',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  cerrarBotonTexto: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },

});
