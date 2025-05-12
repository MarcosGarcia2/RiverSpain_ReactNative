import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View, Text, TouchableOpacity, Image, Platform } from 'react-native';

import Carga from './pantallas/Pantalla_Carga.js';
import Home from './pantallas/Home.js';
import PantallaPerfil from './pantallas/Perfil.js';
import PantallaCustodiar from './pantallas/Custodiar.js';
import PantallaExplorar from './pantallas/Explorar.js';
import DetallesPez from './pantallas/DetallesPez.js';
import DetallesRio from './pantallas/DetallesRio.js';
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function Cabecero() {
  return (
    <View style={styles.header}>
      <View style={styles.divImagen}>
        <Image
          source={require('./img/logo-azul.png')}
          style={styles.headerImage}
        />
      </View>
      <Text style={styles.headerText}>RiverSpain</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    display: 'flex',
    flexDirection: 'row',
    height: Platform.OS === 'android' ? 80 : 100,
    backgroundColor: '#fff',
    justifyContent: 'start',
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1000,
    elevation: 5,
  },
  headerText: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
    top: Platform.OS === 'android' ? 42 : 60,
    marginLeft: 8,
    fontFamily: 'Montserrat',
  },
  divImagen: {
    width: 40,
    height: 40,
    top: Platform.OS === 'android' ? 36 : 52,
    marginLeft: 10,
  },
  headerImage: {
    width: 40,
    height: 40,
  },
});

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        header: () => <Cabecero />,
        headerShown: true,
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Inicio') iconName = 'home';
          else if (route.name === 'Explorar') iconName = 'compass';
          else if (route.name === 'Custodiar') iconName = 'map';
          else if (route.name === 'Perfil') iconName = 'person';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          height: 110,
          paddingTop: 10,
        },
        tabBarButton: (props) => (
          <TouchableOpacity
            {...props}
            activeOpacity={0.6}
          />
        ),
      })}
    >
      <Tab.Screen name="Inicio" component={Home} />
      <Tab.Screen name="Explorar" component={PantallaExplorar} />
      <Tab.Screen name="Custodiar" component={PantallaCustodiar} />
      <Tab.Screen name="Perfil" component={PantallaPerfil} />
    </Tab.Navigator>
  );
}
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Carga" component={Carga} />
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="DetallesPez" component={DetallesPez} />
       <Stack.Screen name="DetallesRio" component={DetallesRio} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
