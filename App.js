import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import HomePage from './HomePage.js';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'grey',
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    marginTop: 20,
  },
  input: {
    width: '80%',
    marginBottom: 15,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
  },
});

const HomeScreen = () => (
  <View style={styles.container}>
    <Text>Welcome to the Home Page!</Text>
  </View>
);

const AuthScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const signIn = async () => {
    // Hier kannst du die Anmeldelogik implementieren, z.B. API-Aufrufe zur Authentifizierung

    // Beispiel: Überprüfung von Benutzername und Passwort
    if (username === 'example' && password === 'password') {
      // Authentifizierung erfolgreich, speichere den Authentifizierungsstatus
      await AsyncStorage.setItem('isAuthenticated', 'true');

      // Navigiere zum Home-Bildschirm
      navigation.navigate('Home');
    } else {
      // Authentifizierung fehlgeschlagen
      alert('Anmeldung fehlgeschlagen');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Geben Sie Ihre Anmeldedaten ein</Text>
      <TextInput
        placeholder="Username"
        onChangeText={(text) => setUsername(text)}
        value={username}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        onChangeText={(text) => setPassword(text)}
        value={password}
        secureTextEntry
        style={styles.input}
      />
      <Button title="Sign In" onPress={signIn} style={styles.button} />
    </View>
  );
};

const AppNavigator = createStackNavigator(
  {
    Auth: {
      screen: AuthScreen,
    },
    Home: {
      screen: HomeScreen,
    },
  },
  {
    initialRouteName: 'Auth',
  }
);

export default createAppContainer(AppNavigator);
