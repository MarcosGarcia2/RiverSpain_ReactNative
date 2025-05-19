import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Linking, Platform } from 'react-native';
import axios from 'axios';
import Constants from 'expo-constants';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable';


export default function Perfil() {

  const [nombre, setNombre] = useState('');
  const [clave, setClave] = useState('');
  const [usuario, setUsuario] = useState(null);
  const [error, setError] = useState('');

  const iniciarSesion = async () => {
    setError('');
    const apiUrl = Constants.expoConfig.extra.apiUrl;
    try {
      const response = await axios.get(`${apiUrl}/voluntarios`);
      const voluntarios = response.data;

      const encontrado = voluntarios.find(
        v => v.nombre.toLowerCase() === nombre.toLowerCase() && v.numerovoluntario === clave
      );

      if (encontrado) {
        setUsuario(encontrado);
      } else {
        setError('Usuario o Número de voluntario incorrectos');
      }
    } catch (err) {
      console.error(err);
      setError('Error al conectar con el servidor');
    }
  };

  const cerrarSesion = async () => {
    setUsuario(null);
  };


  return (
    <View style={styles.container}>
      {usuario ? (
        <View style={{ alignItems: 'center', marginTop: 60 }}>
          <Animatable.View animation="fadeInLeft" duration={500}><Text style={styles.tituloBienvenida}>¡Hola de nuevo, <Text style={{ color: '#007AFF', fontSize: 34 }}>{usuario.nombre}</Text>!</Text></Animatable.View>
          <Text style={{fontSize: 16, marginTop: 20, marginBottom: 15}}>Información de usuario:</Text>
          <Animatable.View animation="fadeInUp" duration={500} style={{ height: 200, width: 360, backgroundColor: '#007AFF', padding: 15, borderRadius: 30, gap: 10, justifyContent: 'center', elevation: 50, marginBottom: 90 }}>
            <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 16 }}>·Nombre completo: <Text style={{ color: '#fff', fontWeight: 'normal', fontSize: 14 }}>{usuario.nombre} {usuario.apellidos}</Text></Text>
            <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 16 }}>·Correo electrónico: <Text style={{ color: '#fff', fontWeight: 'normal', fontSize: 14 }}>{usuario.email}</Text></Text>
            <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 16 }}>·Rol: <Text style={{ color: '#fff', fontWeight: 'normal', fontSize: 14 }}>Voluntario</Text></Text>
            <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 16 }}>·Zonas custodiadas: <Text style={{ color: '#fff', fontWeight: 'normal', fontSize: 14 }}>Próximamente...</Text></Text>
          </Animatable.View>
          <Text style={{ fontSize: 14, textAlign: 'center', marginBottom: 50 }}>Mil gracias por confiar en nuestro proyecto. ¡Gracias a ti y a gente como tú podremos lograr nuestro objetivo común!</Text>
          <View>
            <TouchableOpacity
              style={styles.cerrarBoton}
              onPress={cerrarSesion}
            >
              <Text style={styles.cerrarBotonTexto}>Cerrar Sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View>
          <View>
            <Text style={styles.tituloPantalla}>Perfil</Text>
          </View>
          <View style={{ marginBottom: 25 }}>
            <Text style={styles.texto1}>¿Tienes cuenta de voluntario?</Text>
            <Text style={styles.texto1b}>Inicia sesión para ver tu información</Text>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Nombre"
              value={nombre}
              onChangeText={setNombre}
              style={styles.input}
            />
            {nombre.length > 0 && (
              <TouchableOpacity onPress={() => setNombre('')}>
                <Icon name="close-circle" size={26} color="#007AFF" style={styles.iconoX} />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Número de Voluntario"
              value={clave}
              onChangeText={setClave}
              style={styles.input}
            />
            {clave.length > 0 && (
              <TouchableOpacity onPress={() => setClave('')}>
                <Icon name="close-circle" size={26} color="#007AFF" style={styles.iconoX} />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity onPress={iniciarSesion} style={styles.boton}>
            <Text style={styles.botonTexto}>Iniciar sesión</Text>
          </TouchableOpacity>
          {error !== '' && <Text style={styles.error}>{error}</Text>}

          <View style={{ alignItems: 'center', gap: 10, marginTop: 40 }}>
            <Text style={styles.texto1b}>¿No tienes cuenta?</Text>
            <Text style={styles.texto1b}>Regístrate en nuestra página web accediendo desde aquí</Text>
            <Icon name="arrow-down" size={22} />

            <TouchableOpacity style={styles.boton} onPress={() => Linking.openURL('https://riverspain-proyecto.web.app/#formulario-voluntarios')}>
              <Text style={styles.botonTexto}>
                Ir a la web
              </Text>
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
    paddingHorizontal: 15,
    marginTop: Platform.OS === 'ios' ? 110 : 90,
  },
  tituloPantalla: {
    fontSize: 22,
    left: -5,
    fontWeight: 'bold',
    color: '#007AFF',
    textAlign: 'left',
    marginBottom: 60,
  },
  texto1: {
    textAlign: 'center',
    fontSize: 20,
    color: '#007AFF',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  texto1b: {
    textAlign: 'center',
    fontSize: 16
  },
  inputContainer: {
    backgroundColor: '#fff',
    padding: Platform.OS === 'ios' ? 10 : 3,
    marginBottom: 10,
    borderRadius: 30,
    borderColor: '#007AFF',
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 5,
  },
  boton: {
    backgroundColor: '#007AFF',
    padding: Platform.OS === 'ios' ? 15 : 12,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
  },
  botonTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  },
  tituloBienvenida: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
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
  error: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
});
