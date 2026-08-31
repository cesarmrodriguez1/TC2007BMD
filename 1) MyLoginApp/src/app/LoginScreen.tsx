import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  TextInput, 
  Pressable, 
  View, 
  ActivityIndicator, 
  Alert 
} from 'react-native';
import * as SecureStore from 'expo-secure-store';

export default function LoginScreen({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    // 1. Simple Client-Side Validation
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    setIsLoading(true);

    try {
      // 2. Simulate API Call (Replace with your fetch/axios request)
      // Example: const res = await fetch('https://your-api.com', { ... })
      await new Promise((resolve) => setTimeout(resolve, 1500)); 

      if (email === 'user@example.com' && password === 'password123') {
        // 3. Save mock session token securely
        await SecureStore.setItemAsync('userToken', 'mock-jwt-token-xyz');
        onLoginSuccess();
      } else {
        Alert.alert('Auth Failed', 'Invalid email or password.');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      
      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Email Address"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#999"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true} // Hides character input
        autoCapitalize="none"
        autoCorrect={false}
      />

      {/* Custom Styled Login Button */}
      <Pressable 
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed, isLoading && styles.disabled]}
        onPress={handleLogin}
        disabled={isLoading} // Submission locking to prevent duplicate requests
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Log In</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 32,
    textAlign: 'center',
  },
  input: {
    height: 54,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#007AFF',
    height: 54,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    elevation: 2, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  disabled: {
    backgroundColor: '#a2a2a2',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});