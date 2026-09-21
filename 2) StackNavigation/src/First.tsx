import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import { SafeAreaProvider } from 'react-native-safe-area-context';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';

type Props = NativeStackScreenProps<RootStackParamList, 'First'>;

export default function First({ navigation }: Props) {
  return (
    <SafeAreaProvider style={styles.safeArea}>
      <View style={styles.container}>

        <View style={styles.card}>
          <Text style={styles.icon}>🏠</Text>

          <Text style={styles.title}>
            View 1
          </Text>

          <Text style={styles.description}>
            This is View 1, you can navigate wherever you want
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Second')}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>
              Go to View 2
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Third')}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>
              Go to View 3
            </Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#DDEBFF',
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },

  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 30,
    alignItems: 'center',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },

  icon: {
    fontSize: 50,
    marginBottom: 15,
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#1E3A5F',
    marginBottom: 10,
  },

  description: {
    fontSize: 16,
    color: '#52667A',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 25,
  },

  button: {
    width: '100%',
    backgroundColor: '#3478F6',
    paddingVertical: 16,
    borderRadius: 18,
    marginVertical: 7,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.18,
    shadowRadius: 5,
    elevation: 4,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});