import React from 'react';

import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

import MediaButton from '../components/MediaButton';

import {
  RootStackParamList,
} from '../types/navigation';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'Home'
>;

const HomeScreen = ({
  navigation,
}: Props): React.JSX.Element => {
  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Aplicación Multimedia
      </Text>

      <Text style={styles.description}>
        Selecciona el contenido que deseas reproducir
      </Text>

      <View style={styles.buttonsContainer}>

        <MediaButton
          title="Reproducir audio"
          onPress={() => navigation.navigate('Audio')}
        />

        <MediaButton
          title="Reproducir video"
          onPress={() => navigation.navigate('Video')}
        />

      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },

  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },

  buttonsContainer: {
    width: '100%',
    alignItems: 'center',
  },
});

export default HomeScreen;