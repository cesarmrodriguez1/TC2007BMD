import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import LoginScreen from './LoginScreen';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Check if token exists on app boot
  useEffect(() => {
    async function checkToken() {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        if (token) {
          setIsAuthenticated(true);
        }
      } catch (e) {
        console.error('Failed to fetch auth token.');
      } finally {
        setCheckingAuth(false);
      }
    }
    checkToken();
  }, []);

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('userToken');
    setIsAuthenticated(false);
  };

  if (checkingAuth) {
    return null; // Or return a splash screen indicator
  }

  // Conditional routing logic based on auth state
  if (!isAuthenticated) {
    return <LoginScreen onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <View style={styles.protectedContainer}>
      <Text style={styles.welcomeText}>🎉 Welcome to the App Dashboard!</Text>
      <Button title="Log Out" onPress={handleLogout} color="#FF3B30" />
    </View>
  );
}

const styles = StyleSheet.create({
  protectedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 20,
  },
});