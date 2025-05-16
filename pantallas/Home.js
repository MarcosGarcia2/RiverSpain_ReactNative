import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import React, { useState, useEffect } from 'react';
import Carousel from 'react-native-reanimated-carousel';
import Constants from 'expo-constants';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';

export default function Home() {

  const navigation = useNavigation();

  const [scroll, setScroll] = useState(true);
  const [peces, setPeces] = useState([]);
  const [pecesDestacados, setPecesDestacados] = useState([]);
  const [zonaDestacada, setZonaDestacada] = useState([]);
  const [error, setError] = useState(null);
  const [rios,setRios]= useState([])
  const hayScroll = () => {
    if (scroll) setScroll(false);
  };

  const { width } = Dimensions.get('window');
  const carouselWidth = width - 20;

  const dataCarrusel=rios.map(rio => ({
    id: rio.id.toString(),
    title: rio.nombre,
    image: { uri: rio.imagen },
  }));
  
  const fetchRios = async () => {
    const apiUrl = Constants.expoConfig.extra.apiUrl;

    if (!apiUrl) {
      setError('La variable de entorno API_URL no está definida.');
      return;
    }

    try {
      const response = await axios.get(`${apiUrl}/rios`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = response.data;
      setRios(data);

      /* const idsDestacados = [1, 9, 21];
      const pecesFiltrados = data.filter(patata => idsDestacados.includes(patata.id));
      setPecesDestacados(pecesFiltrados); */
    } catch (error) {
      console.error('Error fetching peces:', error.message);
      setError(`Error fetching peces: ${error.message}`);
    }
  };
  const renderItemCarrusel = ({ item }) => (
    <Pressable
     onPress={() => navigation.navigate('DetallesRio', { rio: rios.find(p => p.id === parseInt(item.id)) })}
      style={({ pressed }) => [
        styles.tarjetaCarrusel,
        { transform: [{ scale: pressed ? 0.96 : 1 }] },
      ]}>
      <Image source={item.image} style={styles.imagen} />
      <View style={styles.tituloContainer}>
        <Text style={styles.tituloCarrusel}>{item.title}</Text>
      </View>
    </Pressable>

  );

  const dataCarruselPeces = pecesDestacados.map(pez => ({
    id: pez.id.toString(),
    title: pez.nombrecomun,
    image: { uri: pez.urlimagen },
  }));

  const renderItemCarruselPeces = ({ item }) => (
    <Pressable
      onPress={() => navigation.navigate('DetallesPez', { pez: peces.find(p => p.id === parseInt(item.id)) })}
      style={({ pressed }) => [
        styles.tarjetaCarrusel,
        { transform: [{ scale: pressed ? 0.96 : 1 }] },
      ]}
    >
      <Image source={item.image} style={styles.imagen} />
      <View style={styles.tituloContainer}>
        <Text style={styles.tituloCarrusel}>{item.title}</Text>
      </View>
    </Pressable>
  );

  const fetchPeces = async () => {
    const apiUrl = Constants.expoConfig.extra.apiUrl;

    if (!apiUrl) {
      setError('La variable de entorno API_URL no está definida.');
      return;
    }

    try {
      const response = await axios.get(`${apiUrl}/peces`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = response.data;
      setPeces(data);

      const idsDestacados = [1, 9, 21];
      const pecesFiltrados = data.filter(patata => idsDestacados.includes(patata.id));
      setPecesDestacados(pecesFiltrados);
    } catch (error) {
      console.error('Error fetching peces:', error.message);
      setError(`Error fetching peces: ${error.message}`);
    }
  };

  const dataZona = zonaDestacada
    ? {
      title: zonaDestacada.nombre,
      voluntarios: zonaDestacada.voluntarioszona,
    } : null;

  const fetchZona = async () => {
    const apiUrl = Constants.expoConfig.extra.apiUrl;

    try {
      const response = await axios.get(`${apiUrl}/zonas/zonaMasCustodiada`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const zona = response.data;
      setZonaDestacada(zona);
    } catch (error) {
      console.error('Error fetching zona:', error.message);
      setError(`Error fetching zona: ${error.message}`);
    }
  };

  const bigPulse = {
    0: { scale: 1 },
    0.5: { scale: 1.2 },
    1: { scale: 1 },
  };

  const explorarZona = () => {
    if (zonaDestacada && zonaDestacada.latitud && zonaDestacada.longitud) {
      navigation.navigate('Custodiar', {
        ciudadid: zonaDestacada.ciudadid,
      });
    }
  };

  useEffect(() => {
    fetchPeces();
    fetchZona();
    fetchRios();
  }, []);



  return (
    <ScrollView onScrollBeginDrag={hayScroll} scrollEventThrottle={16}>
      <View style={styles.container}>
        <Text style={styles.titulo}>¡Bienvenid@! Más de <Text style={styles.texto1}>41,000,000</Text> de animales te esperan</Text>
        {scroll ? (
          <Animatable.View animation="bounce" iterationCount="infinite" duration={1000}>
            <Ionicons name="arrow-down" size={36} color="#007AFF" />
          </Animatable.View>
        ) : (
          null
        )}
        <View style={styles.containerTituloRios}>
          <Text style={styles.texto2}>Ríos Destacados</Text><Animatable.View
            animation={bigPulse}
            iterationCount="infinite"
            easing="ease-out"
            duration={800}
            style={styles.iconoFuego}
          >
            <Ionicons name="flame" size={18} color="orange" />
          </Animatable.View>
        </View>
        <Carousel
          width={carouselWidth}
          height={250}
          data={dataCarrusel}
          renderItem={renderItemCarrusel}
          loop
          autoPlay={true}
          autoPlayInterval={3000}
          mode="parallax"
          modeConfig={{
            parallaxScrollingScale: 0.85,
            parallaxScrollingOffset: 70,
          }}
          style={{ marginTop: 10 }}
        />
        <View style={styles.containerTituloPeces}>
          <Text style={styles.texto2}>Peces Destacados</Text><Animatable.View
            animation={bigPulse}
            iterationCount="infinite"
            easing="ease-out"
            duration={800}
            style={styles.iconoFuego}
          >
            <Ionicons name="flame" size={18} color="orange" />
          </Animatable.View>
        </View>
        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : dataCarruselPeces.length > 0 ? (
          <Carousel
            width={carouselWidth}
            height={250}
            data={dataCarruselPeces}
            renderItem={renderItemCarruselPeces}
            loop
            autoPlay={true}
            autoPlayInterval={3000}
            mode="parallax"
            modeConfig={{
              parallaxScrollingScale: 0.85,
              parallaxScrollingOffset: 70,
            }}
            style={{ marginTop: 10 }}
          />
        ) : (
          <Text style={styles.cargandoText}>Cargando peces...</Text>
        )}
        <View style={styles.containerTituloPeces}>
          <Text style={styles.texto2}>Zona Destacada</Text><Animatable.View
            animation={bigPulse}
            iterationCount="infinite"
            easing="ease-out"
            duration={800}
            style={styles.iconoFuego}
          >
            <Ionicons name="flame" size={18} color="orange" />
          </Animatable.View>
        </View>
        <View>
          {zonaDestacada && zonaDestacada.latitud && zonaDestacada.longitud ? (
            <View style={{ width: 375, height: 275, borderRadius: 12, overflow: 'hidden', alignItems: 'center', backgroundColor: '#fff', elevation: 10, marginTop: 20 }}>
              <MapView
                style={styles.mapa}
                initialRegion={{
                  latitude: parseFloat(zonaDestacada.latitud),
                  longitude: parseFloat(zonaDestacada.longitud),
                  latitudeDelta: 0.05,
                  longitudeDelta: 0.05,
                }}
              >
                <Marker
                  coordinate={{
                    latitude: parseFloat(zonaDestacada.latitud),
                    longitude: parseFloat(zonaDestacada.longitud),
                  }}
                  title={zonaDestacada.nombre}

                >
                  <Image
                    source={require('../img/logo-azul-claro.png')}
                    style={{ width: 35, height: 35, backgroundColor: '#007AFF', borderRadius: 20 }}
                  />
                </Marker>
              </MapView>
              <View style={styles.tituloContainerMapa}>
                <Text style={{ fontWeight: 'bold', textAlign: 'center', color: 'white' }}>
                  Voluntarios: {zonaDestacada.voluntarioszona.split(',').length}
                </Text>
              </View>
            </View>
          ) : (
            <Text style={styles.cargandoText}>Cargando zona destacada...</Text>
          )}

        </View>
        <View>
          <TouchableOpacity style={{ backgroundColor: '#007AFF', marginTop: 20, padding: 16, borderRadius: 50, elevation: 10, marginBottom: 50, shadowColor: '#000', shadowOffset: {width: 0, height: 6,}, shadowOpacity: 0.3, shadowRadius: 8.3 }} onPress={explorarZona}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Explorar Zona</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    paddingHorizontal: 10,
  },
  titulo: {
    marginTop: 120,
    marginBottom: 25,
    color: 'black',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  texto1: {
    color: '#007AFF',
    fontSize: 22,
    fontWeight: 'bold'
  },
  containerTituloRios: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '100%',
    marginTop: 40,
    flexDirection: 'row'
  },
  texto2: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 2,
    marginRight: 3,
  },
  tarjetaCarrusel: {
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 0,
    width: '100%',
    height: 250,
  },
  imagenContainer: {
    width: '100%',
    height: 180,
    overflow: 'hidden',
  },
  imagen: {
    width: 'auto',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 12,
    elevation: 10,
    shadowColor: '#000', //Para iOS
    shadowOffset: { width: 0, height: 4 }, //Para iOS
    shadowOpacity: 0.3, //Para iOS
    shadowRadius: 6, //Para iOS
    marginBottom: 50,
  },
  tituloContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  tituloCarrusel: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
  },
  containerTituloPeces: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '100%',
    marginTop: 70,
    flexDirection: 'row'
  },
  iconoFuego: {
    marginTop: 1,
  },
  mapa: {
    width: 375,
    height: 300,
    marginTop: 0.1,
  },
  tituloContainerMapa: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 8,
    paddingHorizontal: 10,
  }

});

//ngrok http 8080